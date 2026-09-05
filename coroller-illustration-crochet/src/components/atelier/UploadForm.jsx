import { useEffect, useRef, useState } from "react";
import { COLORS, field, btnPrimary, btnGhost } from "./theme";
import Icon from "./Icon";
import ImageCropper from "./ImageCropper";

const label = { fontWeight: 600, fontSize: 13.5, color: COLORS.ink };
let seq = 1;

const stripExt = (name) => name.replace(/\.[^.]+$/, "");

// Vignette qui gère sa propre URL d'aperçu.
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
            style={{
                width: 52,
                height: 52,
                objectFit: "cover",
                borderRadius: 8,
                border: `1px solid ${COLORS.border}`,
                flexShrink: 0,
            }}
        />
    );
}

// Ajout d'une ou plusieurs œuvres : glisser-déposer multiple, titre par image,
// recadrage optionnel, publication séquentielle avec progression.
// `onSubmit(list, onProgress)` renvoie une promesse<{ failed: item[] }>.
export default function UploadForm({ onSubmit, onCancel }) {
    const [items, setItems] = useState([]); // { id, file, title }
    const [category, setCategory] = useState("illustration");
    const [size, setSize] = useState("medium");
    const [dragging, setDragging] = useState(false);
    const [phase, setPhase] = useState("idle"); // idle | publishing
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
        setItems((list) => [
            ...list,
            ...images.map((file) => ({ id: seq++, file, title: stripExt(file.name) })),
        ]);
    };

    const setItem = (id, changes) =>
        setItems((list) => list.map((it) => (it.id === id ? { ...it, ...changes } : it)));
    const removeItem = (id) => setItems((list) => list.filter((it) => it.id !== id));

    const missingTitle = items.some((it) => !it.title.trim());
    const canPublish = items.length > 0 && !missingTitle && phase === "idle";

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!canPublish) {
            setError(items.length === 0 ? "Ajoute au moins une image." : "Chaque image doit avoir un titre.");
            return;
        }
        setError("");
        setPhase("publishing");
        setProgress({ done: 0, total: items.length });

        const list = items.map((it) => ({
            title: it.title.trim(),
            category,
            size,
            file: it.file,
        }));
        const { failed } = await onSubmit(list, (done, total) => setProgress({ done, total }));

        setPhase("idle");
        if (failed.length === 0) return; // le parent quitte la vue
        // On garde les images en échec pour réessayer.
        const failedNames = new Set(failed.map((f) => f.file));
        setItems((prev) => prev.filter((it) => failedNames.has(it.file)));
        setError(`${failed.length} image(s) non publiée(s). Réessaie.`);
    };

    const cropping = items.find((it) => it.id === croppingId);

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                background: COLORS.card,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 20,
                padding: 28,
                display: "flex",
                flexDirection: "column",
                gap: 18,
                maxWidth: 620,
            }}
        >
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 7, flex: "1 1 200px" }}>
                    <label style={label}>Catégorie</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} style={field}>
                        <option value="illustration">Illustration</option>
                        <option value="crochet">Crochet</option>
                    </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7, flex: "1 1 200px" }}>
                    <label style={label}>Disposition dans la mosaïque</label>
                    <select value={size} onChange={(e) => setSize(e.target.value)} style={field}>
                        <option value="medium">Standard (carré / moyen)</option>
                        <option value="large">Mise en valeur (grand / vertical)</option>
                    </select>
                </div>
            </div>
            <p style={{ fontSize: 12, color: COLORS.muted, margin: "-8px 0 0" }}>
                La catégorie et la disposition s'appliquent à toutes les images ajoutées ici.
            </p>

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
                    padding: "26px 16px",
                    textAlign: "center",
                    cursor: "pointer",
                    background: dragging ? "rgba(253,106,61,0.06)" : COLORS.paper,
                    transition: "border-color .15s, background .15s",
                }}
            >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: COLORS.muted }}>
                    <Icon name="image" size={26} />
                    <span style={{ fontSize: 13.5 }}>
                        Glisse une ou plusieurs images ici, ou{" "}
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
                        <div
                            key={it.id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                padding: 10,
                                border: `1px solid ${COLORS.border}`,
                                borderRadius: 12,
                            }}
                        >
                            <Thumb file={it.file} />
                            <input
                                type="text"
                                value={it.title}
                                onChange={(e) => setItem(it.id, { title: e.target.value })}
                                placeholder="Titre de l'œuvre"
                                style={{ ...field, flex: 1 }}
                            />
                            <button
                                type="button"
                                onClick={() => setCroppingId(it.id)}
                                title="Recadrer"
                                style={{ ...btnGhost, padding: "8px 10px" }}
                            >
                                <Icon name="crop" size={14} />
                            </button>
                            <button
                                type="button"
                                onClick={() => removeItem(it.id)}
                                title="Retirer"
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: COLORS.muted,
                                    cursor: "pointer",
                                    display: "flex",
                                    padding: 4,
                                }}
                            >
                                <Icon name="x" size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {error && <div style={{ color: COLORS.danger, fontSize: 13, fontWeight: 600 }}>{error}</div>}

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <button type="submit" disabled={!canPublish} style={{ ...btnPrimary, opacity: canPublish ? 1 : 0.6, padding: "12px 20px" }}>
                    {phase === "publishing"
                        ? `Publication ${progress.done}/${progress.total}…`
                        : `Publier ${items.length || ""} œuvre${items.length > 1 ? "s" : ""} →`}
                </button>
                <button type="button" onClick={onCancel} style={{ ...btnGhost, padding: "12px 18px" }}>
                    Annuler
                </button>
            </div>

            {cropping && (
                <ImageCropper
                    file={cropping.file}
                    onCancel={() => setCroppingId(null)}
                    onDone={(cropped) => {
                        setItem(cropping.id, { file: cropped });
                        setCroppingId(null);
                    }}
                />
            )}
        </form>
    );
}
