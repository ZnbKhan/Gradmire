"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/db";
import { requireStaff } from "@/lib/auth";
import { CONTENT_TAG } from "@/lib/queries";
import type { FormState } from "@/lib/actions/consultation";

const stageValues = schema.applicationStage.enumValues;
const leadStatusValues = schema.leadStatus.enumValues;

/** Short, quotable reference: GM-<4 hex>. Collisions retry on the unique index. */
function makeReference() {
  return `GM-${Math.random().toString(16).slice(2, 6).toUpperCase()}`;
}

export async function updateLeadStatus(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireStaff();

  const parsed = z
    .object({
      leadId: z.string().uuid(),
      status: z.enum(leadStatusValues),
    })
    .safeParse({
      leadId: formData.get("leadId"),
      status: formData.get("status"),
    });

  if (!parsed.success) return { ok: false, message: "Invalid status change." };

  await db
    .update(schema.leads)
    .set({ status: parsed.data.status, updatedAt: new Date() })
    .where(eq(schema.leads.id, parsed.data.leadId));

  revalidatePath("/admin/leads");
  return { ok: true, message: "Lead updated." };
}

/**
 * Moves an application to a new stage and records the move on its timeline.
 * The event row is what the applicant portal renders, so the two are written
 * together rather than the stage alone.
 */
export async function updateApplicationStage(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { staff } = await requireStaff();

  const parsed = z
    .object({
      applicationId: z.string().uuid(),
      stage: z.enum(stageValues),
      note: z.string().trim().max(500).optional(),
      applicantNote: z.string().trim().max(500).optional(),
    })
    .safeParse({
      applicationId: formData.get("applicationId"),
      stage: formData.get("stage"),
      note: formData.get("note") ?? undefined,
      applicantNote: formData.get("applicantNote") ?? undefined,
    });

  if (!parsed.success) return { ok: false, message: "Invalid stage change." };

  const { applicationId, stage, note, applicantNote } = parsed.data;

  await db.transaction(async (tx) => {
    await tx
      .update(schema.applications)
      .set({
        stage,
        applicantNote: applicantNote || null,
        updatedAt: new Date(),
      })
      .where(eq(schema.applications.id, applicationId));

    await tx.insert(schema.applicationEvents).values({
      applicationId,
      stage,
      note: note || null,
      createdByStaffId: staff.id,
    });
  });

  revalidatePath("/admin/applications");
  revalidatePath("/portal");
  return { ok: true, message: "Stage updated. The applicant can see it now." };
}

/**
 * Creates an applicant (or reuses one by email) plus their first application.
 * This is how a student gets something to log in and look at.
 */
export async function createApplication(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { staff } = await requireStaff();

  const parsed = z
    .object({
      email: z.string().trim().toLowerCase().email(),
      fullName: z.string().trim().min(2).max(120),
      universityName: z.string().trim().min(2).max(160),
      programmeName: z.string().trim().min(2).max(160),
      intake: z.string().trim().max(60).optional(),
      courseHubId: z.string().uuid().optional().or(z.literal("")),
    })
    .safeParse({
      email: formData.get("email"),
      fullName: formData.get("fullName"),
      universityName: formData.get("universityName"),
      programmeName: formData.get("programmeName"),
      intake: formData.get("intake") ?? undefined,
      courseHubId: formData.get("courseHubId") ?? "",
    });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { email, fullName, universityName, programmeName, intake, courseHubId } =
    parsed.data;

  try {
    const [applicant] = await db
      .insert(schema.applicants)
      .values({ email, fullName })
      .onConflictDoUpdate({
        target: schema.applicants.email,
        set: { fullName, updatedAt: new Date() },
      })
      .returning({ id: schema.applicants.id });

    await db.transaction(async (tx) => {
      const [app] = await tx
        .insert(schema.applications)
        .values({
          reference: makeReference(),
          applicantId: applicant.id,
          courseHubId: courseHubId || null,
          universityName,
          programmeName,
          intake: intake || null,
          stage: "enquiry",
          assignedStaffId: staff.id,
        })
        .returning({ id: schema.applications.id });

      await tx.insert(schema.applicationEvents).values({
        applicationId: app.id,
        stage: "enquiry",
        note: "Application opened.",
        createdByStaffId: staff.id,
      });

      return app.id;
    });

    revalidatePath("/admin/applications");
    return {
      ok: true,
      message: `Application created. ${email} can now sign in to track it.`,
    };
  } catch (error) {
    console.error("[admin] createApplication failed", error);
    return { ok: false, message: "Couldn't create that application. Try again." };
  }
}

/** Edits the figures that go stale — fees, salaries, verification date. */
export async function updateCourseHub(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireStaff();

  const num = (v: FormDataEntryValue | null) => {
    if (v == null || v === "") return null;
    const n = Number(String(v).replace(/[^\d.]/g, ""));
    return Number.isFinite(n) ? Math.round(n) : null;
  };

  const parsed = z
    .object({ hubId: z.string().uuid(), status: z.enum(schema.hubStatus.enumValues) })
    .safeParse({ hubId: formData.get("hubId"), status: formData.get("status") });

  if (!parsed.success) return { ok: false, message: "Invalid course hub." };

  const markVerified = formData.get("markVerified") === "on";

  await db
    .update(schema.courseHubs)
    .set({
      status: parsed.data.status,
      oneLiner: (formData.get("oneLiner") as string) || null,
      overview: (formData.get("overview") as string) || null,
      tuitionMin: num(formData.get("tuitionMin")),
      tuitionMax: num(formData.get("tuitionMax")),
      livingCostMin: num(formData.get("livingCostMin")),
      livingCostMax: num(formData.get("livingCostMax")),
      salaryMin: num(formData.get("salaryMin")),
      salaryMax: num(formData.get("salaryMax")),
      ...(markVerified ? { dataVerifiedAt: new Date() } : {}),
      updatedAt: new Date(),
    })
    .where(eq(schema.courseHubs.id, parsed.data.hubId));

  // Content is cached by tag across requests; drop it so the public pages
  // pick the edit up on their next request rather than after the TTL.
  revalidateTag(CONTENT_TAG);
  revalidatePath("/admin/courses");

  return { ok: true, message: "Saved. Live pages will refresh on next request." };
}
