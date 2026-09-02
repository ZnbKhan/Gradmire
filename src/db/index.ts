import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * The client is created on first use rather than at import time. A build
 * (or a lint pass) that merely imports this module should not fail for want
 * of a connection string — only an actual query should.
 *
 * `prepare: false` is required behind Supabase's Supavisor pooler in
 * transaction mode, which does not support prepared statements.
 */
const globalForDb = globalThis as unknown as {
  gradmireDb?: postgres.Sql;
  gradmireDrizzle?: ReturnType<typeof drizzle<typeof schema>>;
};

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

function getDb() {
  if (globalForDb.gradmireDrizzle) return globalForDb.gradmireDrizzle;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env.local and fill in the Supabase connection string.",
    );
  }

  const client =
    globalForDb.gradmireDb ??
    postgres(connectionString, {
      prepare: false,
      // Serverless functions each hold their own pool, so keep it small and
      // let Supavisor do the real pooling. Override for other runtimes.
      max: Number(process.env.DATABASE_POOL_MAX ?? 10),
      idle_timeout: 20,
      connect_timeout: 10,
    });

  const instance = drizzle(client, { schema });

  if (process.env.NODE_ENV !== "production") {
    globalForDb.gradmireDb = client;
    globalForDb.gradmireDrizzle = instance;
  }
  return instance;
}

/** Proxied so `db.query…` resolves the real client only when touched. */
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb(), prop, receiver);
  },
});

export { schema };
