import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { db, schema } from "@/db";
import { safeRedirectUrl } from "@/lib/safe-redirect";

/**
 * Exchanges the magic-link code for a session, then links the Supabase auth
 * user to the applicant row a counselor created earlier. The link is done by
 * email because the applicant record exists before the student ever signs in.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  // Never interpolated directly — see safe-redirect.ts.
  const next = searchParams.get("next");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", origin));
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user?.email) {
    return NextResponse.redirect(new URL("/login?error=invalid_link", origin));
  }

  try {
    await db
      .update(schema.applicants)
      .set({ authUserId: data.user.id, updatedAt: new Date() })
      .where(eq(schema.applicants.email, data.user.email.toLowerCase()));
  } catch (err) {
    // A failure here means the portal shows no applications rather than
    // breaking sign-in, so log and continue.
    console.error("[auth/callback] failed to link applicant", err);
  }

  return NextResponse.redirect(safeRedirectUrl(next, origin));
}
