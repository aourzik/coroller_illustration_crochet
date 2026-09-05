import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

// Contexte d'authentification : une seule source de vérité pour "qui est connecté".
// La session Supabase est persistée automatiquement dans le localStorage du
// navigateur, donc Marie reste connectée d'une visite à l'autre.
const AuthContext = createContext({
    user: null,
    loading: true,
    signIn: async () => {},
    signOut: async () => {},
});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!supabase) {
            setLoading(false);
            return;
        }

        // 1. Session déjà présente au chargement de la page ?
        supabase.auth.getSession().then(({ data }) => {
            setUser(data.session?.user ?? null);
            setLoading(false);
        });

        // 2. On suit les changements (login / logout / refresh du token).
        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => sub.subscription.unsubscribe();
    }, []);

    const value = {
        user,
        loading,
        signIn: (email, password) => {
            if (!supabase) {
                return Promise.resolve({
                    error: { message: "Supabase n'est pas configuré (fichier .env)." },
                });
            }
            return supabase.auth.signInWithPassword({ email, password });
        },
        signOut: () => (supabase ? supabase.auth.signOut() : Promise.resolve()),
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
