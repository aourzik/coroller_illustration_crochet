import { useCallback, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const TABLE = "oeuvres";
const BUCKET = "galerie";

// Couche données du back-office : centralise tous les appels Supabase
// (lecture + upload image + insert/update/delete). Les composants ne touchent
// jamais `supabase` directement.
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
        else setOeuvres(data ?? []);
        setLoading(false);
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const addOeuvre = async ({ title, category, size, file }) => {
        if (!supabase) return { error: new Error("Supabase non configuré.") };

        const ext = file.name.split(".").pop();
        const path = `${Date.now()}.${ext}`;

        const up = await supabase.storage.from(BUCKET).upload(path, file);
        if (up.error) return { error: up.error };

        const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);

        const ins = await supabase
            .from(TABLE)
            .insert([{ title, category, size, img_url: urlData.publicUrl }])
            .select()
            .single();
        if (ins.error) return { error: ins.error };

        setOeuvres((list) => [ins.data, ...list]);
        return { data: ins.data };
    };

    const updateOeuvre = async (id, patch) => {
        if (!supabase) return { error: new Error("Supabase non configuré.") };
        const { error } = await supabase.from(TABLE).update(patch).eq("id", id);
        if (error) return { error };
        setOeuvres((list) => list.map((it) => (it.id === id ? { ...it, ...patch } : it)));
        return {};
    };

    const removeOeuvre = async (id, imgUrl) => {
        if (!supabase) return { error: new Error("Supabase non configuré.") };

        const fileName = imgUrl.split("/").pop();
        const del = await supabase.storage.from(BUCKET).remove([fileName]);
        if (del.error) console.warn("Fichier Storage introuvable :", del.error.message);

        const { error } = await supabase.from(TABLE).delete().eq("id", id);
        if (error) return { error };
        setOeuvres((list) => list.filter((it) => it.id !== id));
        return {};
    };

    return { oeuvres, loading, configError, refresh, addOeuvre, updateOeuvre, removeOeuvre };
}
