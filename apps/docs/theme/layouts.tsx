import { themesRuntimeCss, themesToCssBlock } from '@motif-js/core';
import { Box } from '@motif-js/react';
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

const motifVarsCss = themesToCssBlock([lightTheme, darkTheme]);
const motifVarsHtml = { __html: motifVarsCss };

// motif-js 1.2 runtime emission: `@font-face` decls, `body` / `::selection`
// resets, and the `prefers-reduced-motion` guard. The docs site doesn't
// use motif's `<ThemeProvider>` (active theme cycles via `<html data-theme>`
// + ThemeToggle MutationObserver), so we emit the runtime block ourselves
// alongside the token-vars block.
const motifRuntimeCss = themesRuntimeCss([lightTheme, darkTheme]);
const motifRuntimeHtml = { __html: motifRuntimeCss };

function ThemeShell({ children }: { children: ReactNode }) {
  return (
    <MDXComponentsProvider components={mdxComponents}>
      <style data-motif-themes="docs" dangerouslySetInnerHTML={motifVarsHtml} />
      <style data-motif-themes="docs-runtime" dangerouslySetInnerHTML={motifRuntimeHtml} />
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
