import logo from "../assets/images/logo.png";
import { Link } from "react-router-dom";
import React from "react";


export default function Footer({ divider, logoStyle, txt, muted }) {
    return (
        <footer style={{ borderTop: `1px solid ${divider}`, padding: "60px 40px" }}>
            <div style={{ maxWidth: 1600, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 40 }}>

                {/* IDENTITÉ AVEC LOGO */}
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <img src={logo} alt="Logo" style={{ height: 50, width: "auto", objectFit: "contain" }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <span style={{ fontFamily: "Georgia,serif", fontSize: 18, color: txt, letterSpacing: 1 }}>
                            Coroller Illustration & Crochet
                        </span>
                        <span style={{ color: muted, fontSize: 12 }}>© 2026 · Fait avec passion à Albi par Aïny Ourzik</span>
                    </div>
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
                        <Link
                            to="/contact"
                            style={{
                                color: muted,
                                textDecoration: "none",
                                fontSize: "14px",
                                transition: "color 0.3s"
                            }}
                            onMouseEnter={(e) => e.target.style.color = txt}
                            onMouseLeave={(e) => e.target.style.color = muted}
                        >
                            Contact
                        </Link>
                    </a>
                </div>

                {/* LIENS LÉGAUX (RGPD) */}
                <div style={{ display: "flex", gap: 24 }}>
                    <Link 
                        to="/mentions-legales" 
                        style={{ color: muted, fontSize: 12, textDecoration: "none", fontWeight: 500, transition: "color 0.2s" }}
                        onMouseEnter={e => e.target.style.color = txt}
                        onMouseLeave={e => e.target.style.color = muted}
                    >
                        Mentions Légales
                    </Link>
                    
                    <Link 
                        to="/politique-confidentialite" 
                        style={{ color: muted, fontSize: 12, textDecoration: "none", fontWeight: 500, transition: "color 0.2s" }}
                        onMouseEnter={e => e.target.style.color = txt}
                        onMouseLeave={e => e.target.style.color = muted}
                    >
                        Politique de Confidentialité (RGPD)
                    </Link>
                    
                    <a 
                        href="#" 
                        onClick={(e) => {
                        e.preventDefault();
                        alert("Ce site respecte votre vie privée : aucun cookie publicitaire ou traceur tiers n'est utilisé. Seuls des cookies techniques essentiels à la navigation peuvent être déposés.");
                        }}
                        style={{ color: muted, fontSize: 12, textDecoration: "none", fontWeight: 500, fontFamily: "Corbel, sans-serif", transition: "color 0.2s" }}
                        onMouseEnter={e => e.target.style.color = txt}
                        onMouseLeave={e => e.target.style.color = muted}
                    >
                        Gestion des Cookies
                    </a>
                </div>
            </div>
        </footer>
    );
}