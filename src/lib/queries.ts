import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { asc, eq, and } from "drizzle-orm";
import { db, schema } from "@/db";

/**
 * Content reads are cached at two levels:
 *   - `cache()` dedupes repeat calls inside a single render pass.
 *   - `unstable_cache` persists across requests and is invalidated by tag
 *     whenever the admin writes, so course pages serve from cache under load
 *     instead of hitting Postgres per visitor.
 */

export const CONTENT_TAG = "content";
const REVALIDATE_SECONDS = 3600;

export type HubWithChildren = Awaited<ReturnType<typeof getCourseHub>>;

export const getDestinations = cache(
  unstable_cache(
    async () =>
      db.query.destinations.findMany({
        orderBy: [asc(schema.destinations.sortOrder)],
      }),
    ["destinations"],
    { tags: [CONTENT_TAG], revalidate: REVALIDATE_SECONDS },
  ),
);

export const getDestination = cache((slug: string) =>
  unstable_cache(
    async () =>
      db.query.destinations.findFirst({
        where: eq(schema.destinations.slug, slug),
      }),
    ["destination", slug],
    { tags: [CONTENT_TAG], revalidate: REVALIDATE_SECONDS },
  )(),
);

/** Every hub for a destination, live and stub, in display order. */
export const getCourseHubs = cache((destinationSlug: string) =>
  unstable_cache(
    async () => {
      const destination = await db.query.destinations.findFirst({
        where: eq(schema.destinations.slug, destinationSlug),
        columns: { id: true },
      });
      if (!destination) return [];

      return db.query.courseHubs.findMany({
        where: eq(schema.courseHubs.destinationId, destination.id),
        orderBy: [asc(schema.courseHubs.sortOrder)],
        with: {
          universities: { orderBy: [asc(schema.universities.sortOrder)], limit: 1 },
        },
      });
    },
    ["course-hubs", destinationSlug],
    { tags: [CONTENT_TAG], revalidate: REVALIDATE_SECONDS },
  )(),
);

export const getCourseHub = cache((destinationSlug: string, hubSlug: string) =>
  unstable_cache(
    async () => {
      const destination = await db.query.destinations.findFirst({
        where: eq(schema.destinations.slug, destinationSlug),
      });
      if (!destination) return null;

      const hub = await db.query.courseHubs.findFirst({
        where: and(
          eq(schema.courseHubs.destinationId, destination.id),
          eq(schema.courseHubs.slug, hubSlug),
        ),
        with: {
          universities: { orderBy: [asc(schema.universities.sortOrder)] },
          deadlines: { orderBy: [asc(schema.deadlines.sortOrder)] },
        },
      });
      if (!hub) return null;

      return { ...hub, destination };
    },
    ["course-hub", destinationSlug, hubSlug],
    { tags: [CONTENT_TAG], revalidate: REVALIDATE_SECONDS },
  )(),
);

/** Every live-destination / hub pair, for generateStaticParams and sitemaps. */
export const getAllHubPaths = cache(
  unstable_cache(
    async () => {
      const rows = await db
        .select({
          destination: schema.destinations.slug,
          hub: schema.courseHubs.slug,
          status: schema.courseHubs.status,
          updatedAt: schema.courseHubs.updatedAt,
        })
        .from(schema.courseHubs)
        .innerJoin(
          schema.destinations,
          eq(schema.courseHubs.destinationId, schema.destinations.id),
        )
        .orderBy(asc(schema.courseHubs.sortOrder));
      return rows;
    },
    ["hub-paths"],
    { tags: [CONTENT_TAG], revalidate: REVALIDATE_SECONDS },
  ),
);

/** Rows for the departures board: live hubs first, stubs marked "soon". */
export const getBoardRows = cache((destinationSlug: string) =>
  unstable_cache(
    async () => {
      const hubs = await getCourseHubs(destinationSlug);
      return hubs.slice(0, 6).map((h) => ({
        code: h.code,
        subject: h.name,
        topUniversity:
          h.status === "live"
            ? h.universities[0]?.name ?? "—"
            : "— guide in progress",
        status: h.status === "live" ? ("open" as const) : ("soon" as const),
      }));
    },
    ["board-rows", destinationSlug],
    { tags: [CONTENT_TAG], revalidate: REVALIDATE_SECONDS },
  )(),
);

/** Formats a stored integer range the way the content spec writes it. */
export function formatRange(
  min: number | null,
  max: number | null,
  opts: { currency?: string; suffix?: string; compact?: boolean } = {},
) {
  if (min == null && max == null) return null;
  const { currency = "£", suffix = "", compact = false } = opts;
  const fmt = (n: number) =>
    compact && n >= 1000
      ? `${currency}${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`
      : `${currency}${n.toLocaleString("en-GB")}`;
  if (min != null && max != null && min !== max) {
    return `${fmt(min)}–${fmt(max)}${suffix}`;
  }
  return `${fmt((min ?? max)!)}${suffix}`;
}
