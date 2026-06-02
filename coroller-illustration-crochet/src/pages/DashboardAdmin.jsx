import React, { useState, useEffect } from "react";
import { C } from "../App";
import { supabase } from "../supabaseClient"; 

export default function DashboardAdmin({ dark }) {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("illustration");
    const [size, setSize] = useState("medium");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    
    // État pour stocker la liste des œuvres existantes pour la gestion
    const [oeuvres, setOeuvres] = useState([]);

    const txt = dark ? "#f0eef8" : "#0d0b1a";
    const muted = dark ? "#8b8aaa" : "#6a6880";
    const cardBg = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
    const cardBorder = dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";

    // Charger les œuvres existantes au démarrage
    const fetchOeuvres = async () => {
        try {
            const { data, error } = await supabase
                .from("oeuvres")
                .select("*")
                .order("created_at", { ascending: false }); // Les plus récentes en premier
            if (error) throw error;
            if (data) setOeuvres(data);
        } catch (error) {
            console.error("Erreur chargement liste :", error);
        }
    };

    useEffect(() => {
        fetchOeuvres();
    }, []);

    // Action d'envoi/publication
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
            const fileName = `${Date.now()}.${fileExt}`; 
            const filePath = fileName;

            const { error: uploadError } = await supabase.storage
                .from('galerie')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Récupérer l'URL publique de l'image
            const { data: urlData } = supabase.storage
                .from('galerie')
                .getPublicUrl(filePath);

            const publicUrl = urlData.publicUrl;

            // 3. Insérer les infos dans la table 'oeuvres'
            const { error: insertError } = await supabase
                .from('oeuvres')
                .insert([
                    { title: title, category: category, size: size, img_url: publicUrl }
                ]);

            if (insertError) throw insertError;

            setMessage("🎉 Œuvre publiée avec succès sur le site !");
            setTitle("");
            setFile(null);
            e.target.reset();
            
            // Recharger la liste d'administration après l'ajout
            fetchOeuvres();

        } catch (error) {
            console.error(error);
            setMessage(`❌ Erreur : ${error.message || "Impossible d'envoyer l'œuvre."}`);
        } finally {
            setLoading(false);
        }
    };

    // Action de suppression d'une œuvre (DB + Storage)
    const handleDelete = async (id, imgUrl) => {
        if (!window.confirm("Es-tu sûre de vouloir supprimer définitivement cette œuvre ?")) return;

        try {
            // A. Extraire le nom du fichier depuis l'URL publique pour le Storage
            // L'URL ressemble à .../galerie/nom_du_fichier.jpg
            const fileName = imgUrl.split("/").pop();

            // B. Supprimer le fichier physique du Storage
            const { error: storageError } = await supabase.storage
                .from("galerie")
                .remove([fileName]);

            if (storageError) console.warn("Note: Fichier introuvable dans le Storage, suppression de la ligne DB.");

            // C. Supprimer la ligne correspondante dans la Table SQL
            const { error: dbError } = await supabase
                .from("oeuvres")
                .delete()
                .eq("id", id);

            if (dbError) throw dbError;

            // D. Mettre à jour l'affichage de l'administration
            setOeuvres(oeuvres.filter(item => item.id !== id));
            setMessage("🗑️ Œuvre retirée du site avec succès.");

        } catch (error) {
            console.error(error);
            alert(`Erreur lors de la suppression : ${error.message}`);
        }
    };

    return (
        <div style={{ 
            position: "relative", // Obligatoire pour bloquer les bulles
            overflow: "hidden",   // Empêche le scroll horizontal des bulles
            minHeight: "100vh",
            // 🔥 ICI : Le même magnifique gradient de fin de page que sur les galeries !
            background: dark 
                ? C.ink 
                : `linear-gradient(0deg, #d4e6ff 0%, #d4e6ff 5%, ${C.cream} 70%, ${C.cream} 100%)`, 
            color: txt, 
            fontFamily: "Corbel, sans-serif", 
            transition: "all .5s"
        }}>
            
            {/* --- LES BULLES D'AMBIANCE DE FIN DE PAGE --- */}
            <div style={{ 
                position: "absolute", top: "-100px", left: "-15%", 
                width: "80vw", height: "80vw", borderRadius: "50%", 
                background: dark ? "radial-gradient(circle, rgba(79,71,144,0.25) 0%, transparent 75%)" : `radial-gradient(circle, ${C.sky} 0%, transparent 70%)`, 
                filter: "blur(90px)", opacity: dark ? 0.8 : 0.7, pointerEvents: "none", zIndex: 0 
            }} />
            <div style={{ 
                position: "absolute", top: "10%", right: "-10%", 
                width: "60vw", height: "60vw", borderRadius: "50%", 
                background: dark ? "radial-gradient(circle, rgba(253,106,61,0.15) 0%, transparent 75%)" : `radial-gradient(circle, ${C.accent} 0%, transparent 70%)`, 
                filter: "blur(110px)", opacity: dark ? 0.8 : 0.5, pointerEvents: "none", zIndex: 0 
            }} />

            {/* CONTENU PRINCIPAL (Passé en zIndex: 1 pour rester au-dessus des bulles) */}
            <div style={{ maxWidth: "800px", margin: "0 auto", padding: "140px 20px 100px", position: "relative", zIndex: 1 }}>
                <h1 style={{ fontFamily: "Georgia, serif", fontSize: "2.5rem", marginBottom: "10px" }}>Espace Créatrice</h1>
                <p style={{ color: muted, marginBottom: "40px" }}>Ajoute ou supprime les créations affichées sur ton site.</p>

                {/* FORMULAIRE D'AJOUT */}
                <form onSubmit={handleUpload} style={{ 
                    background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 24, padding: "32px",
                    display: "flex", flexDirection: "column", gap: "20px", marginBottom: "60px",
                    backdropFilter: "blur(8px)" // Ajoute un effet flouté premium sur le fond des cartes
                }}>
                    <h2 style={{ fontFamily: "Georgia, serif", fontSize: "1.4rem", margin: 0 }}>✨ Publier une nouveauté</h2>
                    
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

                {/* LISTE DES ŒUVRES EN LIGNE */}
                <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 24, padding: "32px", backdropFilter: "blur(8px)" }}>
                    <h2 style={{ fontFamily: "Georgia, serif", fontSize: "1.4rem", marginBottom: "20px" }}>🛠️ Gestion des œuvres en ligne ({oeuvres.length})</h2>
                    
                    {oeuvres.length === 0 ? (
                        <p style={{ color: muted, fontSize: 14 }}>Aucune œuvre publiée pour le moment.</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            {oeuvres.map((item) => (
                                <div key={item.id} style={{ 
                                    display: "flex", alignItems: "center", justifyContent: "space-between", 
                                    padding: "12px 16px", borderRadius: 14, border: `1px solid ${cardBorder}`,
                                    background: dark ? "rgba(0,0,0,0.2)" : "#fff", flexWrap: "wrap", gap: "12px"
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                        <img src={item.img_url} alt={item.title} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }} />
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: 15 }}>{item.title}</div>
                                            <div style={{ fontSize: 12, color: muted }}>
                                                {item.category === "illustration" ? "🎨 Illustration" : "🧶 Crochet"} · {item.size === "large" ? "Grand" : "Standard"}
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleDelete(item.id, item.img_url)}
                                        style={{ 
                                            background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "none", 
                                            borderRadius: "8px", padding: "8px 16px", fontWeight: 600, fontSize: 13, 
                                            cursor: "pointer", transition: "0.2s" 
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)"}
                                        onMouseLeave={e => e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"}
                                    >
                                        🗑️ Supprimer
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}