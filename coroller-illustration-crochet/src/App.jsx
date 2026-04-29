import { useState, useEffect, useRef } from "react";


import mariePhoto from "./assets/images/marie.jpg";
import logo from "./assets/images/logo.png";


const C = {
    ink: "#0d0b1a",
    cream: "#faf8f4",
    accent: "#fd6a3d",
    indigo: "#4f4790",
    sky: "#92bbf3",
    muted: "#8b8aaa",
    glass: "rgba(250,248,244,0.06)",
    glassBorder: "rgba(255,255,255,0.1)",
};

const illus = [
    { bg: "linear-gradient(135deg,#1a1035,#4f4790)", img: "/illu_1.png", label: "La Louve" },
    { bg: "linear-gradient(135deg,#1a3035,#2a7090)", img: "/illu_2.png", label: "Pomme de Terre" },
    { bg: "linear-gradient(135deg,#35101a,#903050)", img: "/illu_3.png", label: "Petite fille aux Fleurs" },
    { bg: "linear-gradient(135deg,#102535,#1a5060)", img: "/illu_4.png", label: "La rencontre" },
    { bg: "linear-gradient(135deg,#251035,#6a3080)", img: "/illu_5.png", label: "L'automne" },
];

const croch = [
    { bg: "linear-gradient(135deg,#1e1206,#5c3d12)", img: "/croch.png", label: "Les cocottes" },
    { bg: "linear-gradient(135deg,#06121e,#124060)", img: "/croch5.png", label: "Dinosaures" },
    { bg: "linear-gradient(135deg,#121e06,#3a5c12)", img: "/croch2.png", label: "Le renard" },
    { bg: "linear-gradient(135deg,#1e0612,#5c1230)", img: "/croch3.png", label: "Pinguins" },
    { bg: "linear-gradient(135deg,#1a1206,#5c4a12)", img: "/croch4.png", label: "Les Cactus" },
];

const scrollAnimStyle = `
  @keyframes scrollFloat {
    0% { transform: translateY(0); opacity: 0.3; }
    50% { transform: translateY(10px); opacity: 1; }
    100% { transform: translateY(0); opacity: 0.3; }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .reveal { opacity: 0; transition: all 0.8s ease-out; }
  .reveal.visible { animation: fadeInUp 1s forwards ease-out; }
`;

// --- COMPOSANT COMPTEUR ANIMÉ ---
function AnimatedCounter({ target, duration = 2000 }) {
    const [count, setCount] = useState(0);
    const countRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) setIsVisible(true);
        }, { threshold: 0.5 });
        if (countRef.current) observer.observe(countRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;
        let start = 0;
        const targetValue = parseInt(target);
        const increment = targetValue / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= targetValue) {
                setCount(targetValue);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [isVisible, target, duration]);

    return <span ref={countRef}>{count}{target.includes('+') ? '+' : ''}</span>;
}

function Carousel({ items, dark }) {
    const [cur, setCur] = useState(0);
    const n = items.length;

    // --- AUTOPLAY ---
    useEffect(() => {
        const timer = setInterval(() => setCur(c => (c + 1) % n), 4000);
        return () => clearInterval(timer);
    }, [n]);

    const prev = () => setCur(i => (i - 1 + n) % n);
    const next = () => setCur(i => (i + 1) % n);

    return (
        <div style={{ width: "100%", userSelect: "none" }}>
            <div style={{ position: "relative", height: 500, overflow: "hidden", borderRadius: 24 }}>
                {items.map((item, i) => {
                    const offset = ((i - cur + n) % n);
                    const pos = offset <= n / 2 ? offset : offset - n;
                    const visible = Math.abs(pos) <= 1;
                    return (
                        <div key={item.label} style={{
                            position: "absolute", inset: 0,
                            background: item.bg,
                            borderRadius: 24,
                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                            transform: `translateX(${pos * 105}%) scale(${pos === 0 ? 1 : 0.88})`,
                            opacity: pos === 0 ? 1 : visible ? 0.4 : 0,
                            transition: "all 0.55s cubic-bezier(.4,0,.2,1)",
                            zIndex: pos === 0 ? 2 : 1,
                            border: "1px solid rgba(255,255,255,0.08)",
                        }}>
                            <div style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}>
                                <img
                                    src={item.img}
                                    alt={item.label}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover", // L'image remplit tout l'espace
                                        opacity: 0.6, // Optionnel : pour mieux voir le texte par-dessus
                                    }}
                                />
                            </div>
                            <div style={{ color: "#fff", fontFamily: "Georgia,serif", fontSize: 22, fontWeight: 400 }}>{item.label}</div>
                            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, letterSpacing: 2, marginTop: 6, textTransform: "uppercase" }}>{item.sub}</div>
                        </div>
                    );
                })}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 20 }}>
                <button onClick={prev} style={{ background: "none", border: `1px solid ${dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"}`, borderRadius: 99, width: 44, height: 44, cursor: "pointer", color: dark ? "#fff" : C.ink, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s" }}>←</button>
                <div style={{ display: "flex", gap: 8 }}>
                    {items.map((_, i) => (
                        <button key={i} onClick={() => setCur(i)} style={{ width: i === cur ? 28 : 8, height: 8, borderRadius: 99, background: i === cur ? C.accent : dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)", border: "none", cursor: "pointer", transition: "all .35s", padding: 0 }} />
                    ))}
                </div>
                <button onClick={next} style={{ background: "none", border: `1px solid ${dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"}`, borderRadius: 99, width: 44, height: 44, cursor: "pointer", color: dark ? "#fff" : C.ink, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s" }}>→</button>
            </div>
        </div>
    );
}

function Modal({ onClose, dark }) {
    const bg = dark ? "#0d0b1a" : "#faf8f4";
    const txt = dark ? "#e8eaf6" : "#0d0b1a";
    const inputStyle = {
        display: "block", width: "100%", marginBottom: 14,
        padding: "13px 16px", borderRadius: 12,
        border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
        background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
        color: txt, fontFamily: "Corbel,sans-serif", fontSize: 14,
        outline: "none", boxSizing: "border-box",
    };
    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
            <div onClick={e => e.stopPropagation()} style={{ background: bg, borderRadius: 28, padding: "48px 40px", maxWidth: 440, width: "90%", border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`, position: "relative" }}>
                <button onClick={onClose} style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", fontSize: 20, cursor: "pointer", color: C.muted }}>✕</button>
                <div style={{ fontFamily: "Georgia,serif", fontSize: 13, letterSpacing: 3, color: C.accent, textTransform: "uppercase", marginBottom: 8 }}>Contact</div>
                <h3 style={{ fontFamily: "Georgia,serif", fontSize: 28, fontWeight: 400, color: txt, marginBottom: 6, marginTop: 0 }}>Parlons de<br />votre projet.</h3>
                <p style={{ color: C.muted, fontSize: 13, marginBottom: 28, lineHeight: 1.6 }}>Je réponds à chaque message avec soin, sous 48h.</p>
                <input placeholder="Votre nom" style={inputStyle} />
                <input placeholder="Votre email" style={inputStyle} />
                <textarea placeholder="Décrivez votre projet…" rows={4} style={{ ...inputStyle, resize: "none", marginBottom: 20 }} />
                <button style={{ width: "100%", background: C.accent, color: "#fff", border: "none", borderRadius: 12, padding: "14px", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "Corbel,sans-serif", letterSpacing: 0.5 }}>Envoyer le message →</button>
            </div>
        </div>
    );
}

export default function App() {
    const [dark, setDark] = useState(true);
    const [modal, setModal] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // --- GESTION DU REVEAL AU SCROLL ---
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('visible');
            });
        }, { threshold: 0.15 });
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const h = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", h);
        return () => window.removeEventListener("scroll", h);
    }, []);

    const bg = dark ? C.ink : C.cream;
    const txt = dark ? "#f0eef8" : C.ink;
    const muted = dark ? "#8b8aaa" : "#6a6880";
    const cardBg = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
    const cardBorder = dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
    const divider = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

    const Tag = ({ label }) => (
        <span style={{ fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: muted, fontWeight: 600 }}>{label}</span>
    );

    const CTABtn = ({ children, onClick, outline }) => (
        <button onClick={onClick} style={{
            background: outline ? "transparent" : C.accent,
            color: outline ? txt : "#fff",
            border: outline ? `1px solid ${dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"}` : "none",
            borderRadius: 10, padding: "13px 28px", fontWeight: 700, fontSize: 14,
            cursor: "pointer", fontFamily: "Corbel,sans-serif", letterSpacing: 0.3,
            transition: "opacity .2s",
        }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.82"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
            {children}
        </button>
    );

    const ScrollIndicator = ({ dark }) => (
        <div style={{ position: "absolute", bottom: "30px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", zIndex: 10, opacity: 0.6, animation: "scrollFloat 2s infinite ease-in-out" }}>
            <style>{scrollAnimStyle}</style>
            <span style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 600, color: dark ? "#fff" : "#0d0b1a" }}>Scroll</span>
            <div style={{ width: "1px", height: "40px", background: `linear-gradient(to bottom, ${dark ? "#fff" : "#0d0b1a"}, transparent)` }} />
        </div>
    );

    return (
        <div style={{ background: bg, color: txt, fontFamily: "Corbel, sans-serif", minHeight: "100vh", transition: "all .5s", position: "relative", overflowX: "hidden" }}>

            {/* --- LES BULLES D'AMBIANCE --- */}
            <div style={{ position: "absolute", top: "-100px", left: "-15%", width: "80vw", height: "80vw", borderRadius: "50%", background: dark ? "radial-gradient(circle, rgba(79,71,144,0.25) 0%, transparent 75%)" : `radial-gradient(circle, ${C.sky} 0%, transparent 70%)`, filter: "blur(90px)", opacity: dark ? 0.8 : 0.7, pointerEvents: "none", zIndex: 0 }} />
            <div style={{ position: "absolute", top: "10%", right: "-10%", width: "60vw", height: "60vw", borderRadius: "50%", background: dark ? "radial-gradient(circle, rgba(253,106,61,0.15) 0%, transparent 75%)" : `radial-gradient(circle, ${C.accent} 0%, transparent 70%)`, filter: "blur(110px)", opacity: dark ? 0.8 : 0.5, pointerEvents: "none", zIndex: 0 }} />

            {/* NAV */}
            <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: dark ? scrolled ? "rgba(13, 11, 26, 0.51)" : "transparent" : scrolled ? "rgba(250, 248, 244, 0.51)" : "transparent", backdropFilter: scrolled ? "blur(50px)" : "none", borderBottom: scrolled ? `1px solid ${divider}` : "1px solid transparent", transition: "all .2s" }}>
                <div style={{ maxWidth: 1600, margin: "0 auto", padding: "0 40px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <img src={logo} alt="Logo" style={{ height: 40, width: "auto", objectFit: "contain" }} />
                        <span style={{ fontFamily: "Georgia,serif", fontSize: 16, letterSpacing: 1, color: txt }}>Coroller<br />Illustration & Crochet</span>
                    </div>
                    <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
                        {["À propos", "Illustrations", "Crochet", "Contact"].map(l => (
                            <a key={l} href={`#${l.replace("À", "a").replace(" ", "-").toLowerCase()}`}
                                style={{ color: muted, textDecoration: "none", fontSize: 13, letterSpacing: 0.5, fontWeight: 600, transition: "color .2s" }}
                                onMouseEnter={e => e.target.style.color = txt}
                                onMouseLeave={e => e.target.style.color = muted}>{l}</a>
                        ))}
                        <button onClick={() => setDark(d => !d)} style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 99, width: 40, height: 24, cursor: "pointer", display: "flex", alignItems: "center", padding: "0 4px", position: "relative", transition: "background .3s" }}>
                            <div style={{ width: 16, height: 16, borderRadius: "50%", background: dark ? C.sky : C.accent, transform: dark ? "translateX(16px)" : "translateX(0)", transition: "all .3s" }} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "80px 40px", position: "relative", maxWidth: "100%", margin: "0 auto", zIndex: 1, overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, zIndex: -1, opacity: 0.6, pointerEvents: "none" }}>
                    <iframe src="https://my.spline.design/maskimagerevealcopycopy-tjKszRnI28NNBDPRI65AaOth-eLk/" frameBorder="0" width="100%" height="120%" style={{ transform: "scale(1.1)", filter: dark ? "brightness(0.8) contrast(1.2)" : "none" }}></iframe>
                </div>
                <div style={{ position: "relative", zIndex: 1, maxWidth: 780 }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 32, padding: "8px 20px", borderRadius: 99, border: `1px solid ${cardBorder}`, background: cardBg }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent }} />
                        <Tag label="Illustration · Crochet" />
                    </div>
                    <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(3.5rem,8vw,7rem)", fontWeight: 400, lineHeight: 1.0, margin: "0 0 28px", letterSpacing: -1, color: txt, textShadow: dark ? "0 10px 30px rgba(0,0,0,0.5)" : "none" }}>
                        L'art à l'état<br /><span style={{ color: C.accent }}>pur.</span>
                    </h1>
                    <p style={{ fontSize: "clamp(1rem,2vw,1.2rem)", color: muted, maxWidth: 480, margin: "0 auto 44px", lineHeight: 1.8, fontWeight: 400 }}>
                        Illustrations oniriques et pièces crochet uniques — chaque création naît d'une intention, d'un fragment de rêve mis en forme.
                    </p>
                    <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                        <CTABtn onClick={() => setModal(true)}>Travaillons ensemble →</CTABtn>
                        <CTABtn outline>Voir les créations</CTABtn>
                    </div>
                </div>
                <ScrollIndicator dark={dark} />
            </section>

            {/* À PROPOS */}
            <section id="a-propos" className="reveal" style={{ maxWidth: 1600, margin: "0 auto", padding: "100px 40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
                <div style={{ position: "relative", justifySelf: "center", width: "100%", maxWidth: "500px" }}>
                    <div style={{ aspectRatio: "4/5", borderRadius: 24, background: dark ? "#1a1840" : "#d5e4f9", overflow: "hidden", border: `1px solid ${cardBorder}` }}>
                        <img src={mariePhoto} alt="Portrait" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ position: "absolute", bottom: 28, right: -20, background: dark ? "#12102a" : "#bbd3f5f3", border: `1px solid ${cardBorder}`, borderRadius: 16, padding: "16px 20px" }}>
                        <div style={{ fontSize: 24, fontFamily: "Georgia,serif", color: txt, fontWeight: 400 }}>
                            <AnimatedCounter target="8+" />
                        </div>
                        <div style={{ fontSize: 11, color: muted, letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>ans d'expérience</div>
                    </div>
                </div>
                <div>
                    <Tag label="Qui suis-je ?" />
                    <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(2rem,4vw,2.6rem)", fontWeight: 400, margin: "16px 0 24px", lineHeight: 1.15, color: txt }}>
                        Une rêveuse,<br />enfant cachée dans le corps d'une adulte qui croit toujours aux fées.
                    </h2>
                    <p style={{ color: muted, lineHeight: 1.9, marginBottom: 20, fontSize: 15 }}>
                        Mon parcours n'est pas linéaire. J'ai commencé par suivre des études de psychologie. Diplômée en 2018, j'ai voulu m'engager dans un service civique avant de me lancer sur le marché du travail. Cette expérience m'a fait bifurquer dans le champ du social, dans la branche associative.
                    </p>
                    <p style={{ color: muted, lineHeight: 1.9, marginBottom: 36, fontSize: 15 }}>
                        Finalement après quelques déménagements, je décide de me former à ma passion pour concrétiser des projets perso (l'illustration d'un jeu de société, la création d'un livre pour enfant). Je me forme donc à l'illustration avec l'école EDAA pour gagner en légitimité et compétences.
                    </p>
                    <p style={{ color: muted, lineHeight: 1.9, marginBottom: 36, fontSize: 15 }}>
                        En 2025, je décide de me lancer à mon compte avec ma petite entreprise, c'est là qu'est né Coroller Illustration. Et, je rejoins un groupe d'entraide d'artistes : le Collecti'fées pour ne pas être seule avec mes créations et mes projets.
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                        {[["150+", "Illustrations"], ["80+", "Pièces crochet"], ["40+", "Clients satisfaits"]].map(([n, l]) => (
                            <div key={l} style={{ padding: "18px 16px", borderRadius: 14, border: `1px solid ${cardBorder}`, background: cardBg, textAlign: "center" }}>
                                <div style={{ fontFamily: "Georgia,serif", fontSize: 26, color: txt }}>
                                    <AnimatedCounter target={n} />
                                </div>
                                <div style={{ fontSize: 11, color: muted, marginTop: 4, letterSpacing: 0.5 }}>{l}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ILLUSTRATIONS */}
            <section id="illustrations" className="reveal" style={{ borderTop: `1px solid ${divider}` }}>
                <div style={{ maxWidth: 1600, margin: "0 auto", padding: "100px 40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
                    <Carousel items={illus} dark={dark} />
                    <div>
                        <Tag label="Illustrations" />
                        <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, margin: "16px 0 24px", lineHeight: 1.15, color: txt }}>
                            Des récits visuels qui traversent le temps.
                        </h2>
                        <p style={{ color: muted, lineHeight: 1.9, marginBottom: 20, fontSize: 15 }}>
                            Mon univers est inspiré de l'imaginaire, de la nature, de la fantaisie. Je crée des images à l'aquarelle et aux crayons de couleurs.
                        </p>
                        <p style={{ color: muted, lineHeight: 1.9, marginBottom: 36, fontSize: 15 }}>
                            Chaque illustration est une invitation à un voyage visuel, une histoire figée dans le temps qui attend d'être découverte.
                        </p>
                        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                            <CTABtn>Galerie complète →</CTABtn>
                            <CTABtn outline>Commande personnalisée</CTABtn>
                        </div>
                    </div>
                </div>
            </section>

            {/* CROCHET */}
            <section id="crochet" className="reveal" style={{ borderTop: `1px solid ${divider}` }}>
                <div style={{ maxWidth: 1600, margin: "0 auto", padding: "100px 40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
                    <div>
                        <Tag label="Créations crochet" />
                        <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, margin: "16px 0 24px", lineHeight: 1.15, color: txt }}>
                            De la découverte à la révélation.
                        </h2>
                        <p style={{ color: muted, lineHeight: 1.9, marginBottom: 20, fontSize: 15 }}>
                            J'ai découvert par hasard :un kit pour créer un amigurumi et ça a été la révélation ! Activité antistress que je ne peux plus lâcher je me mets à créer, créer, créer … tellement bien que je me dis au bout d'un certain nombre de peluches accumulées qu'il serait pertinent de les distribuer ! Alors pourquoi ne pas les vendre, et combiner cette activité créatrice à mon entreprise...
                        </p>
                        <p style={{ color: muted, lineHeight: 1.9, marginBottom: 36, fontSize: 15 }}>
                            C'est ainsi que j'en suis arrivée à inclure du crochet à Coroller Illustration. Je crée des peluches, petites, grandes, en porte clef... et des plantes. Des plantes, parce que c'est une passion chez moi, les multiplier, les offrir, les rempoter, les voir grandir ! Et j'étais bien trop triste de voir que certaines personnes ne pouvaient pas en avoir chez elles : un chat qui détruit tout, un emploi du temps qui ne permet pas de s'en occuper, un appart sans luminosité … Les plantes en crochet sont donc la solution à ce problème !
                        </p>
                        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                            <CTABtn>Galerie complète →</CTABtn>
                            <CTABtn outline onClick={() => setModal(true)}>Commande personnalisée</CTABtn>
                        </div>
                    </div>
                    <Carousel items={croch} dark={dark} />
                </div>
            </section>

            {/* CTA RESTAURÉ */}
            <section id="contact" className="reveal" style={{ padding: "0 40px 100px" }}>
                <div style={{
                    maxWidth: 1600, margin: "0 auto",
                    background: dark ? "linear-gradient(135deg,#1a1640 0%,#2a204a 50%,#1a1030 100%)" : "linear-gradient(135deg,#eae6f8 0%,#ddd8f5 50%,#e8e2f5 100%)",
                    borderRadius: 28, padding: "80px 64px",
                    border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(79,71,144,0.12)"}`,
                    display: "grid", gridTemplateColumns: "1fr auto", gap: 48, alignItems: "center",
                }}>
                    <div>
                        <Tag label="Collaboration" />
                        <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(1rem,4vw,2rem)", fontWeight: 400, color: txt, margin: "16px 0 20px", lineHeight: 1.15 }}>
                            J'espère que mon univers te parlera, <br />qu'il fera écho à ton enfant intérieur, le ravivera peut-être.
                        </h2>
                        <p style={{ color: muted, fontSize: 15, lineHeight: 1.8, maxWidth: 480, marginBottom: 0 }}>
                            Si mes créations correspondent à une idée, un projet que tu voudrais réaliser n'hésite pas à me contacter pour en discuter !
                        </p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-end" }}>
                        <CTABtn onClick={() => setModal(true)}>Travaillons ensemble →</CTABtn>
                        <span style={{ fontSize: 12, color: muted, letterSpacing: 0.5 }}>Réponse sous 48h garantie</span>
                    </div>
                </div>
            </section>

            {/* FOOTER RESTAURÉ ET MIS À JOUR */}
            <footer style={{ borderTop: `1px solid ${divider}`, padding: "60px 40px" }}>
                <div style={{ maxWidth: 1600, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 40 }}>

                    {/* IDENTITÉ */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <span style={{ fontFamily: "Georgia,serif", fontSize: 18, color: txt, letterSpacing: 1 }}>
                            Coroller Illustration & Crochet
                        </span>
                        <span style={{ color: muted, fontSize: 12 }}>© 2026 · Fait avec passion à Albi</span>
                    </div>

                    {/* RÉSEAUX & CONTACT AVEC VRAIS LOGOS STYLÉS */}
                    <div style={{ display: "flex", gap: 32, alignItems: "center" }}>

                        {/* Instagram */}
                        <a href="https://www.instagram.com/m.coroller/" target="_blank" rel="noreferrer"
                            style={{
                                color: muted,
                                textDecoration: "none",
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                transition: "all .3s ease",
                                fontSize: "14px"
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.color = txt;
                                e.currentTarget.style.transform = "translateY(-2px)";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.color = muted;
                                e.currentTarget.style.transform = "translateY(0)";
                            }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                            <span>Instagram</span>
                        </a>

                        {/* Email / Contact */}
                        <a href="mailto:tonemail@exemple.com"
                            style={{
                                color: muted,
                                textDecoration: "none",
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                transition: "all .3s ease",
                                fontSize: "14px"
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.color = txt;
                                e.currentTarget.style.transform = "translateY(-2px)";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.color = muted;
                                e.currentTarget.style.transform = "translateY(0)";
                            }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            <span>Contact</span>
                        </a>
                    </div>

                    {/* LIENS LÉGAUX (RGPD) */}
                    <div style={{ display: "flex", gap: 24 }}>
                        <a href="#" style={{ color: muted, fontSize: 12, textDecoration: "none", fontWeight: 500 }}
                            onMouseEnter={e => e.target.style.color = txt}
                            onMouseLeave={e => e.target.style.color = muted}>
                            Mentions Légales
                        </a>
                        <a href="#" style={{ color: muted, fontSize: 12, textDecoration: "none", fontWeight: 500 }}
                            onMouseEnter={e => e.target.style.color = txt}
                            onMouseLeave={e => e.target.style.color = muted}>
                            Politique de Confidentialité (RGPD)
                        </a>
                        <a href="#" style={{ color: muted, fontSize: 12, textDecoration: "none", fontWeight: 500 }}
                            onMouseEnter={e => e.target.style.color = txt}
                            onMouseLeave={e => e.target.style.color = muted}>
                            Gestion des Cookies
                        </a>
                    </div>
                </div>
            </footer>

            {modal && <Modal onClose={() => setModal(false)} dark={dark} />}
        </div>
    );
}