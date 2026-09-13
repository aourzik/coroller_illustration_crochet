import { useCallback, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { uploadToGalerie, removeFromGalerie, fileNameFromUrl } from "../lib/galerieStorage";

const TABLE = "oeuvres";

// Code Postgres pour « colonne inexistante » : la colonne `position` peut ne
// pas encore avoir été ajoutée (migration SQL optionnelle).
const UNDEFINED_COLUMN = "42703";

// Tri stable par `position` ; les lignes sans position gardent l'ordre reçu
// (donc `created_at` décroissant venant de la requête).
const sortByPosition = (list) =>
    [...list].sort((a, b) => {
        const pa = a.position ?? Number.POSITIVE_INFINITY;
        const pb = b.position ?? Number.POSITIVE_INFINITY;
        return pa - pb;
    });

// Couche données du back-office : centralise tous les appels Supabase.
// Les composants ne touchent jamais `supabase` directement.
export function useOeuvres() {
    const [oeuvres, setOeuvres] = useState([]);
    const [loading, setLoading] = useState(true);
    const configError = !supabase;

    const refresh = useCallback(async () => {
        if (!supabase) {
            setLoading(false);
            return;
        }
        setLoading(true);
        const { data, error } = await supabase
            .from(TABLE)
            .select("*")
            .order("created_at", { ascending: false });
        if (error) console.error("Chargement des œuvres :", error);
        else setOeuvres(sortByPosition(data ?? []));
        setLoading(false);
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const addOeuvre = async ({ title, category, size, file }) => {
        if (!supabase) return { error: new Error("Supabase non configuré.") };

        const up = await uploadToGalerie(file);
        if (up.error) return { error: up.error };

        // Nouvelle œuvre = à la fin de sa catégorie.
        const nextPosition =
            oeuvres
                .filter((o) => o.category === category)
                .reduce((max, o) => Math.max(max, o.position ?? -1), -1) + 1;

        const row = { title, category, size, img_url: up.url, position: nextPosition };
        let ins = await supabase.from(TABLE).insert([row]).select().single();

        // Colonne `position` pas encore ajoutée : on réinsère sans.
        if (ins.error?.code === UNDEFINED_COLUMN) {
            const { position, ...rowNoPos } = row; // eslint-disable-line no-unused-vars
            ins = await supabase.from(TABLE).insert([rowNoPos]).select().single();
        }
        if (ins.error) return { error: ins.error };

        setOeuvres((list) => [...list, ins.data]);
        return { data: ins.data };
    };

    // patch = champs à modifier ; file (optionnel) = nouvelle image de remplacement.
    const updateOeuvre = async (id, patch, file) => {
        if (!supabase) return { error: new Error("Supabase non configuré.") };

        const current = oeuvres.find((o) => o.id === id);
        let nextPatch = patch;

        if (file) {
            const up = await uploadToGalerie(file);
            if (up.error) return { error: up.error };
            nextPatch = { ...patch, img_url: up.url };
        }

        const { error } = await supabase.from(TABLE).update(nextPatch).eq("id", id);
        if (error) return { error };

        // Ancien fichier supprimé seulement une fois la ligne mise à jour.
        if (file && current?.img_url) removeFromGalerie(current.img_url);

        setOeuvres((list) => list.map((it) => (it.id === id ? { ...it, ...nextPatch } : it)));
        return {};
    };

    // Retire l'œuvre de l'affichage sans la supprimer en base (pour l'undo).
    // Renvoie l'œuvre retirée, ou null.
    const stashOeuvre = (id) => {
        const item = oeuvres.find((o) => o.id === id) || null;
        if (item) setOeuvres((list) => list.filter((it) => it.id !== id));
        return item;
    };

    // Remet une œuvre stashée dans l'affichage (annulation).
    const restoreOeuvre = (item) => {
        if (!item) return;
        setOeuvres((list) => sortByPosition([...list.filter((it) => it.id !== item.id), item]));
    };

    // Suppression réelle (base + fichier Storage). Suppose l'œuvre déjà retirée
    // de l'affichage via stashOeuvre.
    const removeOeuvre = async (id, imgUrl) => {
        if (!supabase) return { error: new Error("Supabase non configuré.") };

        if (fileNameFromUrl(imgUrl)) await removeFromGalerie(imgUrl);

        const { error } = await supabase.from(TABLE).delete().eq("id", id);
        if (error) return { error };
        setOeuvres((list) => list.filter((it) => it.id !== id));
        return {};
    };

    // Réordonne : `orderedIds` = ids d'une même catégorie dans le nouvel ordre.
    const reorderOeuvres = async (orderedIds) => {
        if (!supabase) return { error: new Error("Supabase non configuré.") };

        const posById = new Map(orderedIds.map((id, index) => [id, index]));

        // Optimiste : on applique tout de suite en local.
        setOeuvres((list) =>
            list.map((it) => (posById.has(it.id) ? { ...it, position: posById.get(it.id) } : it))
        );

        const updates = orderedIds.map((id, index) =>
            supabase.from(TABLE).update({ position: index }).eq("id", id)
        );
        const results = await Promise.all(updates);
        const failed = results.find((r) => r.error);
        if (failed) {
            await refresh(); // resynchronise si un update a échoué
            const error =
                failed.error.code === UNDEFINED_COLUMN
                    ? new Error(
                          "Le réordonnancement nécessite la colonne « position » (migration SQL non appliquée)."
                      )
                    : failed.error;
            return { error };
        }
        return {};
    };

    return {
        oeuvres,
        loading,
        configError,
        refresh,
        addOeuvre,
        updateOeuvre,
        stashOeuvre,
        restoreOeuvre,
        removeOeuvre,
        reorderOeuvres,
    };
}
