import { useEffect, useRef, useState } from "react";
import {
    COLORS,
    field,
    btnPrimary,
    btnGhost,
    btnDanger,
    categoryBadge,
    CATEGORY_LABEL,
    SIZE_LABEL,
} from "./theme";
import Icon from "./Icon";
import ImageCropper from "./ImageCropper";

// Une carte de la grille. Modes : "view" | "edit" | "confirm".
// Props de réordonnancement (optionnelles) : reorderable, dragHandleProps, isDragging.
export default function OeuvreCard({
    oeuvre,
    onSave,
    onDelete,
    reorderable = false,
    dragHandleProps,
    isDragging = false,
}) {
    const [mode, setMode] = useState("view");
    const [form, setForm] = useState({ title: oeuvre.title, category: oeuvre.category, size: oeuvre.size });
    const [newFile, setNewFile] = useState(null);
    const [newPreview, setNewPreview] = useState(null);
    const [cropping, setCropping] = useState(false);
    const [busy, setBusy] = useState(false);
    const fileRef = useRef(null);

    useEffect(() => {
        if (!newFile) {
            setNewPreview(null);
            return;
        }
        const url = URL.createObjectURL(newFile);
        setNewPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [newFile]);

    const startEdit = () => {
        setForm({ title: oeuvre.title, category: oeuvre.category, size: oeuvre.size });
        setNewFile(null);
        setMode("edit");
    };

    const cancelEdit = () => {
        setNewFile(null);
        setMode("view");
    };

    const save = async () => {
        setBusy(true);
        const ok = await onSave(
            oeuvre.id,
            {
                title: form.title.trim() || oeuvre.title,
                category: form.category,
                size: form.size,
            },
            newFile || undefined
        );
        setBusy(false);
        if (ok) {
            setNewFile(null);
            setMode("view");
        }
    };

    // Retrait instantané côté affichage (l'undo est géré par un toast du parent).
    const remove = () => onDelete(oeuvre.id, oeuvre.img_url);

    return (
        <div
            style={{
                background: COLORS.card,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 16,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                opacity: isDragging ? 0.4 : 1,
                transition: "opacity .15s",
            }}
        >
            <div style={{ position: "relative", aspectRatio: "4 / 3", background: COLORS.paper }}>
                <img
                    src={newPreview || oeuvre.img_url}
                    alt={oeuvre.title}
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />

                {reorderable && mode === "view" && (
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
                            width: 30,
                            height: 30,
                            borderRadius: 8,
                            background: "rgba(13,11,26,0.55)",
                            color: "#fff",
                            cursor: "grab",
                        }}
                    >
                        <Icon name="drag" size={16} />
                    </div>
                )}

                {mode === "confirm" && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: "rgba(13,11,26,0.78)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 12,
                            padding: 16,
                            textAlign: "center",
                        }}
                    >
                        <span style={{ color: "#fff", fontSize: 13.5, fontWeight: 600 }}>
                            Supprimer « {oeuvre.title} » définitivement ?
                        </span>
                        <div style={{ display: "flex", gap: 8 }}>
                            <button
                                onClick={remove}
                                style={{ ...btnDanger, background: COLORS.danger, color: "#fff" }}
                            >
                                Oui, supprimer
                            </button>
                            <button onClick={() => setMode("view")} style={btnGhost}>
                                Annuler
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                {mode === "edit" ? (
                    <>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                            style={field}
                        />
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <select
                                value={form.category}
                                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                                style={{ ...field, flex: "1 1 120px" }}
                            >
                                <option value="illustration">Illustration</option>
                                <option value="crochet">Crochet</option>
                            </select>
                            <select
                                value={form.size}
                                onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
                                style={{ ...field, flex: "1 1 120px" }}
                            >
                                <option value="medium">Standard</option>
                                <option value="large">Grand</option>
                            </select>
                        </div>

                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <button
                                type="button"
                                onClick={() => fileRef.current?.click()}
                                style={btnGhost}
                            >
                                <Icon name="image" size={14} />
                                {newFile ? "Changer l'image" : "Remplacer l'image"}
                            </button>
                            {newFile && (
                                <button type="button" onClick={() => setCropping(true)} style={btnGhost}>
                                    <Icon name="crop" size={14} />
                                    Recadrer
                                </button>
                            )}
                        </div>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => setNewFile(e.target.files[0] || null)}
                            style={{ display: "none" }}
                        />
                        {newFile && (
                            <span style={{ fontSize: 11.5, color: COLORS.muted }}>
                                Nouvelle image : {newFile.name}
                            </span>
                        )}

                        <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                            <button onClick={save} disabled={busy} style={{ ...btnPrimary, opacity: busy ? 0.7 : 1 }}>
                                {busy ? "…" : "Enregistrer"}
                            </button>
                            <button onClick={cancelEdit} disabled={busy} style={btnGhost}>
                                Annuler
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div style={{ fontWeight: 600, fontSize: 14.5, color: COLORS.ink }}>{oeuvre.title}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={categoryBadge(oeuvre.category)}>{CATEGORY_LABEL[oeuvre.category]}</span>
                            <span style={{ fontSize: 12, color: COLORS.muted }}>{SIZE_LABEL[oeuvre.size]}</span>
                        </div>
                        <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                            <button onClick={startEdit} style={btnGhost}>
                                <Icon name="edit" size={14} />
                                Modifier
                            </button>
                            <button onClick={() => setMode("confirm")} style={btnDanger}>
                                <Icon name="trash" size={14} />
                                Supprimer
                            </button>
                        </div>
                    </>
                )}
            </div>

            {cropping && newFile && (
                <ImageCropper
                    file={newFile}
                    onCancel={() => setCropping(false)}
                    onDone={(cropped) => {
                        setNewFile(cropped);
                        setCropping(false);
                    }}
                />
            )}
        </div>
    );
}
