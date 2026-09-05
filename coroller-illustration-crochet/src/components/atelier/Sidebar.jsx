import { COLORS } from "./theme";
import Icon from "./Icon";

export default function Sidebar({ items, active, onSelect, isNarrow }) {
    return (
        <aside
            style={{
                width: isNarrow ? "100%" : 240,
                flexShrink: 0,
                background: COLORS.navy,
                borderRight: isNarrow ? "none" : "1px solid rgba(255,255,255,0.06)",
                padding: isNarrow ? "10px" : "20px 14px",
                display: "flex",
                flexDirection: isNarrow ? "row" : "column",
                gap: 4,
                overflowX: isNarrow ? "auto" : "visible",
            }}
        >
            {items.map((it) => {
                const isActive = active === it.id;
                return (
                    <button
                        key={it.id}
                        onClick={() => onSelect(it.id)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            width: isNarrow ? "auto" : "100%",
                            whiteSpace: "nowrap",
                            padding: isNarrow ? "10px 14px" : "12px 16px",
                            borderRadius: 10,
                            border: "none",
                            cursor: "pointer",
                            background: isActive ? "rgba(253,106,61,0.16)" : "transparent",
                            color: isActive ? COLORS.orange : "rgba(240,238,248,0.72)",
                            fontWeight: isActive ? 700 : 500,
                            fontSize: 14,
                            fontFamily: "inherit",
                            textAlign: "left",
                            borderLeft: isNarrow
                                ? "none"
                                : `3px solid ${isActive ? COLORS.orange : "transparent"}`,
                            transition: "all .15s",
                        }}
                    >
                        <Icon name={it.icon} size={16} />
                        {it.label}
                    </button>
                );
            })}
        </aside>
    );
}
