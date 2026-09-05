import { COLORS } from "./theme";

const toneColor = {
    info: COLORS.sky,
    success: COLORS.orange,
    error: COLORS.danger,
};

// Pile de notifications en bas à droite. Clic = fermeture immédiate.
export default function Toaster({ toasts, onDismiss }) {
    if (toasts.length === 0) return null;
    return (
        <div
            style={{
                position: "fixed",
                right: 20,
                bottom: 20,
                zIndex: 1000,
                display: "flex",
                flexDirection: "column",
                gap: 10,
                maxWidth: "min(360px, calc(100vw - 40px))",
            }}
        >
            {toasts.map((t) => (
                <div
                    key={t.id}
                    onClick={() => onDismiss(t.id)}
                    role="status"
                    style={{
                        background: COLORS.card,
                        border: `1px solid ${COLORS.border}`,
                        borderLeft: `3px solid ${toneColor[t.tone] || COLORS.sky}`,
                        borderRadius: 10,
                        padding: "12px 16px",
                        fontSize: 13.5,
                        fontWeight: 600,
                        color: COLORS.ink,
                        boxShadow: "0 8px 24px rgba(13,11,26,0.12)",
                        cursor: "pointer",
                    }}
                >
                    {t.message}
                </div>
            ))}
        </div>
    );
}
