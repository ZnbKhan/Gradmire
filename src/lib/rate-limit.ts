import "server-only";

/**
 * Fixed-window limiter for unauthenticated form posts.
 *
 * In-memory, so it is per-instance: a serverless deployment running several
 * concurrent instances enforces the limit per instance rather than globally.
 * That is deliberate — it costs nothing, blocks the naive flood that form
 * spam actually consists of, and the honeypot plus Postgres unique
 * constraints catch the rest. Swap the map for Upstash Redis if the site
 * starts attracting distributed abuse.
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_KEYS = 10_000;

export function rateLimit(
  key: string,
  { limit = 5, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {},
): { ok: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    // Cheap guard against unbounded growth from spoofed IPs.
    if (buckets.size > MAX_KEYS) {
      Array.from(buckets.entries()).forEach(([k, v]) => {
        if (now > v.resetAt) buckets.delete(k);
      });
    }
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= limit) {
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count++;
  return { ok: true, retryAfterSeconds: 0 };
}
