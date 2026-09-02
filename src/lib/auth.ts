import "server-only";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { db, schema } from "@/db";

/**
 * Guards every admin surface. Middleware already blocks the route by role
 * claim; this re-checks against the staff table so a stale JWT claim cannot
 * grant access on its own.
 */
export async function requireStaff() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) redirect("/login?next=/admin");

  const member = await db.query.staff.findFirst({
    where: eq(schema.staff.email, user.email.toLowerCase()),
  });

  if (!member) redirect("/portal");
  return { user, staff: member };
}
