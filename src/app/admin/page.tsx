import Link from "next/link";
import { desc, eq, count } from "drizzle-orm";
import { db, schema } from "@/db";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const [newLeads, openApplications, liveHubs, staleHubs, recentLeads] =
    await Promise.all([
      db.select({ n: count() }).from(schema.leads).where(eq(schema.leads.status, "new")),
      db.select({ n: count() }).from(schema.applications),
      db
        .select({ n: count() })
        .from(schema.courseHubs)
        .where(eq(schema.courseHubs.status, "live")),
      db.query.courseHubs.findMany({
        where: eq(schema.courseHubs.status, "live"),
        columns: { id: true, name: true, dataVerifiedAt: true },
      }),
      db.query.leads.findMany({
        orderBy: [desc(schema.leads.createdAt)],
        limit: 8,
      }),
    ]);

  const unverified = staleHubs.filter((h) => !h.dataVerifiedAt);

  const tiles = [
    { label: "New leads", value: newLeads[0]?.n ?? 0, href: "/admin/leads" },
    { label: "Applications", value: openApplications[0]?.n ?? 0, href: "/admin/applications" },
    { label: "Live course hubs", value: liveHubs[0]?.n ?? 0, href: "/admin/courses" },
    { label: "Hubs with unverified data", value: unverified.length, href: "/admin/courses" },
  ];

  return (
    <>
      <h1 className="mb-8 text-[30px] font-semibold">Overview</h1>

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t) => (
          <Link
            key={t.label}
            href={t.href}
            className="rounded-2xl border border-line bg-white p-5 transition-colors hover:border-ink"
          >
            <span className="block font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft">
              {t.label}
            </span>
            <span className="mt-2 block font-display text-[32px] font-semibold tabular">
              {t.value}
            </span>
          </Link>
        ))}
      </div>

      {unverified.length > 0 && (
        <div className="mb-10 rounded-2xl border-l-[3px] border-coral bg-coral-dim px-5 py-4">
          <h2 className="mb-1 text-[15px] font-semibold">
            {unverified.length} live {unverified.length === 1 ? "hub carries" : "hubs carry"} unverified figures
          </h2>
          <p className="text-[13.5px] text-ink-soft">
            Rankings and fees were seeded as placeholders. Verify them against the
            current subject tables, then mark them verified in Course content:{" "}
            {unverified.map((h) => h.name).join(", ")}.
          </p>
        </div>
      )}

      <h2 className="mb-4 text-[20px] font-semibold">Latest enquiries</h2>
      {recentLeads.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line bg-white p-8 text-center text-[14px] text-ink-soft">
          No consultation requests yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[620px] text-sm">
            <thead>
              <tr className="border-b border-line">
                {["Name", "Email", "Intake", "Received", "Status"].map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-ink-soft">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentLeads.map((l) => (
                <tr key={l.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-medium">{l.fullName}</td>
                  <td className="px-4 py-3 text-ink-soft">{l.email}</td>
                  <td className="px-4 py-3 text-ink-soft">{l.preferredIntake ?? "—"}</td>
                  <td className="px-4 py-3 font-mono text-[12.5px] text-ink-soft">
                    {l.createdAt.toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-pill bg-paper-dim px-2.5 py-1 font-mono text-[11px] uppercase">
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
