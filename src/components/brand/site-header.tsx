import { getNavigation } from "@/lib/nav";
import { PRIMARY_DESTINATION } from "@/config/site";
import { SiteNav } from "@/components/brand/site-nav";

/**
 * Server half of the header: fetches the destination and course lists so the
 * menus reflect the database rather than a hardcoded copy, then hands them
 * to the client component that owns the interaction. Reads are cached and
 * tagged, so this is a cache hit per render.
 *
 * It takes no `signedIn` prop. It used to, and every page had to read the
 * auth cookie on the server to supply it — which made those pages per-user
 * and cost the homepage its static rendering. `SiteNav` now resolves the
 * session in the browser instead.
 */
export async function SiteHeader() {
  const nav = await getNavigation();

  return <SiteNav nav={nav} primaryDestination={PRIMARY_DESTINATION} />;
}
