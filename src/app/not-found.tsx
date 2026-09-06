import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/brand/site-header";
import { SiteFooter } from "@/components/brand/site-footer";
import { Cta } from "@/components/ui/cta";
import { PRIMARY_DESTINATION } from "@/config/site";

/**
 * `notFound()` is called from the destination and course-hub pages. Without
 * this the visitor landed on Next's unstyled default with no way back.
 */
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="gutter py-28">
        <div className="mx-auto max-w-[620px] text-center">
          <p className="eyebrow justify-center">Error 404</p>
          <h1 className="mt-5 font-display text-[38px] leading-[1.1] tracking-tight text-ink">
            This page isn&apos;t on the board.
          </h1>
          <p className="mt-4 text-lede leading-relaxed text-ink-soft">
            The page you asked for either moved or never existed. The course
            hubs below are the best place to pick the thread back up.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Cta href="/" size="md">
              Back to home
              <ArrowRight size={14} aria-hidden="true" />
            </Cta>
            <Cta href={`/${PRIMARY_DESTINATION}`} variant="outline" size="md">
              Browse courses
            </Cta>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
