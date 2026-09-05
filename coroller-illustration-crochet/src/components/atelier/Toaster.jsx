import { COLORS } from "./theme";

const toneColor = {
    info: COLORS.sky,
    success: COLORS.orange,
    error: COLORS.danger,
};

// Pile de notifications en bas à droite. Clic sur le corps = fermeture.
// Un toast peut porter une action (ex. « Annuler »).
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
                maxWidth: "min(380px, calc(100vw - 40px))",
            }}
        >
            {toasts.map((t) => (
                <div
                    key={t.id}
                    role="status"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        background: COLORS.card,
                        border: `1px solid ${COLORS.border}`,
                        borderLeft: `3px solid ${toneColor[t.tone] || COLORS.sky}`,
                        borderRadius: 10,
                        padding: "12px 14px 12px 16px",
                        fontSize: 13.5,
                        fontWeight: 600,
                        color: COLORS.ink,
                        boxShadow: "0 8px 24px rgba(13,11,26,0.12)",
                    }}
                >
                    <span
                        onClick={() => onDismiss(t.id)}
                        style={{ flex: 1, cursor: "pointer" }}
                    >
                        {t.message}
                    </span>
                    {t.action && (
                        <button
                            type="button"
                            onClick={() => {
                                t.action.onClick();
                                onDismiss(t.id);
                            }}
                            style={{
                                flexShrink: 0,
                                background: "none",
                                border: "none",
                                color: COLORS.skyDeep,
                                fontWeight: 700,
                                fontSize: 13,
                                cursor: "pointer",
                                fontFamily: "inherit",
                                padding: "4px 6px",
                            }}
                        >
                            {t.action.label}
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}
