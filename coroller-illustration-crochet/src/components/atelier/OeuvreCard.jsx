import { useState } from "react";
import { COLORS, field, btnPrimary, btnGhost, btnDanger, categoryBadge, CATEGORY_LABEL, SIZE_LABEL } from "./theme";
import Icon from "./Icon";

// Une carte de la grille. Gère ses propres modes : "view" | "edit" | "confirm".
export default function OeuvreCard({ oeuvre, onSave, onDelete }) {
    const [mode, setMode] = useState("view");
    const [form, setForm] = useState({ title: oeuvre.title, category: oeuvre.category, size: oeuvre.size });
    const [busy, setBusy] = useState(false);

    const startEdit = () => {
        setForm({ title: oeuvre.title, category: oeuvre.category, size: oeuvre.size });
        setMode("edit");
    };

    const save = async () => {
        setBusy(true);
        const ok = await onSave(oeuvre.id, {
            title: form.title.trim() || oeuvre.title,
            category: form.category,
            size: form.size,
        });
        setBusy(false);
        if (ok) setMode("view");
    };

    const remove = async () => {
        setBusy(true);
        await onDelete(oeuvre.id, oeuvre.img_url);
        // en cas de succès la carte est retirée de la liste par le parent
        setBusy(false);
    };

    return (
        <div
            style={{
                background: COLORS.card,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 16,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div style={{ position: "relative", aspectRatio: "4 / 3", background: COLORS.paper }}>
                <img
                    src={oeuvre.img_url}
                    alt={oeuvre.title}
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
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
                                disabled={busy}
                                style={{ ...btnDanger, background: COLORS.danger, color: "#fff", opacity: busy ? 0.7 : 1 }}
                            >
                                {busy ? "Suppression…" : "Oui, supprimer"}
                            </button>
                            <button onClick={() => setMode("view")} disabled={busy} style={btnGhost}>
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
                        <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                            <button onClick={save} disabled={busy} style={{ ...btnPrimary, opacity: busy ? 0.7 : 1 }}>
                                {busy ? "…" : "Enregistrer"}
                            </button>
                            <button onClick={() => setMode("view")} disabled={busy} style={btnGhost}>
                                Annuler
                            </button>
                        </div>
                        <p style={{ fontSize: 11.5, color: COLORS.muted, margin: 0 }}>
                            Pour changer l'image : supprime l'œuvre et publie-la à nouveau.
                        </p>
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
        </div>
    );
}
