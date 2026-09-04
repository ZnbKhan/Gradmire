import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { eq, desc } from "drizzle-orm";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/brand/site-header";
import { SiteFooter } from "@/components/brand/site-footer";
import { getSessionUser } from "@/lib/supabase/server";
import { db, schema } from "@/db";
import { STAGES, stageIndex, stageLabel } from "@/lib/stages";

export const metadata: Metadata = {
  title: "My applications",
  robots: { index: false, follow: false },
};

/** Always fresh — a counselor may have moved a stage seconds ago. */
export const dynamic = "force-dynamic";

function StageTrack({ stage }: { stage: string }) {
  if (stage === "withdrawn") {
    return (
      <p className="rounded-lg bg-paper-dim px-4 py-3 text-[13.5px] text-ink-soft">
        This application was withdrawn. Talk to your counselor if that&rsquo;s wrong.
      </p>
    );
  }
  const current = stageIndex(stage);

  return (
    <ol className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-5">
      {STAGES.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li
            key={s.key}
            aria-current={active ? "step" : undefined}
            className={`rounded-lg border px-3 py-2.5 text-[12px] ${
              active
                ? "border-coral bg-coral-dim font-semibold text-coral-text"
                : done
                  ? "border-brandgreen/30 bg-brandgreen-dim text-ink"
                  : "border-line bg-white text-ink-soft"
            }`}
          >
            <span className="block font-mono text-[10px] uppercase tracking-wider opacity-70">
              {String(i + 1).padStart(2, "0")}
            </span>
            {s.label}
          </li>
        );
      })}
    </ol>
  );
}

export default async function PortalPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/portal");

  const applicant = await db.query.applicants.findFirst({
    where: eq(schema.applicants.email, (user.email ?? "").toLowerCase()),
  });

  const applications = applicant
    ? await db.query.applications.findMany({
        where: eq(schema.applications.applicantId, applicant.id),
        orderBy: [desc(schema.applications.updatedAt)],
        with: {
          events: { orderBy: [desc(schema.applicationEvents.createdAt)], limit: 5 },
        },
      })
    : [];

  return (
    <>
      <SiteHeader />
      <main id="main" className="px-7 py-14">
        <div className="mx-auto max-w-[1180px]">
          <span className="eyebrow">Applicant portal</span>
          <h1 className="mb-2 mt-3 text-[clamp(28px,3.6vw,40px)] font-semibold">
            {applicant?.fullName ? `Hello, ${applicant.fullName.split(" ")[0]}` : "My applications"}
          </h1>
          <p className="mb-10 text-[15px] text-ink-soft">
            Signed in as {user.email}
          </p>

          {applications.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-paper-dim p-10 text-center">
              <h2 className="mb-2 text-[20px] font-semibold">No applications yet</h2>
              <p className="mx-auto mb-6 max-w-[46ch] text-[14.5px] text-ink-soft">
                Once your counselor starts an application for you, its status will
                appear here — from shortlist through to visa approval.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-pill bg-ink px-5 py-3 text-[14.5px] font-semibold text-paper transition-colors hover:bg-coral"
              >
                Book a consultation
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <ul className="space-y-6">
              {applications.map((app) => (
                <li key={app.id} className="rounded-2xl border border-line bg-white p-6">
                  <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-soft">
                        {app.reference}
                        {app.intake ? ` · ${app.intake}` : ""}
                      </span>
                      <h2 className="mt-1 text-[20px] font-semibold">
                        {app.programmeName}
                      </h2>
                      <p className="text-[14px] text-ink-soft">{app.universityName}</p>
                    </div>
                    <span className="rounded-pill bg-ink px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-paper">
                      {stageLabel(app.stage)}
                    </span>
                  </div>

                  <StageTrack stage={app.stage} />

                  {app.applicantNote && (
                    <p className="mt-5 rounded-r-lg border-l-[3px] border-gold bg-paper-dim px-4 py-3 text-[14px]">
                      {app.applicantNote}
                    </p>
                  )}

                  {app.events.length > 0 && (
                    <div className="mt-5">
                      <h3 className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-soft">
                        Recent updates
                      </h3>
                      <ul className="space-y-2">
                        {app.events.map((ev) => (
                          <li key={ev.id} className="flex gap-3 text-[13.5px]">
                            <time
                              dateTime={ev.createdAt.toISOString()}
                              className="shrink-0 font-mono text-[12px] text-ink-soft"
                            >
                              {ev.createdAt.toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                              })}
                            </time>
                            <span>
                              <strong className="font-medium">{stageLabel(ev.stage)}</strong>
                              {ev.note ? ` — ${ev.note}` : ""}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
