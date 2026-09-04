import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/brand/site-header";
import { SiteFooter } from "@/components/brand/site-footer";
import { PRIMARY_DESTINATION } from "@/config/site";

/**
 * `notFound()` is called from the destination and course-hub pages. Without
 * this the visitor landed on Next's unstyled default with no way back.
 */
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="px-7 py-28">
        <div className="mx-auto max-w-[620px] text-center">
          <p className="eyebrow justify-center">Error 404</p>
          <h1 className="mt-5 font-display text-[38px] leading-[1.1] tracking-tight text-ink">
            This page isn&apos;t on the board.
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
            The page you asked for either moved or never existed. The course
            hubs below are the best place to pick the thread back up.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-pill bg-ink px-5 py-2.5 text-[14px] font-semibold text-paper transition-[transform,background-color] duration-150 ease-out hover:-translate-y-0.5 hover:bg-coral"
            >
              Back to home
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <Link
              href={`/${PRIMARY_DESTINATION}`}
              className="rounded-pill border border-line px-5 py-2.5 text-[14px] font-medium text-ink transition-colors duration-150 ease-out hover:text-coral-text"
            >
              Browse courses
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
