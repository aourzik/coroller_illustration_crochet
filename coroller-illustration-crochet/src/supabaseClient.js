import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured =
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    supabaseAnonKey !== 'COLLE_TA_CLE_ANON_ICI';

if (!isConfigured) {
    console.warn(
        "[Supabase] Configuration manquante : renseigne VITE_SUPABASE_URL et " +
        "VITE_SUPABASE_ANON_KEY dans coroller-illustration-crochet/.env, puis " +
        "relance `npm run dev`. Les galeries et le dashboard resteront vides en attendant."
    );
}

// Si la config est absente on expose `null` plutôt que de faire planter tout le
// site au chargement (createClient lève une erreur si l'URL/clé sont vides).
export const supabase = isConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
