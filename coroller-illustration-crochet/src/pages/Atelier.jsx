import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { useOeuvres } from "../hooks/useOeuvres";
import { useToasts } from "../hooks/useToasts";
import { COLORS, btnPrimary } from "../components/atelier/theme";
import Icon from "../components/atelier/Icon";
import TopBar from "../components/atelier/TopBar";
import Sidebar from "../components/atelier/Sidebar";
import StatsRow from "../components/atelier/StatsRow";
import Toolbar from "../components/atelier/Toolbar";
import OeuvreGrid from "../components/atelier/OeuvreGrid";
import UploadForm from "../components/atelier/UploadForm";
import Toaster from "../components/atelier/Toaster";

const NAV_ITEMS = [
    { id: "overview", icon: "grid", label: "Vue d'ensemble" },
    { id: "illustration", icon: "image", label: "Illustrations" },
    { id: "crochet", icon: "aperture", label: "Crochet" },
    { id: "add", icon: "plus", label: "Ajouter une œuvre" },
];

const SECTION_TITLE = {
    overview: "Vue d'ensemble",
    illustration: "Illustrations",
    crochet: "Crochet",
    add: "Ajouter une œuvre",
};

const byManual = (a, b) =>
    (a.position ?? Number.POSITIVE_INFINITY) - (b.position ?? Number.POSITIVE_INFINITY);
const byRecent = (a, b) => new Date(b.created_at) - new Date(a.created_at);
const byOld = (a, b) => new Date(a.created_at) - new Date(b.created_at);
const byAz = (a, b) => a.title.localeCompare(b.title, "fr");
const byZa = (a, b) => b.title.localeCompare(a.title, "fr");
const SORTERS = { manual: byManual, recent: byRecent, old: byOld, az: byAz, za: byZa };

export default function Atelier() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const {
        oeuvres,
        loading,
        configError,
        addOeuvre,
        updateOeuvre,
        stashOeuvre,
        restoreOeuvre,
        removeOeuvre,
        reorderOeuvres,
    } = useOeuvres();
    const { toasts, push, dismiss } = useToasts();
    const pendingDeletes = useRef(new Map()); // id -> timeoutId

    const [section, setSection] = useState("overview");
    const [isNarrow, setIsNarrow] = useState(
        typeof window !== "undefined" && window.innerWidth < 900
    );
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState("manual");
    const [category, setCategory] = useState("all");

    useEffect(() => {
        const onResize = () => setIsNarrow(window.innerWidth < 900);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    useEffect(() => {
        if (configError) push("Supabase n'est pas configuré (fichier .env).", "error");
    }, [configError, push]);

    const handleLogout = async () => {
        await signOut();
        navigate("/connexion", { replace: true });
    };

    // Publication séquentielle d'un lot d'images ; `onProgress(done, total)`.
    const handleAddBatch = async (list, onProgress) => {
        const failed = [];
        for (let i = 0; i < list.length; i += 1) {
            const { error } = await addOeuvre(list[i]);
            if (error) failed.push({ ...list[i], error });
            onProgress?.(i + 1, list.length);
        }
        const published = list.length - failed.length;
        if (published > 0) {
            push(`${published} œuvre${published > 1 ? "s" : ""} publiée${published > 1 ? "s" : ""}.`, "success");
        }
        if (failed.length > 0) {
            push(`${failed.length} image(s) en échec : ${failed[0].error.message}`, "error");
        } else {
            setSection("overview");
        }
        return { failed };
    };

    const handleSave = async (id, patch, file) => {
        const { error } = await updateOeuvre(id, patch, file);
        push(error ? `Erreur : ${error.message}` : "Modifications enregistrées.", error ? "error" : "success");
        return !error;
    };

    // Suppression avec fenêtre d'annulation : l'œuvre disparaît de l'affichage,
    // la suppression réelle (base + fichier) n'a lieu qu'après 6 s sans « Annuler ».
    const handleDelete = (id, imgUrl) => {
        const item = stashOeuvre(id);
        if (!item) return;
        const timer = setTimeout(async () => {
            pendingDeletes.current.delete(id);
            const { error } = await removeOeuvre(id, imgUrl);
            if (error) {
                restoreOeuvre(item);
                push(`Erreur : ${error.message}`, "error");
            }
        }, 6000);
        pendingDeletes.current.set(id, timer);
        push("Œuvre retirée du site.", "info", {
            duration: 6000,
            action: {
                label: "Annuler",
                onClick: () => {
                    clearTimeout(timer);
                    pendingDeletes.current.delete(id);
                    restoreOeuvre(item);
                },
            },
        });
    };

    // Au démontage (déconnexion, navigation…), on annule les suppressions encore
    // en attente : l'œuvre réapparaîtra au prochain chargement (choix prudent).
    useEffect(() => {
        const map = pendingDeletes.current;
        return () => map.forEach(clearTimeout);
    }, []);

    const handleReorder = async (orderedIds) => {
        const { error } = await reorderOeuvres(orderedIds);
        if (error) push(`Erreur : ${error.message}`, "error");
    };

    const sectionCategory =
        section === "illustration" ? "illustration" : section === "crochet" ? "crochet" : null;

    const visible = useMemo(() => {
        let list = oeuvres;
        if (sectionCategory) list = list.filter((o) => o.category === sectionCategory);
        else if (category !== "all") list = list.filter((o) => o.category === category);

        const q = query.trim().toLowerCase();
        if (q) list = list.filter((o) => o.title.toLowerCase().includes(q));

        return [...list].sort(SORTERS[sort] || byManual);
    }, [oeuvres, sectionCategory, category, query, sort]);

    // Glisser-déposer possible seulement dans une section catégorie, en tri
    // manuel et sans recherche en cours (sinon l'ordre affiché ≠ ordre réel).
    const reorderable = Boolean(sectionCategory) && sort === "manual" && !query.trim();

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                background: COLORS.paper,
                fontFamily: "Corbel, sans-serif",
            }}
        >
            <TopBar email={user?.email} onLogout={handleLogout} />

            <div style={{ display: "flex", flex: 1, flexDirection: isNarrow ? "column" : "row" }}>
                <Sidebar items={NAV_ITEMS} active={section} onSelect={setSection} isNarrow={isNarrow} />

                <main
                    style={{
                        flex: 1,
                        minWidth: 0,
                        padding: isNarrow ? "22px 16px 60px" : "32px 34px 80px",
                    }}
                >
                    <header
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 16,
                            flexWrap: "wrap",
                            marginBottom: 24,
                        }}
                    >
                        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "1.7rem", fontWeight: 400, color: COLORS.ink, margin: 0 }}>
                            {SECTION_TITLE[section]}
                        </h1>
                        {section !== "add" && (
                            <button onClick={() => setSection("add")} style={btnPrimary}>
                                <Icon name="plus" size={15} />
                                Ajouter une œuvre
                            </button>
                        )}
                    </header>

                    {section === "overview" && (
                        <StatsRow
                            total={oeuvres.length}
                            illus={oeuvres.filter((o) => o.category === "illustration").length}
                            croch={oeuvres.filter((o) => o.category === "crochet").length}
                        />
                    )}

                    {section === "add" ? (
                        <UploadForm onSubmit={handleAddBatch} onCancel={() => setSection("overview")} />
                    ) : (
                        <>
                            <Toolbar
                                query={query}
                                onQuery={setQuery}
                                sort={sort}
                                onSort={setSort}
                                category={category}
                                onCategory={setCategory}
                                showCategory={section === "overview"}
                                count={visible.length}
                            />
                            {reorderable && visible.length > 1 && (
                                <p style={{ fontSize: 12.5, color: COLORS.muted, margin: "0 0 12px" }}>
                                    Glisse une vignette par sa poignée pour changer l'ordre d'affichage
                                    sur le site.
                                </p>
                            )}
                            {loading ? (
                                <p style={{ color: COLORS.muted, fontSize: 14 }}>Chargement…</p>
                            ) : (
                                <OeuvreGrid
                                    oeuvres={visible}
                                    onSave={handleSave}
                                    onDelete={handleDelete}
                                    reorderable={reorderable}
                                    onReorder={handleReorder}
                                    emptyLabel={
                                        query.trim()
                                            ? "Aucune œuvre ne correspond à ta recherche."
                                            : "Aucune œuvre pour le moment."
                                    }
                                />
                            )}
                        </>
                    )}
                </main>
            </div>

            <Toaster toasts={toasts} onDismiss={dismiss} />
        </div>
    );
}
