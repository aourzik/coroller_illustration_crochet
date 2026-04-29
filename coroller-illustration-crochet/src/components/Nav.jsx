import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";

export default function Nav({ dark, setDark, scrolled, txt, muted, C, cardBg, cardBorder, divider }) {
    return (
        <nav style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999,
            background: dark ? (scrolled ? "rgba(13, 11, 26, 0.6)" : "transparent") : (scrolled ? "rgba(250, 248, 244, 0.6)" : "transparent"),
            backdropFilter: scrolled ? "blur(50px)" : "none",
            borderBottom: scrolled ? `1px solid ${divider}` : "1px solid transparent",
            transition: "all .2s"
        }}>
            <div style={{ maxWidth: 1600, margin: "0 auto", padding: "0 40px", height: 80, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

                {/* LOGO : Ramène à la racine "/" */}
                <Link to="/" style={{ textDecoration: "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <img src={logo} alt="Logo" style={{ height: 60, width: "auto", objectFit: "contain" }} />
                        <span style={{ fontFamily: "Georgia,serif", fontSize: 16, letterSpacing: 1, color: txt }}>
                            Coroller<br />Illustration & Crochet
                        </span>
                    </div>
                </Link>

                <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
                    {/* ACCUEIL : Ramène à la racine "/" */}
                    <Link to="/" style={{ color: muted, textDecoration: "none", fontSize: 13, letterSpacing: 0.5, fontWeight: 600, transition: "color .2s" }}>
                        Accueil
                    </Link>

                    {/* AUTRES PAGES */}
                    <Link to="/galerie-illustrations" style={{ color: muted, textDecoration: "none", fontSize: 13, letterSpacing: 0.5, fontWeight: 600 }}>
                        Illustrations
                    </Link>

                    <Link to="/galerie-crochet" style={{ color: muted, textDecoration: "none", fontSize: 13, letterSpacing: 0.5, fontWeight: 600 }}>
                        Crochet
                    </Link>

                    <Link to="/contact" style={{ color: muted, textDecoration: "none", fontSize: 13, letterSpacing: 0.5, fontWeight: 600 }}>
                        Contact
                    </Link>

                    {/* BOUTON DARK MODE */}
                    <button onClick={() => setDark(!dark)} style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 99, width: 40, height: 24, cursor: "pointer", display: "flex", alignItems: "center", padding: "0 4px", position: "relative", transition: "background .3s" }}>
                        <div style={{ width: 16, height: 16, borderRadius: "50%", background: dark ? C.sky : C.accent, transform: dark ? "translateX(16px)" : "translateX(0)", transition: "all .3s" }} />
                    </button>
                </div>
            </div>
        </nav>
    );
}