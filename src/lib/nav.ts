import "server-only";
import { cache } from "react";
import { getDestinations, getCourseHubs } from "@/lib/queries";
import { PRIMARY_DESTINATION } from "@/config/site";
import { formatMoneyRange } from "@/lib/money";
import { isDatabaseConfigured } from "@/db";
import { courseHubs as staticCourseHubs } from "@/data/courses";

/**
 * Navigation data for the site header and footer.
 *
 * Both used to hardcode their own copies of the destination list and a
 * handful of course-hub slugs. That made the `destinations` table's
 * `status` column a lie: marking the US live in the admin changed the
 * country page and nothing in the chrome, and renaming a hub slug left the
 * footer pointing at a 404. This reads the same rows the pages do, so the
 * database stays the only source of truth.
 *
 * Reads are already tagged and cached by `@/lib/queries`, so this costs one
 * cache lookup per render rather than a query per page.
 */

export type NavDestination = {
  slug: string;
  name: string;
  flagEmoji: string | null;
  live: boolean;
  /** Short supporting line, e.g. the destination's tagline. */
  detail: string | null;
};

export type NavHub = {
  slug: string;
  name: string;
  href: string;
  live: boolean;
  /** Formatted tuition range, or null when the hub carries no figures. */
  tuition: string | null;
  /** Lucide icon name for display in dropdowns */
  icon: string | null;
  /** Short description for dropdown tooltip/hover */
  oneLiner: string | null;
};

export type Navigation = {
  destinations: NavDestination[];
  hubs: NavHub[];
};

/**
 * Static stand-in for the menus, built from the same content the `/uk` page
 * itself renders (`@/data/courses`) rather than a second hardcoded list.
 *
 * Without this, a missing or empty database doesn't just lose the DB-backed
 * copy — it silently drops the dropdown chevron too, since `NavMenu` renders
 * a plain link once its item list is empty. A visitor sees "Destinations"
 * and "Courses" as flat links with no menu at all, even though the site has
 * exactly the content to fill one. This keeps the header interactive on a
 * fresh deploy, an unseeded database, or a database outage; real rows always
 * take priority once they exist.
 */
const FALLBACK_NAVIGATION: Navigation = {
  destinations: [
    {
      slug: PRIMARY_DESTINATION,
      name: "United Kingdom",
      flagEmoji: "🇬🇧",
      live: true,
      detail: "1-year Master's, 2-year graduate visa",
    },
  ],
  hubs: staticCourseHubs
    .filter((c) => c.countrySlug === PRIMARY_DESTINATION)
    .map((h) => ({
      slug: h.slug,
      name: h.name,
      href: `/${PRIMARY_DESTINATION}/courses/${h.slug}`,
      live: !h.isStub,
      tuition: h.tuitionRange ?? null,
      icon: h.icon,
      oneLiner: h.oneLiner,
    })),
};

export const getNavigation = cache(async (): Promise<Navigation> => {
  // The chrome renders on pages that need no database at all (/login,
  // /about, /faq). A missing or unreachable database must degrade the menus
  // to the static fallback, not take down every page that has a header.
  if (!isDatabaseConfigured()) return FALLBACK_NAVIGATION;

  try {
    const [destinations, hubs] = await Promise.all([
      getDestinations(),
      getCourseHubs(PRIMARY_DESTINATION),
    ]);

    return {
      destinations:
        destinations.length > 0
          ? destinations.map((d) => ({
              slug: d.slug,
              name: d.name,
              flagEmoji: d.flagEmoji,
              live: d.status === "live",
              detail: d.tagline,
            }))
          : FALLBACK_NAVIGATION.destinations,
      hubs:
        hubs.length > 0
          ? hubs.map((h) => ({
              slug: h.slug,
              name: h.name,
              href: `/${PRIMARY_DESTINATION}/courses/${h.slug}`,
              live: h.status === "live",
              tuition: formatMoneyRange(
                { min: h.tuitionMin, max: h.tuitionMax, currency: h.currency },
                { suffix: "/year", compact: true },
              ),
              icon: h.icon,
              oneLiner: h.oneLiner,
            }))
          : FALLBACK_NAVIGATION.hubs,
    };
  } catch (error) {
    console.error("[nav] falling back to static menus", error);
    return FALLBACK_NAVIGATION;
  }
});
