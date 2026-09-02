import { desc } from "drizzle-orm";
import { db, schema } from "@/db";
import { ActionForm } from "@/components/admin/action-form";
import { updateLeadStatus } from "@/lib/actions/admin";

export const dynamic = "force-dynamic";
export const metadata = { title: "Leads" };

export default async function LeadsPage() {
  const leads = await db.query.leads.findMany({
    orderBy: [desc(schema.leads.createdAt)],
    limit: 100,
    with: { courseHub: { columns: { name: true } } },
  });

  return (
    <>
      <h1 className="mb-2 text-[30px] font-semibold">Leads</h1>
      <p className="mb-8 text-[14.5px] text-ink-soft">
        Consultation requests from the site, newest first.
      </p>

      {leads.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line bg-white p-10 text-center text-[14px] text-ink-soft">
          No enquiries yet.
        </p>
      ) : (
        <ul className="space-y-4">
          {leads.map((lead) => (
            <li key={lead.id} className="rounded-2xl border border-line bg-white p-5">
              <div className="mb-3 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-[17px] font-semibold">{lead.fullName}</h2>
                  <p className="text-[13.5px] text-ink-soft">
                    <a href={`mailto:${lead.email}`} className="underline">
                      {lead.email}
                    </a>
                    {lead.phone && ` · ${lead.phone}`}
                  </p>
                </div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                  {lead.createdAt.toLocaleString("en-GB")}
                </span>
              </div>

              <dl className="mb-3 grid gap-2 text-[13.5px] sm:grid-cols-3">
                <div>
                  <dt className="font-mono text-[10.5px] uppercase tracking-wider text-ink-soft">Course</dt>
                  <dd>{lead.courseHub?.name ?? "Not sure yet"}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10.5px] uppercase tracking-wider text-ink-soft">Intake</dt>
                  <dd>{lead.preferredIntake ?? "—"}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10.5px] uppercase tracking-wider text-ink-soft">From page</dt>
                  <dd className="truncate">{lead.sourcePath ?? "—"}</dd>
                </div>
              </dl>

              {lead.message && (
                <p className="mb-3 rounded-lg bg-paper-dim px-4 py-3 text-[13.5px]">
                  {lead.message}
                </p>
              )}

              <ActionForm action={updateLeadStatus} submitLabel="Update">
                <input type="hidden" name="leadId" value={lead.id} />
                <label htmlFor={`status-${lead.id}`} className="sr-only">
                  Status for {lead.fullName}
                </label>
                <select
                  id={`status-${lead.id}`}
                  name="status"
                  defaultValue={lead.status}
                  className="rounded-lg border border-line bg-white px-3 py-2 text-[13px]"
                >
                  {schema.leadStatus.enumValues.map((s) => (
                    <option key={s} value={s}>
                      {s.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </ActionForm>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
