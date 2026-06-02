import React, { useState, useEffect } from "react"; // 👈 Intégration de useState et useEffect
import { Link } from "react-router-dom";
import { C } from "../App"; 
import { supabase } from "../supabaseClient"; // 👈 Connexion au client Supabase

export default function GalerieIllustrations({ dark }) {
    // Liste dynamique des illustrations chargées depuis Supabase
    const [allIllus, setAllIllus] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchIllustrations() {
            try {
                const { data, error } = await supabase
                    .from("oeuvres")
                    .select("*")
                    .eq("category", "illustration"); // 🎯 Filtre uniquement sur la catégorie illustration

                if (error) throw error;
                if (data) setAllIllus(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des illustrations :", error);
            } finally {
                setLoading(false);
            }
        }

        fetchIllustrations();
    }, []);

    const txt = dark ? "#f0eef8" : "#0d0b1a";
    const muted = dark ? "#8b8aaa" : "#6a6880";
    const cardBorder = dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
    
    const orangeLight = "#ef6637"; 
    const orangeDark = "#fd6a3d"; 

    const CTABtn = ({ children }) => (
        <button style={{
            background: dark ? orangeDark : orangeLight,
            color: "#fff",
            border: "none",
            borderRadius: 10, 
            padding: "13px 28px", 
            fontWeight: 700, 
            fontSize: 14,
            cursor: "pointer", 
            fontFamily: "Corbel,sans-serif", 
            letterSpacing: 0.3,
            transition: "all .3s ease",
            marginTop: "24px"
        }}
        onMouseEnter={e => {
            e.currentTarget.style.opacity = "0.9";
            e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={e => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(0)";
        }}>
            {children}
        </button>
    );

    return (
        <div style={{ 
            position: "relative", 
            overflow: "hidden",   
            minHeight: "100vh",
            background: dark 
            ? C.ink 
            : `linear-gradient(0deg, #d4e6ff 0%, #d4e6ff 5%, ${C.cream} 70%, ${C.cream} 100%)`, 
            transition: "all .5s"
        }}>
            
            {/* --- LES BULLES D'AMBIANCE --- */}
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

            {/* CONTENU PRINCIPAL */}
            <div style={{ 
                position: "relative", 
                zIndex: 1,
                maxWidth: 1600, margin: "0 auto", padding: "140px 40px 100px" 
            }}>
                
                {/* EN-TÊTE DE LA PAGE */}
                <div style={{ maxWidth: 800, margin: "0 auto 80px", textAlign: "center" }}>
                    <h1 style={{ 
                        fontFamily: "Georgia,serif", 
                        fontSize: "clamp(3.5rem,8vw,4.5rem)", 
                        fontWeight: 400, 
                        lineHeight: 1.1, 
                        margin: "0 0 24px", 
                        letterSpacing: -1, 
                        color: txt 
                    }}>
                        Toutes mes Illustrations
                    </h1>
                    
                    <p style={{ 
                        color: muted, 
                        lineHeight: 1.8, 
                        fontSize: "1.1rem", 
                        maxWidth: "650px", 
                        margin: "0 auto" 
                    }}>
                        Si tu as un projet, une idée, une envie, n'hésite pas à me contacter pour voir comment lui faire prendre vie. 
                        Je crée des illustrations à offrir ou bien se faire plaisir, des faire-part, des affiches, des cartes d'anniversaire...
                    </p>

                    <Link to="/contact">
                        <CTABtn>Travaillons ensemble →</CTABtn>
                    </Link>
                </div>

                {/* LA MOSAÏQUE DYNAMIQUE */}
                {loading ? (
                    <p style={{ textAlign: "center", color: muted, fontSize: "1.1rem", fontFamily: "Georgia, serif" }}>Chargement des illustrations de Marie...</p>
                ) : allIllus.length === 0 ? (
                    <p style={{ textAlign: "center", color: muted, fontSize: "1.1rem" }}>Aucune illustration n'a été publiée pour le moment.</p>
                ) : (
                    <div style={{ 
                        display: "grid", 
                        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
                        gridAutoRows: "200px", 
                        gap: 24, 
                        gridAutoFlow: "dense" 
                    }}>
                        {allIllus.map((item) => (
                            <div key={item.id} style={{ 
                                gridRowEnd: `span ${item.size === 'large' ? 3 : 2}`, 
                                position: "relative", 
                                borderRadius: 24, 
                                overflow: "hidden", 
                                background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
                                border: `1px solid ${cardBorder}` 
                            }}>
                                <img src={item.img_url} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                
                                <div style={{ 
                                    position: "absolute", inset: 0, 
                                    background: "rgba(13, 11, 26, 0.7)", opacity: 0, 
                                    display: "flex", flexDirection: "column", gap: "12px",
                                    alignItems: "center", justifyContent: "center", 
                                    transition: "0.3s", backdropFilter: "blur(4px)"
                                }} 
                                onMouseEnter={e => e.currentTarget.style.opacity = 1} 
                                onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                                    <span style={{ color: "#fff", fontFamily: "Georgia, serif", fontSize: "1.2rem" }}>{item.title}</span>
                                    <Link to="/contact">
                                        <button style={{ background: "#fd6a3d", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontWeight: 600 }}>Commander ?</button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}