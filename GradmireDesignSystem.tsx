// Gradmire design-system components (Next.js + Tailwind, TypeScript)
// Drop into /components, wire up the tokens from tailwind.config.tokens.ts first.
// Each component is self-contained (no external UI lib) so you can copy piecemeal.

import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

/* ---------------------------------------------------------------- */
/* Header                                                            */
/* ---------------------------------------------------------------- */
export function SiteHeader() {
  const links = [
    { href: "/#destinations", label: "Destinations" },
    { href: "/#courses", label: "Courses" },
    { href: "/#tools", label: "Tools" },
    { href: "/about", label: "About" },
    { href: "/faq", label: "FAQ" },
  ];
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-7 py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-semibold text-ink">
          <span className="inline-block h-2 w-2 rounded-full bg-coral" />
          Gradmire
        </Link>
        <nav className="hidden gap-8 text-sm font-medium md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-ink transition hover:text-coral">
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-pill bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition hover:-translate-y-0.5 hover:bg-coral"
        >
          Book Consultation <ArrowRight size={14} />
        </Link>
      </div>
    </header>
  );
}

/* ---------------------------------------------------------------- */
/* Departure board — the signature hero element                     */
/* ---------------------------------------------------------------- */
export type DepartureRow = {
  subject: string;
  topUniversity: string;
  unis: string;
  status: "open" | "soon";
};

export function DepartureBoard({ rows }: { rows: DepartureRow[] }) {
  return (
    <div className="relative rounded-2xl bg-ink p-6 shadow-2xl" role="img" aria-label="Live board of course subjects and application status">
      <div className="pointer-events-none absolute inset-2 rounded-xl border border-white/10" />
      <div className="mb-2 flex items-center justify-between border-b border-dashed border-white/20 pb-4">
        <span className="font-mono text-xs uppercase tracking-widest text-white">
          Gradmire <span className="text-gold font-semibold">Departures</span> · UK
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-300">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Live intake
        </span>
      </div>
      <div className="grid grid-cols-[1.6fr_2.6fr_1.2fr] gap-2 px-1 pt-3 pb-2 font-mono text-[10px] uppercase tracking-widest text-white/40">
        <span>Subject</span><span>Top University</span><span>Status</span>
      </div>
      {rows.map((r) => (
        <div key={r.subject} className="grid grid-cols-[1.6fr_2.6fr_1.2fr] items-center gap-2 rounded-lg px-1 py-2.5 hover:bg-white/[0.04]">
          <span className="rounded bg-ink-2 px-2 py-1.5 font-mono text-[13px] text-white shadow-inner">{r.subject}</span>
          <span className="rounded bg-ink-2 px-2 py-1.5 font-mono text-[13px] text-white shadow-inner">{r.topUniversity}</span>
          <span
            className={`rounded px-2 py-1 text-center font-mono text-[10px] uppercase tracking-wide ${
              r.status === "open" ? "bg-emerald-400/15 text-emerald-300" : "bg-amber-400/15 text-amber-300"
            }`}
          >
            {r.status === "open" ? "Open" : "Soon"}
          </span>
        </div>
      ))}
      <div className="mt-3 flex justify-between border-t border-dashed border-white/20 pt-4 font-mono text-[10px] uppercase tracking-widest text-white/40">
        <span>September 2026 intake</span>
        <span>{rows.length} subjects tracked</span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Course card — "boarding pass"                                     */
/* ---------------------------------------------------------------- */
export function CoursePassCard({
  code,
  name,
  description,
  unis,
  href,
}: {
  code: string;
  name: string;
  description: string;
  unis: number | "soon";
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl bg-paper text-ink shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
    >
      <div className="p-5 pb-4">
        <span className={`mb-2.5 block font-mono text-[11px] uppercase tracking-widest ${unis === "soon" ? "text-ink-soft" : "text-coral"}`}>
          {code}
        </span>
        <h3 className="mb-2.5 min-h-[3rem] font-display text-lg leading-tight">{name}</h3>
        <p className="min-h-[4rem] text-[13px] text-ink-soft">{description}</p>
      </div>
      {/* perforation */}
      <div className="relative border-t-2 border-dashed border-line">
        <span className="absolute -left-2.5 -top-2.5 h-5 w-5 rounded-full bg-ink" />
        <span className="absolute -right-2.5 -top-2.5 h-5 w-5 rounded-full bg-ink" />
      </div>
      <div className="flex items-center justify-between p-5 pt-4">
        <div className="font-mono">
          <b className="block text-[15px] text-ink">{unis === "soon" ? "—" : `${unis} unis`}</b>
          <span className="text-[10px] uppercase tracking-wider text-ink-soft">{unis === "soon" ? "Guide soon" : "Ranked hub"}</span>
        </div>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-white transition group-hover:bg-coral">
          <ArrowRight size={15} />
        </span>
      </div>
    </Link>
  );
}

/* ---------------------------------------------------------------- */
/* Destination card — "passport stamp"                               */
/* ---------------------------------------------------------------- */
export function DestinationCard({
  flag,
  name,
  description,
  stampLabel,
  href,
  live = false,
}: {
  flag: string;
  name: string;
  description: string;
  stampLabel: string;
  href: string;
  live?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-2xl p-6 shadow-lg ${
        live
          ? "bg-gradient-to-br from-ink via-ink-3 to-coral text-white"
          : "justify-between border border-dashed border-line bg-paper-dim text-ink"
      }`}
    >
      <span
        className={`absolute right-5 top-5 flex h-16 w-16 rotate-[9deg] items-center justify-center rounded-full border-2 text-center font-mono text-[9px] uppercase leading-tight ${
          live ? "border-white/50 text-white/80" : "border-ink-soft text-ink-soft -rotate-[8deg]"
        }`}
      >
        {stampLabel}
      </span>
      <div>
        <div className="mb-3.5 text-3xl">{flag}</div>
        <h3 className="mb-1.5 font-display text-xl">{name}</h3>
        <p className="max-w-[26ch] text-[13.5px] opacity-85">{description}</p>
      </div>
      <span className={`mt-4 inline-flex items-center gap-2 text-[13.5px] font-semibold ${live ? "" : "text-ink-soft font-medium"}`}>
        {live ? "Explore courses" : "Coming soon"} {live && <ArrowRight size={13} />}
      </span>
    </Link>
  );
}

/* ---------------------------------------------------------------- */
/* Footer                                                             */
/* ---------------------------------------------------------------- */
export function SiteFooter() {
  const columns: { title: string; links: { label: string; href: string }[] }[] = [
    { title: "Destinations", links: [{ label: "🇬🇧 United Kingdom", href: "/uk" }, { label: "More coming: US, CA, AU", href: "#" }] },
    {
      title: "Popular Courses",
      links: [
        { label: "Business & Management", href: "/uk/courses/business-management" },
        { label: "CS, AI & Data Science", href: "/uk/courses/computer-science-ai-data-science" },
        { label: "Engineering & Technology", href: "/uk/courses/engineering-technology" },
      ],
    },
    {
      title: "Tools",
      links: [
        { label: "Course Finder", href: "/tools/course-finder" },
        { label: "ROI Calculator", href: "/tools/roi-calculator" },
        { label: "Deadline Tracker", href: "/tools/deadline-tracker" },
      ],
    },
    { title: "Company", links: [{ label: "About", href: "/about" }, { label: "Contact", href: "/contact" }, { label: "FAQ", href: "/faq" }] },
  ];
  return (
    <footer className="bg-ink text-white/70">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 border-b border-white/10 px-7 py-14 md:grid-cols-5">
        <div className="col-span-2">
          <span className="flex items-center gap-2 font-display text-xl font-semibold text-white">
            <span className="inline-block h-2 w-2 rounded-full bg-coral" /> Gradmire
          </span>
          <p className="mt-3 max-w-[30ch] text-[13.5px] text-white/55">
            Study abroad, organized by subject — not by flag.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="mb-4 font-mono text-xs uppercase tracking-wider text-white">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-[13.5px] hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-7 py-6 text-[12.5px]">
        <span>© 2026 Gradmire. All rights reserved.</span>
        <span>Made for students, one subject at a time.</span>
      </div>
    </footer>
  );
}
