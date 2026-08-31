// Side-by-side comparison spec: docs site vs reference prototype.
//
// Reference is the Babel-runtime React prototype under
// ~/Downloads/Motif Documentation/, served on :4322 (python -m http.server).
// Docs site is the built vorge preview on :4321 (yarn preview).
//
// Drives the prototype's internal state by clicking the visible chrome
// (top-nav links, sidebar items). Forces both surfaces to LIGHT theme so the
// comparison is apples-to-apples.

import { expect, test, type Page } from '@playwright/test';

const DOCS = 'http://localhost:4321';
const REF = 'http://localhost:4322';

type RefDriver = (page: Page) => Promise<void>;

type Pair = {
  slug: string;
  docsPath: string;
  refDriver: RefDriver;
  /** True when prototype has no specific page for this route - same template */
  templateOnly?: boolean;
  /** True when there is no remotely comparable reference. */
  noReference?: boolean;
};

// Sidebar labels in the prototype, keyed by the prototype's internal docId.
const SIDEBAR_LABEL: Record<string, string> = {
  introduction: 'Introduction',
  installation: 'Installation',
  'first-style': 'Your first style',
  platforms: 'Web and native',
  tokens: 'Tokens',
  variants: 'Variants',
  theming: 'Theming',
  composition: 'Composition',
  responsive: 'Responsive styles',
};

async function gotoDocs(page: Page, route: string) {
  await page.goto(`${DOCS}${route}`, { waitUntil: 'load' });
}

async function gotoRef(page: Page) {
  await page.goto(`${REF}/index.html`, { waitUntil: 'load' });
  // Wait for Babel + React UMD to mount before interacting.
  await page.waitForSelector('nav, .topnav, [class*="nav"]', { timeout: 10_000 });
  // Prototype defaults to dark theme. The React useEffect that drives
  // data-theme runs once on mount; once that's landed we override directly
  // so the assertion-only viewport (mobile) doesn't depend on the
  // toggle button being clickable in the responsive top-nav.
  await page.waitForFunction(() => !!document.documentElement.dataset.theme);
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
}

async function settle(page: Page) {
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({
    content: `
      .marquee__track { animation: none !important; transform: none !important; }
      *, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; }
    `,
  });
  // Any vorge `<Island>`s on the page need their lazy chunk to load before
  // the screenshot. Wait until no `--pending` containers remain, or move
  // on after 4s if there were none / they never settled.
  await page
    .waitForFunction(() => document.querySelectorAll('.vorge-island--pending').length === 0, {
      timeout: 4_000,
    })
    .catch(() => undefined);
  // Small extra beat for React-driven layout shifts to settle.
  await page.waitForTimeout(150);
}

// On mobile, the prototype's top-nav links visually overflow but stay in the
// DOM. Pointer-event interception trips Playwright's actionability checks,
// so we click via DOM .click() to bypass them while keeping React handlers.
async function clickByText(page: Page, selector: string, text: string) {
  await page.evaluate(
    ({ selector, text }) => {
      const el = Array.from(document.querySelectorAll<HTMLElement>(selector)).find(
        (n) => n.textContent?.trim().toLowerCase() === text.toLowerCase(),
      );
      if (!el) throw new Error(`no ${selector} matching "${text}"`);
      el.click();
    },
    { selector, text },
  );
}

const docsArticle =
  (refId: string): RefDriver =>
  async (page: Page) => {
    await clickByText(page, '.nav__right a', 'Docs');
    // The sidebar is in the DOM but display:none at mobile widths; wait for
    // presence (state: 'attached') and drive it via JS .click() below.
    await page.waitForSelector('aside.sidebar', { state: 'attached', timeout: 5_000 });
    if (refId !== 'introduction') {
      const label = SIDEBAR_LABEL[refId];
      if (!label) throw new Error(`no sidebar label for refId=${refId}`);
      // "Responsive styles" has a "new" badge inside the same anchor;
      // match on the anchor's normalized leading label instead of full text.
      await page.evaluate(
        ({ label }) => {
          const link = Array.from(document.querySelectorAll<HTMLElement>('aside.sidebar a')).find(
            (n) =>
              (n.firstChild?.textContent?.trim() ?? n.textContent?.trim() ?? '').startsWith(label),
          );
          if (!link) throw new Error(`no sidebar link matching "${label}"`);
          link.click();
        },
        { label },
      );
    }
  };

const guidePage: RefDriver = async (page: Page) => {
  await clickByText(page, '.nav__right a', 'Guides');
};

const apiPage: RefDriver = async (page: Page) => {
  await clickByText(page, '.nav__right a', 'API');
};

const notFound: RefDriver = async (page: Page) => {
  // "Blog" link in the prototype's top-nav routes to 404 (Nav.jsx line 70).
  await clickByText(page, '.nav__right a', 'Blog');
};

const changelog: RefDriver = async (page: Page) => {
  // Only entry-point is the "See full changelog" CTA on the home page.
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll<HTMLElement>('button')).find((n) =>
      /see full changelog/i.test(n.textContent ?? ''),
    );
    if (!btn) throw new Error('no "See full changelog" button found');
    btn.click();
  });
};

const home: RefDriver = async () => {
  // Default page after gotoRef.
};

const PAIRS: Pair[] = [
  { slug: 'home', docsPath: '/', refDriver: home },
  { slug: '404', docsPath: '/404', refDriver: notFound },
  { slug: 'changelog', docsPath: '/changelog', refDriver: changelog },

  // Concepts → docs template w/ matching docId
  {
    slug: 'concepts-composition',
    docsPath: '/concepts/composition',
    refDriver: docsArticle('composition'),
  },
  {
    slug: 'concepts-responsive',
    docsPath: '/concepts/responsive',
    refDriver: docsArticle('responsive'),
  },
  { slug: 'concepts-theming', docsPath: '/concepts/theming', refDriver: docsArticle('theming') },
  { slug: 'concepts-tokens', docsPath: '/concepts/tokens', refDriver: docsArticle('tokens') },
  { slug: 'concepts-variants', docsPath: '/concepts/variants', refDriver: docsArticle('variants') },

  // Getting started → docs template w/ matching docId
  {
    slug: 'getting-started-installation',
    docsPath: '/getting-started/installation',
    refDriver: docsArticle('installation'),
  },
  {
    slug: 'getting-started-introduction',
    docsPath: '/getting-started/introduction',
    refDriver: docsArticle('introduction'),
  },
  {
    slug: 'getting-started-web-and-native',
    docsPath: '/getting-started/web-and-native',
    refDriver: docsArticle('platforms'),
  },
  {
    slug: 'getting-started-your-first-style',
    docsPath: '/getting-started/your-first-style',
    refDriver: docsArticle('first-style'),
  },

  // Guides → prototype has one guide template (design-system).
  // Compare each docs guide against that template - drift in chrome/layout
  // is real even if the body content differs.
  { slug: 'guides-design-system', docsPath: '/guides/design-system', refDriver: guidePage },
  {
    slug: 'guides-migrating-styled-components',
    docsPath: '/guides/migrating-styled-components',
    refDriver: guidePage,
    templateOnly: true,
  },
  {
    slug: 'guides-performance',
    docsPath: '/guides/performance',
    refDriver: guidePage,
    templateOnly: true,
  },
  {
    slug: 'guides-server-rendering',
    docsPath: '/guides/server-rendering',
    refDriver: guidePage,
    templateOnly: true,
  },

  // Reference → prototype has one API template (motif()).
  { slug: 'reference-styled', docsPath: '/reference/styled', refDriver: apiPage },
  {
    slug: 'reference-create-theme',
    docsPath: '/reference/create-theme',
    refDriver: apiPage,
    templateOnly: true,
  },
  { slug: 'reference-ssr', docsPath: '/reference/ssr', refDriver: apiPage, templateOnly: true },
  { slug: 'reference-theme', docsPath: '/reference/theme', refDriver: apiPage, templateOnly: true },
  {
    slug: 'reference-use-theme',
    docsPath: '/reference/use-theme',
    refDriver: apiPage,
    templateOnly: true,
  },

  // Recipes: prototype has sidebar entries (r-buttons etc.) but DocsArticle
  // headerByTopic has no matching key - it falls back to the "first-style"
  // article. Capture against the docs template anyway for chrome comparison;
  // body drift is expected.
  {
    slug: 'recipes-buttons',
    docsPath: '/recipes/buttons',
    refDriver: docsArticle('first-style'),
    templateOnly: true,
  },
  {
    slug: 'recipes-forms',
    docsPath: '/recipes/forms',
    refDriver: docsArticle('first-style'),
    templateOnly: true,
  },
  {
    slug: 'recipes-layouts',
    docsPath: '/recipes/layouts',
    refDriver: docsArticle('first-style'),
    templateOnly: true,
  },
  {
    slug: 'recipes-animation',
    docsPath: '/recipes/animation',
    refDriver: docsArticle('first-style'),
    templateOnly: true,
  },
];

// Override snapshot path to land each pair under
// __visual__/comparison/<slug>/<which>-<projectName>.png
// (which = 'current' or 'reference').
test.describe.configure({ mode: 'parallel' });

for (const pair of PAIRS) {
  test(`compare ${pair.slug} — current`, async ({ page }) => {
    await gotoDocs(page, pair.docsPath);
    await settle(page);
    await expect(page).toHaveScreenshot(['comparison', pair.slug, 'current.png'], {
      fullPage: true,
    });
  });

  test(`compare ${pair.slug} — reference`, async ({ page }) => {
    await gotoRef(page);
    await pair.refDriver(page);
    await settle(page);
    await expect(page).toHaveScreenshot(['comparison', pair.slug, 'reference.png'], {
      fullPage: true,
    });
  });
}
