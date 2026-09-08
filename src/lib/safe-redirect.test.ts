import { describe, expect, it } from "vitest";
import { DEFAULT_REDIRECT, safeNextPath, safeRedirectUrl } from "./safe-redirect";

/**
 * Ported from scripts/verify-redirect.ts.
 *
 * This is the guard behind the magic-link callback
 * (src/app/auth/callback/route.ts). If it regresses, an attacker can
 * authenticate a victim on gradmire.com and then bounce them to a phishing
 * page — so every string below is a real vector, not a formality.
 */

const ORIGIN = "https://gradmire.com";

/**
 * Values that must not survive as a path at all. Each one escapes the origin
 * under the naive `${origin}${next}` interpolation this module replaces:
 * with no trailing slash on the origin, "@evil.com" makes gradmire.com the
 * *userinfo* of evil.com, and ".evil.com" makes it a subdomain label.
 */
const REJECTED = [
  "@evil.com",
  ".evil.com",
  "//evil.com",
  "/\\evil.com",
  "\\\\evil.com",
  "https://evil.com",
  "http://evil.com",
  "javascript:alert(1)",
  "///evil.com",
  "%2F%2Fevil.com",
  "-evil.com",
  ":@evil.com",
  "?next=x",
  "//evil.com/path",
];

/**
 * Contained rather than rejected. Percent-encoded slashes are *not* path
 * separators, so this stays a single path segment on gradmire.com and never
 * reaches evil.com. Keeping it as its own case documents that the difference
 * is intended: the contract is "never leaves the origin", not "looks tidy".
 */
const CONTAINED_AS_PATH = "/%2f%2fevil.com";

/** Real in-app destinations, including query and hash, must survive intact. */
const LEGITIMATE = [
  "/portal",
  "/admin/leads",
  "/uk/courses/business-management",
  "/portal?tab=x",
  "/portal#top",
];

describe("safeRedirectUrl", () => {
  // The invariant that actually matters, asserted over every hostile input.
  it.each([...REJECTED, CONTAINED_AS_PATH])("keeps %j on the site origin", (raw) => {
    expect(safeRedirectUrl(raw, ORIGIN).host).toBe("gradmire.com");
  });

  it.each(LEGITIMATE)("preserves %j", (path) => {
    expect(safeRedirectUrl(path, ORIGIN).href).toBe(`${ORIGIN}${path}`);
  });

  it("falls back when the value is missing", () => {
    for (const empty of [null, undefined, ""]) {
      expect(safeRedirectUrl(empty, ORIGIN).href).toBe(`${ORIGIN}${DEFAULT_REDIRECT}`);
    }
  });
});

describe("safeNextPath", () => {
  it.each(REJECTED)("rejects %j", (raw) => {
    expect(safeNextPath(raw)).toBe(DEFAULT_REDIRECT);
  });

  it("keeps encoded slashes as one harmless path segment", () => {
    expect(safeNextPath(CONTAINED_AS_PATH)).toBe(CONTAINED_AS_PATH);
  });

  it.each(LEGITIMATE)("returns %j unchanged", (path) => {
    expect(safeNextPath(path)).toBe(path);
  });

  it("rejects a relative path, which would resolve against the current page", () => {
    expect(safeNextPath("portal")).toBe(DEFAULT_REDIRECT);
    expect(safeNextPath("../admin")).toBe(DEFAULT_REDIRECT);
  });
});
