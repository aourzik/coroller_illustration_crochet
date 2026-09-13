import { useEffect } from "react";
import { Link } from "react-router-dom";

const navBtn = (side) => ({
    position: "absolute",
    top: "50%",
    [side]: 16,
    transform: "translateY(-50%)",
    width: 48,
    height: 48,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.18)",
    color: "#fff",
    fontSize: 24,
    lineHeight: 1,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
});

// Vue plein écran d'une œuvre (fond sombre quel que soit le thème du site,
// comme la plupart des visionneuses) : l'image entière, jamais recadrée,
// avec navigation précédent/suivant et un accès direct à la commande.
export default function Lightbox({ items, index, onClose, onPrev, onNext }) {
    const item = items[index];

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") onPrev();
            if (e.key === "ArrowRight") onNext();
        };
        window.addEventListener("keydown", onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [onClose, onPrev, onNext]);

    if (!item) return null;

    return (
        <div
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 2000,
                background: "rgba(8,7,16,0.94)",
                backdropFilter: "blur(6px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "min(8vh, 70px) 24px",
            }}
        >
            <button
                onClick={onClose}
                aria-label="Fermer"
                style={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    color: "#fff",
                    fontSize: 18,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                ✕
            </button>

            {items.length > 1 && (
                <>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onPrev();
                        }}
                        aria-label="Œuvre précédente"
                        style={navBtn("left")}
                    >
                        ‹
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onNext();
                        }}
                        aria-label="Œuvre suivante"
                        style={navBtn("right")}
                    >
                        ›
                    </button>
                </>
            )}

            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 22,
                    maxWidth: "min(92vw, 1000px)",
                    maxHeight: "100%",
                }}
            >
                <img
                    src={item.img_url}
                    alt={item.title}
                    style={{
                        maxWidth: "100%",
                        maxHeight: "68vh",
                        objectFit: "contain",
                        borderRadius: 14,
                        boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
                    }}
                />
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 20,
                        flexWrap: "wrap",
                        justifyContent: "center",
                        textAlign: "center",
                    }}
                >
                    <span style={{ color: "#fff", fontFamily: "Georgia, serif", fontSize: "1.3rem" }}>
                        {item.title}
                    </span>
                    <Link to="/contact">
                        <button
                            style={{
                                background: "#fd6a3d",
                                color: "#fff",
                                border: "none",
                                borderRadius: 10,
                                padding: "12px 24px",
                                fontWeight: 700,
                                fontSize: 14,
                                cursor: "pointer",
                                fontFamily: "Corbel, sans-serif",
                            }}
                        >
                            Commander cette pièce →
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
