import { themesToCssBlock } from '@motif-js/core';
import type { ComponentType, ReactNode } from 'react';
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

const stub: ComponentType<{ children: ReactNode }> = ({ children }) => (
  <ThemeShell>{children}</ThemeShell>
);

export const DocLayout = stub;
export const BlankLayout = stub;
export const MarketingLayout = stub;
export const BlogPostLayout = stub;
export const ChangelogLayout = stub;
export const ApiLayout = stub;
export const GuideLayout = stub;
export const NotFoundLayout = stub;
