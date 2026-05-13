import { themesRuntimeCss, themesToCssBlock } from '@motif-js/core';
import { definePlugin } from '@vorge/core/plugins';
import { darkTheme, lightTheme } from '../theme/tokens.js';

// Hoist motif's CSS-variable block into <head>. The variables
// (`--colors-surface-paper`, etc.) are referenced by chrome.css's
// render-blocking `body { background: var(--colors-surface-paper) }`
// rule, which is loaded as an external stylesheet in <head>. If the
// variables are only defined later in <body> (the natural place if
// they came from a React component) the body paints with an undefined
// var → transparent → canvas color on first paint, then repaints once
// the body-scoped <style> block is parsed. That's the tiny flicker on
// every route change — vorge has no SPA router, so every internal link
// is a full document load and the repaint is visible each time.
//
// Computed once at module load. Tokens are static, so this never needs
// to re-run; if tokens.ts changes, restart the dev server.
const motifVarsCss = themesToCssBlock([lightTheme, darkTheme]);
const motifRuntimeCss = themesRuntimeCss([lightTheme, darkTheme]);

const HEAD_INJECTION =
  `<style data-motif-themes="docs">${motifVarsCss}</style>` +
  `<style data-motif-themes="docs-runtime">${motifRuntimeCss}</style>`;

export function motifThemes() {
  return definePlugin({
    name: 'docs:motif-themes',
    transformHtml(html) {
      return html.replace('</head>', `${HEAD_INJECTION}</head>`);
    },
  });
}
