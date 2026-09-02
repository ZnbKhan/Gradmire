import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A course hub as a boarding pass, perforation and all.
 *
 * Live hubs are links; stubs are not — a card that navigates nowhere should
 * not look or behave like one. The perforation notches are filled from
 * --perf-bg, set by the hosting section, so the card is portable across
 * backgrounds instead of only working on ink.
 */
export function CoursePassCard({
  code,
  name,
  description,
  universityCount,
  href,
  isStub = false,
}: {
  code: string;
  name: string;
  description: string | null;
  universityCount: number;
  href: string;
  isStub?: boolean;
}) {
  const inner = (
    <>
      <div className="p-5 pb-4">
        <span
          className={cn(
            "mb-2.5 block font-mono text-[11px] uppercase tracking-[0.1em]",
            isStub ? "text-ink-soft" : "text-coral-text",
          )}
        >
          {code}
        </span>
        <h3 className="mb-2.5 min-h-[46px] text-[19px] font-semibold leading-tight">
          {name}
        </h3>
        <p className="min-h-[64px] text-[13px] text-ink-soft">{description}</p>
      </div>

      <div className="perforation" aria-hidden="true" />

      <div className="mt-auto flex items-center justify-between p-5 pt-4">
        <div className="font-mono">
          <b className="block text-[15px] font-semibold text-ink">
            {isStub ? "—" : `${universityCount} unis`}
          </b>
          <span className="text-[10px] uppercase tracking-[0.08em] text-ink-soft">
            {isStub ? "Guide soon" : "Ranked hub"}
          </span>
        </div>
        {!isStub && (
          <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-ink text-white transition-colors group-hover:bg-coral">
            <ArrowRight size={15} aria-hidden="true" />
          </span>
        )}
      </div>
    </>
  );

  const shell =
    "group flex flex-col overflow-hidden rounded-2xl bg-paper text-ink shadow-pass";

  if (isStub) {
    return (
      <div className={cn(shell, "opacity-70")}>
        {inner}
        <span className="sr-only">Guide coming soon</span>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        shell,
        "transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl",
      )}
    >
      {inner}
    </Link>
  );
}
