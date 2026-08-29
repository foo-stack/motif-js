import { defineConfig, devices } from '@playwright/test';

/**
 * Cascade-layer ordering tests, deliberately separate from the visual run.
 *
 * Two reasons for a second config rather than another `testDir` entry in
 * `playwright.config.ts`: these are functional assertions on computed styles,
 * not screenshots, so none of the snapshot settings apply; and the visual run
 * is the committed-baseline gate, so folding a functional test into it would
 * mean a baseline drift could mask a real cascade regression.
 *
 * No `webServer`. The fixtures are static files with no build step, so the
 * tests load them over `file://` and the suite needs nothing running.
 */
export default defineConfig({
  testDir: './tests/cascade',
  fullyParallel: true,
  retries: 0,
  reporter: 'list',
  use: { trace: 'off' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
