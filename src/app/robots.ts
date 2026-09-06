import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";

const base = SITE_URL;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/portal", "/login", "/signup", "/auth"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
