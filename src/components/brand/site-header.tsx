"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";

const NAV = [
  { href: "/uk", label: "Destinations" },
  { href: "/uk#courses", label: "Courses" },
  { href: "/tools/course-finder", label: "Tools" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

export function SiteHeader({ signedIn = false }: { signedIn?: boolean }) {
  const [open, setOpen] = useState(false);

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

        <nav aria-label="Main" className="hidden items-center gap-[34px] lg:flex">
          {NAV.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-[14.5px] font-medium text-ink transition-colors hover:text-coral-text"
            >
              {l.label}
            </Link>
          ))}
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
          {NAV.map((l) => (
            <Link
              key={l.label}
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
