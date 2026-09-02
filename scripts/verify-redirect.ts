import { safeNextPath, safeRedirectUrl } from "../src/lib/safe-redirect";

const ORIGIN = "https://gradmire.com";

const attacks = [
  "@evil.com", ".evil.com", "//evil.com", "/\\evil.com", "\\\\evil.com",
  "https://evil.com", "http://evil.com", "javascript:alert(1)",
  "///evil.com", "/%2f%2fevil.com", "%2F%2Fevil.com", "-evil.com",
  ":@evil.com", "?next=x", "//evil.com/path",
];
const legit = ["/portal", "/admin/leads", "/uk/courses/business-management", "/portal?tab=x", "/portal#top"];

let failures = 0;

console.log("BEFORE (vulnerable pattern) vs AFTER (safeRedirectUrl)\n");
for (const a of attacks) {
  let before = "n/a";
  try { before = new URL(`${ORIGIN}${a}`).host; } catch { before = "throws"; }
  const after = safeRedirectUrl(a, ORIGIN);
  const leaked = after.host !== "gradmire.com";
  if (leaked) failures++;
  const escapedBefore = before !== "gradmire.com" && before !== "throws";
  console.log(
    `${escapedBefore ? "EXPLOIT" : "  ok   "}  ${JSON.stringify(a).padEnd(22)} before-host=${before.padEnd(24)} after=${after.href}`,
  );
}

console.log("\nlegitimate paths preserved:");
for (const p of legit) {
  const got = safeNextPath(p);
  const ok = got === p;
  if (!ok) failures++;
  console.log(`  ${ok ? "ok  " : "FAIL"} ${p} -> ${got}`);
}

console.log(failures === 0 ? "\nALL REDIRECTS CONTAINED" : `\n${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
