import { themesRuntimeCss, themesToCssBlock } from '@motif-js/core';
import { Box } from 'usemotif';
import { MDXComponentsProvider } from '@vorge/core/runtime';
import type { ComponentType, ReactNode } from 'react';
import { Footer } from './chrome/Footer.js';
import { OnThisPage } from './chrome/OnThisPage.js';
import { PageNav } from './chrome/PageNav.js';
import { SearchModal } from './chrome/SearchModal.js';
import { Sidebar } from './chrome/Sidebar.js';
import { TopNav } from './chrome/TopNav.js';
import { mdxComponents } from './_mdxComponents.js';
import { NotFoundShell } from './_NotFound.js';
import { darkTheme, lightTheme } from './tokens.js';

// motif's CSS-variable block + 1.2 runtime block (`@font-face` decls,
// `body` / `::selection` resets, reduced-motion guard) need to be in
// scope before chrome.css's render-blocking `body { background:
// var(--colors-surface-paper) }` is resolved. Otherwise the first paint
// gets an undefined var → transparent → canvas (white), then repaints
// once a later style block defines the vars — the tiny flicker users
// see on every route change, since vorge has no SPA router.
//
// Production: `plugins/motif-themes.ts` injects both blocks into <head>
// via vorge's `transformHtml` hook, so the body shell omits them.
//
// Dev: vorge's dev server doesn't run plugin `transformHtml` (only
// `vite.transformIndexHtml`), so the head plugin never fires. We fall
// back to body emission here, which means dev still has the route-
// change flicker — acceptable because dev is a maintainer experience
// and production users see the fixed behavior.
const DEV_THEME_VARS_HTML = import.meta.env.PROD
  ? null
  : { __html: themesToCssBlock([lightTheme, darkTheme]) };
const DEV_THEME_RUNTIME_HTML = import.meta.env.PROD
  ? null
  : { __html: themesRuntimeCss([lightTheme, darkTheme]) };

function ThemeShell({ children }: { children: ReactNode }) {
  return (
    <MDXComponentsProvider components={mdxComponents}>
      {DEV_THEME_VARS_HTML ? (
        <style data-motif-themes="docs-dev" dangerouslySetInnerHTML={DEV_THEME_VARS_HTML} />
      ) : null}
      {DEV_THEME_RUNTIME_HTML ? (
        <style
          data-motif-themes="docs-dev-runtime"
          dangerouslySetInnerHTML={DEV_THEME_RUNTIME_HTML}
        />
      ) : null}
      {children}
      <SearchModal />
    </MDXComponentsProvider>
  );
}

export function DocLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeShell>
      <TopNav />
      <Box
        display="grid"
        gridTemplateColumns={{
          base: 'minmax(0, 1fr)',
          md: '220px minmax(0, 1fr)',
          lg: '244px minmax(0, 1fr) 220px',
        }}
        maxW={1440}
        mx="auto"
        gap={{ base: 0, md: 40, lg: 56 }}
        px={{ base: 20, md: 24, lg: 32 }}
        pt={{ base: 20, md: 24, lg: 28 }}
        pb={{ base: 64, md: 80, lg: 96 }}
      >
        <Sidebar />
        {/* TOC scroll-margin moved into the MDX h2/h3 components
            (`style={{ scrollMarginTop: 88 }}`) — no longer chrome.css's
            concern. */}
        <Box as="main" minW={0} maxW={720}>
          {children}
          <PageNav />
        </Box>
        <OnThisPage />
      </Box>
      <Footer />
    </ThemeShell>
  );
}

export function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeShell>
      <TopNav />
      <main>{children}</main>
      <Footer />
    </ThemeShell>
  );
}

export function NotFoundLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeShell>
      <TopNav />
      <NotFoundShell>{children}</NotFoundShell>
      <Footer />
    </ThemeShell>
  );
}

const stub: ComponentType<{ children: ReactNode }> = ({ children }) => (
  <ThemeShell>{children}</ThemeShell>
);

export const BlankLayout = stub;
export const BlogPostLayout = stub;
export const ChangelogLayout = DocLayout;
export const ApiLayout = DocLayout;
export const GuideLayout = DocLayout;
