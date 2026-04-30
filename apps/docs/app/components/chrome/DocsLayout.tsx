import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { OnThisPage } from './OnThisPage';

export interface DocsLayoutProps {
  /** The article body. Lives in `<article class="article">` so the
   *  design's `.article h1`, `.article p` etc. cascade rules apply. */
  children: ReactNode;
}

/**
 * Three-column docs shell.
 *
 *   ≥ 1100px : sidebar | article | OnThisPage
 *   ≥  760px : sidebar | article            (TOC hides via media query)
 *   <  760px : article only                  (sidebar lives in the mobile sheet)
 *
 * The `.layout` class drives the grid template. Article content is
 * wrapped in `<article class="article">` so prose styling cascades
 * via the design's site.css rules.
 */
export function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="layout">
      <Sidebar />
      <article className="article" data-pagefind-body>
        {children}
      </article>
      <OnThisPage />
    </div>
  );
}
