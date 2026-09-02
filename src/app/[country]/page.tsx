import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/brand/site-header";
import { SiteFooter } from "@/components/brand/site-footer";
import { CoursePassCard } from "@/components/brand/course-pass-card";
import { getDestination, getDestinations, getCourseHubs } from "@/lib/queries";
import { isDatabaseConfigured } from "@/db";

export const revalidate = 3600;

export async function generateStaticParams() {
  if (!isDatabaseConfigured()) return [];
  const destinations = await getDestinations();
  return destinations.map((d) => ({ country: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country } = await params;
  const destination = await getDestination(country);
  if (!destination) return {};

  const live = destination.status === "live";
  return {
    title: live
      ? `Study in the ${destination.name} — courses by subject`
      : `${destination.name} — coming soon`,
    description: live
      ? `Compare ${destination.name} master's courses by subject: fees, entry requirements, deadlines and graduate salaries.`
      : `Gradmire is building course-first guides for the ${destination.name}. The UK is live now.`,
    alternates: { canonical: `/${destination.slug}` },
    robots: live ? undefined : { index: false, follow: true },
  };
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const destination = await getDestination(country);
  if (!destination) notFound();

  /*
   * V1 covers the UK only. Other destinations are real routes so the
   * "coming soon" cards link somewhere honest, but they carry no course
   * content and are excluded from indexing.
   */
  if (destination.status !== "live") {
    return (
      <>
        <SiteHeader />
        <main id="main" className="px-7 py-24">
          <div className="mx-auto max-w-[52ch] text-center">
            <div aria-hidden="true" className="mb-6 text-5xl">
              {destination.flagEmoji}
            </div>
            <span className="eyebrow justify-center">Not yet open</span>
            <h1 className="mb-4 mt-3 text-[clamp(30px,4vw,44px)] font-semibold">
              {destination.name} guides are in research
            </h1>
            <p className="mb-8 text-[16px] text-ink-soft">
              We build one destination at a time so each subject guide carries real
              ranking, fee and deadline data rather than a directory listing. The
              United Kingdom is live now with eight subject hubs.
            </p>
            <Link
              href="/uk"
              className="inline-flex items-center gap-2 rounded-pill bg-ink px-6 py-3.5 text-[15px] font-semibold text-paper transition-colors hover:bg-coral"
            >
              Explore UK courses
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  const hubs = await getCourseHubs(country);

  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="px-7 pb-12 pt-16">
          <div className="mx-auto max-w-[1180px]">
            <span className="eyebrow">Study destination</span>
            <h1 className="my-4 max-w-[16ch] text-[clamp(34px,4.6vw,54px)] font-semibold leading-[1.06]">
              Study in the {destination.name}
            </h1>
            <p className="max-w-[54ch] text-[17px] text-ink-soft">
              {destination.tagline}. Pick your subject below — every hub carries
              subject-level rankings, real fee ranges, deadline windows and graduate
              salary bands.
            </p>
          </div>
        </section>

        <section
          id="courses"
          className="bg-ink px-7 py-[70px] text-paper [--perf-bg:var(--ink)]"
        >
          <div className="mx-auto max-w-[1180px]">
            <div className="mb-10">
              <span className="eyebrow !text-gold before:!bg-gold">Browse by course</span>
              <h2 className="mt-2.5 text-[clamp(26px,3vw,36px)] font-semibold text-white">
                {hubs.length} subject hubs
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {hubs.map((hub) => (
                <CoursePassCard
                  key={hub.id}
                  code={hub.code}
                  name={hub.name}
                  description={hub.oneLiner}
                  universityCount={hub.universities.length}
                  isStub={hub.status === "stub"}
                  href={`/${country}/courses/${hub.slug}`}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
