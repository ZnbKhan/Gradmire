"use client";

import { useState } from "react";
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
  type LucideIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { TOOLS, COMPANY_LINKS } from "@/config/site";
import type { Navigation } from "@/lib/nav";
import { cn } from "@/lib/utils";

/**
 * The interactive half of the header. Nav content arrives as props from the
 * server component so this stays free of any hardcoded destination or
 * course list — see `@/lib/nav`.
 */

/** Config carries icon *names* so it stays serialisable; resolve them here. */
const TOOL_ICONS: Record<string, LucideIcon> = {
  Compass,
  Calculator,
  Scale,
  CalendarClock,
};

const triggerCls =
  "group flex items-center gap-1 rounded-pill px-3 py-2 text-[14.5px] font-medium text-ink outline-none transition-colors hover:text-coral-text data-[state=open]:text-coral-text";

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
      <DropdownMenuContent align="start" className="min-w-[300px]">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SiteNav({
  nav,
  signedIn = false,
  primaryDestination,
}: {
  nav: Navigation;
  signedIn?: boolean;
  /** Where "Destinations" and "Courses" point when their menus are empty. */
  primaryDestination: string;
}) {
  const [open, setOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);

  function toggleMobileSection(label: string) {
    setMobileSection((current) => (current === label ? null : label));
  }

  const destinationsHref = `/${primaryDestination}`;
  const coursesHref = `/${primaryDestination}#courses`;

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between px-7 py-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-[21px] font-semibold text-ink"
        >
          <span aria-hidden="true" className="h-[9px] w-[9px] rounded-full bg-coral" />
          Gradmire
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-[6px] lg:flex">
          <NavMenu
            label="Destinations"
            fallbackHref={destinationsHref}
            hasItems={nav.destinations.length > 0}
          >
            {nav.destinations.map((d) =>
              d.live ? (
                <DropdownMenuItem key={d.slug} asChild>
                  <Link href={`/${d.slug}`}>
                    {d.flagEmoji && (
                      <span aria-hidden="true" className="text-lg leading-none">
                        {d.flagEmoji}
                      </span>
                    )}
                    <span className="flex-1">
                      <span className="block font-medium text-ink">{d.name}</span>
                      {d.detail && (
                        <span className="block text-[12px] text-ink-soft">{d.detail}</span>
                      )}
                    </span>
                    <span className="mt-0.5 rounded-pill bg-brandgreen-dim px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink">
                      Live
                    </span>
                  </Link>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem key={d.slug} disabled>
                  {d.flagEmoji && (
                    <span aria-hidden="true" className="text-lg leading-none opacity-60">
                      {d.flagEmoji}
                    </span>
                  )}
                  <span className="flex-1">
                    <span className="block font-medium text-ink-soft">{d.name}</span>
                    {d.detail && (
                      <span className="block text-[12px] text-ink-soft/70">{d.detail}</span>
                    )}
                  </span>
                  <span className="mt-0.5 rounded-pill bg-paper-dim px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-soft">
                    Soon
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
            {nav.hubs.map((hub) =>
              hub.live ? (
                <DropdownMenuItem key={hub.slug} asChild>
                  <Link href={hub.href}>
                    <span className="flex-1">
                      <span className="block font-medium text-ink">{hub.name}</span>
                      {hub.tuition && (
                        <span className="block text-[12px] text-ink-soft">{hub.tuition}</span>
                      )}
                    </span>
                    <ArrowRight
                      size={13}
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-ink-soft"
                    />
                  </Link>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem key={hub.slug} disabled>
                  <span className="flex-1">
                    <span className="block font-medium text-ink-soft">{hub.name}</span>
                    <span className="block text-[12px] text-ink-soft/70">In research</span>
                  </span>
                </DropdownMenuItem>
              ),
            )}
          </NavMenu>

          <NavMenu label="Tools" fallbackHref={TOOLS[0].href} hasItems>
            {TOOLS.map((tool) => {
              const Icon = TOOL_ICONS[tool.icon] ?? BookOpen;
              return (
                <DropdownMenuItem key={tool.href} asChild>
                  <Link href={tool.href}>
                    <Icon
                      size={17}
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-coral-text"
                    />
                    <span className="flex-1">
                      <span className="block font-medium text-ink">{tool.label}</span>
                      <span className="block text-[12px] text-ink-soft">
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
            className="hidden rounded-pill px-4 py-2.5 text-[14px] font-medium text-ink transition-colors hover:text-coral-text sm:inline-flex"
          >
            {signedIn ? "My applications" : "Sign in"}
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-pill bg-ink px-5 py-2.5 text-[14px] font-semibold text-paper transition-all hover:-translate-y-0.5 hover:bg-coral"
          >
            Book consultation
            <ArrowRight size={14} aria-hidden="true" />
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="rounded-md p-2 text-ink transition-colors hover:bg-paper-dim lg:hidden"
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-line bg-paper px-7 pb-6 pt-2 lg:hidden"
      >
        <nav aria-label="Mobile" className="flex flex-col">
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
                    className="flex items-center gap-2.5 py-2 text-[14px] text-ink"
                  >
                    {d.flagEmoji && <span aria-hidden="true">{d.flagEmoji}</span>}
                    {d.name}
                    <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-ink-soft">
                      Live
                    </span>
                  </Link>
                ) : (
                  <span
                    key={d.slug}
                    className="flex items-center gap-2.5 py-2 text-[14px] text-ink-soft"
                  >
                    {d.flagEmoji && (
                      <span aria-hidden="true" className="opacity-60">
                        {d.flagEmoji}
                      </span>
                    )}
                    {d.name}
                    <span className="ml-auto font-mono text-[10px] uppercase tracking-wider">
                      Soon
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
              {nav.hubs.map((hub) =>
                hub.live ? (
                  <Link
                    key={hub.slug}
                    href={hub.href}
                    onClick={() => setOpen(false)}
                    className="block py-2 text-[14px] text-ink"
                  >
                    {hub.name}
                  </Link>
                ) : (
                  <span key={hub.slug} className="block py-2 text-[14px] text-ink-soft">
                    {hub.name}{" "}
                    <span className="font-mono text-[10px] uppercase tracking-wider">
                      In research
                    </span>
                  </span>
                ),
              )}
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
                className="block py-2 text-[14px] text-ink"
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
              className="border-b border-line/60 py-3.5 text-[15px] font-medium text-ink"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href={signedIn ? "/portal" : "/login"}
            onClick={() => setOpen(false)}
            className="py-3.5 text-[15px] font-medium text-coral-text"
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
        className="flex w-full items-center justify-between py-3.5 text-[15px] font-medium text-ink"
      >
        {label}
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={cn("transition-transform", expanded && "rotate-180")}
        />
      </button>
      {expanded && <div className="pb-3 pl-1">{children}</div>}
    </div>
  );
}
