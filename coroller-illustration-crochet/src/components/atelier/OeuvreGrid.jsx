import { useEffect, useRef, useState } from "react";
import { COLORS } from "./theme";
import OeuvreCard from "./OeuvreCard";

const GRID = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 16,
};

export default function OeuvreGrid({
    oeuvres,
    onSave,
    onDelete,
    emptyLabel,
    reorderable = false,
    onReorder,
}) {
    // Ordre local pendant un glisser ; resynchronisé dès que la liste change.
    const [order, setOrder] = useState(oeuvres);
    const dragId = useRef(null);
    const movedRef = useRef(false);

    useEffect(() => {
        setOrder(oeuvres);
    }, [oeuvres]);

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

    if (!reorderable) {
        return (
            <div style={GRID}>
                {oeuvres.map((o) => (
                    <OeuvreCard key={o.id} oeuvre={o} onSave={onSave} onDelete={onDelete} />
                ))}
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
            {order.map((o) => (
                <div
                    key={o.id}
                    onDragOver={(e) => {
                        e.preventDefault();
                        handleDragOverCard(o.id);
                    }}
                    onDrop={commit}
                >
                    <OeuvreCard
                        oeuvre={o}
                        onSave={onSave}
                        onDelete={onDelete}
                        reorderable
                        isDragging={dragId.current === o.id}
                        dragHandleProps={{
                            draggable: true,
                            onDragStart: (e) => {
                                dragId.current = o.id;
                                e.dataTransfer.effectAllowed = "move";
                                // certains navigateurs exigent un payload
                                e.dataTransfer.setData("text/plain", String(o.id));
                            },
                            onDragEnd: commit,
                        }}
                    />
                </div>
            ))}
        </div>
    );
}
