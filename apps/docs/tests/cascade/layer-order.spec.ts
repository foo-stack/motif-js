import { expect, test, type Page } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

/**
 * Cascade-layer ordering against a Tailwind v4-shaped stylesheet.
 *
 * These assert CSS cascade semantics, not motif defects. The two
 * "wrong ordering" cases stay true forever, and they are the regression guard
 * for the guide: if either stops holding, the ordering the guide documents has
 * to be re-derived. Do not delete them as tests for a fixed bug.
 *
 * jsdom cannot host these. It drops the contents of `@layer` blocks entirely,
 * so a Vitest version of this file would pass while asserting nothing.
 */
function fixture(name: string): string {
  return pathToFileURL(resolve(import.meta.dirname, 'fixtures', `${name}.html`)).href;
}

/** Computed box values for one element, as strings the assertions can read. */
async function box(page: Page, selector: string) {
  return page.locator(selector).evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      padding: style.paddingTop,
      margin: style.marginTop,
      background: style.backgroundColor,
    };
  });
}

const MOTIF_BLUE = 'rgb(0, 0, 255)';

test('fixture loads and the Tailwind utility applies', async ({ page }) => {
  await page.goto(fixture('correct'));
  await expect(page.locator('#plain')).toHaveText('motif base props only');
  expect((await box(page, '#contested')).padding).toBe('32px');
});

test('documented ordering makes motif outrank Tailwind', async ({ page }) => {
  // `@layer motif, app;` placed after the import cannot reorder Tailwind's
  // existing layers, so `motif` is appended above `utilities`. The guide
  // promised the app's CSS would win; it loses.
  await page.goto(fixture('documented'));

  expect(await box(page, '#contested')).toEqual({
    padding: '12px', // motif, not the .p-8 utility's 32px
    margin: '8px',
    background: MOTIF_BLUE,
  });
});

test('ordering motif before base lets preflight zero padding and margin', async ({ page }) => {
  // The obvious correction. Tailwind now wins, preflight included, and
  // preflight's universal reset zeroes exactly the two properties motif set.
  await page.goto(fixture('motif-first'));

  expect(await box(page, '#plain')).toEqual({
    padding: '0px',
    margin: '0px',
    // Preflight does not reset background, so this proves motif's sheet did
    // load and only the reset properties were lost. That selectiveness is why
    // the failure reads as a motif bug rather than a cascade-order one.
    background: MOTIF_BLUE,
  });
});

test('motif between base and components survives preflight and yields to utilities', async ({
  page,
}) => {
  await page.goto(fixture('correct'));

  // Preflight can no longer clobber motif.
  expect(await box(page, '#plain')).toEqual({
    padding: '12px',
    margin: '8px',
    background: MOTIF_BLUE,
  });

  // A Tailwind utility still overrides motif, which is what an incremental
  // migration needs.
  expect((await box(page, '#contested')).padding).toBe('32px');
});
