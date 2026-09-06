import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/brand/site-header";
import { SiteFooter } from "@/components/brand/site-footer";
import { CoursePassCard } from "@/components/brand/course-pass-card";
import { Reveal } from "@/components/motion/reveal";
import { CountUp } from "@/components/motion/count-up";
import { getDestinations, getCourseHubs } from "@/lib/queries";
import { optionalContent } from "@/lib/safe-query";
import { PRIMARY_DESTINATION } from "@/config/site";
import { Container } from "@/components/ui/container";
import { Cta } from "@/components/ui/cta";
import { UniversityCard } from "@/components/ui/university-card";
import { CityCard } from "@/components/ui/city-card";
import { TestimonialCard } from "@/components/ui/testimonial-card";
import { PathTimeline } from "@/components/ui/path-timeline";
import { HeroStatRail, type HeroStat } from "@/components/ui/hero-stat-rail";

// Same three facts as `WHY_UK` below, compressed to a chip-length label.
// Kept as a distinct list rather than mapped from `WHY_UK` at render time so
// the two can be edited independently — the hero chip needs a short label,
// the grid tile below it a fuller sentence, and coupling them would make an
// edit to one silently reword the other.
const HERO_STATS: HeroStat[] = [
  { icon: "graduation", value: "1 year", label: "Shorter Master's degrees" },
  { icon: "plane", value: "2 years", label: "Graduate Route work visa" },
  { icon: "trophy", value: "4 of 10", label: "World's top ten universities" },
];

// Mock destinations data for all study destinations
const DESTINATIONS_DATA = [
  {
    id: "1",
    name: "United Kingdom",
    slug: "uk",
    flagEmoji: "🇬🇧",
    stampLabel: "UK",
    tagline: "1-year master's degrees. Live now — 8 subject hubs.",
    status: "live",
  },
  {
    id: "2",
    name: "United States",
    slug: "us",
    flagEmoji: "🇺🇸",
    stampLabel: "US",
    tagline: "World's largest higher education system",
    status: "coming-soon",
  },
  {
    id: "3",
    name: "Canada",
    slug: "ca",
    flagEmoji: "🇨🇦",
    stampLabel: "CA",
    tagline: "Pathway to permanent residency",
    status: "coming-soon",
  },
  {
    id: "4",
    name: "Australia",
    slug: "au",
    flagEmoji: "🇦🇺",
    stampLabel: "AU",
    tagline: "Top 5 international student destination",
    status: "coming-soon",
  },
];

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

// Mock university data
const TOP_UNIVERSITIES = [
  {
    name: "University of Oxford",
    city: "Oxford",
    ranking: 1,
    tuitionFees: "£25-30k",
    employability: 96,
    imageUrl:
      "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=500&h=500&fit=crop",
  },
  {
    name: "University of Cambridge",
    city: "Cambridge",
    ranking: 2,
    tuitionFees: "£25-30k",
    employability: 95,
    imageUrl:
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=500&h=500&fit=crop",
  },
  {
    name: "LSE",
    city: "London",
    ranking: 3,
    tuitionFees: "£28-35k",
    employability: 97,
    imageUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=500&fit=crop",
  },
  {
    name: "University of Manchester",
    city: "Manchester",
    ranking: 6,
    tuitionFees: "£18-24k",
    employability: 92,
    imageUrl:
      "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=500&h=500&fit=crop",
  },
];

// Mock UK cities data
const UK_CITIES = [
  {
    name: "London",
    description: "Vibrant capital with endless opportunities and cultural diversity",
    universities: 22,
    imageUrl:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&h=400&fit=crop",
  },
  {
    name: "Manchester",
    description: "Creative hub known for innovation and world-class research",
    universities: 5,
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&q=85",
  },
  {
    name: "Edinburgh",
    description: "Historic city blending heritage with cutting-edge research",
    universities: 4,
    imageUrl:
      "https://images.unsplash.com/photo-1565008576549-bdcd6d60b69e?w=600&h=400&fit=crop&q=85",
  },
  {
    name: "Birmingham",
    description: "Second city with strong engineering and business schools",
    universities: 3,
    imageUrl:
      "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=600&h=400&fit=crop",
  },
];

// Mock course hubs data
const COURSE_HUBS = [
  {
    id: "1",
    code: "BUS·MGT",
    name: "Business & Management",
    oneLiner: "From MBAs to specialist Master's in Finance and Marketing, the UK offers some of the most respected business education in the world — often completed in a single year.",
    universityCount: 6,
    status: "live",
    slug: "business-management",
  },
  {
    id: "2",
    code: "CS·AI·DS",
    name: "Computer Science, AI & Data Science",
    oneLiner: "Home to some of Europe's strongest CS research departments and a fast-growing tech job market, especially in London, Cambridge, and Edinburgh.",
    universityCount: 6,
    status: "live",
    slug: "computer-science-ai-data-science",
  },
  {
    id: "3",
    code: "ENG·TEC",
    name: "Engineering & Technology",
    oneLiner: "Strong in mechanical, civil, electrical, and increasingly renewable/clean energy engineering, with close ties to UK industry and infrastructure projects.",
    universityCount: 6,
    status: "live",
    slug: "engineering-technology",
  },
  {
    id: "4",
    code: "MED·HLT",
    name: "Medicine, Nursing & Health Sciences",
    oneLiner: "World-renowned medical schools, NHS clinical placements, and globally recognized qualifications.",
    universityCount: 5,
    status: "live",
    slug: "medicine-nursing-health",
  },
  {
    id: "5",
    code: "LAW",
    name: "Law",
    oneLiner: "Study in one of the world's most influential legal systems, with access to top law firms and the Inns of Court.",
    universityCount: 5,
    status: "stub",
    slug: "law",
  },
  {
    id: "6",
    code: "ARC·DES",
    name: "Architecture & Design",
    oneLiner: "From the Bartlett to the AA, the UK is home to some of the world's most prestigious architecture and design schools.",
    universityCount: 4,
    status: "stub",
    slug: "architecture-design",
  },
  {
    id: "7",
    code: "ECON",
    name: "Economics",
    oneLiner: "Strong quantitative training with pathways into finance, policy, and consulting at top departments like LSE and Warwick.",
    universityCount: 4,
    status: "stub",
    slug: "economics",
  },
  {
    id: "8",
    code: "PSYC",
    name: "Psychology",
    oneLiner: "BPS-accredited programmes with research-intensive training and clinical placement opportunities.",
    universityCount: 4,
    status: "stub",
    slug: "psychology",
  },
  {
    id: "9",
    code: "STEM",
    name: "Other STEM",
    oneLiner: "From physics and chemistry to biology and environmental science, explore diverse STEM programmes across the UK.",
    universityCount: 5,
    status: "stub",
    slug: "other-stem",
  },
];

// Mock testimonials data
const STUDENT_TESTIMONIALS = [
  {
    studentName: "Sarah Chen",
    university: "University of Cambridge",
    course: "Computer Science",
    quote:
      "Gradmire helped me find the perfect course match before I even thought about universities. The personalized guidance was incredible.",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 5,
  },
  {
    studentName: "James Mitchell",
    university: "LSE",
    course: "Economics",
    quote:
      "The application support and visa guidance saved me months of stress. Highly recommend for any international student.",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 5,
  },
  {
    studentName: "Priya Patel",
    university: "University of Manchester",
    course: "Engineering",
    quote:
      "Finding the right UK university seemed daunting, but Gradmire made it simple and supportive throughout.",
    imageUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    rating: 5,
  },
];

export default async function HomePage() {
  // Nothing here reads cookies or headers, which is what keeps this page
  // statically rendered and served from the CDN. `getSessionUser()` used to
  // sit in this list to tell the header whether to say "Sign in" or "My
  // applications"; that single cookie read made the whole route dynamic, and
  // it was the only page on the site that missed the cache. The header
  // resolves the session in the browser now — see `SiteNav`.
  // Both lists are supporting content: the page still sells without them, so
  // a database outage degrades the sections rather than serving a crash page.
  const [destinations, hubs] = await Promise.all([
    optionalContent("homepage destinations", () => getDestinations(), []),
    optionalContent("homepage course hubs", () => getCourseHubs(PRIMARY_DESTINATION), []),
  ]);

  // Use mock data as fallback if database returns empty
  const finalDestinations = destinations.length > 0 ? destinations : DESTINATIONS_DATA;
  const finalHubs = hubs.length > 0 ? hubs : COURSE_HUBS;

  return (
    <>
      <SiteHeader />

      <main id="main">
        {/* ---------- Hero ----------
            Text column is plain server-rendered markup with no entrance
            animation — the headline is this page's LCP candidate, and
            Chrome does not count an element painted at opacity 0 as an LCP
            candidate (see the note in `Reveal`). Only the photo and its
            floating stat chips, which are decorative, get motion, and that
            motion lives in the client-only `HeroStatRail`. The photo column
            is `lg:`-only: a background photograph earns its place once
            there is room for it beside the copy, not as extra weight on a
            360px download. */}
        <section className="gutter overflow-hidden pb-10 pt-16">
          <Container>
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_minmax(0,440px)]">
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
                  <Cta
                    href="#courses"
                    variant="coral"
                    className="shadow-[0_10px_22px_-10px_rgba(228,57,14,0.55)]"
                  >
                    Find my course
                    <ArrowRight size={15} aria-hidden="true" />
                  </Cta>
                  <Cta href="/tools/course-finder" variant="outline">
                    Take the quiz
                  </Cta>
                </div>
                {finalHubs.length > 0 && (
                  <p className="text-body text-ink-soft">
                    {finalHubs.filter((h) => h.status === "live").length} UK subject hubs live · {finalHubs.filter((h) => h.status !== "live").length} in
                    research
                  </p>
                )}
              </div>

              <div className="relative hidden lg:block">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] shadow-board">
                  <Image
                    src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1000&h=1250&fit=crop&q=80"
                    alt="A student walking beside the Thames with Big Ben and the Houses of Parliament behind her"
                    fill
                    priority
                    sizes="440px"
                    className="object-cover"
                  />
                  {/* Anchors the floating chips to something legible: without
                      it the bottom third of the photo is unpredictable and
                      the cards read fine over sky but not over stone. */}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                </div>

                <div className="absolute inset-x-5 bottom-5">
                  <HeroStatRail stats={HERO_STATS} />
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ---------- Why the UK ---------- */}
        <section className="gutter py-16">
          <Container>
            {/* Revealed as one block, not per tile: the grid's gaps are its
                own background showing through, so fading the tiles
                individually would flash a bare line-coloured slab. */}
            <Reveal className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {WHY_UK.map((item) => (
                <div key={item.stat} className="bg-paper p-6">
                  <p className="font-display text-[28px] font-semibold text-ink">
                    <CountUp value={item.stat} />
                  </p>
                  <p className="mt-1.5 text-body text-ink-soft">{item.label}</p>
                </div>
              ))}
            </Reveal>
          </Container>
        </section>

        {/* ---------- Destinations ---------- */}
        <section id="destinations" className="gutter py-[70px]">
          <Container>
            <Reveal group className="mb-10 flex flex-wrap items-end justify-between gap-6">
              <div>
                <span className="eyebrow">Study destinations</span>
                <h2 className="mt-2.5 max-w-[20ch] text-[clamp(26px,3vw,36px)] font-semibold">
                  Where will you study?
                </h2>
              </div>
              <p className="max-w-[38ch] text-lede text-ink-soft">
                We&rsquo;re building the most comprehensive course-first platform, one
                destination at a time. The UK is live now.
              </p>
            </Reveal>

            <Reveal group className="grid gap-4.5 md:grid-cols-2 lg:grid-cols-[1.3fr_repeat(3,1fr)]">
              {finalDestinations.map((d) =>
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
                      <p className="max-w-[26ch] text-body opacity-85">
                        {d.tagline}
                      </p>
                    </div>
                    <span className="mt-4 inline-flex items-center gap-2 text-body font-semibold">
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
                      <p className="max-w-[26ch] text-body text-ink-soft">
                        {d.tagline}
                      </p>
                    </div>
                    <span className="mt-4 text-body font-medium text-ink-soft">
                      Coming soon
                    </span>
                  </div>
                ),
              )}
            </Reveal>
          </Container>
        </section>

        {/* ---------- Courses ---------- */}
        <section
          id="courses"
          className="bg-ink gutter py-[70px] text-paper [--perf-bg:var(--ink)]"
        >
          <Container>
            <Reveal group className="mb-10 flex flex-wrap items-end justify-between gap-6">
              <div>
                <span className="eyebrow !text-gold before:!bg-gold">
                  Browse by course
                </span>
                <h2 className="mt-2.5 max-w-[20ch] text-[clamp(26px,3vw,36px)] font-semibold text-white">
                  What do you want to study?
                </h2>
              </div>
              <p className="max-w-[38ch] text-lede text-paper/60">
                Every hub carries subject rankings, fees, deadlines and career outcomes.
              </p>
            </Reveal>

            <Reveal group step={55} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {finalHubs.map((hub) => (
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
            </Reveal>
          </Container>
        </section>

        {/* ---------- How it works ---------- */}
        <section className="gutter py-[74px]">
          <Container>
            <Reveal group className="mb-10">
              <span className="eyebrow">The journey</span>
              <h2 className="mt-2.5 max-w-[20ch] text-[clamp(26px,3vw,36px)] font-semibold">
                Four stages, one boarding pass
              </h2>
            </Reveal>
            {/* Numbered because this is a real sequence — each stage depends on the last. */}
            <Reveal as="ol" group step={110} className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step, i) => (
                <li key={step.title}>
                  <div className="mb-5 flex h-[68px] w-[68px] items-center justify-center rounded-full border-[1.5px] border-ink font-display text-[22px]">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="mb-2 text-[17px] font-semibold">{step.title}</h3>
                  <p className="text-body text-ink-soft">{step.body}</p>
                </li>
              ))}
            </Reveal>
          </Container>
        </section>

        {/* ---------- Top Universities ---------- */}
        <section className="gutter py-[70px]">
          <Container>
            <Reveal group className="mb-10">
              <span className="eyebrow">Featured universities</span>
              <h2 className="mt-2.5 max-w-[20ch] text-[clamp(26px,3vw,36px)] font-semibold">
                Top-ranked options
              </h2>
            </Reveal>

            <Reveal group step={50} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {TOP_UNIVERSITIES.map((uni) => (
                <UniversityCard
                  key={uni.name}
                  name={uni.name}
                  city={uni.city}
                  ranking={uni.ranking}
                  tuitionFees={uni.tuitionFees}
                  employability={uni.employability}
                  imageUrl={uni.imageUrl}
                />
              ))}
            </Reveal>
          </Container>
        </section>

        {/* ---------- UK Cities ---------- */}
        <section className="gutter py-[70px] bg-paper-dim">
          <Container>
            <Reveal group className="mb-10">
              <span className="eyebrow">Study destinations</span>
              <h2 className="mt-2.5 max-w-[20ch] text-[clamp(26px,3vw,36px)] font-semibold">
                Explore UK cities
              </h2>
            </Reveal>

            <Reveal group step={50} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {UK_CITIES.map((city) => (
                <CityCard
                  key={city.name}
                  name={city.name}
                  description={city.description}
                  universities={city.universities}
                  imageUrl={city.imageUrl}
                />
              ))}
            </Reveal>
          </Container>
        </section>

        {/* ---------- Student Success Stories ---------- */}
        <section className="gutter py-[70px]">
          <Container>
            <Reveal group className="mb-10">
              <span className="eyebrow">Success stories</span>
              <h2 className="mt-2.5 max-w-[20ch] text-[clamp(26px,3vw,36px)] font-semibold">
                Student testimonials
              </h2>
            </Reveal>

            <Reveal group step={50} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {STUDENT_TESTIMONIALS.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.studentName}
                  studentName={testimonial.studentName}
                  university={testimonial.university}
                  course={testimonial.course}
                  quote={testimonial.quote}
                  imageUrl={testimonial.imageUrl}
                  rating={testimonial.rating}
                />
              ))}
            </Reveal>
          </Container>
        </section>

        {/* ---------- Find Your Path Timeline ---------- */}
        <section className="gutter py-[70px] bg-gradient-to-b from-ink/5 to-coral-dim/20">
          <Container>
            <Reveal group className="mb-12">
              <span className="eyebrow justify-center">Your journey</span>
              <h2 className="mx-auto mt-2.5 max-w-[20ch] text-center text-[clamp(26px,3vw,36px)] font-semibold">
                Find your path to UK education
              </h2>
              <p className="mx-auto mt-4 max-w-[50ch] text-center text-ink-soft">
                Seven simple steps from your interest to your dream university
              </p>
            </Reveal>

            <Reveal className="mt-16">
              <PathTimeline />
            </Reveal>
          </Container>
        </section>

        {/* ---------- Final CTA ---------- */}
        <section className="gutter pb-[90px] pt-5">
          <Container>
            <Reveal className="relative overflow-hidden rounded-3xl bg-ink px-8 py-14 text-center">
              <span className="eyebrow justify-center !text-gold before:!bg-gold">
                Ready when you are
              </span>
              <h2 className="mx-auto mb-4 mt-3 max-w-[16ch] text-[clamp(28px,3.6vw,42px)] font-semibold text-white">
                Ready to find your course?
              </h2>
              <p className="mx-auto mb-8 max-w-[42ch] text-lede text-paper/60">
                Book a free consultation. We&rsquo;ll help you shortlist the right
                programmes and guide you through every step, deadline to visa.
              </p>
              <div className="flex flex-wrap justify-center gap-3.5">
                <Cta
                  href="/contact"
                  variant="onDark"
                  className="hover:bg-gold hover:text-white"
                >
                  Book free consultation
                  <ArrowRight size={15} aria-hidden="true" />
                </Cta>
                <Cta
                  href="/tools/course-finder"
                  variant="outline"
                  className="border-white/35 text-white hover:bg-white/10 hover:text-white"
                >
                  Try course finder
                </Cta>
              </div>
            </Reveal>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
