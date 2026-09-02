/**
 * Applies the generated migration to an in-process Postgres (PGlite) and
 * exercises the relations the app depends on. Verifies the SQL is valid and
 * the foreign keys, enums and unique indexes behave as intended — without
 * needing a provisioned database.
 */
import { PGlite } from "@electric-sql/pglite";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "drizzle");

async function main() {
  const pg = new PGlite();

  // Numbered migrations only — rls.sql depends on Supabase's auth schema.
  const files = readdirSync(dir).filter((f) => /^\d{4}_.*\.sql$/.test(f)).sort();
  for (const file of files) {
    const sql = readFileSync(join(dir, file), "utf8");
    // drizzle-kit separates statements with a breakpoint marker.
    for (const stmt of sql.split("--> statement-breakpoint")) {
      if (stmt.trim()) await pg.exec(stmt);
    }
    console.log(`applied ${file}`);
  }

  const tables = await pg.query<{ table_name: string }>(
    `select table_name from information_schema.tables
     where table_schema = 'public' order by table_name`,
  );
  console.log(`\ntables (${tables.rows.length}):`, tables.rows.map((r) => r.table_name).join(", "));

  // --- exercise the real relationships -------------------------------
  const dest = await pg.query<{ id: string }>(
    `insert into destinations (slug, name, status) values ('uk','United Kingdom','live') returning id`,
  );
  const destId = dest.rows[0].id;

  const hub = await pg.query<{ id: string }>(
    `insert into course_hubs (destination_id, slug, code, name, status, tuition_min, tuition_max)
     values ($1,'business-management','BUS·MGT','Business & Management','live',22000,95000) returning id`,
    [destId],
  );
  const hubId = hub.rows[0].id;

  await pg.query(
    `insert into universities (course_hub_id, name, notable_for, subject_rank)
     values ($1,'London Business School','MBA, Finance','Top 3')`, [hubId],
  );

  const applicant = await pg.query<{ id: string }>(
    `insert into applicants (email, full_name) values ('student@example.com','Test Student') returning id`,
  );
  const app = await pg.query<{ id: string }>(
    `insert into applications (reference, applicant_id, course_hub_id, university_name, programme_name, stage)
     values ('GM-1A2B',$1,$2,'LBS','MSc Finance','submitted') returning id`,
    [applicant.rows[0].id, hubId],
  );
  await pg.query(
    `insert into application_events (application_id, stage, note) values ($1,'submitted','Sent to university')`,
    [app.rows[0].id],
  );
  await pg.query(
    `insert into leads (full_name, email, course_hub_id, status) values ('Priya','p@example.com',$1,'new')`,
    [hubId],
  );

  const joined = await pg.query<{ programme_name: string; name: string; stage: string; note: string }>(
    `select a.programme_name, ch.name, a.stage, ev.note
     from applications a
     join course_hubs ch on ch.id = a.course_hub_id
     join application_events ev on ev.application_id = a.id`,
  );
  console.log("join across applications -> hubs -> events:", joined.rows);

  // Unique constraint on applicant email must hold.
  let duplicateRejected = false;
  try {
    await pg.query(`insert into applicants (email) values ('student@example.com')`);
  } catch {
    duplicateRejected = true;
  }

  // Cascade: deleting the hub must clear its universities.
  await pg.query(`delete from course_hubs where id = $1`, [hubId]);
  const orphans = await pg.query(`select count(*)::int as n from universities`);
  const leadAfter = await pg.query<{ course_hub_id: string | null }>(
    `select course_hub_id from leads`,
  );

  console.log("\nchecks:");
  console.log("  duplicate applicant email rejected:", duplicateRejected);
  console.log("  universities cascade-deleted with hub:", (orphans.rows[0] as { n: number }).n === 0);
  console.log("  lead survived hub deletion (set null):", leadAfter.rows[0].course_hub_id === null);

  const ok =
    tables.rows.length === 10 &&
    joined.rows.length === 1 &&
    duplicateRejected &&
    (orphans.rows[0] as { n: number }).n === 0 &&
    leadAfter.rows[0].course_hub_id === null;

  console.log(ok ? "\nSCHEMA VERIFIED" : "\nSCHEMA CHECK FAILED");
  process.exit(ok ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
