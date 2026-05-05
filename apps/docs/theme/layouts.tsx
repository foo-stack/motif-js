import { themesToCssBlock } from '@motif-js/core';
import type { ComponentType, ReactNode } from 'react';
import { Footer } from './chrome/Footer.js';
import { OnThisPage } from './chrome/OnThisPage.js';
import { PageNav } from './chrome/PageNav.js';
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

const stub: ComponentType<{ children: ReactNode }> = ({ children }) => (
  <ThemeShell>{children}</ThemeShell>
);

export const BlankLayout = stub;
export const MarketingLayout = stub;
export const BlogPostLayout = stub;
export const ChangelogLayout = stub;
export const ApiLayout = stub;
export const GuideLayout = stub;
export const NotFoundLayout = stub;
