import type { Metadata } from "next";
import { SiteHeader } from "@/components/brand/site-header";
import { SiteFooter } from "@/components/brand/site-footer";
import { getHubsForTools } from "@/lib/tool-data";
import ROICalculatorPage from "./tool-client";

export const metadata: Metadata = {
  title: "ROI Calculator",
  alternates: { canonical: "/tools/roi-calculator" },
};

export const revalidate = 3600;

export default async function Page() {
  const hubs = await getHubsForTools();
  return (
    <>
      <SiteHeader />
      <main id="main">
        <ROICalculatorPage hubs={hubs} />
      </main>
      <SiteFooter />
    </>
  );
}
