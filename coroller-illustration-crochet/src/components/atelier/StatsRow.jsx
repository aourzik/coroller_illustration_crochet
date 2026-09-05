import { COLORS } from "./theme";

function StatCard({ label, value, accent }) {
    return (
        <div
            style={{
                flex: "1 1 160px",
                background: COLORS.card,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 16,
                padding: "20px 22px",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: accent }} />
            <div style={{ fontFamily: "Georgia, serif", fontSize: 30, color: COLORS.ink }}>{value}</div>
            <div style={{ fontSize: 12, color: COLORS.muted, letterSpacing: 0.4, marginTop: 2 }}>{label}</div>
        </div>
    );
}

export default function StatsRow({ total, illus, croch }) {
    return (
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 30 }}>
            <StatCard label="Œuvres en ligne" value={total} accent={COLORS.orange} />
            <StatCard label="Illustrations" value={illus} accent={COLORS.sky} />
            <StatCard label="Crochet" value={croch} accent={COLORS.orange} />
        </div>
    );
}
