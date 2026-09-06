import type { Metadata } from "next";
import type { CourseHub } from "@/data/courses";
import { SiteHeader } from "@/components/brand/site-header";
import { SiteFooter } from "@/components/brand/site-footer";
import { getHubsForTools } from "@/lib/tool-data";
import ComparatorPage from "./tool-client";

export const metadata: Metadata = {
  title: "Compare courses",
  alternates: { canonical: "/tools/comparator" },
};

// Next requires route segment config to be a literal it can statically
// extract, so this cannot reference CONTENT_REVALIDATE_SECONDS directly.
// Keep it equal to that constant in @/config/site.
export const revalidate = 3600;

export default async function Page() {
  let hubs: CourseHub[] = [];
  try {
    hubs = await getHubsForTools();
  } catch (error) {
    // If database is unavailable (build time), use empty array
    // The client component will use fallback data from courseHubs
    console.warn("Database unavailable for Comparator, using fallback data", error);
  }
  return (
    <>
      <SiteHeader />
      <main id="main">
        <ComparatorPage hubs={hubs} />
      </main>
      <SiteFooter />
    </>
  );
}
