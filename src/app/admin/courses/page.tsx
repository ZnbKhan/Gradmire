import { asc } from "drizzle-orm";
import { db, schema } from "@/db";
import { ActionForm } from "@/components/admin/action-form";
import { updateCourseHub } from "@/lib/actions/admin";

export const dynamic = "force-dynamic";
export const metadata = { title: "Course content" };

const inputCls =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-[13.5px]";

export default async function AdminCoursesPage() {
  const hubs = await db.query.courseHubs.findMany({
    orderBy: [asc(schema.courseHubs.sortOrder)],
    with: { universities: { columns: { id: true } } },
  });

  return (
    <>
      <h1 className="mb-2 text-[30px] font-semibold">Course content</h1>
      <p className="mb-8 max-w-[70ch] text-[14.5px] text-ink-soft">
        Figures here are what the public hub pages render. Saving clears the content
        cache, so edits appear on the live site on the next request. Tick{" "}
        <strong className="font-medium text-ink">Mark verified</strong> once you have
        checked a hub&rsquo;s rankings and fees against the current subject tables.
      </p>

      <ul className="space-y-5">
        {hubs.map((hub) => (
          <li key={hub.id} className="rounded-2xl border border-line bg-white p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-coral-text">
                  {hub.code}
                </span>
                <h2 className="text-[18px] font-semibold">{hub.name}</h2>
                <p className="text-[12.5px] text-ink-soft">
                  {hub.universities.length} universities ·{" "}
                  {hub.dataVerifiedAt
                    ? `verified ${hub.dataVerifiedAt.toLocaleDateString("en-GB")}`
                    : "figures not yet verified"}
                </p>
              </div>
              {!hub.dataVerifiedAt && hub.status === "live" && (
                <span className="rounded-pill bg-coral-dim px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-coral-text">
                  Unverified
                </span>
              )}
            </div>

            <ActionForm action={updateCourseHub} submitLabel="Save hub">
              <input type="hidden" name="hubId" value={hub.id} />
              <div className="grid gap-3">
                <div className="grid gap-3 sm:grid-cols-4">
                  <div>
                    <label htmlFor={`status-${hub.id}`} className="mb-1 block text-[12.5px] font-medium">Status</label>
                    <select id={`status-${hub.id}`} name="status" defaultValue={hub.status} className={inputCls}>
                      <option value="live">Live</option>
                      <option value="stub">Stub (hidden)</option>
                    </select>
                  </div>
                  {([
                    ["tuitionMin", "Tuition min", hub.tuitionMin],
                    ["tuitionMax", "Tuition max", hub.tuitionMax],
                    ["livingCostMin", "Living min /mo", hub.livingCostMin],
                    ["livingCostMax", "Living max /mo", hub.livingCostMax],
                    ["salaryMin", "Salary min", hub.salaryMin],
                    ["salaryMax", "Salary max", hub.salaryMax],
                  ] as const).map(([name, label, value]) => (
                    <div key={name}>
                      <label htmlFor={`${name}-${hub.id}`} className="mb-1 block text-[12.5px] font-medium">
                        {label}
                      </label>
                      <input
                        id={`${name}-${hub.id}`}
                        name={name}
                        inputMode="numeric"
                        defaultValue={value ?? ""}
                        className={inputCls}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label htmlFor={`oneLiner-${hub.id}`} className="mb-1 block text-[12.5px] font-medium">
                    One-liner
                  </label>
                  <textarea
                    id={`oneLiner-${hub.id}`}
                    name="oneLiner"
                    rows={2}
                    defaultValue={hub.oneLiner ?? ""}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor={`overview-${hub.id}`} className="mb-1 block text-[12.5px] font-medium">
                    Overview
                  </label>
                  <textarea
                    id={`overview-${hub.id}`}
                    name="overview"
                    rows={3}
                    defaultValue={hub.overview ?? ""}
                    className={inputCls}
                  />
                </div>

                <label className="flex items-center gap-2.5 text-[13px]">
                  <input type="checkbox" name="markVerified" className="h-4 w-4 rounded border-line" />
                  Mark figures as verified today
                </label>
              </div>
            </ActionForm>
          </li>
        ))}
      </ul>
    </>
  );
}
