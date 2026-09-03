import "server-only";
import { cache } from "react";
import { getDestinations, getCourseHubs } from "@/lib/queries";
import { PRIMARY_DESTINATION } from "@/config/site";
import { formatMoneyRange } from "@/lib/money";
import { isDatabaseConfigured } from "@/db";

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
};

export type Navigation = {
  destinations: NavDestination[];
  hubs: NavHub[];
};

const EMPTY: Navigation = { destinations: [], hubs: [] };

export const getNavigation = cache(async (): Promise<Navigation> => {
  // The chrome renders on pages that need no database at all (/login,
  // /about, /faq). A missing or unreachable database must degrade the menus
  // to their top-level links, not take down every page that has a header.
  if (!isDatabaseConfigured()) return EMPTY;

  try {
    const [destinations, hubs] = await Promise.all([
      getDestinations(),
      getCourseHubs(PRIMARY_DESTINATION),
    ]);

    return {
      destinations: destinations.map((d) => ({
        slug: d.slug,
        name: d.name,
        flagEmoji: d.flagEmoji,
        live: d.status === "live",
        detail: d.tagline,
      })),
      hubs: hubs.map((h) => ({
        slug: h.slug,
        name: h.name,
        href: `/${PRIMARY_DESTINATION}/courses/${h.slug}`,
        live: h.status === "live",
        tuition: formatMoneyRange(
          { min: h.tuitionMin, max: h.tuitionMax, currency: h.currency },
          { suffix: "/year", compact: true },
        ),
      })),
    };
  } catch (error) {
    console.error("[nav] falling back to top-level links", error);
    return EMPTY;
  }
});
