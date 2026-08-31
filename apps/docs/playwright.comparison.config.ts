import { defineConfig, devices } from '@playwright/test';

const PORT = 4321;

/**
 * Side-by-side comparison against the design prototype, deliberately separate
 * from the visual run.
 *
 * This suite needs a second server the repository cannot start: the prototype
 * is a local folder outside the checkout, served by hand on port 4322. That
 * makes it a development harness rather than a gate, and it cannot pass on a
 * fresh clone or in CI.
 *
 * It lived in `tests/visual/` until now, which meant `visual-check` picked it
 * up and failed 50 tests on every machine, on every run, forever. A gate that
 * can never be green is a gate nobody runs, and nobody did: no workflow has
 * ever executed `visual-check`, and the committed baselines drifted unnoticed
 * for three months behind those permanent failures.
 *
 * To run it: serve the prototype on 4322, then `yarn comparison-check`.
 */
export default defineConfig({
  testDir: './tests/comparison',
  fullyParallel: true,
  retries: 0,
  workers: 4,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'off',
  },
  snapshotDir: './__visual__',
  snapshotPathTemplate: '{snapshotDir}/baseline/{arg}{-projectName}{ext}',
  expect: {
    toHaveScreenshot: {
      threshold: 0.02,
      maxDiffPixels: 200,
      animations: 'disabled',
      caret: 'hide',
    },
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'yarn preview',
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
