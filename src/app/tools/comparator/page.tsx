import type { Metadata } from "next";
import { SiteHeader } from "@/components/brand/site-header";
import { SiteFooter } from "@/components/brand/site-footer";
import { getHubsForTools } from "@/lib/tool-data";
import ComparatorPage from "./tool-client";

export const metadata: Metadata = {
  title: "Compare courses",
  alternates: { canonical: "/tools/comparator" },
};

export const revalidate = 3600;

export default async function Page() {
  const hubs = await getHubsForTools();
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
