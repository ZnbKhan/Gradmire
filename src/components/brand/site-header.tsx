import { getNavigation } from "@/lib/nav";
import { PRIMARY_DESTINATION } from "@/config/site";
import { SiteNav } from "@/components/brand/site-nav";

/**
 * Server half of the header: fetches the destination and course lists so the
 * menus reflect the database rather than a hardcoded copy, then hands them
 * to the client component that owns the interaction.
 *
 * The prop contract is unchanged, so every page keeps rendering
 * `<SiteHeader signedIn={…} />` with no knowledge of where nav data comes
 * from. Reads are cached and tagged, so this is a cache hit per render.
 */
export async function SiteHeader({ signedIn = false }: { signedIn?: boolean }) {
  const nav = await getNavigation();

  return (
    <SiteNav nav={nav} signedIn={signedIn} primaryDestination={PRIMARY_DESTINATION} />
  );
}
