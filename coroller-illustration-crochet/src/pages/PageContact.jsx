import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { C } from "../App";

export default function PageContact({ dark }) {
    const form = useRef();
    const [status, setStatus] = useState("");

    const orangeLight = "#ef6637";
    const orangeDark = "#fd6a3d";

    const sendEmail = (e) => {
        e.preventDefault();
        setStatus("Envoi en cours...");

        emailjs.sendForm(
            'service_lhhkv9f',
            'template_jxcsqn5',
            form.current,
            'DSJIeivHNjwwa9u8v'
        )
            .then(() => {
                setStatus("Message envoyé ! ✨");
                form.current.reset(); // On vide le formulaire
            }, (error) => {
                setStatus("Erreur... Réessayez.");
            });
    };

    const inputStyle = {
        width: "100%",
        padding: "14px",
        marginBottom: "20px",
        borderRadius: "12px",
        border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
        background: dark ? "rgba(255,255,255,0.05)" : "#fff",
        color: dark ? "#fff" : "#0d0b1a",
        fontFamily: "inherit",
        outline: "none",
        boxSizing: "border-box",
        fontSize: "16px"
    };

    return (
        <div style={{
            paddingTop: "140px",
            paddingBottom: "100px",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingLeft: "20px",
            paddingRight: "20px"
        }}>
            <div style={{ maxWidth: "600px", width: "100%", textAlign: "center", marginBottom: "40px" }}>
                <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2.5rem, 5vw, 3.5rem)", color: dark ? "#fff" : "#0d0b1a", marginBottom: "16px" }}>
                    Contact
                </h1>
                <p style={{ color: "#8b8aaa", fontSize: "18px", lineHeight: "1.6" }}>
                    Un projet d'illustration, une envie de crochet sur mesure ou juste un petit mot doux ? Je vous recontacterai au plus vite.
                </p>
            </div>

            <div style={{
                background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                padding: "48px",
                borderRadius: "32px",
                width: "100%",
                maxWidth: "550px",
                border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"}`
            }}>
                <form ref={form} onSubmit={sendEmail}>
                    <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", opacity: 0.7 }}>Nom complet</label>
                    <input type="text" name="user_name" placeholder="Esmée Coroller" required style={inputStyle} />

                    <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", opacity: 0.7 }}>Adresse email</label>
                    <input type="email" name="user_email" placeholder="esmee@exemple.com" required style={inputStyle} />

                    <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", opacity: 0.7 }}>Votre message</label>
                    <textarea name="message" placeholder="Dites-moi tout sur votre projet..." rows="6" required style={{ ...inputStyle, resize: "none" }} />

                    <button
                        type="submit"
                        disabled={status === "Envoi en cours..."}
                        style={{
                            width: "100%",
                            padding: "16px",
                            borderRadius: "12px",
                            border: "none",
                            background: dark ? orangeDark : orangeLight,
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: "16px",
                            cursor: status === "Envoi en cours..." ? "default" : "pointer",
                            transition: "all 0.2s",
                            marginTop: "10px"
                        }}
                    >
                        {status || "Envoyer le message →"}
                    </button>
                </form>
            </div>
        </div>
    );
}