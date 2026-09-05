import { useEffect, useState } from "react";
import { COLORS, field, btnPrimary, btnGhost } from "./theme";

const label = { fontWeight: 600, fontSize: 13.5, color: COLORS.ink };

// Formulaire d'ajout d'une œuvre, avec aperçu de l'image choisie.
// `onSubmit(fields)` doit renvoyer une promesse<boolean> (true = succès).
export default function UploadForm({ onSubmit, onCancel }) {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("illustration");
    const [size, setSize] = useState("medium");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

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
                <label style={label}>Fichier image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0] || null)}
                    style={{ color: COLORS.muted, fontSize: 13.5 }}
                />
            </div>

            {preview && (
                <img
                    src={preview}
                    alt="Aperçu"
                    style={{
                        width: "100%",
                        maxHeight: 260,
                        objectFit: "contain",
                        borderRadius: 12,
                        border: `1px solid ${COLORS.border}`,
                        background: COLORS.paper,
                    }}
                />
            )}

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
