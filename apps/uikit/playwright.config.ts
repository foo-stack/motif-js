import { defineConfig, devices } from '@playwright/test';

const PORT = 6006;

// Visual-regression config, mirroring apps/docs: baselines live in
// __visual__/baseline/ and ARE the gate (committed to git). The caller builds
// Storybook first (`yarn build`); the webServer just serves storybook-static.
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
    {
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
  webServer: {
    command: 'yarn serve-storybook',
    url: `http://localhost:${PORT}/index.json`,
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
