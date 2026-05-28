import React, { useState } from "react";
import { C } from "../App";
import { supabase } from "../supabaseClient"; 

export default function DashboardAdmin({ dark }) {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("illustration");
    const [size, setSize] = useState("medium");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const txt = dark ? "#f0eef8" : "#0d0b1a";
    const muted = dark ? "#8b8aaa" : "#6a6880";
    const cardBg = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
    const cardBorder = dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !title) {
            setMessage("❌ Remplis tous les champs et choisis une image !");
            return;
        }
        
        setLoading(true);
        setMessage("⏳ Téléversement en cours...");

        try {
            // 1. Envoyer l'image dans le Storage Supabase
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`; // Crée un nom unique
            const filePath = fileName;

            const { error: uploadError } = await supabase.storage
                .from('galerie')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Récupérer l'URL publique de l'image fraîchement envoyée
            const { data: urlData } = supabase.storage
                .from('galerie')
                .getPublicUrl(filePath);

            const publicUrl = urlData.publicUrl;

            // 3. Insérer les infos (Titre, Catégorie, Taille, URL) dans la table 'oeuvres'
            const { error: insertError } = await supabase
                .from('oeuvres')
                .insert([
                    { title: title, category: category, size: size, img_url: publicUrl }
                ]);

            if (insertError) throw insertError;

            setMessage("🎉 Œuvre publiée avec succès sur le site !");
            setTitle("");
            setFile(null);
            
            // On réinitialise l'input file manuellement
            e.target.reset();

        } catch (error) {
            console.error(error);
            setMessage(`❌ Erreur : ${error.message || "Impossible d'envoyer l'œuvre."}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            paddingTop: "140px", paddingBottom: "100px", minHeight: "100vh",
            background: dark ? C.ink : "#faf8f4", color: txt, fontFamily: "Corbel, sans-serif", transition: "all .5s"
        }}>
            <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 20px" }}>
                <h1 style={{ fontFamily: "Georgia, serif", fontSize: "2.5rem", marginBottom: "10px" }}>Espace Créatrice</h1>
                <p style={{ color: muted, marginBottom: "40px" }}>Ajoute une nouvelle œuvre aux galeries en un instant.</p>

                <form onSubmit={handleUpload} style={{ 
                    background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 24, padding: "32px",
                    display: "flex", flexDirection: "column", gap: "20px"
                }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={{ fontWeight: 600, fontSize: 14 }}>Titre de l'œuvre</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Le Renard des bois" style={{ padding: "12px", borderRadius: 10, border: `1px solid ${cardBorder}`, background: dark ? "#161427" : "#fff", color: txt, outline: "none" }} />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={{ fontWeight: 600, fontSize: 14 }}>Catégorie</label>
                        <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: "12px", borderRadius: 10, border: `1px solid ${cardBorder}`, background: dark ? "#161427" : "#fff", color: txt, outline: "none" }}>
                            <option value="illustration">🎨 Illustration</option>
                            <option value="crochet">🧶 Crochet</option>
                        </select>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={{ fontWeight: 600, fontSize: 14 }}>Disposition dans la mosaïque</label>
                        <select value={size} onChange={e => setSize(e.target.value)} style={{ padding: "12px", borderRadius: 10, border: `1px solid ${cardBorder}`, background: dark ? "#161427" : "#fff", color: txt, outline: "none" }}>
                            <option value="medium">Standard (Carré / Moyen)</option>
                            <option value="large">Mise en valeur (Grand / Vertical)</option>
                        </select>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={{ fontWeight: 600, fontSize: 14 }}>Fichier Image</label>
                        <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} style={{ color: muted, fontSize: 14 }} />
                    </div>

                    <button type="submit" disabled={loading} style={{
                        background: dark ? C.accent : "#7a9cd6", color: "#fff", border: "none", borderRadius: 10,
                        padding: "14px", fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all .3s ease", marginTop: "10px"
                    }}>
                        {loading ? "Envoi en cours..." : "Publier sur le site →"}
                    </button>

                    {message && <div style={{ textAlign: "center", fontWeight: 600, fontSize: 14, marginTop: "10px" }}>{message}</div>}
                </form>
            </div>
        </div>
    );
}