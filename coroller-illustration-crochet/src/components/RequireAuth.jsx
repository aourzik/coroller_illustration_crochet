import { Navigate } from "react-router-dom";
import { useAuth } from "../auth";
import { C } from "../App";

// Garde de route : si personne n'est connecté, on renvoie vers /connexion.
// C'est un garde-fou côté interface — la vraie protection reste les RLS Supabase.
export default function RequireAuth({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    background: C.ink,
                    color: "#f0eef8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "Corbel, sans-serif",
                }}
            >
                Chargement…
            </div>
        );
    }

    if (!user) return <Navigate to="/connexion" replace />;

    return children;
}
