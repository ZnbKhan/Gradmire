import type { Metadata } from "next";
import { SiteHeader } from "@/components/brand/site-header";
import { SiteFooter } from "@/components/brand/site-footer";
import { getHubsForTools } from "@/lib/tool-data";
import DeadlineTrackerPage from "./tool-client";

export const metadata: Metadata = {
  title: "Deadline Tracker",
  alternates: { canonical: "/tools/deadline-tracker" },
};

export const revalidate = 3600;

export default async function Page() {
  const hubs = await getHubsForTools();
  return (
    <>
      <SiteHeader />
      <main id="main">
        <DeadlineTrackerPage hubs={hubs} />
      </main>
      <SiteFooter />
    </>
  );
}
