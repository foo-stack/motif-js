import { Box, SSRStyleCollector, ThemeProvider } from '@motif-js/react-web';
import type { Theme } from '@motif-js/core';
import { createElement, type CSSProperties, type ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import { bench, describe } from 'vitest';

/**
 * Render-heavy bench: list of N items, each with style props.
 *
 * Three variants tell the same visual story but exercise different paths:
 *
 * 1. **runtime** — `<Box p={4} bg="#3b82f6" />`. Every render goes
 *    through `resolveResponsiveStylesToVars` and `injectAtRules`.
 *
 * 2. **compiled** — `<Box p={4} bg="#3b82f6" />` AFTER the babel plugin
 *    has stripped the style props and baked them into `style=` /
 *    `className=`. We simulate that here by passing the props the
 *    plugin would emit. Box's fast-path skips the resolver entirely.
 *
 * 3. **vanilla** — `<div style={...}>` with no motif involvement. The
 *    theoretical floor; useful as the absolute baseline.
 */

const N = 200;

const theme: Theme = {
  name: 'bench',
  tokens: {
    space: { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 6: 24, 8: 32 },
    colors: { brand: { 500: '#3b82f6' } },
  },
};

const COMPILED_STYLE: CSSProperties = { padding: 16, backgroundColor: '#3b82f6' };

function RuntimeRow(): ReactElement {
  // Style props supplied as runtime props — the resolver path runs.
  return createElement(Box, { p: '$4', bg: '$colors.brand.500' });
}

function CompiledRow(): ReactElement {
  // What the compiler emits: style + className already baked, no style
  // props remain on the element. Box's fast-path early-returns.
  return createElement(Box, { style: COMPILED_STYLE });
}

function VanillaRow(): ReactElement {
  return createElement('div', { style: COMPILED_STYLE });
}

function buildTree(Row: () => ReactElement): ReactElement {
  const items: ReactElement[] = [];
  for (let i = 0; i < N; i++) {
    items.push(createElement(Row, { key: i }));
  }
  return createElement(ThemeProvider, { themes: [theme], active: 'bench' }, ...items);
}

/**
 * Each iteration runs inside its own `SSRStyleCollector`, simulating a
 * cold per-request render. Without this, the module-level injected-set
 * dedupes after the first iteration and the runtime path looks
 * artificially fast.
 */
describe('list of boxes — server-side render', () => {
  bench(`runtime — ${N} <Box p={...} bg={...}>`, () => {
    new SSRStyleCollector().collect(() => renderToString(buildTree(RuntimeRow)));
  });

  bench(`compiled — ${N} <Box style={...}> (post-plugin shape)`, () => {
    new SSRStyleCollector().collect(() => renderToString(buildTree(CompiledRow)));
  });

  bench(`vanilla — ${N} <div style={...}> (no motif)`, () => {
    renderToString(buildTree(VanillaRow));
  });
});
