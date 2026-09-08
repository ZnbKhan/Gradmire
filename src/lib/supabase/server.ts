import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { User } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

/**
 * Supabase client for Server Components, Route Handlers and Server Actions.
 * Reads the session from cookies so row-level security applies as the
 * signed-in user rather than as an anonymous visitor.
 *
 * Returns null when auth is not configured — see ./config.ts.
 */
export async function createClient() {
  if (!isSupabaseConfigured()) return null;
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component, where cookies are read-only.
          // The middleware refreshes the session instead, so this is safe.
        }
      },
    },
  });
}

/**
 * The signed-in user, or null when nobody is signed in *or* auth is not
 * configured. Callers that gate a route must treat null as "not allowed".
 */
export async function getSessionUser(): Promise<User | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
