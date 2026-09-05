import { COLORS, field, selectField } from "./theme";
import Icon from "./Icon";

const SORT_OPTIONS = [
    { value: "recent", label: "Plus récentes" },
    { value: "old", label: "Plus anciennes" },
    { value: "az", label: "Titre A → Z" },
    { value: "za", label: "Titre Z → A" },
];

// Barre d'outils au-dessus de la grille : recherche, filtre catégorie
// (optionnel), tri, et compteur de résultats.
export default function Toolbar({
    query,
    onQuery,
    sort,
    onSort,
    category,
    onCategory,
    showCategory,
    count,
}) {
    // Mêmes dimensions que le champ de recherche : chaque contrôle prend une
    // part égale de la ligne et se replie proprement quand la place manque.
    const select = { ...selectField, flex: "1 1 180px" };

    return (
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ position: "relative", flex: "1 1 200px", minWidth: 180 }}>
                <span
                    style={{
                        position: "absolute",
                        left: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: COLORS.muted,
                        pointerEvents: "none",
                    }}
                >
                    <Icon name="search" size={16} />
                </span>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => onQuery(e.target.value)}
                    placeholder="Rechercher un titre…"
                    style={{ ...field, paddingLeft: 36, paddingRight: query ? 34 : 12 }}
                />
                {query && (
                    <button
                        type="button"
                        onClick={() => onQuery("")}
                        aria-label="Effacer la recherche"
                        style={{
                            position: "absolute",
                            right: 8,
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: COLORS.muted,
                            display: "flex",
                            padding: 4,
                        }}
                    >
                        <Icon name="x" size={15} />
                    </button>
                )}
            </div>

            {showCategory && (
                <select value={category} onChange={(e) => onCategory(e.target.value)} style={select}>
                    <option value="all">Toutes les catégories</option>
                    <option value="illustration">Illustrations</option>
                    <option value="crochet">Crochet</option>
                </select>
            )}

            <select value={sort} onChange={(e) => onSort(e.target.value)} style={select}>
                {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>

            <span
                style={{
                    fontSize: 13,
                    color: COLORS.muted,
                    marginLeft: "auto",
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                }}
            >
                {count} œuvre{count > 1 ? "s" : ""}
            </span>
        </div>
    );
}
