"use server";

import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { consultationSchema, newsletterSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { CONTACT_EMAIL } from "@/config/site";

export type FormState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

async function clientKey(prefix: string) {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0].trim() ??
    h.get("x-real-ip") ??
    "unknown";
  return `${prefix}:${ip}`;
}

/**
 * Records a consultation request. This is the site's only conversion point,
 * so it fails loudly rather than silently: the caller always learns whether
 * the enquiry was stored.
 */
export async function submitConsultation(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = consultationSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone") ?? "",
    courseHubSlug: formData.get("courseHubSlug") ?? "",
    preferredIntake: formData.get("preferredIntake") ?? "",
    message: formData.get("message") ?? "",
    sourcePath: formData.get("sourcePath") ?? "",
    website: formData.get("website") ?? "",
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  // Honeypot: report success so a bot does not learn it was caught.
  if (parsed.data.website) return { ok: true, message: "Thanks — we'll be in touch." };

  const limit = rateLimit(await clientKey("consultation"), { limit: 3, windowMs: 60_000 });
  if (!limit.ok) {
    return {
      ok: false,
      message: `Too many requests. Try again in ${limit.retryAfterSeconds} seconds.`,
    };
  }

  const { fullName, email, phone, courseHubSlug, preferredIntake, message, sourcePath } =
    parsed.data;

  try {
    let courseHubId: string | null = null;
    if (courseHubSlug) {
      const hub = await db.query.courseHubs.findFirst({
        where: eq(schema.courseHubs.slug, courseHubSlug),
        columns: { id: true },
      });
      courseHubId = hub?.id ?? null;
    }

    await db.insert(schema.leads).values({
      fullName,
      email,
      phone: phone || null,
      courseHubId,
      preferredIntake: preferredIntake || null,
      message: message || null,
      sourcePath: sourcePath || null,
    });

    return {
      ok: true,
      message:
        "Booked. A counselor who specializes in your subject will email you within one working day.",
    };
  } catch (error) {
    console.error("[consultation] failed to store lead", error);
    return {
      ok: false,
      message: `We couldn't save that just now. Email ${CONTACT_EMAIL} and we'll pick it up directly.`,
    };
  }
}

export async function subscribeToNewsletter(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = newsletterSchema.safeParse({
    email: formData.get("email"),
    courseHubSlug: formData.get("courseHubSlug") ?? "",
    website: formData.get("website") ?? "",
  });

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      message: "Enter a valid email address.",
    };
  }
  if (parsed.data.website) return { ok: true, message: "You're on the list." };

  const limit = rateLimit(await clientKey("newsletter"), { limit: 5, windowMs: 60_000 });
  if (!limit.ok) {
    return { ok: false, message: `Too many requests. Try again in ${limit.retryAfterSeconds}s.` };
  }

  try {
    let courseHubId: string | null = null;
    if (parsed.data.courseHubSlug) {
      const hub = await db.query.courseHubs.findFirst({
        where: eq(schema.courseHubs.slug, parsed.data.courseHubSlug),
        columns: { id: true },
      });
      courseHubId = hub?.id ?? null;
    }

    await db
      .insert(schema.newsletterSubscribers)
      .values({ email: parsed.data.email, courseHubId })
      // Re-subscribing after unsubscribing should work, not error.
      .onConflictDoUpdate({
        target: schema.newsletterSubscribers.email,
        set: { unsubscribedAt: null, courseHubId },
      });

    return { ok: true, message: "You're on the list. We'll send deadline reminders for your subject." };
  } catch (error) {
    console.error("[newsletter] failed to subscribe", error);
    return { ok: false, message: "We couldn't sign you up just now. Try again shortly." };
  }
}
