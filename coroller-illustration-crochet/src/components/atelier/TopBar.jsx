import { COLORS } from "./theme";
import logo from "../../assets/images/logo.png";

export default function TopBar({ email, onLogout }) {
    return (
        <nav
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                padding: "12px 22px",
                background: COLORS.navy,
                color: "#f0eef8",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                flexWrap: "wrap",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img src={logo} alt="" style={{ height: 34, width: "auto", objectFit: "contain" }} />
                <span style={{ fontFamily: "Georgia, serif", fontSize: 15, letterSpacing: 0.5 }}>
                    Coroller · Espace créatrice
                </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12.5 }}>
                <span style={{ color: "rgba(240,238,248,0.6)" }}>{email}</span>
                <button
                    onClick={onLogout}
                    style={{
                        background: "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(255,255,255,0.14)",
                        color: "#f0eef8",
                        borderRadius: 8,
                        padding: "7px 13px",
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "inherit",
                    }}
                >
                    Se déconnecter
                </button>
            </div>
        </nav>
    );
}
