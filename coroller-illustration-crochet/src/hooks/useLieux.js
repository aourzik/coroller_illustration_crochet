import { useCallback, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { uploadToGalerie, removeFromGalerie } from "../lib/galerieStorage";

const TABLE = "lieux_evenements";

const sortByPosition = (list) =>
    [...list].sort((a, b) => {
        const pa = a.position ?? Number.POSITIVE_INFINITY;
        const pb = b.position ?? Number.POSITIVE_INFINITY;
        return pa - pb;
    });

// Couche données des photos de lieux ponctuels (marchés, salons...) : juste
// des images, réordonnables, pas de texte (Marie intègre le texte dans
// l'image elle-même).
export function useLieux() {
    const [lieux, setLieux] = useState([]);
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
        if (error) console.error("Chargement des lieux :", error);
        else setLieux(sortByPosition(data ?? []));
        setLoading(false);
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const addLieu = async (file) => {
        if (!supabase) return { error: new Error("Supabase non configuré.") };

        const up = await uploadToGalerie(file);
        if (up.error) return { error: up.error };

        const nextPosition = lieux.reduce((max, l) => Math.max(max, l.position ?? -1), -1) + 1;

        const { data, error } = await supabase
            .from(TABLE)
            .insert([{ img_url: up.url, position: nextPosition }])
            .select()
            .single();
        if (error) return { error };

        setLieux((list) => [...list, data]);
        return { data };
    };

    const stashLieu = (id) => {
        const item = lieux.find((l) => l.id === id) || null;
        if (item) setLieux((list) => list.filter((l) => l.id !== id));
        return item;
    };

    const restoreLieu = (item) => {
        if (!item) return;
        setLieux((list) => sortByPosition([...list.filter((l) => l.id !== item.id), item]));
    };

    const removeLieu = async (id, imgUrl) => {
        if (!supabase) return { error: new Error("Supabase non configuré.") };

        await removeFromGalerie(imgUrl);

        const { error } = await supabase.from(TABLE).delete().eq("id", id);
        if (error) return { error };
        setLieux((list) => list.filter((l) => l.id !== id));
        return {};
    };

    const reorderLieux = async (orderedIds) => {
        if (!supabase) return { error: new Error("Supabase non configuré.") };

        const posById = new Map(orderedIds.map((id, index) => [id, index]));
        setLieux((list) =>
            list.map((it) => (posById.has(it.id) ? { ...it, position: posById.get(it.id) } : it))
        );

        const results = await Promise.all(
            orderedIds.map((id, index) => supabase.from(TABLE).update({ position: index }).eq("id", id))
        );
        const failed = results.find((r) => r.error);
        if (failed) {
            await refresh();
            return { error: failed.error };
        }
        return {};
    };

    return { lieux, loading, configError, refresh, addLieu, stashLieu, restoreLieu, removeLieu, reorderLieux };
}
