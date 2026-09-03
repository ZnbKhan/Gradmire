/**
 * Cross-cutting configuration. Anything that was previously repeated as a
 * literal in more than one file belongs here, so rolling out a second
 * destination or changing a cache window is one edit rather than a search.
 *
 * Safe to import from both server and client components: no secrets, and
 * every value is serialisable (icons are referenced by name, not component).
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gradmire.com";

/**
 * The destination V1 leads with. The homepage board, the contact form's
 * course list and the header's course menu all key off this rather than a
 * literal "uk", so a second live destination is a config change.
 *
 * Note this is the *default* surface only — `/[country]` pages are driven
 * entirely by the `destinations` table and need no change here.
 */
export const PRIMARY_DESTINATION = "uk";

/** How long cached content reads and ISR pages stay warm. */
export const CONTENT_REVALIDATE_SECONDS = 3600;

/** Rows on the homepage departures board. */
export const BOARD_ROW_LIMIT = 6;

/**
 * Where enquiries are sent, and the address shown to a visitor when the
 * lead form itself fails. Mirrors the env var the deploy sets so the two
 * cannot drift.
 */
export const CONTACT_EMAIL =
  process.env.LEADS_NOTIFICATION_EMAIL ?? "hello@gradmire.com";

/**
 * The four tools, in the order they are offered. Consumed by both the
 * header menu and the footer column; `icon` is a lucide icon name resolved
 * by the client that renders it.
 */
export const TOOLS = [
  {
    href: "/tools/course-finder",
    label: "Course Finder",
    description: "A short quiz that shortlists subject hubs for you.",
    icon: "Compass",
  },
  {
    href: "/tools/roi-calculator",
    label: "ROI Calculator",
    description: "Weigh tuition and living costs against likely salary.",
    icon: "Calculator",
  },
  {
    href: "/tools/comparator",
    label: "Comparator",
    description: "Compare course hubs side by side.",
    icon: "Scale",
  },
  {
    href: "/tools/deadline-tracker",
    label: "Deadline Tracker",
    description: "Shortlist hubs and track their application deadlines.",
    icon: "CalendarClock",
  },
] as const;

/** Nav entries with no sub-menu, shared by the header and footer. */
export const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
] as const;

/* ------------------------------------------------------------------ */
/* Intakes                                                             */
/* ------------------------------------------------------------------ */

/** The months UK postgraduate courses actually start, in calendar order. */
const INTAKE_MONTHS = [
  { month: 0, label: "January" },
  { month: 8, label: "September" },
] as const;

/**
 * Applications close well before an intake starts, so an intake stops being
 * offerable roughly this far ahead of its start date.
 */
const INTAKE_LEAD_MONTHS = 3;

/**
 * The intakes a visitor can still realistically apply for, soonest first.
 *
 * Generated rather than listed: a hardcoded "September 2026" is correct for
 * one year and quietly wrong afterwards, and the form, the homepage board
 * and the admin placeholder all showed different hardcoded years.
 */
export function upcomingIntakes(now: Date = new Date(), count = 3): string[] {
  const cutoff = new Date(now);
  cutoff.setMonth(cutoff.getMonth() + INTAKE_LEAD_MONTHS);

  const options: string[] = [];
  for (let yearOffset = 0; options.length < count && yearOffset < 5; yearOffset++) {
    const year = now.getFullYear() + yearOffset;
    for (const { month, label } of INTAKE_MONTHS) {
      if (options.length >= count) break;
      // Compare against the 1st of the intake month.
      if (new Date(year, month, 1) >= cutoff) options.push(`${label} ${year}`);
    }
  }
  return options;
}

/** The intake the homepage board advertises. */
export function currentIntake(now: Date = new Date()): string {
  return upcomingIntakes(now, 1)[0] ?? "";
}
