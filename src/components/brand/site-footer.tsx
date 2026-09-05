import Link from "next/link";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { getNavigation } from "@/lib/nav";
import { TOOLS, COMPANY_LINKS } from "@/config/site";
import { Container } from "@/components/ui/container";

/** How many live course hubs the footer highlights. */
const FEATURED_HUB_COUNT = 3;

type Column = { title: string; links: { label: string; href: string }[] };

/**
 * Server component: reads the same destination/hub data as the header menu
 * (see `@/lib/nav`) instead of a hardcoded "UK only, these 3 courses" copy
 * that silently went stale the moment content changed.
 */
export async function SiteFooter() {
  const nav = await getNavigation();

  const liveDestinations = nav.destinations.filter((d) => d.live);
  const comingSoon = nav.destinations.filter((d) => !d.live);
  const liveHubs = nav.hubs.filter((h) => h.live).slice(0, FEATURED_HUB_COUNT);

  const columns: Column[] = [
    {
      title: "Destinations",
      links: [
        ...liveDestinations.map((d) => ({
          label: d.flagEmoji ? `${d.flagEmoji} ${d.name}` : d.name,
          href: `/${d.slug}`,
        })),
        ...(comingSoon.length > 0
          ? [
              {
                label: `More coming: ${comingSoon.map((d) => d.name).join(", ")}`,
                href: liveDestinations[0] ? `/${liveDestinations[0].slug}` : "/",
              },
            ]
          : []),
      ],
    },
    {
      title: "Popular courses",
      links: liveHubs.map((h) => ({ label: h.name, href: h.href })),
    },
    {
      title: "Tools",
      links: TOOLS.map((t) => ({ label: t.label, href: t.href })),
    },
    {
      title: "Company",
      links: [...COMPANY_LINKS, { href: "/portal", label: "My applications" }],
    },
  ];

  return (
    <footer className="bg-ink text-paper/70">
      <Container className="gutter">
        <div className="grid grid-cols-2 gap-8 border-b border-white/10 py-[60px] md:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
            <span className="flex items-center gap-2.5 font-display text-[21px] font-semibold text-white">
              <span aria-hidden="true" className="h-[9px] w-[9px] rounded-full bg-coral" />
              Gradmire
            </span>
            <p className="mt-3 max-w-[30ch] text-body text-paper/60">
              Study abroad, organized by subject — not by flag.
            </p>
            <NewsletterForm className="mt-5" />
          </div>

          {columns
            .filter((col) => col.links.length > 0)
            .map((col) => (
              <div key={col.title}>
                <h2 className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.09em] text-white">
                  {col.title}
                </h2>
                {/* Inline links gave a 19px tap target. On phones each becomes
                    a full-width block instead; desktop keeps the tighter list. */}
                <ul className="sm:space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="block py-3 text-body hover:text-white sm:py-0"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 py-6 text-meta">
          <span>© {new Date().getFullYear()} Gradmire. All rights reserved.</span>
          <span className="flex gap-5">
            <Link href="/privacy" className="py-2 hover:text-white">Privacy</Link>
            <Link href="/terms" className="py-2 hover:text-white">Terms</Link>
          </span>
        </div>
      </Container>
    </footer>
  );
}
