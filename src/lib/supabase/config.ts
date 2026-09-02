/**
 * Auth is optional infrastructure: the public marketing site, the course
 * hubs and the four tools are all readable without a session. Only the
 * applicant portal and the staff admin need Supabase.
 *
 * Rather than crashing every request when the keys are absent — which is
 * what an unguarded `process.env.X!` does — the app treats a missing
 * configuration as "nobody is signed in" and refuses the two authed areas.
 * That keeps a misconfigured deploy serving the site instead of a 500, and
 * it never opens a gated route by accident.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
