import { useEffect, useRef, useState } from "react";
import { COLORS, btnPrimary, btnGhost } from "./theme";
import Icon from "./Icon";
import ImageCropper from "./ImageCropper";

let seq = 1;

function Thumb({ file }) {
    const [url, setUrl] = useState(null);
    useEffect(() => {
        const u = URL.createObjectURL(file);
        setUrl(u);
        return () => URL.revokeObjectURL(u);
    }, [file]);
    return (
        <img
            src={url || undefined}
            alt=""
            style={{ width: 52, height: 52, objectFit: "cover", borderRadius: 8, border: `1px solid ${COLORS.border}`, flexShrink: 0 }}
        />
    );
}

// Ajout de photos de lieux ponctuels : glisser-déposer multiple, recadrage
// optionnel par image, pas de titre (Marie intègre le texte dans l'image).
// `onSubmit(files, onProgress)` renvoie une promesse<{ failed: File[] }>.
export default function LieuUploadForm({ onSubmit }) {
    const [items, setItems] = useState([]); // { id, file }
    const [dragging, setDragging] = useState(false);
    const [phase, setPhase] = useState("idle");
    const [progress, setProgress] = useState({ done: 0, total: 0 });
    const [error, setError] = useState("");
    const [croppingId, setCroppingId] = useState(null);
    const inputRef = useRef(null);

    const addFiles = (fileList) => {
        const images = Array.from(fileList || []).filter((f) => f.type.startsWith("image/"));
        if (images.length === 0) {
            if (fileList?.length) setError("Aucune image dans la sélection.");
            return;
        }
        setError("");
        setItems((list) => [...list, ...images.map((file) => ({ id: seq++, file }))]);
    };

    const removeItem = (id) => setItems((list) => list.filter((it) => it.id !== id));

    const handlePublish = async () => {
        if (items.length === 0) {
            setError("Ajoute au moins une photo.");
            return;
        }
        setError("");
        setPhase("publishing");
        setProgress({ done: 0, total: items.length });

        const files = items.map((it) => it.file);
        const { failed } = await onSubmit(files, (done, total) => setProgress({ done, total }));

        setPhase("idle");
        if (failed.length === 0) {
            setItems([]);
            return;
        }
        const failedSet = new Set(failed);
        setItems((prev) => prev.filter((it) => failedSet.has(it.file)));
        setError(`${failed.length} photo(s) non publiée(s). Réessaie.`);
    };

    const cropping = items.find((it) => it.id === croppingId);

    return (
        <div
            style={{
                background: COLORS.card,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 20,
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 16,
            }}
        >
            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    addFiles(e.dataTransfer.files);
                }}
                style={{
                    border: `2px dashed ${dragging ? COLORS.orange : COLORS.fieldBorder}`,
                    borderRadius: 14,
                    padding: "22px 16px",
                    textAlign: "center",
                    cursor: "pointer",
                    background: dragging ? "rgba(253,106,61,0.06)" : COLORS.paper,
                }}
            >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: COLORS.muted }}>
                    <Icon name="map-pin" size={22} />
                    <span style={{ fontSize: 13.5 }}>
                        Glisse une ou plusieurs photos de lieux ici, ou{" "}
                        <strong style={{ color: COLORS.skyDeep }}>parcours tes fichiers</strong>
                    </span>
                </div>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                        addFiles(e.target.files);
                        e.target.value = "";
                    }}
                    style={{ display: "none" }}
                />
            </div>

            {items.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {items.map((it) => (
                        <div key={it.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 10, border: `1px solid ${COLORS.border}`, borderRadius: 12 }}>
                            <Thumb file={it.file} />
                            <span style={{ flex: 1, fontSize: 13, color: COLORS.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {it.file.name}
                            </span>
                            <button type="button" onClick={() => setCroppingId(it.id)} title="Recadrer" style={{ ...btnGhost, padding: "8px 10px" }}>
                                <Icon name="crop" size={14} />
                            </button>
                            <button
                                type="button"
                                onClick={() => removeItem(it.id)}
                                title="Retirer"
                                style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", display: "flex", padding: 4 }}
                            >
                                <Icon name="x" size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {error && <div style={{ color: COLORS.danger, fontSize: 13, fontWeight: 600 }}>{error}</div>}

            <button
                type="button"
                onClick={handlePublish}
                disabled={items.length === 0 || phase === "publishing"}
                style={{ ...btnPrimary, alignSelf: "flex-start", opacity: items.length === 0 ? 0.6 : 1 }}
            >
                {phase === "publishing" ? `Publication ${progress.done}/${progress.total}…` : `Publier ${items.length || ""} photo${items.length > 1 ? "s" : ""} →`}
            </button>

            {cropping && (
                <ImageCropper
                    file={cropping.file}
                    onCancel={() => setCroppingId(null)}
                    onDone={(cropped) => {
                        setItems((list) => list.map((it) => (it.id === cropping.id ? { ...it, file: cropped } : it)));
                        setCroppingId(null);
                    }}
                />
            )}
        </div>
    );
}
