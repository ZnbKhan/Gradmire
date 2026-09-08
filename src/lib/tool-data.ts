import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { CONTENT_TAG } from "@/lib/queries";
import { formatMoneyRange } from "@/lib/money";
import { CONTENT_REVALIDATE_SECONDS } from "@/config/site";
import type { CourseHub } from "@/data/courses";

/**
 * Adapts database rows into the CourseHub shape the tools were written
 * against, so the Comparator, ROI Calculator, Course Finder and Deadline
 * Tracker all read the same figures an admin edits — rather than the static
 * seed file they originally imported.
 *
 * Both the formatted range (for display) and the raw min/max (for the ROI
 * calculator's arithmetic) are included — see the CourseHub numeric fields.
 */
export const getHubsForTools = cache(
  unstable_cache(
    async (): Promise<CourseHub[]> => {
      const rows = await db.query.courseHubs.findMany({
        where: eq(schema.courseHubs.status, "live"),
        orderBy: [asc(schema.courseHubs.sortOrder)],
        with: {
          destination: { columns: { slug: true } },
          universities: { orderBy: [asc(schema.universities.sortOrder)] },
          deadlines: { orderBy: [asc(schema.deadlines.sortOrder)] },
        },
      });

      return rows.map((h) => ({
        countrySlug: h.destination.slug,
        slug: h.slug,
        name: h.name,
        icon: h.icon ?? "BookOpen",
        isStub: false,
        oneLiner: h.oneLiner ?? "",
        overview: h.overview ?? undefined,
        universities: h.universities.map((u) => ({
          name: u.name,
          notableFor: u.notableFor ?? "",
          subjectRank: u.subjectRank ?? undefined,
        })),
        currency: h.currency,
        tuitionMin: h.tuitionMin ?? undefined,
        tuitionMax: h.tuitionMax ?? undefined,
        tuitionRange:
          formatMoneyRange(
            { min: h.tuitionMin, max: h.tuitionMax, currency: h.currency },
            { suffix: "/year" },
          ) ?? undefined,
        livingCostMin: h.livingCostMin ?? undefined,
        livingCostMax: h.livingCostMax ?? undefined,
        livingCosts:
          formatMoneyRange(
            { min: h.livingCostMin, max: h.livingCostMax, currency: h.currency },
            { suffix: "/month" },
          ) ?? undefined,
        entryRequirements: h.entryRequirements ?? [],
        applicationDeadlines: h.deadlines.map((d) => ({
          label: d.label,
          detail: d.detail ?? "",
        })),
        deadlineWarning: h.deadlines.find((d) => d.warning)?.warning ?? undefined,
        salaryMin: h.salaryMin ?? undefined,
        salaryMax: h.salaryMax ?? undefined,
        medianSalaryRange:
          formatMoneyRange({ min: h.salaryMin, max: h.salaryMax, currency: h.currency }) ??
          undefined,
        topSectors: h.topSectors ?? [],
        commonEmployers: h.commonEmployers ?? [],
        visaNotes: h.visaNotes ?? [],
        atasRequired: h.atasRequirement !== "no",
        extraNote: h.extraNote ?? undefined,
      }));
    },
    ["tool-hubs"],
    { tags: [CONTENT_TAG], revalidate: CONTENT_REVALIDATE_SECONDS },
  ),
);
