import { useState, useEffect } from "react";

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
    { bg: "linear-gradient(135deg,#1a1035,#4f4790)", emoji: "🌙", label: "Nuit Féerique", sub: "Aquarelle numérique" },
    { bg: "linear-gradient(135deg,#1a3035,#2a7090)", emoji: "🌿", label: "Botanique", sub: "Encre & couleurs" },
    { bg: "linear-gradient(135deg,#35101a,#903050)", emoji: "🌸", label: "Flore Sauvage", sub: "Illustration éditoriale" },
    { bg: "linear-gradient(135deg,#102535,#1a5060)", emoji: "🦋", label: "Métamorphose", sub: "Série limitée" },
    { bg: "linear-gradient(135deg,#251035,#6a3080)", emoji: "✨", label: "Cosmos", sub: "Print numérique" },
];

const croch = [
    { bg: "linear-gradient(135deg,#1e1206,#5c3d12)", emoji: "🐻", label: "Ours Arctique", sub: "Laine mérinos" },
    { bg: "linear-gradient(135deg,#06121e,#124060)", emoji: "🐙", label: "Pieuvre Abyssale", sub: "Coton organique" },
    { bg: "linear-gradient(135deg,#121e06,#3a5c12)", emoji: "🌵", label: "Jardin Calme", sub: "Décoration murale" },
    { bg: "linear-gradient(135deg,#1e0612,#5c1230)", emoji: "🐰", label: "Lapin Lune", sub: "Sur commande" },
    { bg: "linear-gradient(135deg,#1a1206,#5c4a12)", emoji: "🌻", label: "Soleil d'Or", sub: "Édition unique" },
];

import mariePhoto from "./assets/images/marie.jpg";

function Carousel({ items, dark }) {
    const [cur, setCur] = useState(0);
    const n = items.length;
    const prev = () => setCur(i => (i - 1 + n) % n);
    const next = () => setCur(i => (i + 1) % n);

    return (
        <div style={{ width: "100%", userSelect: "none" }}>
            <div style={{ position: "relative", height: 320, overflow: "hidden", borderRadius: 24 }}>
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
                            <div style={{ fontSize: 64, marginBottom: 16 }}>{item.emoji}</div>
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

    return (
        <div style={{
            background: bg,
            color: txt,
            fontFamily: "Corbel, sans-serif",
            minHeight: "100vh",
            transition: "all .5s",
            position: "relative", // C'est le point de repère pour les bulles
            overflowX: "hidden"
        }}>

            {/* --- LES BULLES (Elles restent en haut et scrollent avec le texte) --- */}
            <div style={{
                position: "absolute", // Absolute = elles suivent le mouvement du scroll
                top: "-100px",
                left: "-15%",
                width: "80vw",
                height: "80vw",
                borderRadius: "50%",
                background: dark
                    ? "radial-gradient(circle, rgba(79,71,144,0.25) 0%, transparent 75%)"
                    : `radial-gradient(circle, ${C.sky} 0%, transparent 70%)`,
                filter: "blur(90px)",
                opacity: dark ? 0.8 : 0.7,
                pointerEvents: "none",
                zIndex: 0
            }} />

            <div style={{
                position: "absolute", // Absolute = elles suivent le mouvement du scroll
                top: "10%",
                right: "-10%",
                width: "60vw",
                height: "60vw",
                borderRadius: "50%",
                background: dark
                    ? "radial-gradient(circle, rgba(253,106,61,0.15) 0%, transparent 75%)"
                    : `radial-gradient(circle, ${C.accent} 0%, transparent 70%)`,
                filter: "blur(110px)",
                opacity: dark ? 0.8 : 0.5,
                pointerEvents: "none",
                zIndex: 0
            }} />

            {/* NAV */}
            <nav style={{
                position: "fixed", // On passe de sticky à fixed
                top: 0,
                left: 0, // Indispensable avec fixed
                right: 0, // Indispensable avec fixed
                zIndex: 100,
                background: dark
                    ? scrolled ? "rgba(13, 11, 26, 0.51)" : "transparent"
                    : scrolled ? "rgba(250, 248, 244, 0.51)" : "transparent",
                backdropFilter: scrolled ? "blur(50px)" : "none",
                borderBottom: scrolled ? `1px solid ${divider}` : "1px solid transparent",
                transition: "all .2s",
            }}>
                <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "Georgia,serif", fontSize: 20, letterSpacing: 1.5, color: txt }}>Coroller Illustration & crochet</span>
                    <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
                        {["À propos", "Illustrations", "Crochet", "Contact"].map(l => (
                            <a key={l} href={`#${l.replace("À", "a").replace(" ", "-").toLowerCase()}`}
                                style={{ color: muted, textDecoration: "none", fontSize: 13, letterSpacing: 0.5, fontWeight: 600, transition: "color .2s" }}
                                onMouseEnter={e => e.target.style.color = txt}
                                onMouseLeave={e => e.target.style.color = muted}>{l}</a>
                        ))}
                        <button onClick={() => setDark(d => !d)} style={{
                            background: cardBg, border: `1px solid ${cardBorder}`,
                            borderRadius: 99, width: 40, height: 24, cursor: "pointer",
                            display: "flex", alignItems: "center", padding: "0 4px",
                            position: "relative", transition: "background .3s",
                        }}>
                            <div style={{
                                width: 16, height: 16, borderRadius: "50%",
                                background: dark ? C.sky : C.accent,
                                transform: dark ? "translateX(16px)" : "translateX(0)",
                                transition: "all .3s",
                            }} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "80px 40px",
                position: "relative",
                maxWidth: 1100,
                margin: "0 auto",
                zIndex: 1,
            }}>

                {/* CONTENU TEXTE */}
                <div style={{ position: "relative", zIndex: 1, maxWidth: 780 }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 32, padding: "8px 20px", borderRadius: 99, border: `1px solid ${cardBorder}`, background: cardBg }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent }} />
                        <span style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: muted, fontWeight: 600 }}>Illustration · Crochet</span>
                    </div>
                    <h1 style={{
                        fontFamily: "Georgia,serif",
                        fontSize: "clamp(3.5rem,8vw,7rem)",
                        fontWeight: 400, lineHeight: 1.0,
                        margin: "0 0 28px", letterSpacing: -1,
                        color: txt,
                    }}>
                        L'art à l'état<br />
                        <span style={{ color: C.accent }}>pur.</span>
                    </h1>
                    <p style={{ fontSize: "clamp(1rem,2vw,1.2rem)", color: muted, maxWidth: 480, margin: "0 auto 44px", lineHeight: 1.8, fontWeight: 400 }}>
                        Illustrations oniriques et pièces crochet uniques — chaque création naît d'une intention, d'un fragment de rêve mis en forme.
                    </p>
                    <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                        <CTABtn onClick={() => setModal(true)}>Travaillons ensemble →</CTABtn>
                        <CTABtn outline>Voir les créations</CTABtn>
                    </div>
                </div>
            </section>

            {/* À PROPOS */}
            <section id="a-propos" style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
                <div style={{ position: "relative" }}>

                    {/* --- MODIFICATION ICI : On remplace l'émoji par la photo --- */}
                    <div style={{
                        aspectRatio: "4/5",
                        borderRadius: 24,
                        // On enlève le fond dégradé, on garde juste une couleur neutre
                        background: dark ? "#1a1840" : "#d5e4f9",
                        overflow: "hidden",
                        border: `1px solid ${cardBorder}`
                    }}>
                        <img
                            src={mariePhoto} // On utilise la variable d'import
                            alt="Portrait de Marie Léonard"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover", // Important pour que l'image remplisse le cadre sans se déformer
                            }}
                        />
                    </div>
                    <div style={{ position: "absolute", bottom: 28, right: -20, background: dark ? "#12102a" : "#bbd3f5f3", border: `1px solid ${cardBorder}`, borderRadius: 16, padding: "16px 20px" }}>
                        <div style={{ fontSize: 24, fontFamily: "Georgia,serif", color: txt, fontWeight: 400 }}>8+</div>
                        <div style={{ fontSize: 11, color: muted, letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>ans d'expérience</div>
                    </div>
                </div>
                <div>
                    <Tag label="À propos" />
                    <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(2rem,4vw,2.6rem)", fontWeight: 400, margin: "16px 0 24px", lineHeight: 1.15, color: txt }}>
                        Basée à Albi,<br />créatrice de l'imaginaire.
                    </h2>
                    <p style={{ color: muted, lineHeight: 1.9, marginBottom: 20, fontSize: 15 }}>
                        Depuis 2016, je transforme des émotions en formes visuelles — à travers l'illustration numérique et le textile artisanal. Mon travail explore la frontière entre le tangible et l'onirique.
                    </p>
                    <p style={{ color: muted, lineHeight: 1.9, marginBottom: 36, fontSize: 15 }}>
                        Chaque projet, qu'il soit une commande éditoriale ou une peluche sur-mesure, reçoit la même attention minutieuse. Je crois que les objets qu'on choisit de faire entrer dans notre vie doivent avoir une âme.
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                        {[["150+", "Illustrations"], ["80+", "Pièces crochet"], ["40+", "Clients satisfaits"]].map(([n, l]) => (
                            <div key={l} style={{ padding: "18px 16px", borderRadius: 14, border: `1px solid ${cardBorder}`, background: cardBg, textAlign: "center" }}>
                                <div style={{ fontFamily: "Georgia,serif", fontSize: 26, color: txt }}>{n}</div>
                                <div style={{ fontSize: 11, color: muted, marginTop: 4, letterSpacing: 0.5 }}>{l}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ILLUSTRATIONS */}
            <section id="illustrations" style={{ borderTop: `1px solid ${divider}` }}>
                <div style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
                    <Carousel items={illus} dark={dark} />
                    <div>
                        <Tag label="Illustrations" />
                        <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, margin: "16px 0 24px", lineHeight: 1.15, color: txt }}>
                            Des récits visuels qui traversent le temps.
                        </h2>
                        <p style={{ color: muted, lineHeight: 1.9, marginBottom: 20, fontSize: 15 }}>
                            Illustrations éditoriales, prints d'art et commandes personnalisées. Mon univers mêle botanique, cosmos et poésie du quotidien dans une palette soigneusement maîtrisée.
                        </p>
                        <p style={{ color: muted, lineHeight: 1.9, marginBottom: 36, fontSize: 15 }}>
                            Disponibles en formats numériques haute résolution ou en tirages d'art numérotés et signés. Collaborations presse et édition bienvenues.
                        </p>
                        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                            <CTABtn>Galerie complète →</CTABtn>
                            <CTABtn outline>Commande personnalisée</CTABtn>
                        </div>
                    </div>
                </div>
            </section>

            {/* CROCHET */}
            <section id="crochet" style={{ borderTop: `1px solid ${divider}` }}>
                <div style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
                    <div>
                        <Tag label="Créations crochet" />
                        <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, margin: "16px 0 24px", lineHeight: 1.15, color: txt }}>
                            La lenteur comme acte de création.
                        </h2>
                        <p style={{ color: muted, lineHeight: 1.9, marginBottom: 20, fontSize: 15 }}>
                            Amigurumi, objets décoratifs et pièces textiles réalisés à la main avec des fils naturels soigneusement sélectionnés — laine mérinos, coton biologique, alpaga.
                        </p>
                        <p style={{ color: muted, lineHeight: 1.9, marginBottom: 36, fontSize: 15 }}>
                            Chaque pièce est unique. Je propose des créations sur commande pour des cadeaux qui sortent de l'ordinaire, ou des collections en édition limitée disponibles en boutique.
                        </p>
                        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                            <CTABtn>Voir la boutique →</CTABtn>
                            <CTABtn outline onClick={() => setModal(true)}>Commander sur-mesure</CTABtn>
                        </div>
                    </div>
                    <Carousel items={croch} dark={dark} />
                </div>
            </section>

            {/* CTA */}
            <section id="contact" style={{ padding: "0 40px 100px" }}>
                <div style={{
                    maxWidth: 1100, margin: "0 auto",
                    background: dark ? "linear-gradient(135deg,#1a1640 0%,#2a204a 50%,#1a1030 100%)" : "linear-gradient(135deg,#eae6f8 0%,#ddd8f5 50%,#e8e2f5 100%)",
                    borderRadius: 28, padding: "80px 64px",
                    border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(79,71,144,0.12)"}`,
                    display: "grid", gridTemplateColumns: "1fr auto", gap: 48, alignItems: "center",
                }}>
                    <div>
                        <Tag label="Collaboration" />
                        <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 400, color: txt, margin: "16px 0 20px", lineHeight: 1.15 }}>
                            Votre vision mérite<br />un traitement d'exception.
                        </h2>
                        <p style={{ color: muted, fontSize: 15, lineHeight: 1.8, maxWidth: 480, marginBottom: 0 }}>
                            Illustration éditoriale, packaging, peluche sur-mesure ou projet créatif collaboratif — discutons de ce que vous avez en tête.
                        </p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-end" }}>
                        <CTABtn onClick={() => setModal(true)}>Travaillons ensemble →</CTABtn>
                        <span style={{ fontSize: 12, color: muted, letterSpacing: 0.5 }}>Réponse sous 48h garantie</span>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={{ borderTop: `1px solid ${divider}`, padding: "40px 40px" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
                    <span style={{ fontFamily: "Georgia,serif", fontSize: 18, color: txt, letterSpacing: 1 }}>Marie Léonard</span>
                    <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
                        {["Instagram", "Pinterest", "Etsy", "Behance"].map(s => (
                            <a key={s} href="#" style={{ color: muted, fontSize: 13, textDecoration: "none", transition: "color .2s", letterSpacing: 0.3, fontWeight: 600 }}
                                onMouseEnter={e => e.target.style.color = txt}
                                onMouseLeave={e => e.target.style.color = muted}>{s}</a>
                        ))}
                    </div>
                    <span style={{ color: muted, fontSize: 12 }}>© 2025 · Tous droits réservés</span>
                </div>
            </footer>

            {modal && <Modal onClose={() => setModal(false)} dark={dark} />}
        </div>
    );
}
