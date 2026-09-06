import type { MetadataRoute } from "next";
import { getAllHubPaths, getDestinations } from "@/lib/queries";
import { SITE_URL, TOOLS, COMPANY_LINKS } from "@/config/site";

const base = SITE_URL;

/** Static, always-indexable routes — pulled from the same config the nav renders. */
const STATIC_PATHS = [
  "",
  ...COMPANY_LINKS.map((l) => l.href),
  ...TOOLS.map((t) => t.href),
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = STATIC_PATHS.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  try {
    const [destinations, hubs] = await Promise.all([getDestinations(), getAllHubPaths()]);

    // Only live destinations and published hubs belong in the sitemap.
    const destinationRoutes = destinations
      .filter((d) => d.status === "live")
      .map((d) => ({
        url: `${base}/${d.slug}`,
        lastModified: d.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.9,
      }));

    const hubRoutes = hubs
      .filter((h) => h.status === "live")
      .map((h) => ({
        url: `${base}/${h.destination}/courses/${h.hub}`,
        lastModified: h.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      }));

    return [...staticRoutes, ...destinationRoutes, ...hubRoutes];
  } catch (error) {
    // If database is unavailable (build time), return static routes only
    console.warn("Database unavailable for sitemap generation, returning static routes only", error);
    return staticRoutes;
  }
}
