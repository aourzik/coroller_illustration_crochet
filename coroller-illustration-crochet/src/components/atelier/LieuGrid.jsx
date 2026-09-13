import { useEffect, useRef, useState } from "react";
import { COLORS, btnDanger, btnGhost } from "./theme";
import Icon from "./Icon";

const GRID = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: 14,
};

function LieuCard({ lieu, isDragging, dragHandleProps, onDelete }) {
    const [confirming, setConfirming] = useState(false);

    return (
        <div
            style={{
                position: "relative",
                aspectRatio: "4 / 3",
                borderRadius: 14,
                overflow: "hidden",
                border: `1px solid ${COLORS.border}`,
                opacity: isDragging ? 0.4 : 1,
                transition: "opacity .15s",
            }}
        >
            <img src={lieu.img_url} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />

            {!confirming && (
                <div
                    {...dragHandleProps}
                    title="Glisser pour réordonner"
                    style={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: "rgba(13,11,26,0.55)",
                        color: "#fff",
                        cursor: "grab",
                    }}
                >
                    <Icon name="drag" size={14} />
                </div>
            )}

            {!confirming ? (
                <button
                    onClick={() => setConfirming(true)}
                    aria-label="Supprimer"
                    style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: "rgba(220,38,38,0.85)",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Icon name="trash" size={14} />
                </button>
            ) : (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(13,11,26,0.82)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                        padding: 10,
                        textAlign: "center",
                    }}
                >
                    <span style={{ color: "#fff", fontSize: 12.5, fontWeight: 600 }}>Supprimer cette photo ?</span>
                    <div style={{ display: "flex", gap: 6 }}>
                        <button
                            onClick={() => onDelete(lieu.id, lieu.img_url)}
                            style={{ ...btnDanger, background: COLORS.danger, color: "#fff", padding: "6px 10px", fontSize: 12 }}
                        >
                            Oui
                        </button>
                        <button onClick={() => setConfirming(false)} style={{ ...btnGhost, padding: "6px 10px", fontSize: 12 }}>
                            Non
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Grille des photos de lieux ponctuels : glisser-déposer pour réordonner
// (toujours actif, pas de tri/filtre pour cette liste plus simple).
export default function LieuGrid({ lieux, onDelete, onReorder }) {
    const [order, setOrder] = useState(lieux);
    const dragId = useRef(null);
    const movedRef = useRef(false);

    useEffect(() => {
        setOrder(lieux);
    }, [lieux]);

    if (lieux.length === 0) {
        return (
            <div
                style={{
                    background: COLORS.card,
                    border: `1px dashed ${COLORS.border}`,
                    borderRadius: 16,
                    padding: "32px 24px",
                    textAlign: "center",
                    color: COLORS.muted,
                    fontSize: 14,
                }}
            >
                Aucune photo de lieu pour le moment.
            </div>
        );
    }

    const handleDragOverCard = (overId) => {
        const fromId = dragId.current;
        if (fromId == null || fromId === overId) return;
        setOrder((list) => {
            const from = list.findIndex((x) => x.id === fromId);
            const to = list.findIndex((x) => x.id === overId);
            if (from === -1 || to === -1 || from === to) return list;
            const next = [...list];
            const [moved] = next.splice(from, 1);
            next.splice(to, 0, moved);
            movedRef.current = true;
            return next;
        });
    };

    const commit = () => {
        dragId.current = null;
        if (movedRef.current) {
            movedRef.current = false;
            onReorder(order.map((x) => x.id));
        }
    };

    return (
        <div style={GRID}>
            {order.map((l) => (
                <div
                    key={l.id}
                    onDragOver={(e) => {
                        e.preventDefault();
                        handleDragOverCard(l.id);
                    }}
                    onDrop={commit}
                >
                    <LieuCard
                        lieu={l}
                        onDelete={onDelete}
                        isDragging={dragId.current === l.id}
                        dragHandleProps={{
                            draggable: true,
                            onDragStart: (e) => {
                                dragId.current = l.id;
                                e.dataTransfer.effectAllowed = "move";
                                e.dataTransfer.setData("text/plain", String(l.id));
                            },
                            onDragEnd: commit,
                        }}
                    />
                </div>
            ))}
        </div>
    );
}
