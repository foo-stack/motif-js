import { defineConfig } from '@playwright/test';

// Single Electron smoke test. No browser projects - Playwright drives the
// Electron app directly via its `_electron` API, so no `playwright install`
// of browser binaries is needed, only Electron itself.
export default defineConfig({
  testDir: '.',
  testMatch: 'smoke.test.ts',
  timeout: 60_000,
  reporter: 'list',
  fullyParallel: false,
});
