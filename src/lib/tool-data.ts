import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { CONTENT_TAG } from "@/lib/queries";
import type { CourseHub } from "@/data/courses";

/**
 * Adapts database rows into the CourseHub shape the tools were written
 * against, so the Comparator, ROI Calculator, Course Finder and Deadline
 * Tracker all read the same figures an admin edits — rather than the static
 * seed file they originally imported.
 */
function money(min: number | null, max: number | null, suffix: string) {
  if (min == null && max == null) return undefined;
  const f = (n: number) => `£${n.toLocaleString("en-GB")}`;
  return min != null && max != null && min !== max
    ? `${f(min)}–${f(max)}${suffix}`
    : `${f((min ?? max)!)}${suffix}`;
}

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
        tuitionRange: money(h.tuitionMin, h.tuitionMax, "/year"),
        livingCosts: money(h.livingCostMin, h.livingCostMax, "/month"),
        entryRequirements: h.entryRequirements ?? [],
        applicationDeadlines: h.deadlines.map((d) => ({
          label: d.label,
          detail: d.detail ?? "",
        })),
        deadlineWarning: h.deadlines.find((d) => d.warning)?.warning ?? undefined,
        medianSalaryRange: money(h.salaryMin, h.salaryMax, ""),
        topSectors: h.topSectors ?? [],
        commonEmployers: h.commonEmployers ?? [],
        visaNotes: h.visaNotes ?? [],
        atasRequired: h.atasRequirement !== "no",
        extraNote: h.extraNote ?? undefined,
      }));
    },
    ["tool-hubs"],
    { tags: [CONTENT_TAG], revalidate: 3600 },
  ),
);
