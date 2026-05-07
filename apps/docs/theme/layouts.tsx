import { themesRuntimeCss, themesToCssBlock } from '@motif-js/core';
import type { ComponentType, ReactNode } from 'react';
import { Footer } from './chrome/Footer.js';
import { OnThisPage } from './chrome/OnThisPage.js';
import { PageNav } from './chrome/PageNav.js';
import { SearchModal } from './chrome/SearchModal.js';
import { Sidebar } from './chrome/Sidebar.js';
import { TopNav } from './chrome/TopNav.js';
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
    <>
      <style data-motif-themes="docs" dangerouslySetInnerHTML={motifVarsHtml} />
      <style data-motif-themes="docs-runtime" dangerouslySetInnerHTML={motifRuntimeHtml} />
      {children}
      <SearchModal />
    </>
  );
}

export function DocLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeShell>
      <TopNav />
      <div className="layout">
        <Sidebar />
        <main className="article">
          {children}
          <PageNav />
        </main>
        <OnThisPage />
      </div>
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
      <main className="not-found">{children}</main>
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
