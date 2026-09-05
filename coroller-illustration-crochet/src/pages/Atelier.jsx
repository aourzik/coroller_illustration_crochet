import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../auth";
import logo from "../assets/images/logo.png";

// --- Palette dashboard (valeurs figées : l'objet C de App.jsx n'est pas
// disponible au niveau module à cause de l'import circulaire) ---
const NAVY = "#0d0b1a";      // sidebar + nav  (C.ink)
const PAPER = "#faf8f4";     // fond de la zone de travail  (C.cream)
const CARD = "#ffffff";
const INK = "#0d0b1a";
const MUTED = "#6a6880";
const BORDER = "rgba(13,11,26,0.08)";
const ORANGE = "#fd6a3d";    // C.accent
const SKY = "#92bbf3";       // C.sky
const SKY_DEEP = "#3f6bb0";

const field = {
    padding: "11px 12px",
    borderRadius: 10,
    border: "1px solid rgba(13,11,26,0.15)",
    background: "#fff",
    color: INK,
    outline: "none",
    fontFamily: "inherit",
    fontSize: 14,
    width: "100%",
    boxSizing: "border-box",
};

const btnBase = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    cursor: "pointer",
    fontFamily: "inherit",
    borderRadius: 10,
};

const btnPrimary = {
    ...btnBase,
    background: ORANGE,
    color: "#fff",
    border: "none",
    padding: "11px 18px",
    fontWeight: 700,
    fontSize: 13,
};

const btnGhost = {
    ...btnBase,
    background: "#fff",
    color: SKY_DEEP,
    border: `1px solid ${SKY}`,
    padding: "9px 14px",
    fontWeight: 600,
    fontSize: 13,
};

const btnDanger = {
    ...btnBase,
    background: "rgba(239,68,68,0.09)",
    color: "#dc2626",
    border: "none",
    padding: "9px 14px",
    fontWeight: 600,
    fontSize: 13,
};

// Petites icônes SVG (style trait, comme celles du Footer) — pas d'emoji.
function Icon({ name, size = 16 }) {
    const p = {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        style: { flexShrink: 0, display: "block" },
    };
    switch (name) {
        case "grid":
            return (
                <svg {...p}>
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                </svg>
            );
        case "image":
            return (
                <svg {...p}>
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                </svg>
            );
        case "aperture":
            return (
                <svg {...p}>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="14.31" y1="8" x2="20.05" y2="8" />
                    <line x1="9.69" y1="8" x2="3.95" y2="8" />
                    <line x1="7.38" y1="12" x2="10.19" y2="7" />
                    <line x1="16.62" y1="12" x2="13.81" y2="7" />
                    <line x1="9.69" y1="16" x2="3.95" y2="16" />
                    <line x1="14.31" y1="16" x2="20.05" y2="16" />
                    <line x1="16.62" y1="12" x2="13.81" y2="17" />
                    <line x1="7.38" y1="12" x2="10.19" y2="17" />
                </svg>
            );
        case "plus":
            return (
                <svg {...p}>
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            );
        case "edit":
            return (
                <svg {...p}>
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
            );
        case "trash":
            return (
                <svg {...p}>
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
            );
        default:
            return null;
    }
}

const NAV_ITEMS = [
    { id: "overview", icon: "grid", label: "Vue d'ensemble" },
    { id: "illustration", icon: "image", label: "Illustrations" },
    { id: "crochet", icon: "aperture", label: "Crochet" },
    { id: "add", icon: "plus", label: "Ajouter une œuvre" },
];

export default function Atelier() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const [section, setSection] = useState("overview");
    const [isNarrow, setIsNarrow] = useState(
        typeof window !== "undefined" && window.innerWidth < 900
    );

    // Formulaire d'ajout
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("illustration");
    const [size, setSize] = useState("medium");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Liste + édition
    const [oeuvres, setOeuvres] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ title: "", category: "illustration", size: "medium" });
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    useEffect(() => {
        const onResize = () => setIsNarrow(window.innerWidth < 900);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    useEffect(() => {
        if (!message) return;
        const t = setTimeout(() => setMessage(""), 4000);
        return () => clearTimeout(t);
    }, [message]);

    const fetchOeuvres = async () => {
        if (!supabase) {
            setMessage("Supabase n'est pas configuré (fichier .env).");
            return;
        }
        try {
            const { data, error } = await supabase
                .from("oeuvres")
                .select("*")
                .order("created_at", { ascending: false });
            if (error) throw error;
            if (data) setOeuvres(data);
        } catch (err) {
            console.error("Erreur chargement liste :", err);
        }
    };

    useEffect(() => {
        fetchOeuvres();
    }, []);

    const handleLogout = async () => {
        await signOut();
        navigate("/connexion", { replace: true });
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!supabase) {
            setMessage("Supabase n'est pas configuré (fichier .env).");
            return;
        }
        if (!file || !title) {
            setMessage("Remplis le titre et choisis une image.");
            return;
        }
        setLoading(true);
        setMessage("Téléversement en cours…");
        try {
            const fileExt = file.name.split(".").pop();
            const filePath = `${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from("galerie")
                .upload(filePath, file);
            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage.from("galerie").getPublicUrl(filePath);

            const { error: insertError } = await supabase
                .from("oeuvres")
                .insert([{ title, category, size, img_url: urlData.publicUrl }]);
            if (insertError) throw insertError;

            setMessage("Œuvre publiée sur le site.");
            setTitle("");
            setFile(null);
            e.target.reset();
            await fetchOeuvres();
            setSection("overview");
        } catch (err) {
            console.error(err);
            setMessage(`Erreur : ${err.message || "impossible d'envoyer l'œuvre."}`);
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (item) => {
        setPendingDeleteId(null);
        setEditingId(item.id);
        setEditForm({ title: item.title, category: item.category, size: item.size });
    };

    const saveEdit = async (id) => {
        if (!supabase) return;
        try {
            const { error } = await supabase
                .from("oeuvres")
                .update({ title: editForm.title, category: editForm.category, size: editForm.size })
                .eq("id", id);
            if (error) throw error;
            setOeuvres((list) => list.map((it) => (it.id === id ? { ...it, ...editForm } : it)));
            setEditingId(null);
            setMessage("Modifications enregistrées.");
        } catch (err) {
            console.error(err);
            setMessage(`Erreur : ${err.message}`);
        }
    };

    const confirmDelete = async (id, imgUrl) => {
        if (!supabase) return;
        try {
            const fileName = imgUrl.split("/").pop();
            const { error: storageError } = await supabase.storage.from("galerie").remove([fileName]);
            if (storageError) console.warn("Fichier Storage introuvable, on supprime la ligne quand même.");
            const { error: dbError } = await supabase.from("oeuvres").delete().eq("id", id);
            if (dbError) throw dbError;
            setOeuvres((list) => list.filter((it) => it.id !== id));
            setPendingDeleteId(null);
            setMessage("Œuvre retirée du site.");
        } catch (err) {
            console.error(err);
            setMessage(`Erreur suppression : ${err.message}`);
        }
    };

    const illusCount = oeuvres.filter((o) => o.category === "illustration").length;
    const crochCount = oeuvres.filter((o) => o.category === "crochet").length;

    const visibleOeuvres =
        section === "illustration"
            ? oeuvres.filter((o) => o.category === "illustration")
            : section === "crochet"
            ? oeuvres.filter((o) => o.category === "crochet")
            : oeuvres;

    const sectionTitle =
        section === "add"
            ? "Ajouter une œuvre"
            : section === "illustration"
            ? "Illustrations"
            : section === "crochet"
            ? "Crochet"
            : "Vue d'ensemble";

    // --- Sidebar ---
    const NavItem = ({ id, icon, label }) => {
        const active = section === id;
        return (
            <button
                onClick={() => setSection(id)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    width: isNarrow ? "auto" : "100%",
                    whiteSpace: "nowrap",
                    padding: isNarrow ? "10px 14px" : "12px 16px",
                    borderRadius: 10,
                    border: "none",
                    cursor: "pointer",
                    background: active ? "rgba(253,106,61,0.16)" : "transparent",
                    color: active ? ORANGE : "rgba(240,238,248,0.72)",
                    fontWeight: active ? 700 : 500,
                    fontSize: 14,
                    fontFamily: "inherit",
                    textAlign: "left",
                    borderLeft: isNarrow ? "none" : `3px solid ${active ? ORANGE : "transparent"}`,
                    transition: "all .15s",
                }}
            >
                <Icon name={icon} size={16} />
                {label}
            </button>
        );
    };

    const CategoryBadge = ({ cat }) => (
        <span
            style={{
                fontSize: 11,
                fontWeight: 700,
                padding: "3px 9px",
                borderRadius: 999,
                background: cat === "illustration" ? "rgba(146,187,243,0.22)" : "rgba(253,106,61,0.15)",
                color: cat === "illustration" ? SKY_DEEP : "#c2451f",
            }}
        >
            {cat === "illustration" ? "Illustration" : "Crochet"}
        </span>
    );

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: PAPER, fontFamily: "Corbel, sans-serif" }}>
            {/* NAV DU HAUT */}
            <nav
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "12px 22px",
                    background: NAVY,
                    color: "#f0eef8",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    flexWrap: "wrap",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <img src={logo} alt="" style={{ height: 34, width: "auto", objectFit: "contain" }} />
                    <span style={{ fontFamily: "Georgia, serif", fontSize: 15, letterSpacing: 0.5 }}>
                        Coroller · Espace créatrice
                    </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12.5 }}>
                    <span style={{ color: "rgba(240,238,248,0.6)" }}>{user?.email}</span>
                    <button
                        onClick={handleLogout}
                        style={{
                            background: "rgba(255,255,255,0.07)",
                            border: "1px solid rgba(255,255,255,0.14)",
                            color: "#f0eef8",
                            borderRadius: 8,
                            padding: "7px 13px",
                            fontSize: 12.5,
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "inherit",
                        }}
                    >
                        Se déconnecter
                    </button>
                </div>
            </nav>

            <div style={{ display: "flex", flex: 1, flexDirection: isNarrow ? "column" : "row" }}>
                {/* SIDEBAR */}
                <aside
                    style={{
                        width: isNarrow ? "100%" : 240,
                        flexShrink: 0,
                        background: NAVY,
                        borderRight: isNarrow ? "none" : "1px solid rgba(255,255,255,0.06)",
                        padding: isNarrow ? "10px" : "20px 14px",
                        display: "flex",
                        flexDirection: isNarrow ? "row" : "column",
                        gap: 4,
                        overflowX: isNarrow ? "auto" : "visible",
                    }}
                >
                    {NAV_ITEMS.map((it) => (
                        <NavItem key={it.id} {...it} />
                    ))}
                </aside>

                {/* CONTENU */}
                <main style={{ flex: 1, minWidth: 0, padding: isNarrow ? "22px 16px 60px" : "32px 34px 80px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
                        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "1.7rem", fontWeight: 400, color: INK, margin: 0 }}>
                            {sectionTitle}
                        </h1>
                        {section !== "add" && (
                            <button onClick={() => setSection("add")} style={btnPrimary}>
                                <Icon name="plus" size={15} />
                                Ajouter une œuvre
                            </button>
                        )}
                    </div>

                    {message && (
                        <div
                            style={{
                                background: CARD,
                                border: `1px solid ${BORDER}`,
                                borderLeft: `3px solid ${SKY}`,
                                borderRadius: 10,
                                padding: "12px 16px",
                                fontSize: 14,
                                fontWeight: 600,
                                color: INK,
                                marginBottom: 22,
                            }}
                        >
                            {message}
                        </div>
                    )}

                    {/* STATS (vue d'ensemble) */}
                    {section === "overview" && (
                        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 30 }}>
                            {[
                                ["Œuvres en ligne", oeuvres.length, ORANGE],
                                ["Illustrations", illusCount, SKY],
                                ["Crochet", crochCount, ORANGE],
                            ].map(([label, n, accent]) => (
                                <div
                                    key={label}
                                    style={{
                                        flex: "1 1 160px",
                                        background: CARD,
                                        border: `1px solid ${BORDER}`,
                                        borderRadius: 16,
                                        padding: "20px 22px",
                                        position: "relative",
                                        overflow: "hidden",
                                    }}
                                >
                                    <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: accent }} />
                                    <div style={{ fontFamily: "Georgia, serif", fontSize: 30, color: INK }}>{n}</div>
                                    <div style={{ fontSize: 12, color: MUTED, letterSpacing: 0.4, marginTop: 2 }}>{label}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* FORMULAIRE D'AJOUT */}
                    {section === "add" && (
                        <form
                            onSubmit={handleUpload}
                            style={{
                                background: CARD,
                                border: `1px solid ${BORDER}`,
                                borderRadius: 20,
                                padding: 28,
                                display: "flex",
                                flexDirection: "column",
                                gap: 18,
                                maxWidth: 560,
                            }}
                        >
                            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                                <label style={{ fontWeight: 600, fontSize: 13.5, color: INK }}>Titre de l'œuvre</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ex : Le Renard des bois"
                                    style={field}
                                />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                                <label style={{ fontWeight: 600, fontSize: 13.5, color: INK }}>Catégorie</label>
                                <select value={category} onChange={(e) => setCategory(e.target.value)} style={field}>
                                    <option value="illustration">Illustration</option>
                                    <option value="crochet">Crochet</option>
                                </select>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                                <label style={{ fontWeight: 600, fontSize: 13.5, color: INK }}>Disposition dans la mosaïque</label>
                                <select value={size} onChange={(e) => setSize(e.target.value)} style={field}>
                                    <option value="medium">Standard (carré / moyen)</option>
                                    <option value="large">Mise en valeur (grand / vertical)</option>
                                </select>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                                <label style={{ fontWeight: 600, fontSize: 13.5, color: INK }}>Fichier image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    style={{ color: MUTED, fontSize: 13.5 }}
                                />
                            </div>
                            <div style={{ display: "flex", gap: 10 }}>
                                <button type="submit" disabled={loading} style={{ ...btnPrimary, opacity: loading ? 0.7 : 1, padding: "12px 20px" }}>
                                    {loading ? "Envoi en cours…" : "Publier sur le site →"}
                                </button>
                                <button type="button" onClick={() => setSection("overview")} style={{ ...btnGhost, padding: "12px 18px" }}>
                                    Annuler
                                </button>
                            </div>
                        </form>
                    )}

                    {/* LISTE */}
                    {section !== "add" && (
                        <div>
                            <div style={{ fontSize: 13, color: MUTED, marginBottom: 12 }}>
                                {visibleOeuvres.length} œuvre{visibleOeuvres.length > 1 ? "s" : ""}
                            </div>
                            {visibleOeuvres.length === 0 ? (
                                <div
                                    style={{
                                        background: CARD,
                                        border: `1px dashed ${BORDER}`,
                                        borderRadius: 16,
                                        padding: "40px 24px",
                                        textAlign: "center",
                                        color: MUTED,
                                        fontSize: 14,
                                    }}
                                >
                                    Aucune œuvre pour le moment.
                                </div>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    {visibleOeuvres.map((item) => {
                                        const isEditing = editingId === item.id;
                                        const isPendingDelete = pendingDeleteId === item.id;
                                        return (
                                            <div
                                                key={item.id}
                                                style={{
                                                    background: CARD,
                                                    border: `1px solid ${BORDER}`,
                                                    borderRadius: 14,
                                                    padding: "14px 16px",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: 12,
                                                }}
                                            >
                                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
                                                        <img
                                                            src={item.img_url}
                                                            alt={item.title}
                                                            style={{ width: 52, height: 52, objectFit: "cover", borderRadius: 10, flexShrink: 0, border: `1px solid ${BORDER}` }}
                                                        />
                                                        {!isEditing && (
                                                            <div style={{ minWidth: 0 }}>
                                                                <div style={{ fontWeight: 600, fontSize: 15, color: INK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                                    {item.title}
                                                                </div>
                                                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                                                                    <CategoryBadge cat={item.category} />
                                                                    <span style={{ fontSize: 12, color: MUTED }}>
                                                                        {item.size === "large" ? "Grand" : "Standard"}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {!isEditing && !isPendingDelete && (
                                                        <div style={{ display: "flex", gap: 8 }}>
                                                            <button onClick={() => startEdit(item)} style={btnGhost}>
                                                                <Icon name="edit" size={14} />
                                                                Modifier
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setEditingId(null);
                                                                    setPendingDeleteId(item.id);
                                                                }}
                                                                style={btnDanger}
                                                            >
                                                                <Icon name="trash" size={14} />
                                                                Supprimer
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>

                                                {isPendingDelete && (
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "space-between",
                                                            gap: 12,
                                                            flexWrap: "wrap",
                                                            background: "rgba(239,68,68,0.06)",
                                                            border: "1px solid rgba(239,68,68,0.22)",
                                                            borderRadius: 10,
                                                            padding: "10px 14px",
                                                        }}
                                                    >
                                                        <span style={{ fontSize: 13, color: INK }}>
                                                            Supprimer <strong>{item.title}</strong> définitivement ?
                                                        </span>
                                                        <div style={{ display: "flex", gap: 8 }}>
                                                            <button
                                                                onClick={() => confirmDelete(item.id, item.img_url)}
                                                                style={{ ...btnDanger, background: "#dc2626", color: "#fff" }}
                                                            >
                                                                Oui, supprimer
                                                            </button>
                                                            <button onClick={() => setPendingDeleteId(null)} style={btnGhost}>
                                                                Annuler
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {isEditing && (
                                                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                                        <input
                                                            type="text"
                                                            value={editForm.title}
                                                            onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                                                            style={field}
                                                        />
                                                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                                                            <select
                                                                value={editForm.category}
                                                                onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))}
                                                                style={{ ...field, flex: "1 1 150px" }}
                                                            >
                                                                <option value="illustration">Illustration</option>
                                                                <option value="crochet">Crochet</option>
                                                            </select>
                                                            <select
                                                                value={editForm.size}
                                                                onChange={(e) => setEditForm((f) => ({ ...f, size: e.target.value }))}
                                                                style={{ ...field, flex: "1 1 150px" }}
                                                            >
                                                                <option value="medium">Standard</option>
                                                                <option value="large">Grand</option>
                                                            </select>
                                                        </div>
                                                        <div style={{ display: "flex", gap: 8 }}>
                                                            <button onClick={() => saveEdit(item.id)} style={btnPrimary}>Enregistrer</button>
                                                            <button onClick={() => setEditingId(null)} style={btnGhost}>Annuler</button>
                                                        </div>
                                                        <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>
                                                            Pour changer l'image : supprime l'œuvre et publie-la à nouveau.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
