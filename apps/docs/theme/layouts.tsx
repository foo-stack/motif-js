import { themesToCssBlock } from '@motif-js/core';
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

function ThemeShell({ children }: { children: ReactNode }) {
  return (
    <>
      <style data-motif-themes="docs" dangerouslySetInnerHTML={motifVarsHtml} />
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
