import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { beforeAll, afterAll, describe, expect, it } from "vitest";

/**
 * Ported from scripts/verify-schema.ts.
 *
 * Applies the generated migrations to an in-process Postgres and exercises
 * the relationships the app depends on, so a broken migration is caught here
 * rather than against Supabase.
 *
 * The whole scenario runs once in `beforeAll` and records its outcomes,
 * because several checks are destructive (the cascade test deletes a hub).
 * Asserting on recorded results keeps each test independent of the others'
 * ordering.
 */

const MIGRATIONS_DIR = join(process.cwd(), "drizzle");

type Outcome = {
  tables: string[];
  joinedRows: number;
  duplicateEmailRejected: boolean;
  orphanUniversities: number;
  leadCourseHubId: string | null;
};

let pg: PGlite;
let outcome: Outcome;

beforeAll(async () => {
  pg = new PGlite();

  // Numbered migrations only — rls.sql depends on Supabase's auth schema,
  // which does not exist in a bare Postgres.
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => /^\d{4}_.*\.sql$/.test(f))
    .sort();
  expect(files.length).toBeGreaterThan(0);

  for (const file of files) {
    const sql = readFileSync(join(MIGRATIONS_DIR, file), "utf8");
    // drizzle-kit separates statements with a breakpoint marker.
    for (const stmt of sql.split("--> statement-breakpoint")) {
      if (stmt.trim()) await pg.exec(stmt);
    }
  }

  const tables = await pg.query<{ table_name: string }>(
    `select table_name from information_schema.tables
     where table_schema = 'public' order by table_name`,
  );

  const dest = await pg.query<{ id: string }>(
    `insert into destinations (slug, name, status)
     values ('uk','United Kingdom','live') returning id`,
  );
  const destId = dest.rows[0]!.id;

  const hub = await pg.query<{ id: string }>(
    `insert into course_hubs (destination_id, slug, code, name, status, tuition_min, tuition_max)
     values ($1,'business-management','BUS·MGT','Business & Management','live',22000,95000)
     returning id`,
    [destId],
  );
  const hubId = hub.rows[0]!.id;

  await pg.query(
    `insert into universities (course_hub_id, name, notable_for, subject_rank)
     values ($1,'London Business School','MBA, Finance','Top 3')`,
    [hubId],
  );

  const applicant = await pg.query<{ id: string }>(
    `insert into applicants (email, full_name)
     values ('student@example.com','Test Student') returning id`,
  );
  const app = await pg.query<{ id: string }>(
    `insert into applications (reference, applicant_id, course_hub_id, university_name, programme_name, stage)
     values ('GM-1A2B',$1,$2,'LBS','MSc Finance','submitted') returning id`,
    [applicant.rows[0]!.id, hubId],
  );
  await pg.query(
    `insert into application_events (application_id, stage, note)
     values ($1,'submitted','Sent to university')`,
    [app.rows[0]!.id],
  );
  await pg.query(
    `insert into leads (full_name, email, course_hub_id, status)
     values ('Priya','p@example.com',$1,'new')`,
    [hubId],
  );

  const joined = await pg.query(
    `select a.programme_name, ch.name, a.stage, ev.note
     from applications a
     join course_hubs ch on ch.id = a.course_hub_id
     join application_events ev on ev.application_id = a.id`,
  );

  let duplicateEmailRejected = false;
  try {
    await pg.query(`insert into applicants (email) values ('student@example.com')`);
  } catch {
    duplicateEmailRejected = true;
  }

  // Destructive from here: deleting the hub exercises the FK actions.
  await pg.query(`delete from course_hubs where id = $1`, [hubId]);
  const orphans = await pg.query<{ n: number }>(
    `select count(*)::int as n from universities`,
  );
  const leadAfter = await pg.query<{ course_hub_id: string | null }>(
    `select course_hub_id from leads`,
  );

  outcome = {
    tables: tables.rows.map((r) => r.table_name),
    joinedRows: joined.rows.length,
    duplicateEmailRejected,
    orphanUniversities: orphans.rows[0]!.n,
    leadCourseHubId: leadAfter.rows[0]!.course_hub_id,
  };
});

afterAll(async () => {
  await pg?.close();
});

describe("migrations", () => {
  it("create every table the app queries", () => {
    expect(outcome.tables).toEqual(
      expect.arrayContaining([
        "applicants",
        "application_events",
        "applications",
        "course_hubs",
        "deadlines",
        "destinations",
        "leads",
        "staff",
        "universities",
      ]),
    );
  });
});

describe("relationships", () => {
  it("join applications to hubs to events", () => {
    expect(outcome.joinedRows).toBe(1);
  });

  it("reject a duplicate applicant email", () => {
    expect(outcome.duplicateEmailRejected).toBe(true);
  });

  it("cascade-delete a hub's universities", () => {
    expect(outcome.orphanUniversities).toBe(0);
  });

  it("keep a lead when its hub is deleted, nulling the reference", () => {
    // A lead is a person who enquired; losing them because a hub was
    // retired would lose real business.
    expect(outcome.leadCourseHubId).toBeNull();
  });
});
