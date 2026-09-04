import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { asc, eq, and, inArray, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { formatMoneyRange } from "@/lib/money";
import { BOARD_ROW_LIMIT, CONTENT_REVALIDATE_SECONDS } from "@/config/site";

/**
 * Content reads are cached at two levels:
 *   - `cache()` dedupes repeat calls inside a single render pass.
 *   - `unstable_cache` persists across requests and is invalidated by tag
 *     whenever the admin writes, so course pages serve from cache under load
 *     instead of hitting Postgres per visitor.
 */

export const CONTENT_TAG = "content";
const REVALIDATE_SECONDS = CONTENT_REVALIDATE_SECONDS;

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
    async () =>
      // One round trip. This was three sequential queries — look up the
      // destination id, then the hubs, then a separate count aggregate — so
      // every cache miss paid three round trips to Supabase. The destination
      // is now matched by subquery and the count comes back as a correlated
      // aggregate. A missing destination simply yields no rows.
      db.query.courseHubs.findMany({
        where: inArray(
          schema.courseHubs.destinationId,
          db
            .select({ id: schema.destinations.id })
            .from(schema.destinations)
            .where(eq(schema.destinations.slug, destinationSlug)),
        ),
        orderBy: [asc(schema.courseHubs.sortOrder)],
        with: {
          // Only the top-ranked one is rendered, but the *count* below is
          // taken from an aggregate — reading `universities.length` here
          // would report 1 for every hub.
          universities: { orderBy: [asc(schema.universities.sortOrder)], limit: 1 },
        },
        extras: {
          // The inner table is aliased by hand. Interpolating
          // `schema.universities.courseHubId` here would be rewritten to the
          // *outer* alias, producing `courseHubs.course_hub_id` — a column
          // that does not exist.
          universityCount: sql<number>`(
            select count(*)::int
            from "universities" "uc"
            where "uc"."course_hub_id" = ${schema.courseHubs.id}
          )`.as("university_count"),
        },
      }),
    ["course-hubs", destinationSlug],
    { tags: [CONTENT_TAG], revalidate: REVALIDATE_SECONDS },
  )(),
);

export const getCourseHub = cache((destinationSlug: string, hubSlug: string) =>
  unstable_cache(
    async () => {
      // One round trip, where this was two. The destination is matched by
      // subquery and comes back through its own relation rather than from a
      // prior lookup, so the shape (`hub.destination`) is unchanged.
      const hub = await db.query.courseHubs.findFirst({
        where: and(
          eq(schema.courseHubs.slug, hubSlug),
          inArray(
            schema.courseHubs.destinationId,
            db
              .select({ id: schema.destinations.id })
              .from(schema.destinations)
              .where(eq(schema.destinations.slug, destinationSlug)),
          ),
        ),
        with: {
          destination: true,
          universities: { orderBy: [asc(schema.universities.sortOrder)] },
          deadlines: { orderBy: [asc(schema.deadlines.sortOrder)] },
        },
      });

      return hub ?? null;
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

/**
 * Rows for the departures board: live hubs first, stubs marked "soon".
 *
 * `topUniversity` is null rather than a placeholder dash — how a missing
 * value reads is the board's decision, not this layer's.
 */
export const getBoardRows = cache(async (destinationSlug: string) => {
  // Deliberately not wrapped in `unstable_cache`. It reshapes the output of
  // `getCourseHubs`, which is already cached — nesting one cache inside
  // another is unsupported and stored the same rows twice.
  const hubs = await getCourseHubs(destinationSlug);
  return hubs.slice(0, BOARD_ROW_LIMIT).map((h) => ({
    code: h.code,
    subject: h.name,
    topUniversity: h.status === "live" ? h.universities[0]?.name ?? null : null,
    status: h.status === "live" ? ("open" as const) : ("soon" as const),
  }));
});

/**
 * Formats a stored integer range the way the content spec writes it.
 *
 * `currency` comes from the owning course hub, not a default, so a hub
 * priced in dollars never renders in sterling.
 */
export function formatRange(
  min: number | null,
  max: number | null,
  currency: string,
  opts: { suffix?: string; compact?: boolean } = {},
) {
  return formatMoneyRange({ min, max, currency }, opts);
}
