import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

export default function Modal({ onClose, dark }) {
    const form = useRef();
    const [status, setStatus] = useState(""); // "" | "Envoi en cours..." | "Succès" | "Erreur"

    // On récupère tes couleurs
    const orangeLight = "#ef6637";
    const orangeDark = "#fd6a3d";

    const sendEmail = (e) => {
        e.preventDefault();
        setStatus("Envoi en cours...");

        // REMPLACE LES CODES CI-DESSOUS PAR TES CODES EMAILJS
        emailjs.sendForm(
            'service_lhhkv9f',
            'template_jxcsqn5',
            form.current,
            'DSJIeivHNjwwa9u8v'
        )
            .then(() => {
                setStatus("Message envoyé ! ✨");
                // On ferme la popup automatiquement après 2 secondes si ça a marché
                setTimeout(() => onClose(), 2000);
            }, (error) => {
                setStatus("Erreur... Réessayez.");
                console.error("Erreur EmailJS:", error.text);
            });
    };

    const inputStyle = {
        width: "100%",
        padding: "12px",
        marginBottom: "16px",
        borderRadius: "8px",
        border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
        background: dark ? "rgba(255,255,255,0.05)" : "#fff",
        color: dark ? "#fff" : "#0d0b1a",
        fontFamily: "inherit",
        outline: "none",
        boxSizing: "border-box"
    };

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
            <div onClick={e => e.stopPropagation()} style={{ background: dark ? "#0d0b1a" : "#faf8f4", padding: "40px", borderRadius: "24px", width: "95%", maxWidth: "450px", border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`, position: "relative" }}>

                <button onClick={onClose} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#8b8aaa" }}>✕</button>

                <form ref={form} onSubmit={sendEmail}>
                    <h2 style={{ fontFamily: "Georgia, serif", marginBottom: "8px", color: dark ? "#fff" : "#0d0b1a" }}>Parlons de votre projet</h2>
                    <p style={{ color: "#8b8aaa", fontSize: "14px", marginBottom: "24px" }}>Je vous recontacterai au plus vite.</p>

                    {/* Les 'name' doivent être identiques à ceux de ton template EmailJS */}
                    <input type="text" name="user_name" placeholder="Votre nom" required style={inputStyle} />
                    <input type="email" name="user_email" placeholder="Votre email" required style={inputStyle} />
                    <textarea name="message" placeholder="Décrivez votre projet en quelques mots..." rows="5" required style={{ ...inputStyle, resize: "none" }} />

                    <button
                        type="submit"
                        disabled={status === "Envoi en cours..."}
                        style={{
                            width: "100%",
                            padding: "14px",
                            borderRadius: "10px",
                            border: "none",
                            background: dark ? orangeDark : orangeLight,
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: "16px",
                            cursor: status === "Envoi en cours..." ? "default" : "pointer",
                            transition: "all 0.2s"
                        }}
                    >
                        {status || "Envoyer le message →"}
                    </button>
                </form>
            </div>
        </div>
    );
}