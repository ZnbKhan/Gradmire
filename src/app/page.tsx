import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/brand/site-header";
import { SiteFooter } from "@/components/brand/site-footer";
import { CoursePassCard } from "@/components/brand/course-pass-card";
import { getDestinations, getCourseHubs } from "@/lib/queries";
import { PRIMARY_DESTINATION } from "@/config/site";

// Next requires route segment config to be a literal it can statically
// extract, so this cannot reference CONTENT_REVALIDATE_SECONDS directly.
// Keep it equal to that constant in @/config/site.
export const revalidate = 3600;

const STEPS = [
  {
    title: "Tell us your interest",
    body: "Share your subject area, academic background, and career goals.",
  },
  {
    title: "Get your shortlist",
    body: "We match you to the strongest programmes and universities for your profile.",
  },
  {
    title: "Application support",
    body: "SOP reviews, interview prep, and document tracking, handled together.",
  },
  {
    title: "Visa guidance",
    body: "Step-by-step support through ATAS, CAS, and financial documentation.",
  },
];

const WHY_UK = [
  { stat: "1 year", label: "Master's degrees — a year less than the US or Canada" },
  { stat: "2 years", label: "Graduate Route post-study work visa (3 for PhD)" },
  { stat: "4 of 10", label: "Of the world's top ten universities" },
  { stat: "Direct", label: "Teaching-intensive courses with industry links" },
];

export default async function HomePage() {
  // Nothing here reads cookies or headers, which is what keeps this page
  // statically rendered and served from the CDN. `getSessionUser()` used to
  // sit in this list to tell the header whether to say "Sign in" or "My
  // applications"; that single cookie read made the whole route dynamic, and
  // it was the only page on the site that missed the cache. The header
  // resolves the session in the browser now — see `SiteNav`.
  const [destinations, hubs] = await Promise.all([
    getDestinations(),
    getCourseHubs(PRIMARY_DESTINATION),
  ]);

  const liveHubCount = hubs.filter((h) => h.status === "live").length;

  return (
    <>
      <SiteHeader />

      <main id="main">
        {/* ---------- Hero ---------- */}
        <section className="px-7 pb-10 pt-16">
          <div className="mx-auto max-w-[1180px]">
            <div className="max-w-[640px]">
              <span className="eyebrow">Study abroad, reordered</span>
              <h1 className="my-[18px] max-w-[15ch] text-[clamp(34px,4.6vw,58px)] font-semibold leading-[1.05]">
                Find your course. Then find{" "}
                <em className="font-medium italic text-coral">the UK</em> around it.
              </h1>
              <p className="mb-[30px] max-w-[46ch] text-[17.5px] text-ink-soft">
                Most platforms start with &ldquo;pick a country.&rdquo; We start with what
                actually shapes your career — your subject. Get matched to programmes
                first, then the universities and cities built around them.
              </p>
              <div className="mb-[34px] flex flex-wrap gap-3.5">
                <Link
                  href="#courses"
                  className="inline-flex items-center gap-2 rounded-pill bg-coral px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_22px_-10px_rgba(228,57,14,0.55)] transition-transform hover:-translate-y-0.5"
                >
                  Find my course
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
                <Link
                  href="/tools/course-finder"
                  className="inline-flex items-center gap-2 rounded-pill border-[1.5px] border-ink px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:bg-ink hover:text-paper"
                >
                  Take the quiz
                </Link>
              </div>
              <p className="text-[13.5px] text-ink-soft">
                {liveHubCount} UK subject hubs live · {hubs.length - liveHubCount} in
                research
              </p>
            </div>
          </div>
        </section>

        {/* ---------- Why the UK ---------- */}
        <section className="px-7 py-16">
          <div className="mx-auto max-w-[1180px]">
            <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {WHY_UK.map((item) => (
                <div key={item.stat} className="bg-paper p-6">
                  <p className="font-display text-[28px] font-semibold text-ink">
                    {item.stat}
                  </p>
                  <p className="mt-1.5 text-[13.5px] text-ink-soft">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Destinations ---------- */}
        <section id="destinations" className="px-7 py-[70px]">
          <div className="mx-auto max-w-[1180px]">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
              <div>
                <span className="eyebrow">Study destinations</span>
                <h2 className="mt-2.5 max-w-[20ch] text-[clamp(26px,3vw,36px)] font-semibold">
                  Where will you study?
                </h2>
              </div>
              <p className="max-w-[38ch] text-[15px] text-ink-soft">
                We&rsquo;re building the most comprehensive course-first platform, one
                destination at a time. The UK is live now.
              </p>
            </div>

            <div className="grid gap-4.5 md:grid-cols-2 lg:grid-cols-[1.3fr_repeat(3,1fr)]">
              {destinations.map((d) =>
                d.status === "live" ? (
                  <Link
                    key={d.id}
                    href={`/${d.slug}`}
                    className="group relative flex min-h-[290px] flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br from-ink via-ink-3 to-coral p-6 text-white shadow-card"
                  >
                    <span className="absolute right-5 top-5 flex h-16 w-16 rotate-[9deg] items-center justify-center rounded-full border-2 border-white/50 text-center font-mono text-[9.5px] uppercase leading-tight tracking-[0.06em] text-white/80">
                      {d.stampLabel}
                      <br />
                      Entry
                    </span>
                    <div>
                      <div aria-hidden="true" className="mb-3.5 text-[30px]">
                        {d.flagEmoji}
                      </div>
                      <h3 className="mb-1.5 text-[23px] font-semibold">{d.name}</h3>
                      <p className="max-w-[26ch] text-[13.5px] opacity-85">
                        {d.tagline}. Live now — {hubs.length} subject hubs.
                      </p>
                    </div>
                    <span className="mt-4 inline-flex items-center gap-2 text-[13.5px] font-semibold">
                      Explore courses
                      <ArrowRight size={13} aria-hidden="true" />
                    </span>
                  </Link>
                ) : (
                  <div
                    key={d.id}
                    className="relative flex min-h-[290px] flex-col justify-between rounded-2xl border border-dashed border-line bg-paper-dim p-6 text-ink"
                  >
                    <span className="absolute right-5 top-5 flex h-16 w-16 -rotate-[8deg] items-center justify-center rounded-full border-2 border-ink-soft text-center font-mono text-[9.5px] uppercase leading-tight tracking-[0.06em] text-ink-soft">
                      {d.stampLabel}
                      <br />
                      Soon
                    </span>
                    <div>
                      <div aria-hidden="true" className="mb-3.5 text-[30px]">
                        {d.flagEmoji}
                      </div>
                      <h3 className="mb-1.5 text-[23px] font-semibold">{d.name}</h3>
                      <p className="max-w-[26ch] text-[13.5px] text-ink-soft">
                        {d.tagline}
                      </p>
                    </div>
                    <span className="mt-4 text-[13.5px] font-medium text-ink-soft">
                      Coming soon
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        {/* ---------- Courses ---------- */}
        <section
          id="courses"
          className="bg-ink px-7 py-[70px] text-paper [--perf-bg:var(--ink)]"
        >
          <div className="mx-auto max-w-[1180px]">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
              <div>
                <span className="eyebrow !text-gold before:!bg-gold">
                  Browse by course
                </span>
                <h2 className="mt-2.5 max-w-[20ch] text-[clamp(26px,3vw,36px)] font-semibold text-white">
                  What do you want to study?
                </h2>
              </div>
              <p className="max-w-[38ch] text-[15px] text-paper/60">
                Every hub carries subject rankings, fees, deadlines and career outcomes.
              </p>
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
                  href={`/${PRIMARY_DESTINATION}/courses/${hub.slug}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ---------- How it works ---------- */}
        <section className="px-7 py-[74px]">
          <div className="mx-auto max-w-[1180px]">
            <div className="mb-10">
              <span className="eyebrow">The journey</span>
              <h2 className="mt-2.5 max-w-[20ch] text-[clamp(26px,3vw,36px)] font-semibold">
                Four stages, one boarding pass
              </h2>
            </div>
            {/* Numbered because this is a real sequence — each stage depends on the last. */}
            <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step, i) => (
                <li key={step.title}>
                  <div className="mb-5 flex h-[68px] w-[68px] items-center justify-center rounded-full border-[1.5px] border-ink font-display text-[22px]">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="mb-2 text-[17px] font-semibold">{step.title}</h3>
                  <p className="text-[13.5px] text-ink-soft">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- Final CTA ---------- */}
        <section className="px-7 pb-[90px] pt-5">
          <div className="mx-auto max-w-[1180px]">
            <div className="relative overflow-hidden rounded-3xl bg-ink px-8 py-14 text-center">
              <span className="eyebrow justify-center !text-gold before:!bg-gold">
                Ready when you are
              </span>
              <h2 className="mx-auto mb-4 mt-3 max-w-[16ch] text-[clamp(28px,3.6vw,42px)] font-semibold text-white">
                Ready to find your course?
              </h2>
              <p className="mx-auto mb-8 max-w-[42ch] text-[15px] text-paper/60">
                Book a free consultation. We&rsquo;ll help you shortlist the right
                programmes and guide you through every step, deadline to visa.
              </p>
              <div className="flex flex-wrap justify-center gap-3.5">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-pill bg-white px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:bg-gold hover:text-white"
                >
                  Book free consultation
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
                <Link
                  href="/tools/course-finder"
                  className="inline-flex items-center gap-2 rounded-pill border-[1.5px] border-white/35 px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Try course finder
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
