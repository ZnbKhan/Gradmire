/**
 * Seeds Postgres from the TypeScript content files that shipped with the MVP.
 * Idempotent: re-running updates existing rows by slug rather than duplicating,
 * so it is safe to run after editing src/data/*.
 *
 *   npx tsx scripts/seed.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, and } from "drizzle-orm";
import * as schema from "../src/db/schema";
import type { CourseHub, University } from "../src/data/courses";
import { countries } from "../src/data/countries";
import { courseHubs as sourceHubs } from "../src/data/courses";

const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!url) throw new Error("Set DIRECT_URL or DATABASE_URL in .env.local");

const sql = postgres(url, { prepare: false, max: 1 });
const db = drizzle(sql, { schema });

/**
 * "£22,000–£95,000/year" -> [22000, 95000]
 * "£1,100–£1,500/month"  -> [1100, 1500]
 * Handles both the en-dash used in the content and a plain hyphen.
 */
function parseRange(input?: string): [number | null, number | null] {
  if (!input) return [null, null];
  const nums = input
    .replace(/,/g, "")
    .match(/\d+(?:\.\d+)?/g)
    ?.map(Number);
  if (!nums?.length) return [null, null];
  if (nums.length === 1) return [nums[0], nums[0]];
  return [nums[0], nums[1]];
}

/** Derives the boarding-pass code shown on cards, e.g. "BUS·MGT". */
const CODES: Record<string, string> = {
  "business-management": "BUS·MGT",
  "computer-science-ai-data-science": "CS·AI·DS",
  "engineering-technology": "ENG·TEC",
  "medicine-nursing-health": "MED·HLT",
  law: "LAW",
  "architecture-design": "ARC·DES",
  economics: "ECON",
  psychology: "PSYC",
};

function codeFor(slug: string) {
  return (
    CODES[slug] ??
    slug.split("-").slice(0, 2).map((s) => s.slice(0, 3).toUpperCase()).join("·")
  );
}

/** Pulls an IELTS band out of a free-text entry requirement line. */
function parseIelts(reqs?: string[]): [string | null, string | null] {
  const line = reqs?.find((r) => /ielts/i.test(r));
  if (!line) return [null, null];
  const nums = line.match(/\d\.\d|\d/g);
  if (!nums?.length) return [null, null];
  return [nums[0], nums[1] ?? nums[0]];
}

async function main() {
  console.log("Seeding destinations…");
  const destIdBySlug = new Map<string, string>();

  for (let i = 0; i < countries.length; i++) {
    const c = countries[i];
    const values = {
      slug: c.slug,
      name: c.name,
      flagEmoji: c.flagEmoji,
      stampLabel: c.shortLabel,
      tagline: c.heroStat,
      status: (c.live ? "live" : "coming_soon") as "live" | "coming_soon",
      sortOrder: i,
      updatedAt: new Date(),
    };

    const [row] = await db
      .insert(schema.destinations)
      .values(values)
      .onConflictDoUpdate({ target: schema.destinations.slug, set: values })
      .returning({ id: schema.destinations.id });

    destIdBySlug.set(c.slug, row.id);
  }
  console.log(`  ${destIdBySlug.size} destinations`);

  console.log("Seeding course hubs…");
  let hubCount = 0;

  for (let i = 0; i < sourceHubs.length; i++) {
    const h: CourseHub = sourceHubs[i];
    const destinationId = destIdBySlug.get(h.countrySlug);
    if (!destinationId) {
      console.warn(`  skipping ${h.slug}: no destination "${h.countrySlug}"`);
      continue;
    }

    const [tuitionMin, tuitionMax] = parseRange(h.tuitionRange);
    const [livingMin, livingMax] = parseRange(h.livingCosts);
    const [salaryMin, salaryMax] = parseRange(h.medianSalaryRange);
    const [ieltsMin, ieltsMax] = parseIelts(h.entryRequirements);

    const values = {
      destinationId,
      slug: h.slug,
      code: codeFor(h.slug),
      name: h.name,
      icon: h.icon,
      status: (h.isStub ? "stub" : "live") as "live" | "stub",
      sortOrder: i,
      oneLiner: h.oneLiner ?? null,
      overview: h.overview ?? null,
      tuitionMin,
      tuitionMax,
      livingCostMin: livingMin,
      livingCostMax: livingMax,
      currency: "GBP",
      entryRequirements: h.entryRequirements ?? [],
      ieltsMin,
      ieltsMax,
      salaryMin,
      salaryMax,
      topSectors: h.topSectors ?? [],
      commonEmployers: h.commonEmployers ?? [],
      visaNotes: h.visaNotes ?? [],
      graduateRouteYears: 2,
      atasRequirement: h.atasRequired ? "per_course" : "no",
      atasLeadTimeWeeks: h.atasRequired ? 6 : null,
      extraNote: h.extraNote ?? null,
      /*
       * The launch spec is explicit that ranking figures are placeholders to
       * be replaced from a live subject table. Recording that here means the
       * admin can show which hubs still carry unverified data.
       */
      sources: h.isStub
        ? []
        : [{ label: "Placeholder — replace with Complete University Guide subject table" }],
      dataVerifiedAt: null,
      updatedAt: new Date(),
    };

    const [hub] = await db
      .insert(schema.courseHubs)
      .values(values)
      .onConflictDoUpdate({
        target: [schema.courseHubs.destinationId, schema.courseHubs.slug],
        set: values,
      })
      .returning({ id: schema.courseHubs.id });

    // Children are replaced wholesale — they have no stable natural key.
    await db.delete(schema.universities).where(eq(schema.universities.courseHubId, hub.id));
    if (h.universities?.length) {
      await db.insert(schema.universities).values(
        h.universities.map((u: University, idx: number) => ({
          courseHubId: hub.id,
          name: u.name,
          notableFor: u.notableFor ?? null,
          subjectRank: u.subjectRank ?? null,
          sortOrder: idx,
        })),
      );
    }

    await db.delete(schema.deadlines).where(eq(schema.deadlines.courseHubId, hub.id));
    if (h.applicationDeadlines?.length) {
      await db.insert(schema.deadlines).values(
        h.applicationDeadlines.map((d: { label: string; detail: string }, idx: number) => ({
          courseHubId: hub.id,
          intake: "September 2026",
          label: d.label,
          detail: d.detail,
          // The single warning on the hub attaches to its first deadline.
          warning: idx === 0 ? h.deadlineWarning ?? null : null,
          sortOrder: idx,
        })),
      );
    }

    hubCount++;
  }

  console.log(`  ${hubCount} course hubs`);
  console.log("Done.");
  await sql.end();
}

main().catch(async (err) => {
  console.error(err);
  await sql.end();
  process.exit(1);
});
