"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  Compass,
  Calculator,
  Scale,
  CalendarClock,
  BookOpen,
  Briefcase,
  Cpu,
  Wrench,
  Heart,
  PenTool,
  TrendingUp,
  Brain,
  type LucideIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { TOOLS, COMPANY_LINKS } from "@/config/site";
import { createClient } from "@/lib/supabase/client";
import type { Navigation } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Cta } from "@/components/ui/cta";
import { Logo } from "@/components/brand/logo";

/**
 * The interactive half of the header. Nav content arrives as props from the
 * server component so this stays free of any hardcoded destination or
 * course list — see `@/lib/nav`.
 */

/** Config carries icon *names* so it stays serialisable; resolve them here. */
const ICON_MAP: Record<string, LucideIcon> = {
  Compass,
  Calculator,
  Scale,
  CalendarClock,
  Briefcase,
  Cpu,
  Wrench,
  Heart,
  PenTool,
  TrendingUp,
  Brain,
};

const TOOL_ICONS = ICON_MAP;

const triggerCls =
  "group flex items-center gap-1.5 rounded-pill px-3.5 py-2 text-[14.5px] font-semibold text-ink outline-none transition-all duration-200 hover:text-coral-text data-[state=open]:text-coral-text hover:bg-coral-dim/50 data-[state=open]:bg-coral-dim/50 focus-visible:ring-2 focus-visible:ring-coral/50 focus-visible:ring-offset-2";

/**
 * Whether someone is signed in, resolved in the browser.
 *
 * The server deliberately does not read the auth cookie to render the chrome.
 * Doing so made every page carrying a header per-user, which opted the
 * homepage out of static rendering entirely — it was the only route on the
 * site that missed the CDN cache. Starting at `false` means a signed-in
 * visitor sees "Sign in" for a moment before it swaps, which is a cosmetic
 * cost for a page that now serves from the edge.
 *
 * This gates a label, not access: /portal and /admin are enforced in the
 * middleware and again on the server.
 */
function useSignedIn() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    // Reads the cached session locally — no request to Supabase.
    void supabase.auth.getSession().then(({ data }) => {
      setSignedIn(Boolean(data.session));
    });

    // Keeps the label honest when the user signs out in another tab.
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session));
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return signedIn;
}

function Chevron() {
  return (
    <ChevronDown
      size={14}
      aria-hidden="true"
      className="transition-transform group-data-[state=open]:rotate-180"
    />
  );
}

/** A menu whose items are all coming-soon renders as a plain link instead. */
function NavMenu({
  label,
  fallbackHref,
  hasItems,
  children,
}: {
  label: string;
  fallbackHref: string;
  hasItems: boolean;
  children: React.ReactNode;
}) {
  if (!hasItems) {
    return (
      <Link
        href={fallbackHref}
        className="rounded-pill px-3 py-2 text-[14.5px] font-medium text-ink transition-colors hover:text-coral-text"
      >
        {label}
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={triggerCls}>
        {label}
        <Chevron />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="min-w-[340px] shadow-xl border border-line/60 bg-white rounded-xl animate-in fade-in slide-in-from-top-2 duration-200"
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SiteNav({
  nav,
  primaryDestination,
}: {
  nav: Navigation;
  /** Where "Destinations" and "Courses" point when their menus are empty. */
  primaryDestination: string;
}) {
  const [open, setOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const signedIn = useSignedIn();

  function toggleMobileSection(label: string) {
    setMobileSection((current) => (current === label ? null : label));
  }

  const destinationsHref = `/${primaryDestination}`;
  const coursesHref = `/${primaryDestination}#courses`;

  // The header is opaque on purpose. It used to be translucent over a
  // blurred backdrop, and a full-width sticky backdrop filter makes the
  // browser re-blur the strip behind it on every scroll frame — the largest
  // single cause of scroll jank here. At 90% opacity it was barely visible.
  // A later pass re-added `backdrop-blur-md` here (and a blanket `nav,
  // header { backdrop-filter }` rule in globals.css) without noticing this
  // comment, quietly undoing the fix. Removed again — see that rule's
  // removal for the other half.
  return (
    <header className="sticky top-0 z-50 bg-paper/90 after:absolute after:inset-x-0 after:top-full after:h-3 after:bg-gradient-to-b after:from-ink/[0.06] after:to-transparent after:content-['']">
      <Container className="gutter mx-auto flex items-center justify-between gap-3 py-4">
        <Link href="/" className="flex shrink-0 items-center transition-opacity hover:opacity-75" aria-label="Gradmire home">
          <Logo variant="navy" size="md" className="h-10 w-auto" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-[6px] lg:flex">
          <NavMenu
            label="Destinations"
            fallbackHref={destinationsHref}
            hasItems={nav.destinations.length > 0}
          >
            {nav.destinations.map((d) =>
              d.live ? (
                <DropdownMenuItem key={d.slug} asChild className="group/item">
                  <Link href={`/${d.slug}`} className="transition-all duration-200 px-4 py-3.5 flex items-start gap-3 rounded-lg hover:bg-coral-dim/30 active:bg-coral-dim/50 cursor-pointer group">
                    {d.flagEmoji && (
                      <span aria-hidden="true" className="text-xl leading-none transition-transform duration-200 group-hover:scale-120 flex-shrink-0 mt-0.5">
                        {d.flagEmoji}
                      </span>
                    )}
                    <span className="flex-1 min-w-0">
                      <span className="block font-semibold text-ink text-[14.5px] transition-colors duration-200 group-hover:text-coral">{d.name}</span>
                      {d.detail && (
                        <span className="block text-[12px] text-ink-soft mt-0.5 group-hover:text-ink-soft/80 transition-colors duration-200">{d.detail}</span>
                      )}
                    </span>
                    <span className="rounded-full bg-brandgreen/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-brandgreen transition-all duration-200 font-bold flex-shrink-0 whitespace-nowrap">
                      LIVE
                    </span>
                  </Link>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem key={d.slug} disabled className="opacity-50 cursor-not-allowed px-4 py-3.5 flex items-start gap-3 rounded-lg group">
                  {d.flagEmoji && (
                    <span aria-hidden="true" className="text-xl leading-none opacity-60 flex-shrink-0 mt-0.5">
                      {d.flagEmoji}
                    </span>
                  )}
                  <span className="flex-1 min-w-0">
                    <span className="block font-semibold text-ink-soft text-[14.5px]">{d.name}</span>
                    {d.detail && (
                      <span className="block text-[12px] text-ink-soft/70 mt-0.5">{d.detail}</span>
                    )}
                  </span>
                  <span className="rounded-full bg-paper-dim px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-soft/70 flex-shrink-0 whitespace-nowrap">
                    SOON
                  </span>
                </DropdownMenuItem>
              ),
            )}
          </NavMenu>

          <NavMenu
            label="Courses"
            fallbackHref={coursesHref}
            hasItems={nav.hubs.length > 0}
          >
            {(() => {
              const liveHubs = nav.hubs.filter((h) => h.live);
              const comingSoonHubs = nav.hubs.filter((h) => !h.live);

              return (
                <>
                  {liveHubs.length > 0 && (
                    <>
                      {liveHubs.map((hub) => {
                        const Icon = hub.icon ? ICON_MAP[hub.icon] : BookOpen;
                        return (
                          <DropdownMenuItem key={hub.slug} asChild className="group/course">
                            <Link href={hub.href} className="transition-all duration-200 px-4 py-3.5 flex items-start gap-3 rounded-lg hover:bg-coral-dim/30 active:bg-coral-dim/50 cursor-pointer group">
                              <Icon
                                size={18}
                                aria-hidden="true"
                                className="mt-0.5 shrink-0 text-coral-text transition-all duration-200 group-hover:scale-110"
                              />
                              <span className="flex-1 min-w-0">
                                <span className="block font-semibold text-ink text-[14.5px] group-hover:text-coral transition-colors duration-200">{hub.name}</span>
                                {hub.oneLiner && (
                                  <span className="block text-[12px] text-ink-soft line-clamp-2 mt-0.5 group-hover:text-ink-soft/80 transition-colors duration-200">
                                    {hub.oneLiner}
                                  </span>
                                )}
                                {!hub.oneLiner && hub.tuition && (
                                  <span className="block text-[12px] text-ink-soft mt-0.5">{hub.tuition}</span>
                                )}
                              </span>
                              <span className="rounded-full bg-brandgreen/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-brandgreen shrink-0 font-bold whitespace-nowrap transition-all duration-200">
                                LIVE
                              </span>
                            </Link>
                          </DropdownMenuItem>
                        );
                      })}
                      {comingSoonHubs.length > 0 && (
                        <div className="border-t border-line/40 my-2.5" aria-hidden="true" />
                      )}
                    </>
                  )}
                  {comingSoonHubs.map((hub) => {
                    const Icon = hub.icon ? ICON_MAP[hub.icon] : BookOpen;
                    return (
                      <DropdownMenuItem key={hub.slug} disabled className="opacity-50 cursor-not-allowed px-4 py-3.5 flex items-start gap-3 rounded-lg group">
                        <Icon
                          size={18}
                          aria-hidden="true"
                          className="mt-0.5 shrink-0 text-ink-soft/50"
                        />
                        <span className="flex-1 min-w-0">
                          <span className="block font-semibold text-ink-soft text-[14.5px]">{hub.name}</span>
                          {hub.oneLiner && (
                            <span className="block text-[12px] text-ink-soft/70 line-clamp-2 mt-0.5">
                              {hub.oneLiner}
                            </span>
                          )}
                        </span>
                        <span className="rounded-full bg-paper-dim px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-soft/70 shrink-0 whitespace-nowrap">
                          SOON
                        </span>
                      </DropdownMenuItem>
                    );
                  })}
                </>
              );
            })()}
          </NavMenu>

          <NavMenu label="Tools" fallbackHref={TOOLS[0].href} hasItems>
            {TOOLS.map((tool) => {
              const Icon = TOOL_ICONS[tool.icon] ?? BookOpen;
              return (
                <DropdownMenuItem key={tool.href} asChild className="group/tool">
                  <Link href={tool.href} className="transition-all duration-200 px-4 py-3.5 flex items-start gap-3 rounded-lg hover:bg-coral-dim/30 active:bg-coral-dim/50 cursor-pointer group">
                    <Icon
                      size={18}
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-coral-text transition-all duration-200 group-hover:scale-110"
                    />
                    <span className="flex-1 min-w-0">
                      <span className="block font-semibold text-ink text-[14.5px] group-hover:text-coral transition-colors duration-200">{tool.label}</span>
                      <span className="block text-[12px] text-ink-soft mt-0.5 group-hover:text-ink-soft/80 transition-colors duration-200">
                        {tool.description}
                      </span>
                    </span>
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </NavMenu>

          <Link
            href="/about"
            className="rounded-pill px-3 py-2 text-[14.5px] font-medium text-ink transition-colors hover:text-coral-text"
          >
            About
          </Link>
          <Link
            href="/faq"
            className="rounded-pill px-3 py-2 text-[14.5px] font-medium text-ink transition-colors hover:text-coral-text"
          >
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={signedIn ? "/portal" : "/login"}
            className="hidden rounded-pill px-4 py-2.5 text-ui font-medium text-ink transition-colors hover:text-coral-text sm:inline-flex"
          >
            {signedIn ? "My applications" : "Sign in"}
          </Link>
          {/* The full label does not fit beside the logo and the menu button
              on a 360px screen, so the phone gets the short form. */}
          <Cta href="/contact" size="md" className="shrink-0">
            <span className="sm:hidden">Book</span>
            <span className="hidden sm:inline">Book consultation</span>
            <ArrowRight size={14} aria-hidden="true" />
          </Cta>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-ink transition-colors hover:bg-paper-dim lg:hidden"
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </Container>

      {/*
        A grid whose single row animates between 0fr and 1fr. That transitions
        the panel open without animating `height`, which would reflow the page
        on every frame, and without `hidden`, which snapped it open instantly.
      */}
      <div
        id="mobile-nav"
        className={cn(
          "grid overflow-hidden border-line bg-paper transition-[grid-template-rows] duration-200 ease-out lg:hidden",
          open ? "grid-rows-[1fr] border-t" : "grid-rows-[0fr]",
        )}
      >
        {/*
          A collapsed grid row still contains focusable links, so `inert`
          takes them out of the tab order and the a11y tree — the job the
          `hidden` attribute used to do.

          The padding goes with it. A `0fr` track still reserves its min-content
          height and padding counts toward that, which left a 32px strip of the
          closed menu bleeding under the header on every page.
        */}
        <nav
          aria-label="Mobile"
          inert={!open}
          className={cn(
            "gutter flex min-h-0 flex-col",
            open ? "pb-6 pt-2" : "py-0",
          )}
        >
          {nav.destinations.length > 0 && (
            <MobileSection
              label="Destinations"
              expanded={mobileSection === "Destinations"}
              onToggle={() => toggleMobileSection("Destinations")}
            >
              {nav.destinations.map((d) =>
                d.live ? (
                  <Link
                    key={d.slug}
                    href={`/${d.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 py-3 text-ui text-ink hover:text-coral-text transition-colors duration-200"
                  >
                    {d.flagEmoji && <span aria-hidden="true" className="text-xl transition-transform duration-200">{d.flagEmoji}</span>}
                    {d.name}
                    <span className="ml-auto font-mono text-micro uppercase tracking-wider font-semibold text-brandgreen">
                      ✓ Live
                    </span>
                  </Link>
                ) : (
                  <span
                    key={d.slug}
                    className="flex items-center gap-2.5 py-3 text-ui text-ink-soft opacity-60 cursor-not-allowed"
                  >
                    {d.flagEmoji && (
                      <span aria-hidden="true" className="opacity-50">
                        {d.flagEmoji}
                      </span>
                    )}
                    {d.name}
                    <span className="ml-auto font-mono text-micro uppercase tracking-wider">
                      Coming soon
                    </span>
                  </span>
                ),
              )}
            </MobileSection>
          )}

          {nav.hubs.length > 0 && (
            <MobileSection
              label="Courses"
              expanded={mobileSection === "Courses"}
              onToggle={() => toggleMobileSection("Courses")}
            >
              {(() => {
                const liveHubs = nav.hubs.filter((h) => h.live);
                const comingSoonHubs = nav.hubs.filter((h) => !h.live);

                return (
                  <>
                    {liveHubs.length > 0 && (
                      <>
                        {liveHubs.map((hub) => {
                          const Icon = hub.icon ? ICON_MAP[hub.icon] : BookOpen;
                          return (
                            <div key={hub.slug} className="flex items-start gap-2.5 py-3 group/mobileHub hover:bg-paper-dim/50 rounded-lg px-2 -mx-2 transition-colors duration-200">
                              <Icon
                                size={17}
                                aria-hidden="true"
                                className="mt-0.5 shrink-0 text-coral-text transition-transform duration-200 group-hover/mobileHub:scale-110"
                              />
                              <Link
                                href={hub.href}
                                onClick={() => setOpen(false)}
                                className="flex-1 text-ui text-ink hover:text-coral-text transition-colors duration-200"
                              >
                                <span className="font-medium">{hub.name}</span>
                                {hub.oneLiner && (
                                  <span className="block text-[12px] text-ink-soft mt-1">
                                    {hub.oneLiner}
                                  </span>
                                )}
                              </Link>
                              <span className="ml-auto font-mono text-micro uppercase tracking-wider text-brandgreen shrink-0 whitespace-nowrap font-semibold">
                                ✓ Live
                              </span>
                            </div>
                          );
                        })}
                        {comingSoonHubs.length > 0 && (
                          <div className="border-b border-line/60 my-2" aria-hidden="true" />
                        )}
                      </>
                    )}
                    {comingSoonHubs.map((hub) => {
                      const Icon = hub.icon ? ICON_MAP[hub.icon] : BookOpen;
                      return (
                        <div key={hub.slug} className="flex items-start gap-2.5 py-3 opacity-65 cursor-not-allowed px-2 -mx-2">
                          <Icon
                            size={17}
                            aria-hidden="true"
                            className="mt-0.5 shrink-0 text-ink-soft/50"
                          />
                          <div className="flex-1">
                            <span className="text-ui text-ink-soft">{hub.name}</span>
                            {hub.oneLiner && (
                              <span className="block text-[12px] text-ink-soft/70 mt-1">
                                {hub.oneLiner}
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-micro uppercase tracking-wider text-ink-soft shrink-0 whitespace-nowrap">
                            Coming soon
                          </span>
                        </div>
                      );
                    })}
                  </>
                );
              })()}
            </MobileSection>
          )}

          <MobileSection
            label="Tools"
            expanded={mobileSection === "Tools"}
            onToggle={() => toggleMobileSection("Tools")}
          >
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-ui text-ink"
              >
                {tool.label}
              </Link>
            ))}
          </MobileSection>

          {COMPANY_LINKS.filter((l) => l.href !== "/contact").map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-b border-line/60 py-3.5 text-lede font-medium text-ink"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href={signedIn ? "/portal" : "/login"}
            onClick={() => setOpen(false)}
            className="py-3.5 text-lede font-medium text-coral-text"
          >
            {signedIn ? "My applications" : "Sign in"}
          </Link>
        </nav>
      </div>
    </header>
  );
}

function MobileSection({
  label,
  expanded,
  onToggle,
  children,
}: {
  label: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-line/60">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between py-3.5 text-lede font-medium text-ink"
      >
        {label}
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={cn(
            "transition-transform duration-200 ease-out",
            expanded && "rotate-180",
          )}
        />
      </button>
      {/* Same 0fr/1fr reveal as the panel above, for the same reasons. */}
      <div
        className={cn(
          "grid overflow-hidden transition-[grid-template-rows] duration-200 ease-out",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div inert={!expanded} className="min-h-0 pb-3 pl-1">
          {children}
        </div>
      </div>
    </div>
  );
}
