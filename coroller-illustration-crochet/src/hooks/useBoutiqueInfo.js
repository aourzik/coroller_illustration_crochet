import { useCallback, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { uploadToGalerie, removeFromGalerie } from "../lib/galerieStorage";

const TABLE = "boutique_info";
const ROW_ID = 1; // fiche unique (pas une liste)

// Couche données de la fiche boutique (photo + nom + adresse + horaires +
// description). Une seule ligne en base.
export function useBoutiqueInfo() {
    const [boutique, setBoutique] = useState(null);
    const [loading, setLoading] = useState(true);
    const configError = !supabase;

    const refresh = useCallback(async () => {
        if (!supabase) {
            setLoading(false);
            return;
        }
        setLoading(true);
        const { data, error } = await supabase.from(TABLE).select("*").eq("id", ROW_ID).maybeSingle();
        if (error) console.error("Chargement de la fiche boutique :", error);
        else setBoutique(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    // patch = { nom, adresse, horaires, description } ; file (optionnel) = nouvelle photo.
    const updateBoutique = async (patch, file) => {
        if (!supabase) return { error: new Error("Supabase non configuré.") };

        let nextPatch = patch;
        if (file) {
            const up = await uploadToGalerie(file);
            if (up.error) return { error: up.error };
            nextPatch = { ...patch, img_url: up.url };
        }

        const { data, error } = await supabase
            .from(TABLE)
            .upsert({ id: ROW_ID, ...nextPatch })
            .select()
            .single();
        if (error) return { error };

        if (file && boutique?.img_url) removeFromGalerie(boutique.img_url);

        setBoutique(data);
        return { data };
    };

    return { boutique, loading, configError, refresh, updateBoutique };
}
