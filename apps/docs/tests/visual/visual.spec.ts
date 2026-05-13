import { type Page, expect, test } from '@playwright/test';

const ROUTES = [
  '/',
  '/404',
  '/changelog',
  '/concepts/composition',
  '/concepts/responsive',
  '/concepts/theming',
  '/concepts/tokens',
  '/concepts/variants',
  '/getting-started/installation',
  '/getting-started/introduction',
  '/getting-started/web-and-native',
  '/getting-started/your-first-style',
  '/guides/design-system',
  '/guides/migrating-styled-components',
  '/guides/performance',
  '/guides/server-rendering',
  '/migrating/v1-to-v2',
  '/recipes/animation',
  '/recipes/buttons',
  '/recipes/forms',
  '/recipes/layouts',
  '/reference/create-theme',
  '/reference/ssr',
  '/reference/styled',
  '/reference/theme',
  '/reference/use-theme',
] as const;

async function settle(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({
    content: `
      .marquee__track { animation: none !important; transform: none !important; }
      *, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; }
    `,
  });
}

for (const route of ROUTES) {
  test(`visual ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'load' });
    await settle(page);
    const slug = route === '/' ? 'home' : route.slice(1).replace(/\//g, '_');
    await expect(page).toHaveScreenshot(`${slug}.png`, { fullPage: true });
  });
}
