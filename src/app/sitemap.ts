import type { MetadataRoute } from "next";
import { getAllHubPaths, getDestinations } from "@/lib/queries";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gradmire.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [destinations, hubs] = await Promise.all([getDestinations(), getAllHubPaths()]);

  const staticRoutes = ["", "/about", "/faq", "/contact", "/tools/course-finder", "/tools/roi-calculator", "/tools/comparator", "/tools/deadline-tracker"].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    }),
  );

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
}
