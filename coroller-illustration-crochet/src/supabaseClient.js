import { createClient } from '@supabase/supabase-js';

console.log("Vérification URL :", import.meta.env.VITE_SUPABASE_URL);
console.log("Vérification Clé :", import.meta.env.VITE_SUPABASE_ANON_KEY);

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
