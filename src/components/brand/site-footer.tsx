import Link from "next/link";
import { NewsletterForm } from "@/components/forms/newsletter-form";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Destinations",
    links: [
      { label: "🇬🇧 United Kingdom", href: "/uk" },
      { label: "More coming: US, CA, AU", href: "/uk" },
    ],
  },
  {
    title: "Popular courses",
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
      { label: "Comparator", href: "/tools/comparator" },
      { label: "Deadline Tracker", href: "/tools/deadline-tracker" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "My applications", href: "/portal" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-ink text-paper/70">
      <div className="mx-auto max-w-[1180px] px-7">
        <div className="grid grid-cols-2 gap-8 border-b border-white/10 py-[60px] md:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
            <span className="flex items-center gap-2.5 font-display text-[21px] font-semibold text-white">
              <span aria-hidden="true" className="h-[9px] w-[9px] rounded-full bg-coral" />
              Gradmire
            </span>
            <p className="mt-3 max-w-[30ch] text-[13.5px] text-paper/60">
              Study abroad, organized by subject — not by flag.
            </p>
            <NewsletterForm className="mt-5" />
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h2 className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.09em] text-white">
                {col.title}
              </h2>
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

        <div className="flex flex-wrap items-center justify-between gap-3 py-6 text-[12.5px]">
          <span>© {new Date().getFullYear()} Gradmire. All rights reserved.</span>
          <span className="flex gap-5">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
