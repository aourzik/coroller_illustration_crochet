// Palette et styles partagés du back-office.
// Valeurs hex figées : l'objet `C` de App.jsx n'est pas disponible au niveau
// module (import circulaire App → pages → App).

export const COLORS = {
    navy: "#0d0b1a", // nav + sidebar        (C.ink)
    paper: "#faf8f4", // fond zone de travail (C.cream)
    card: "#ffffff",
    ink: "#0d0b1a",
    muted: "#6a6880",
    border: "rgba(13,11,26,0.08)",
    fieldBorder: "rgba(13,11,26,0.15)",
    orange: "#fd6a3d", // C.accent
    sky: "#92bbf3", // C.sky
    skyDeep: "#3f6bb0",
    danger: "#dc2626",
};

export const field = {
    padding: "11px 12px",
    borderRadius: 10,
    border: `1px solid ${COLORS.fieldBorder}`,
    background: "#fff",
    color: COLORS.ink,
    outline: "none",
    fontFamily: "inherit",
    fontSize: 14,
    lineHeight: 1.4,
    width: "100%",
    boxSizing: "border-box",
};

// Chevron custom pour que les <select> aient exactement la même boîte que les
// <input> (les select natifs se rendent plus courts, surtout sur Safari).
const CHEVRON =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236a6880' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")";

export const selectField = {
    ...field,
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    cursor: "pointer",
    backgroundImage: CHEVRON,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
    paddingRight: 34,
};

const btnBase = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    cursor: "pointer",
    fontFamily: "inherit",
    borderRadius: 10,
};

export const btnPrimary = {
    ...btnBase,
    background: COLORS.orange,
    color: "#fff",
    border: "none",
    padding: "11px 18px",
    fontWeight: 700,
    fontSize: 13,
};

export const btnGhost = {
    ...btnBase,
    background: "#fff",
    color: COLORS.skyDeep,
    border: `1px solid ${COLORS.sky}`,
    padding: "9px 14px",
    fontWeight: 600,
    fontSize: 13,
};

export const btnDanger = {
    ...btnBase,
    background: "rgba(239,68,68,0.09)",
    color: COLORS.danger,
    border: "none",
    padding: "9px 14px",
    fontWeight: 600,
    fontSize: 13,
};

// Style d'un badge de catégorie.
export const categoryBadge = (cat) => ({
    fontSize: 11,
    fontWeight: 700,
    padding: "3px 9px",
    borderRadius: 999,
    background: cat === "illustration" ? "rgba(146,187,243,0.22)" : "rgba(253,106,61,0.15)",
    color: cat === "illustration" ? COLORS.skyDeep : "#c2451f",
});

export const CATEGORY_LABEL = { illustration: "Illustration", crochet: "Crochet" };
export const SIZE_LABEL = { medium: "Standard", large: "Grand" };
