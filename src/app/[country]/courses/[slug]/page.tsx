import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, AlertTriangle } from "lucide-react";
import { SiteHeader } from "@/components/brand/site-header";
import { SiteFooter } from "@/components/brand/site-footer";
import { getCourseHub, getAllHubPaths, formatRange } from "@/lib/queries";
import { isDatabaseConfigured } from "@/db";

// Next requires route segment config to be a literal it can statically
// extract, so this cannot reference CONTENT_REVALIDATE_SECONDS directly.
// Keep it equal to that constant in @/config/site.
export const revalidate = 3600;

export async function generateStaticParams() {
  if (!isDatabaseConfigured()) return [];
  const paths = await getAllHubPaths();
  return paths.map((p) => ({ country: p.destination, slug: p.hub }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; slug: string }>;
}): Promise<Metadata> {
  const { country, slug } = await params;
  const hub = await getCourseHub(country, slug);
  if (!hub) return {};

  const tuition = formatRange(hub.tuitionMin, hub.tuitionMax, hub.currency, {
    suffix: "/year",
  });
  return {
    title: `${hub.name} in the ${hub.destination.name}`,
    description:
      hub.oneLiner ??
      `${hub.name} master's courses in the ${hub.destination.name}${tuition ? ` — tuition ${tuition}` : ""}.`,
    alternates: { canonical: `/${country}/courses/${slug}` },
    robots: hub.status === "stub" ? { index: false, follow: true } : undefined,
  };
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.07em] text-ink-soft">
        {label}
      </span>
      <span className="font-display text-[22px] font-semibold">{value}</span>
    </div>
  );
}

export default async function CourseHubPage({
  params,
}: {
  params: Promise<{ country: string; slug: string }>;
}) {
  const { country, slug } = await params;
  const hub = await getCourseHub(country, slug);
  if (!hub) notFound();

  const tuition = formatRange(hub.tuitionMin, hub.tuitionMax, hub.currency, {
    compact: true,
  });
  const living = formatRange(hub.livingCostMin, hub.livingCostMax, hub.currency, {
    compact: true,
    suffix: "/mo",
  });
  const salary = formatRange(hub.salaryMin, hub.salaryMax, hub.currency, {
    compact: true,
  });
  const ielts =
    hub.ieltsMin && hub.ieltsMax && hub.ieltsMin !== hub.ieltsMax
      ? `${hub.ieltsMin}–${hub.ieltsMax}`
      : hub.ieltsMin ?? null;

  const atasLabel =
    hub.atasRequirement === "no"
      ? "No"
      : hub.atasRequirement === "yes"
        ? "Yes"
        : "Per course";

  if (hub.status === "stub") {
    return (
      <>
        <SiteHeader />
        <main id="main" className="px-7 py-24">
          <div className="mx-auto max-w-[52ch] text-center">
            <span className="eyebrow justify-center">Guide in research</span>
            <h1 className="mb-4 mt-3 text-[clamp(30px,4vw,44px)] font-semibold">
              {hub.name}
            </h1>
            <p className="mb-8 text-[16px] text-ink-soft">
              {hub.oneLiner} We&rsquo;re still verifying rankings, fees and deadlines
              for this subject — we publish a hub only once the figures are sourced.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-pill bg-ink px-6 py-3.5 text-[15px] font-semibold text-paper transition-colors hover:bg-coral"
            >
              Talk to a counselor anyway
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main id="main">
        {/* Boarding-pass stub breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="border-b border-dashed border-line px-7 py-5"
        >
          <ol className="mx-auto flex max-w-[1180px] items-center gap-2.5 font-mono text-xs uppercase tracking-[0.06em] text-ink-soft">
            <li><Link href="/" className="hover:text-ink">Gradmire</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href={`/${country}`} className="hover:text-ink">{hub.destination.stampLabel}</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-ink">{hub.name}</li>
          </ol>
        </nav>

        <section className="px-7 pb-11 pt-12">
          <div className="mx-auto grid max-w-[1180px] items-end gap-11 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <span className="eyebrow">Course hub · {hub.code}</span>
              <h1 className="my-4 text-[clamp(32px,4vw,50px)] font-semibold leading-[1.06]">
                {hub.name} in the {hub.destination.name}
              </h1>
              <p className="max-w-[56ch] text-[16px] text-ink-soft">{hub.oneLiner}</p>
            </div>

            <dl className="rounded-2xl bg-ink p-6 font-mono text-white">
              {[
                ["Tuition", tuition ? `${tuition}/yr` : "—"],
                ["Living costs", living ?? "—"],
                ["IELTS", ielts ?? "—"],
                ["Post-study visa", `${hub.graduateRouteYears} yrs Graduate Route`],
                ["ATAS required", atasLabel],
              ].map(([label, value], i, arr) => (
                <div
                  key={label}
                  className={`flex items-center justify-between gap-4 py-2.5 text-[12.5px] ${
                    i < arr.length - 1 ? "border-b border-dashed border-white/15" : ""
                  }`}
                >
                  <dt className="text-white/70">{label}</dt>
                  <dd className="font-semibold text-gold">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {hub.overview && (
          <section className="px-7 pb-4">
            <div className="mx-auto max-w-[1180px]">
              <p className="max-w-[68ch] text-[16px] leading-relaxed text-ink-soft">
                {hub.overview}
              </p>
            </div>
          </section>
        )}

        {/* Universities */}
        {hub.universities.length > 0 && (
          <section className="px-7 py-11">
            <div className="mx-auto max-w-[1180px]">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <h2 className="text-[26px] font-semibold">
                  Top universities for {hub.name.split(" ")[0]}
                </h2>
                <span className="font-mono text-xs uppercase tracking-wide text-ink-soft">
                  Subject-ranked, not overall rank
                </span>
              </div>
              <div className="overflow-x-auto rounded-2xl border border-line">
                <table className="w-full min-w-[560px] border-collapse text-sm">
                  <thead>
                    <tr>
                      {["University", "Notable for", "Subject rank (UK)"].map((h) => (
                        <th
                          key={h}
                          scope="col"
                          className="border-b border-ink bg-white px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-ink-soft"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {hub.universities.map((u) => (
                      <tr key={u.id} className="bg-white hover:bg-paper-dim">
                        <td className="border-b border-line px-4 py-3.5 font-semibold">
                          {u.name}
                        </td>
                        <td className="border-b border-line px-4 py-3.5 text-ink-soft">
                          {u.notableFor}
                        </td>
                        <td className="border-b border-line px-4 py-3.5">
                          {u.subjectRank && (
                            <span className="rounded-pill bg-coral-dim px-2.5 py-1 font-mono text-[11px] font-semibold text-coral-text">
                              {u.subjectRank}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {hub.sources && hub.sources.length > 0 && (
                <p className="mt-3 font-mono text-[11px] uppercase tracking-wide text-ink-soft">
                  {hub.sources[0].label}
                </p>
              )}
            </div>
          </section>
        )}

        {/* Fees & entry */}
        <section className="px-7 py-11">
          <div className="mx-auto max-w-[1180px]">
            <h2 className="mb-6 text-[26px] font-semibold">Fees &amp; entry requirements</h2>
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="grid gap-4 sm:grid-cols-2">
                {tuition && <Stat label="Tuition" value={tuition} />}
                {living && <Stat label="Living costs" value={living} />}
              </div>
              {hub.entryRequirements && hub.entryRequirements.length > 0 && (
                <ul>
                  {hub.entryRequirements.map((req) => (
                    <li
                      key={req}
                      className="border-b border-line py-3 text-[14.5px] text-ink"
                    >
                      {req}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {hub.deadlines.length > 0 && (
              <div className="mt-8 space-y-3">
                {hub.deadlines.map((d) => (
                  <div key={d.id}>
                    <div className="flex items-start gap-3.5 rounded-2xl bg-gold px-5 py-4 text-[14px] font-semibold text-ink">
                      <CalendarDays size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
                      <span>
                        {d.label}: {d.detail}
                      </span>
                    </div>
                    {d.warning && (
                      <p className="mt-2 flex items-start gap-2 rounded-lg border-l-[3px] border-coral bg-coral-dim px-4 py-3 text-[13.5px] text-ink">
                        <AlertTriangle size={16} className="mt-0.5 shrink-0 text-coral-text" aria-hidden="true" />
                        {d.warning}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Careers */}
        <section className="px-7 py-11">
          <div className="mx-auto max-w-[1180px]">
            <div className="rounded-3xl bg-ink p-9 text-white">
              <h2 className="text-[26px] font-semibold text-white">Career outcomes</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {salary && (
                  <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
                    <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.07em] text-white/60">
                      Starting salary
                    </span>
                    <span className="font-display text-[22px] font-semibold">{salary}</span>
                  </div>
                )}
                {hub.topSectors && hub.topSectors.length > 0 && (
                  <div className="rounded-2xl border border-white/15 bg-white/5 p-5 sm:col-span-1 lg:col-span-3">
                    <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.07em] text-white/60">
                      Top hiring sectors
                    </span>
                    <span className="font-display text-[16px]">
                      {hub.topSectors.join(" · ")}
                    </span>
                  </div>
                )}
              </div>

              {hub.commonEmployers && hub.commonEmployers.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-2.5">
                  {hub.commonEmployers.map((e) => (
                    <li
                      key={e}
                      className="rounded-pill bg-white/10 px-3.5 py-2 font-mono text-[12.5px]"
                    >
                      {e}
                    </li>
                  ))}
                </ul>
              )}

              {hub.visaNotes && hub.visaNotes.length > 0 && (
                <ul className="mt-6 space-y-2">
                  {hub.visaNotes.map((n) => (
                    <li
                      key={n}
                      className="rounded-r-lg border-l-[3px] border-gold bg-white/10 px-4 py-3 text-[14px]"
                    >
                      {n}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-7 pb-20 pt-4">
          <div className="mx-auto max-w-[1180px]">
            <div className="rounded-3xl bg-brandgreen p-10 text-center text-white">
              <h2 className="mb-2.5 text-[28px] font-semibold text-white">
                Get a shortlist for {hub.name}
              </h2>
              <p className="mx-auto mb-6 max-w-[46ch] text-[15px] text-white/85">
                Free 20-minute consultation with a counselor who specializes in this
                subject.
              </p>
              <Link
                href={`/contact?course=${hub.slug}`}
                className="inline-flex items-center gap-2 rounded-pill bg-white px-6 py-3.5 text-[15px] font-semibold text-ink transition-transform hover:-translate-y-0.5"
              >
                Book free consultation
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
