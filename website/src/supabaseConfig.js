// The Supabase URL and anon key are safe to expose client-side — access is
// controlled by Postgres row-level security policies, not by hiding these.
// They're still pulled from env vars so the source doesn't hardcode one
// specific project. See .env.example for the required keys.
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
