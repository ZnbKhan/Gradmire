"use client";

import { useEffect } from "react";
import Link from "next/link";

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
    <main id="main" className="px-7 py-28">
      <div className="mx-auto max-w-[620px] text-center">
        <p className="eyebrow justify-center">Something broke</p>
        <h1 className="mt-5 font-display text-[38px] leading-[1.1] tracking-tight text-ink">
          We couldn&apos;t load this page.
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
          This one is on us, not on you. Try again — and if it keeps happening,
          let us know.
        </p>
        {error.digest && (
          <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-ink-soft/70">
            Reference {error.digest}
          </p>
        )}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-pill bg-ink px-5 py-2.5 text-[14px] font-semibold text-paper transition-[transform,background-color] duration-150 ease-out hover:-translate-y-0.5 hover:bg-coral"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-pill border border-line px-5 py-2.5 text-[14px] font-medium text-ink transition-colors duration-150 ease-out hover:text-coral-text"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
