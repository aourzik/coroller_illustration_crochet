import React from "react";
import { C } from "../App";

export default function Modal({ onClose, dark }) {
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
                <button onClick={onClose} style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#8b8aaa" }}>✕</button>
                <div style={{ fontFamily: "Georgia,serif", fontSize: 13, letterSpacing: 3, color: "#fd6a3d", textTransform: "uppercase", marginBottom: 8 }}>Contact</div>
                <h3 style={{ fontFamily: "Georgia,serif", fontSize: 28, fontWeight: 400, color: txt, marginBottom: 6, marginTop: 0 }}>Parlons de<br />votre projet.</h3>
                <p style={{ color: "#8b8aaa", fontSize: 13, marginBottom: 28, lineHeight: 1.6 }}>Je réponds à chaque message avec soin, sous 48h.</p>
                <input placeholder="Votre nom" style={inputStyle} />
                <input placeholder="Votre email" style={inputStyle} />
                <textarea placeholder="Décrivez votre projet…" rows={4} style={{ ...inputStyle, resize: "none", marginBottom: 20 }} />
                <button style={{ width: "100%", background: "#fd6a3d", color: "#fff", border: "none", borderRadius: 12, padding: "14px", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "Corbel,sans-serif", letterSpacing: 0.5 }}>Envoyer le message →</button>
            </div>
        </div>
    );
}