import { useEffect, useRef, useState } from "react";
import { COLORS, btnPrimary, btnGhost } from "./theme";
import { cropImage } from "../../lib/cropImage";

const ASPECTS = [
    { label: "Libre", value: null },
    { label: "1:1", value: 1 },
    { label: "4:5", value: 4 / 5 },
    { label: "3:4", value: 3 / 4 },
    { label: "16:9", value: 16 / 9 },
];
const MIN = 40; // px de l'image d'origine

// Contraint un rectangle (px image d'origine) à rester dans l'image.
function clamp(r, nat) {
    const width = Math.max(MIN, Math.min(r.width, nat.w));
    const height = Math.max(MIN, Math.min(r.height, nat.h));
    const x = Math.max(0, Math.min(r.x, nat.w - width));
    const y = Math.max(0, Math.min(r.y, nat.h - height));
    return { x, y, width, height };
}

// Fenêtre modale de recadrage. `onDone(newFile)` reçoit l'image recadrée.
export default function ImageCropper({ file, onDone, onCancel }) {
    const [src, setSrc] = useState(null);
    const [nat, setNat] = useState(null); // { w, h } dimensions réelles
    const [rect, setRect] = useState(null); // en pixels de l'image d'origine
    const [aspect, setAspect] = useState(null);
    const [busy, setBusy] = useState(false);
    const dragRef = useRef(null);

    useEffect(() => {
        const url = URL.createObjectURL(file);
        setSrc(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    const boxW = Math.min(typeof window !== "undefined" ? window.innerWidth * 0.9 : 880, 880);
    const boxH = Math.min(typeof window !== "undefined" ? window.innerHeight * 0.62 : 520, 520);
    const scale = nat ? Math.min(boxW / nat.w, boxH / nat.h, 1) : 1;
    const dispW = nat ? nat.w * scale : 0;
    const dispH = nat ? nat.h * scale : 0;

    const onImgLoad = (e) => {
        const w = e.target.naturalWidth;
        const h = e.target.naturalHeight;
        setNat({ w, h });
        const rw = w * 0.9;
        const rh = h * 0.9;
        setRect({ x: (w - rw) / 2, y: (h - rh) / 2, width: rw, height: rh });
    };

    const applyAspect = (a) => {
        setAspect(a);
        if (!a || !rect || !nat) return;
        const cx = rect.x + rect.width / 2;
        const cy = rect.y + rect.height / 2;
        let width = rect.width;
        let height = width / a;
        if (height > nat.h) {
            height = nat.h;
            width = height * a;
        }
        if (width > nat.w) {
            width = nat.w;
            height = width / a;
        }
        setRect(clamp({ x: cx - width / 2, y: cy - height / 2, width, height }, nat));
    };

    useEffect(() => {
        if (!nat) return undefined;
        const move = (e) => {
            const d = dragRef.current;
            if (!d) return;
            const dx = (e.clientX - d.startX) / scale;
            const dy = (e.clientY - d.startY) / scale;
            const s = d.startRect;
            if (d.mode === "move") {
                setRect(clamp({ ...s, x: s.x + dx, y: s.y + dy }, nat));
                return;
            }
            let { x, y, width, height } = s;
            if (d.mode.includes("e")) width = s.width + dx;
            if (d.mode.includes("s")) height = s.height + dy;
            if (d.mode.includes("w")) {
                width = s.width - dx;
                x = s.x + dx;
            }
            if (d.mode.includes("n")) {
                height = s.height - dy;
                y = s.y + dy;
            }
            if (aspect) {
                height = width / aspect;
                if (d.mode.includes("n")) y = s.y + s.height - height;
            }
            setRect(clamp({ x, y, width, height }, nat));
        };
        const up = () => {
            dragRef.current = null;
        };
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
        return () => {
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", up);
        };
    }, [nat, scale, aspect]);

    const startDrag = (mode) => (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragRef.current = { mode, startX: e.clientX, startY: e.clientY, startRect: rect };
    };

    const confirm = async () => {
        setBusy(true);
        const cropped = await cropImage(file, rect);
        setBusy(false);
        onDone(cropped);
    };

    const handle = (pos, cursor) => (
        <div
            onPointerDown={startDrag(pos)}
            style={{
                position: "absolute",
                width: 14,
                height: 14,
                background: "#fff",
                border: `2px solid ${COLORS.orange}`,
                borderRadius: 3,
                cursor,
                ...(pos.includes("n") ? { top: -7 } : { bottom: -7 }),
                ...(pos.includes("w") ? { left: -7 } : { right: -7 }),
            }}
        />
    );

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 1100,
                background: "rgba(13,11,26,0.75)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 20,
            }}
        >
            <div
                style={{
                    background: COLORS.card,
                    borderRadius: 18,
                    padding: 22,
                    maxWidth: "95vw",
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                }}
            >
                <div style={{ fontFamily: "Georgia, serif", fontSize: "1.15rem", color: COLORS.ink }}>
                    Recadrer l'image
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {ASPECTS.map((a) => (
                        <button
                            key={a.label}
                            type="button"
                            onClick={() => applyAspect(a.value)}
                            style={{
                                border: `1px solid ${aspect === a.value ? COLORS.orange : COLORS.fieldBorder}`,
                                background: aspect === a.value ? "rgba(253,106,61,0.1)" : "#fff",
                                color: aspect === a.value ? COLORS.orange : COLORS.ink,
                                borderRadius: 8,
                                padding: "6px 12px",
                                fontSize: 12.5,
                                fontWeight: 600,
                                cursor: "pointer",
                                fontFamily: "inherit",
                            }}
                        >
                            {a.label}
                        </button>
                    ))}
                </div>

                <div
                    style={{
                        position: "relative",
                        width: dispW || 320,
                        height: dispH || 200,
                        margin: "0 auto",
                        background: COLORS.paper,
                        overflow: "hidden",
                        touchAction: "none",
                        userSelect: "none",
                    }}
                >
                    <img
                        src={src || undefined}
                        alt=""
                        onLoad={onImgLoad}
                        draggable={false}
                        style={{ width: "100%", height: "100%", display: "block", objectFit: "fill" }}
                    />
                    {rect && nat && (
                        <div
                            onPointerDown={startDrag("move")}
                            style={{
                                position: "absolute",
                                left: rect.x * scale,
                                top: rect.y * scale,
                                width: rect.width * scale,
                                height: rect.height * scale,
                                border: `1px solid #fff`,
                                boxShadow: "0 0 0 9999px rgba(13,11,26,0.5)",
                                cursor: "move",
                            }}
                        >
                            {handle("nw", "nwse-resize")}
                            {handle("ne", "nesw-resize")}
                            {handle("sw", "nesw-resize")}
                            {handle("se", "nwse-resize")}
                        </div>
                    )}
                </div>

                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <button type="button" onClick={onCancel} style={btnGhost}>
                        Annuler
                    </button>
                    <button type="button" onClick={confirm} disabled={busy || !rect} style={{ ...btnPrimary, opacity: busy ? 0.7 : 1 }}>
                        {busy ? "…" : "Recadrer"}
                    </button>
                </div>
            </div>
        </div>
    );
}
