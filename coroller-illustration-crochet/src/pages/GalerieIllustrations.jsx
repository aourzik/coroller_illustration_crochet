import React from "react";

// On définit ici la liste complète des images
const allIllus = [
    { img: "/illu_1.png", label: "La Louve", size: "large" },
    { img: "/illu_2.png", label: "Pomme de Terre", size: "medium" },
    { img: "/illu_3.png", label: "Le Chat", size: "medium" },
    { img: "/illu_4.png", label: "Le Renard", size: "medium" },
    { img: "/illu_5.png", label: "La Sorcière", size: "medium" },
    { img: "/illu_6.png", label: "Le Hérisson", size: "medium" },
    { img: "/illu_7.png", label: "La Licorne", size: "medium" },
    { img: "/illu_8.png", label: "Le Loup et la Lune", size: "medium" },
    { img: "/illu_9.png", label: "Le Corbeau et le Renard", size: "medium" },
    { img: "/illu_10.png", label: "Le Chat Botté", size: "medium" },
    { img: "/illu_11.png", label: "La Belle au Bois Dormant", size: "medium" },
    { img: "/illu_12.png", label: "Le Petit Chaperon Rouge", size: "medium" },
];

export default function GalerieIllustrations({ dark }) {
    const txt = dark ? "#f0eef8" : "#0d0b1a";
    const cardBorder = dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";

    return (
        <div style={{ paddingTop: "140px", minHeight: "100vh", maxWidth: 1600, margin: "0 auto", padding: "140px 40px 100px" }}>
            <h1 style={{ fontFamily: "Georgia,serif", fontSize: "3rem", marginBottom: "40px", textAlign: "center" }}>Toutes mes Illustrations</h1>

            {/* LA MOSAÏQUE */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gridAutoRows: "200px", gap: 24, gridAutoFlow: "dense" }}>
                {allIllus.map((item, i) => (
                    <div key={i} style={{ gridRowEnd: `span ${item.size === 'large' ? 3 : 2}`, position: "relative", borderRadius: 24, overflow: "hidden", border: `1px solid ${cardBorder}` }}>
                        <img src={item.img} alt={item.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <div className="hover-voile" style={{ position: "absolute", inset: 0, background: "rgba(13, 11, 26, 0.8)", opacity: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "0.3s" }} onMouseEnter={e => e.target.style.opacity = 1} onMouseLeave={e => e.target.style.opacity = 0}>
                            <button style={{ background: "#fd6a3d", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer" }}>Commander ?</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}