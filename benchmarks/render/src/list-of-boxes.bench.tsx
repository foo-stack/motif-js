import { Box, SSRStyleCollector, ThemeProvider } from '@motif-js/react-web';
import type { Theme } from '@motif-js/core';
import { createElement, type CSSProperties, type ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import { bench, describe } from 'vitest';

/**
 * Render-heavy bench: list of N items, each with style props.
 *
 * Four variants tell the same visual story but exercise different paths:
 *
 * 1. **runtime** — `<Box p={4} bg="#3b82f6" />`. Every render goes
 *    through `resolveResponsiveStylesToVars` and `injectAtRules`.
 *
 * 2. **compiled** — `<Box style={...} />` AFTER the babel plugin has
 *    stripped the style props and baked them into `style=` / `className=`.
 *    Simulates the pre-wrapper-stripping output: Box's fast-path
 *    early-returns, but we still pay for the React function-component call.
 *
 * 3. **compiled-stripped** — `<div style={...} />` AFTER the babel
 *    plugin's wrapper-stripping pass replaces the `<Box>` wrapper with the
 *    underlying HTML tag. The current compiler emits this shape for
 *    fully-static call sites.
 *
 * 4. **vanilla** — `<div style={...}>` with no motif involvement. The
 *    theoretical floor; useful as the absolute baseline. With
 *    wrapper-stripping the `compiled-stripped` row should match it.
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
  // Pre-wrapper-stripping shape: style baked but `<Box>` wrapper still
  // present. Box's fast-path early-returns but the React function call
  // is still paid.
  return createElement(Box, { style: COMPILED_STYLE });
}

function CompiledStrippedRow(): ReactElement {
  // Post-wrapper-stripping shape: compiler replaced `<Box>` with `<div>`
  // because the call site is fully static. No motif involvement at runtime.
  return createElement('div', { style: COMPILED_STYLE });
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

  bench(`compiled — ${N} <Box style={...}> (pre-strip shape)`, () => {
    new SSRStyleCollector().collect(() => renderToString(buildTree(CompiledRow)));
  });

  bench(`compiled-stripped — ${N} <div style={...}> (post-strip shape)`, () => {
    new SSRStyleCollector().collect(() => renderToString(buildTree(CompiledStrippedRow)));
  });

  bench(`vanilla — ${N} <div style={...}> (no motif)`, () => {
    renderToString(buildTree(VanillaRow));
  });
});
