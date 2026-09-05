import { useEffect, useRef, useState } from "react";
import { COLORS, field, btnPrimary, btnGhost } from "./theme";
import Icon from "./Icon";

const label = { fontWeight: 600, fontSize: 13.5, color: COLORS.ink };

// Formulaire d'ajout d'une œuvre, avec zone de glisser-déposer et aperçu.
// `onSubmit(fields)` doit renvoyer une promesse<boolean> (true = succès).
export default function UploadForm({ onSubmit, onCancel }) {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("illustration");
    const [size, setSize] = useState("medium");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const inputRef = useRef(null);

    // Aperçu local : on crée/révoque une URL blob à chaque changement de fichier.
    useEffect(() => {
        if (!file) {
            setPreview(null);
            return;
        }
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    const pickFile = (f) => {
        if (f && f.type.startsWith("image/")) {
            setFile(f);
            setError("");
        } else if (f) {
            setError("Ce fichier n'est pas une image.");
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        pickFile(e.dataTransfer.files?.[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!file || !title.trim()) {
            setError("Remplis le titre et choisis une image.");
            return;
        }
        setBusy(true);
        const ok = await onSubmit({ title: title.trim(), category, size, file });
        setBusy(false);
        if (ok) {
            setTitle("");
            setFile(null);
        }
    };

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
                maxWidth: 560,
            }}
        >
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <label style={label}>Titre de l'œuvre</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex : Le Renard des bois"
                    style={field}
                />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <label style={label}>Catégorie</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={field}>
                    <option value="illustration">Illustration</option>
                    <option value="crochet">Crochet</option>
                </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <label style={label}>Disposition dans la mosaïque</label>
                <select value={size} onChange={(e) => setSize(e.target.value)} style={field}>
                    <option value="medium">Standard (carré / moyen)</option>
                    <option value="large">Mise en valeur (grand / vertical)</option>
                </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <label style={label}>Image</label>
                <div
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    style={{
                        border: `2px dashed ${dragging ? COLORS.orange : COLORS.fieldBorder}`,
                        borderRadius: 14,
                        padding: preview ? 12 : "28px 16px",
                        textAlign: "center",
                        cursor: "pointer",
                        background: dragging ? "rgba(253,106,61,0.06)" : COLORS.paper,
                        transition: "border-color .15s, background .15s",
                    }}
                >
                    {preview ? (
                        <img
                            src={preview}
                            alt="Aperçu"
                            style={{
                                width: "100%",
                                maxHeight: 260,
                                objectFit: "contain",
                                borderRadius: 10,
                                display: "block",
                            }}
                        />
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: COLORS.muted }}>
                            <Icon name="image" size={26} />
                            <span style={{ fontSize: 13.5 }}>
                                Glisse une image ici, ou <strong style={{ color: COLORS.skyDeep }}>parcours tes fichiers</strong>
                            </span>
                        </div>
                    )}
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => pickFile(e.target.files[0] || null)}
                        style={{ display: "none" }}
                    />
                </div>
                {file && (
                    <span style={{ fontSize: 12, color: COLORS.muted }}>
                        {file.name} — {(file.size / 1024).toFixed(0)} Ko
                    </span>
                )}
            </div>

            {error && <div style={{ color: COLORS.danger, fontSize: 13, fontWeight: 600 }}>{error}</div>}

            <div style={{ display: "flex", gap: 10 }}>
                <button type="submit" disabled={busy} style={{ ...btnPrimary, opacity: busy ? 0.7 : 1, padding: "12px 20px" }}>
                    {busy ? "Envoi en cours…" : "Publier sur le site →"}
                </button>
                <button type="button" onClick={onCancel} style={{ ...btnGhost, padding: "12px 18px" }}>
                    Annuler
                </button>
            </div>
        </form>
    );
}
