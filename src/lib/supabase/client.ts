import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

/** Returns null when auth is not configured — see ./config.ts. */
export function createClient() {
  if (!isSupabaseConfigured()) return null;
  return createBrowserClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
}

export { isSupabaseConfigured };
