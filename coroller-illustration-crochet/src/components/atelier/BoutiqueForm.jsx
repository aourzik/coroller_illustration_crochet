import { useEffect, useRef, useState } from "react";
import { COLORS, field, btnPrimary, btnGhost } from "./theme";
import Icon from "./Icon";
import ImageCropper from "./ImageCropper";

const label = { fontWeight: 600, fontSize: 13.5, color: COLORS.ink };

const emptyForm = { nom: "", adresse: "", horaires: "", description: "" };

// Formulaire de la fiche « vitrine » : une seule fiche (pas une liste),
// photo + nom + adresse + horaires + description.
export default function BoutiqueForm({ boutique, onSave }) {
    const [form, setForm] = useState(emptyForm);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [cropping, setCropping] = useState(false);
    const [busy, setBusy] = useState(false);
    const inputRef = useRef(null);

    // Pré-remplit le formulaire dès que la fiche est chargée.
    useEffect(() => {
        if (boutique) {
            setForm({
                nom: boutique.nom || "",
                adresse: boutique.adresse || "",
                horaires: boutique.horaires || "",
                description: boutique.description || "",
            });
        }
    }, [boutique]);

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
        setBusy(true);
        const ok = await onSave(form, file || undefined);
        setBusy(false);
        if (ok) setFile(null);
    };

    const currentPhoto = preview || boutique?.img_url || null;

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
                <label style={label}>Photo de la boutique</label>
                <div
                    onClick={() => inputRef.current?.click()}
                    style={{
                        border: `2px dashed ${COLORS.fieldBorder}`,
                        borderRadius: 14,
                        padding: currentPhoto ? 12 : "28px 16px",
                        textAlign: "center",
                        cursor: "pointer",
                        background: COLORS.paper,
                    }}
                >
                    {currentPhoto ? (
                        <img
                            src={currentPhoto}
                            alt="Boutique"
                            style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 10, display: "block" }}
                        />
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: COLORS.muted }}>
                            <Icon name="image" size={24} />
                            <span style={{ fontSize: 13.5 }}>Clique pour choisir une photo</span>
                        </div>
                    )}
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0] || null)}
                        style={{ display: "none" }}
                    />
                </div>
                {file && (
                    <button type="button" onClick={() => setCropping(true)} style={{ ...btnGhost, alignSelf: "flex-start" }}>
                        <Icon name="crop" size={14} />
                        Recadrer
                    </button>
                )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <label style={label}>Nom de la boutique</label>
                <input
                    type="text"
                    value={form.nom}
                    onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
                    placeholder="Ex : Chez Fanette"
                    style={field}
                />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <label style={label}>Adresse</label>
                <input
                    type="text"
                    value={form.adresse}
                    onChange={(e) => setForm((f) => ({ ...f, adresse: e.target.value }))}
                    placeholder="Ex : 12 rue des Lices, 81000 Albi"
                    style={field}
                />
                <p style={{ fontSize: 11.5, color: COLORS.muted, margin: 0 }}>
                    C'est cette adresse qui alimente la petite carte affichée sur le site.
                </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <label style={label}>Horaires</label>
                <input
                    type="text"
                    value={form.horaires}
                    onChange={(e) => setForm((f) => ({ ...f, horaires: e.target.value }))}
                    placeholder="Ex : Du mardi au samedi, 10h-18h"
                    style={field}
                />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <label style={label}>Description (optionnel)</label>
                <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Un petit mot sur la boutique…"
                    rows={3}
                    style={{ ...field, resize: "vertical" }}
                />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <button type="submit" disabled={busy} style={{ ...btnPrimary, opacity: busy ? 0.7 : 1 }}>
                    {busy ? "Enregistrement…" : "Enregistrer la fiche"}
                </button>
            </div>

            {cropping && file && (
                <ImageCropper
                    file={file}
                    onCancel={() => setCropping(false)}
                    onDone={(cropped) => {
                        setFile(cropped);
                        setCropping(false);
                    }}
                />
            )}
        </form>
    );
}
