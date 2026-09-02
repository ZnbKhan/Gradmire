import type { Metadata } from "next";
import Link from "next/link";
import { requireStaff } from "@/lib/auth";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Gradmire Admin" },
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/courses", label: "Course content" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { staff } = await requireStaff();

  return (
    <div className="min-h-screen bg-paper-dim">
      <header className="border-b border-line bg-ink text-paper">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-4 px-7 py-4">
          <div className="flex items-center gap-7">
            <Link href="/admin" className="flex items-center gap-2.5 font-display text-lg font-semibold text-white">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-coral" />
              Gradmire
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold">
                Admin
              </span>
            </Link>
            <nav aria-label="Admin" className="flex flex-wrap gap-5">
              {NAV.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-[13.5px] font-medium text-paper/75 hover:text-white"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-paper/60">
            {staff.fullName ?? staff.email} · {staff.role}
          </span>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-[1180px] px-7 py-10">{children}</main>
    </div>
  );
}
