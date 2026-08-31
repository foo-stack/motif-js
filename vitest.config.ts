import { defineConfig } from 'vitest/config';

/**
 * Root Vitest config - discovers per-package vitest.config.ts files.
 *
 * To add tests to a package: drop a vitest.config.ts in the package root,
 * add a "test": "vitest run" script to its package.json, and write
 * src/**\/*.test.ts files. The glob below picks it up automatically.
 */
export default defineConfig({
  test: {
    projects: ['packages/*/vitest.config.ts'],
  },
});
