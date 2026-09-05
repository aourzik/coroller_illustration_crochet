// Jeu d'icônes SVG au trait (style Feather/Lucide), sans dépendance ni emoji.
// La couleur suit `currentColor`, donc celle du texte parent.
export default function Icon({ name, size = 16 }) {
    const p = {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        style: { flexShrink: 0, display: "block" },
    };
    switch (name) {
        case "grid":
            return (
                <svg {...p}>
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                </svg>
            );
        case "image":
            return (
                <svg {...p}>
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                </svg>
            );
        case "aperture":
            return (
                <svg {...p}>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="14.31" y1="8" x2="20.05" y2="8" />
                    <line x1="9.69" y1="8" x2="3.95" y2="8" />
                    <line x1="7.38" y1="12" x2="10.19" y2="7" />
                    <line x1="16.62" y1="12" x2="13.81" y2="7" />
                    <line x1="9.69" y1="16" x2="3.95" y2="16" />
                    <line x1="14.31" y1="16" x2="20.05" y2="16" />
                    <line x1="16.62" y1="12" x2="13.81" y2="17" />
                    <line x1="7.38" y1="12" x2="10.19" y2="17" />
                </svg>
            );
        case "plus":
            return (
                <svg {...p}>
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            );
        case "edit":
            return (
                <svg {...p}>
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
            );
        case "trash":
            return (
                <svg {...p}>
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
            );
        case "search":
            return (
                <svg {...p}>
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
            );
        case "x":
            return (
                <svg {...p}>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            );
        case "drag":
            return (
                <svg {...p} fill="currentColor" stroke="none">
                    <circle cx="9" cy="6" r="1.6" />
                    <circle cx="15" cy="6" r="1.6" />
                    <circle cx="9" cy="12" r="1.6" />
                    <circle cx="15" cy="12" r="1.6" />
                    <circle cx="9" cy="18" r="1.6" />
                    <circle cx="15" cy="18" r="1.6" />
                </svg>
            );
        case "crop":
            return (
                <svg {...p}>
                    <path d="M6 2v14a2 2 0 0 0 2 2h14" />
                    <path d="M18 22V8a2 2 0 0 0-2-2H2" />
                </svg>
            );
        default:
            return null;
    }
}
