import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../App";
import { useAuth } from "../auth";
import logo from "../assets/images/logo.png";

export default function Connexion() {
    const { user, signIn } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState("idle"); // idle | loading | error
    const [errorMsg, setErrorMsg] = useState("");

    // Déjà connectée ? On file directement à l'atelier.
    useEffect(() => {
        if (user) navigate("/atelier", { replace: true });
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMsg("");

        const { error } = await signIn(email.trim(), password);

        if (error) {
            setStatus("error");
            setErrorMsg(
                error.message === "Invalid login credentials"
                    ? "Email ou mot de passe incorrect."
                    : error.message
            );
            return;
        }

        navigate("/atelier", { replace: true });
    };

    const inputStyle = {
        width: "100%",
        padding: "13px 14px",
        marginBottom: "16px",
        borderRadius: "10px",
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(255,255,255,0.05)",
        color: "#f0eef8",
        fontFamily: "inherit",
        fontSize: "15px",
        outline: "none",
        boxSizing: "border-box",
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: C.ink,
                color: "#f0eef8",
                fontFamily: "Corbel, sans-serif",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px 20px",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "400px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "24px",
                    padding: "40px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        marginBottom: "28px",
                    }}
                >
                    <img
                        src={logo}
                        alt="Coroller Illustration & Crochet"
                        style={{ height: 64, width: "auto", objectFit: "contain", marginBottom: 16 }}
                    />
                    <h1
                        style={{
                            fontFamily: "Georgia, serif",
                            fontSize: "1.5rem",
                            fontWeight: 400,
                            margin: 0,
                        }}
                    >
                        Espace créatrice
                    </h1>
                    <p style={{ color: C.muted, fontSize: 13, marginTop: 6, textAlign: "center" }}>
                        Connecte-toi pour gérer tes créations.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                        Email
                    </label>
                    <input
                        type="email"
                        autoComplete="username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={inputStyle}
                    />

                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                        Mot de passe
                    </label>
                    <input
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={inputStyle}
                    />

                    {status === "error" && (
                        <div
                            style={{
                                color: "#ff9b82",
                                fontSize: 13,
                                marginBottom: 16,
                                textAlign: "center",
                            }}
                        >
                            {errorMsg}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={status === "loading"}
                        style={{
                            width: "100%",
                            padding: "14px",
                            borderRadius: "10px",
                            border: "none",
                            background: C.accent,
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: 15,
                            cursor: status === "loading" ? "default" : "pointer",
                            fontFamily: "Corbel, sans-serif",
                            opacity: status === "loading" ? 0.7 : 1,
                            transition: "opacity .2s",
                        }}
                    >
                        {status === "loading" ? "Connexion…" : "Se connecter"}
                    </button>
                </form>
            </div>
        </div>
    );
}
