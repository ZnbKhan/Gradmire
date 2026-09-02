/**
 * Constrains a user-supplied `next` parameter to a path on this origin.
 *
 * Naively interpolating (`${origin}${next}`) is an open redirect: `origin`
 * carries no trailing slash, so "@evil.com" yields
 * "https://gradmire.com@evil.com" (host evil.com, gradmire.com as userinfo)
 * and ".evil.com" yields "https://gradmire.com.evil.com". Both authenticate
 * the victim and then hand them to the attacker.
 *
 * Only a single-slash absolute path is accepted; everything else falls back.
 */
export const DEFAULT_REDIRECT = "/portal";

export function safeNextPath(raw: string | null | undefined): string {
  if (!raw) return DEFAULT_REDIRECT;

  // Must be an absolute path, and must not be protocol-relative ("//host"
  // or "/\host", which some browsers normalise to "//host").
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) {
    return DEFAULT_REDIRECT;
  }

  try {
    // Resolve against a sentinel origin: if anything in the input escapes
    // that origin, it is not a local path.
    const sentinel = "https://redirect-guard.invalid";
    const url = new URL(raw, sentinel);
    if (url.origin !== sentinel) return DEFAULT_REDIRECT;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return DEFAULT_REDIRECT;
  }
}

/** Builds an absolute redirect target that is guaranteed to stay on `origin`. */
export function safeRedirectUrl(raw: string | null | undefined, origin: string): URL {
  const url = new URL(safeNextPath(raw), origin);
  // Belt and braces: a mismatch here means the path smuggled an origin.
  if (url.origin !== new URL(origin).origin) {
    return new URL(DEFAULT_REDIRECT, origin);
  }
  return url;
}
