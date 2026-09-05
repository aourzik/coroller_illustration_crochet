import { useEffect, useState } from "react";

const IMG = "/site_accueil.jpg";

// --- Réglages faciles à ajuster ---
const CARDS = 7; // nombre de cartes verticales
const CARD_HEIGHT = 62; // % de la hauteur du hero
const CARD_MAX_WIDTH = 190; // px
const SIDE_PADDING = "6%"; // marge gauche/droite du cluster
const GAP = "2.4%"; // espace entre les cartes
const RADIUS = 20; // arrondi des cartes
const STAGGER = 0.14; // s entre chaque carte à l'ouverture
const DURATION = 1.3; // s d'ouverture d'une carte
// Décalage vertical de chaque carte (% de la hauteur), pour l'effet « flottant »
const Y_OFFSETS = [7, -5, 3, -9, 4, -6, 6];

const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Révélation du hero : l'image est répartie sur des cartes verticales arrondies,
// décalées, séparées par des espaces. Elles montent en cascade au chargement,
// puis dérivent doucement avec la souris. Remplace l'embed Spline. Zéro dépendance.
export default function HeroReveal({ dark }) {
    const reduce = prefersReducedMotion();
    const [revealed, setRevealed] = useState(reduce);
    const [mouse, setMouse] = useState({ x: 0, y: 0 }); // -1 → 1

    useEffect(() => {
        if (reduce) return undefined;
        const id = requestAnimationFrame(() => setRevealed(true));
        return () => cancelAnimationFrame(id);
    }, [reduce]);

    useEffect(() => {
        if (reduce) return undefined;
        const onMove = (e) => {
            setMouse({
                x: (e.clientX / window.innerWidth) * 2 - 1,
                y: (e.clientY / window.innerHeight) * 2 - 1,
            });
        };
        window.addEventListener("pointermove", onMove);
        return () => window.removeEventListener("pointermove", onMove);
    }, [reduce]);

    return (
        <div
            style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: GAP,
                padding: `0 ${SIDE_PADDING}`,
                boxSizing: "border-box",
            }}
        >
            {Array.from({ length: CARDS }, (_, i) => {
                const yOffset = Y_OFFSETS[i % Y_OFFSETS.length];
                // Parallaxe : plus marquée vers les bords du cluster.
                const px = mouse.x * (i - (CARDS - 1) / 2) * 3;
                const py = mouse.y * 8;
                const enterY = revealed ? 0 : 44;
                return (
                    <div
                        key={i}
                        style={{
                            position: "relative",
                            flex: "1 1 0",
                            maxWidth: CARD_MAX_WIDTH,
                            height: `${CARD_HEIGHT}%`,
                            borderRadius: RADIUS,
                            overflow: "hidden",
                            opacity: revealed ? 1 : 0,
                            transform: `translateY(calc(${yOffset}% + ${enterY}px)) scale(${revealed ? 1 : 0.94})`,
                            transition: `transform ${DURATION}s cubic-bezier(.16,1,.3,1) ${i * STAGGER}s, opacity ${DURATION * 0.8}s ease ${i * STAGGER}s`,
                            boxShadow: dark
                                ? "0 32px 60px -24px rgba(0,0,0,0.55)"
                                : "0 32px 60px -28px rgba(79,71,144,0.35)",
                            willChange: "transform, opacity",
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                inset: "-8px",
                                backgroundImage: `url(${IMG})`,
                                backgroundSize: `${CARDS * 100}% 118%`,
                                backgroundPosition: `${(i / (CARDS - 1)) * 100}% center`,
                                backgroundRepeat: "no-repeat",
                                transform: `translate(${px}px, ${py}px)`,
                                transition: "transform .45s ease-out",
                                filter: dark ? "brightness(.85) contrast(1.1)" : "contrast(1.02)",
                            }}
                        />
                    </div>
                );
            })}
        </div>
    );
}
