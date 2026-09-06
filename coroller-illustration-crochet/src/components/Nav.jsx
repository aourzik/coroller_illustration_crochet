import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { useBreakpoint } from "../hooks/useBreakpoint";

const LINKS = [
    { to: "/", label: "Accueil" },
    { to: "/galerie-illustrations", label: "Illustrations" },
    { to: "/galerie-crochet", label: "Crochet" },
    { to: "/contact", label: "Contact" },
];

function DarkToggle({ dark, setDark, C, cardBg, cardBorder }) {
    return (
        <button
            onClick={() => setDark(!dark)}
            aria-label="Changer le thème"
            style={{
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: 99,
                width: 40,
                height: 24,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                padding: "0 4px",
                position: "relative",
                transition: "background .3s",
                flexShrink: 0,
            }}
        >
            <div
                style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: dark ? C.sky : C.accent,
                    transform: dark ? "translateX(16px)" : "translateX(0)",
                    transition: "all .3s",
                }}
            />
        </button>
    );
}

export default function Nav({ dark, setDark, scrolled, txt, muted, C, cardBg, cardBorder, divider }) {
    const { isTablet } = useBreakpoint();
    const { pathname } = useLocation();
    const [open, setOpen] = useState(false);

    // Referme le menu à chaque changement de page.
    React.useEffect(() => setOpen(false), [pathname]);

    const linkStyle = {
        color: muted,
        textDecoration: "none",
        fontSize: 13,
        letterSpacing: 0.5,
        fontWeight: 600,
        transition: "color .2s",
    };

    return (
        <nav
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 9999,
                background: dark
                    ? scrolled || open
                        ? "rgba(13, 11, 26, 0.85)"
                        : "transparent"
                    : scrolled || open
                    ? "rgba(250, 248, 244, 0.85)"
                    : "transparent",
                backdropFilter: scrolled || open ? "blur(50px)" : "none",
                borderBottom: scrolled || open ? `1px solid ${divider}` : "1px solid transparent",
                transition: "all .2s",
            }}
        >
            <div
                style={{
                    maxWidth: 1600,
                    margin: "0 auto",
                    padding: isTablet ? "0 20px" : "0 40px",
                    height: isTablet ? 66 : 80,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                }}
            >
                <Link
                    to="/"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    style={{ textDecoration: "none", minWidth: 0 }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <img
                            src={logo}
                            alt="Logo"
                            style={{ height: isTablet ? 42 : 60, width: "auto", objectFit: "contain" }}
                        />
                        <span
                            style={{
                                fontFamily: "Georgia,serif",
                                fontSize: isTablet ? 13 : 16,
                                letterSpacing: 1,
                                color: txt,
                            }}
                        >
                            Coroller
                            <br />
                            Illustration & Crochet
                        </span>
                    </div>
                </Link>

                {isTablet ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <DarkToggle {...{ dark, setDark, C, cardBg, cardBorder }} />
                        <button
                            onClick={() => setOpen((o) => !o)}
                            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
                            aria-expanded={open}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: 6,
                                display: "flex",
                                flexDirection: "column",
                                gap: 5,
                                flexShrink: 0,
                            }}
                        >
                            {[0, 1, 2].map((n) => (
                                <span
                                    key={n}
                                    style={{
                                        display: "block",
                                        width: 22,
                                        height: 2,
                                        borderRadius: 2,
                                        background: txt,
                                        transition: "transform .2s, opacity .2s",
                                        transform: open
                                            ? n === 0
                                                ? "translateY(7px) rotate(45deg)"
                                                : n === 2
                                                ? "translateY(-7px) rotate(-45deg)"
                                                : "none"
                                            : "none",
                                        opacity: open && n === 1 ? 0 : 1,
                                    }}
                                />
                            ))}
                        </button>
                    </div>
                ) : (
                    <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
                        {LINKS.map((l) => (
                            <Link key={l.to} to={l.to} style={linkStyle}>
                                {l.label}
                            </Link>
                        ))}
                        <DarkToggle {...{ dark, setDark, C, cardBg, cardBorder }} />
                    </div>
                )}
            </div>

            {/* Panneau déroulant mobile */}
            {isTablet && open && (
                <div
                    style={{
                        borderTop: `1px solid ${divider}`,
                        padding: "8px 20px 20px",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {LINKS.map((l) => (
                        <Link
                            key={l.to}
                            to={l.to}
                            style={{ ...linkStyle, fontSize: 15, padding: "14px 0" }}
                        >
                            {l.label}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
}
