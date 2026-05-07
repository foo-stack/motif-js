import { defineConfig, devices } from '@playwright/test';

const PORT = 4321;

export default defineConfig({
  testDir: './tests/visual',
  fullyParallel: true,
  retries: 0,
  workers: 4,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'off',
  },
  // Snapshots land in apps/docs/__visual__/baseline/ rather than the
  // default `<test>-snapshots/` folder. The baseline IS the gate; we
  // commit it to git so phase commits can be diffed.
  snapshotDir: './__visual__',
  snapshotPathTemplate: '{snapshotDir}/baseline/{arg}{-projectName}{ext}',
  expect: {
    toHaveScreenshot: {
      // Phase 8 fidelity gate: ≤ 4px / ≤ 2 hex-units. maxDiffPixelRatio
      // and threshold are both belt-and-braces — threshold is per-pixel
      // color tolerance (0.02 ≈ 2 hex units of drift); maxDiffPixels
      // bounds total pixel-count diffs.
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
    {
      // iPhone 15 dimensions on Chromium so we don't need a webkit
      // install. The viewport + DPR + isMobile + hasTouch carry the
      // important behaviors for visual diffs.
      name: 'mobile',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 393, height: 852 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  // Vorge preview is HTTP/1.1 on :4321. Reuse a running server if one
  // exists; otherwise spawn it. Build is a prerequisite (caller runs
  // `yarn build` before snapshotting; we don't rebuild on every test).
  webServer: {
    command: 'yarn preview',
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
