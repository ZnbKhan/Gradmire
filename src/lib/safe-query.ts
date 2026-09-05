import "server-only";

/**
 * Runs a content read that its page can render without.
 *
 * `src/lib/nav.ts` already degrades this way, so a database outage leaves the
 * header and footer standing. Without the same treatment at the page level
 * the result was lopsided: the chrome survived while the body threw, taking
 * `/`, `/contact` and `/[country]` to the crash page.
 *
 * Deliberately applied per call site rather than inside `queries.ts`, because
 * "survivable" is a property of the page, not of the query:
 *
 *   - `getDestination` / `getCourseHub` drive `notFound()`. Degrading them to
 *     null would answer an outage with a 404, telling search engines the page
 *     is gone rather than to come back.
 *   - `getAllHubPaths` builds the sitemap and `generateStaticParams`. An empty
 *     array there would publish an empty sitemap, or build a site with no
 *     course pages, and never say so.
 *
 * Those must keep throwing. This is only for the supporting lists.
 */
export async function optionalContent<T>(
  label: string,
  read: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await read();
  } catch (error) {
    console.error(`[content] ${label} unavailable, rendering without it`, error);
    return fallback;
  }
}
