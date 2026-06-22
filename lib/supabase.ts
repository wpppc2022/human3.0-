export function getSupabaseClient() {
  throw new Error(
    "Supabase is intentionally not connected in the static MVP. Add lazy client initialization here when persistence is introduced.",
  );
}
