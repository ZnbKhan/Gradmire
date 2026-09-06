import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

/**
 * Unit tests live beside the code they cover, under `src`. The migration
 * test lives in `tests/` instead, because it boots a real Postgres and is an
 * order of magnitude slower than everything else.
 *
 * `vite-tsconfig-paths` reuses the `@/*` alias from tsconfig.json rather than
 * restating it here, so the two cannot drift.
 */
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ["src/**/*.test.ts", "tests/**/*.test.ts"],
    // Explicit imports from "vitest" rather than ambient globals, so tsc
    // type-checks the tests without extra `types` entries in tsconfig.
    globals: false,
    // The migration test applies every migration to a fresh database.
    testTimeout: 30_000,
  },
});
