"use client";

import { useEffect } from "react";
import { Cta, CtaButton } from "@/components/ui/cta";

/**
 * Last-resort boundary for an unhandled render error. It cannot use
 * `SiteHeader`, because the failure may well be in the data that the header
 * itself reads — so this stays deliberately self-contained.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app] unhandled render error", error);
  }, [error]);

  return (
    <main id="main" className="gutter py-28">
      <div className="mx-auto max-w-[620px] text-center">
        <p className="eyebrow justify-center">Something broke</p>
        <h1 className="mt-5 font-display text-[38px] leading-[1.1] tracking-tight text-ink">
          We couldn&apos;t load this page.
        </h1>
        <p className="mt-4 text-lede leading-relaxed text-ink-soft">
          This one is on us, not on you. Try again — and if it keeps happening,
          let us know.
        </p>
        {error.digest && (
          <p className="mt-4 font-mono text-mini uppercase tracking-wider text-ink-soft/70">
            Reference {error.digest}
          </p>
        )}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <CtaButton type="button" onClick={reset} size="md">
            Try again
          </CtaButton>
          <Cta href="/" variant="outline" size="md">
            Back to home
          </Cta>
        </div>
      </div>
    </main>
  );
}
