import { COLORS } from "./theme";
import OeuvreCard from "./OeuvreCard";

export default function OeuvreGrid({ oeuvres, onSave, onDelete, emptyLabel }) {
    if (oeuvres.length === 0) {
        return (
            <div
                style={{
                    background: COLORS.card,
                    border: `1px dashed ${COLORS.border}`,
                    borderRadius: 16,
                    padding: "44px 24px",
                    textAlign: "center",
                    color: COLORS.muted,
                    fontSize: 14,
                }}
            >
                {emptyLabel}
            </div>
        );
    }

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 16,
            }}
        >
            {oeuvres.map((o) => (
                <OeuvreCard key={o.id} oeuvre={o} onSave={onSave} onDelete={onDelete} />
            ))}
        </div>
    );
}
