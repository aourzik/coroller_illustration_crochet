import { supabase } from "../supabaseClient";
import { compressImage } from "./compressImage";

const BUCKET = "galerie";

export const fileNameFromUrl = (url) => (url ? url.split("/").pop() : null);

// Compresse puis téléverse une image dans le bucket partagé, renvoie son URL
// publique. Utilisé par toutes les couches de données qui stockent des
// images (œuvres, boutique, lieux ponctuels).
export async function uploadToGalerie(file) {
    const optimised = await compressImage(file);
    const ext = optimised.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage.from(BUCKET).upload(path, optimised);
    if (error) return { error };

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return { url: data.publicUrl };
}

// Supprime le fichier correspondant à une URL publique du bucket (best effort).
export async function removeFromGalerie(imgUrl) {
    const stale = fileNameFromUrl(imgUrl);
    if (!stale) return;
    const { error } = await supabase.storage.from(BUCKET).remove([stale]);
    if (error) console.warn("Fichier Storage introuvable :", error.message);
}
