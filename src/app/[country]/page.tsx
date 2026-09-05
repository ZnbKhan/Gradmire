import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/brand/site-header";
import { SiteFooter } from "@/components/brand/site-footer";
import { CoursePassCard } from "@/components/brand/course-pass-card";
import { getDestination, getDestinations, getCourseHubs } from "@/lib/queries";
import { optionalContent } from "@/lib/safe-query";
import { isDatabaseConfigured } from "@/db";
import { PRIMARY_DESTINATION } from "@/config/site";
import { Container } from "@/components/ui/container";
import { Cta } from "@/components/ui/cta";

// Next requires route segment config to be a literal it can statically
// extract, so this cannot reference CONTENT_REVALIDATE_SECONDS directly.
// Keep it equal to that constant in @/config/site.
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
    const primary = await getDestination(PRIMARY_DESTINATION);
    const primaryHubs = primary
      ? await optionalContent(
          "coming-soon teaser hubs",
          () => getCourseHubs(primary.slug),
          [],
        )
      : [];

    return (
      <>
        <SiteHeader />
        <main id="main" className="gutter py-24">
          <div className="mx-auto max-w-[52ch] text-center">
            <div aria-hidden="true" className="mb-6 text-5xl">
              {destination.flagEmoji}
            </div>
            <span className="eyebrow justify-center">Not yet open</span>
            <h1 className="mb-4 mt-3 text-[clamp(30px,4vw,44px)] font-semibold">
              {destination.name} guides are in research
            </h1>
            {primary && (
              <p className="mb-8 text-[16px] text-ink-soft">
                We build one destination at a time so each subject guide carries
                real ranking, fee and deadline data rather than a directory
                listing. {primary.name} is live now with {primaryHubs.length}{" "}
                subject {primaryHubs.length === 1 ? "hub" : "hubs"}.
              </p>
            )}
            {primary && (
              <Cta href={`/${primary.slug}`}>
                Explore {primary.name} courses
                <ArrowRight size={15} aria-hidden="true" />
              </Cta>
            )}
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  const hubs = await optionalContent(
    `${country} course hubs`,
    () => getCourseHubs(country),
    [],
  );

  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="gutter pb-12 pt-16">
          <Container>
            <span className="eyebrow">Study destination</span>
            <h1 className="my-4 max-w-[16ch] text-[clamp(34px,4.6vw,54px)] font-semibold leading-[1.06]">
              Study in the {destination.name}
            </h1>
            <p className="max-w-[54ch] text-[17px] text-ink-soft">
              {destination.tagline}. Pick your subject below — every hub carries
              subject-level rankings, real fee ranges, deadline windows and graduate
              salary bands.
            </p>
          </Container>
        </section>

        {hubs.length > 0 && (
        <section
          id="courses"
          className="bg-ink gutter py-[70px] text-paper [--perf-bg:var(--ink)]"
        >
          <Container>
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
                  universityCount={hub.universityCount}
                  isStub={hub.status === "stub"}
                  href={`/${country}/courses/${hub.slug}`}
                />
              ))}
            </div>
          </Container>
        </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
