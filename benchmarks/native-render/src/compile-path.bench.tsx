import { Box, ThemeProvider } from '@motif-js/react-native';
import type { Theme } from '@motif-js/core';
import { act, createElement, type ReactElement } from 'react';
import { createRoot } from 'react-dom/client';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { bench, describe } from 'vitest';

// React 19 prints noise without this flag — same workaround the
// `native-container` bench uses.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/**
 * Native compile-path bench — closes T3.5's runtime-side acceptance
 * line ("compiled rows ~2× uncompiled rate").
 *
 * The compiler's job on native is to elide motif's runtime resolver
 * work for literal-arg call sites: it pre-resolves `<Box p="$4"
 * bg="$colors.brand.500" />` against the active theme, hoists the
 * resulting style object into a single file-top
 * `StyleSheet.create({ id0: {...} })`, and rewrites the JSX to
 * `<Box style={_motifStyles.id0} />`. At render time, the runtime
 * resolver short-circuits (a `style` prop with no responsive props
 * skips the responsive resolver entirely), and the only work left is
 * the React function-component call + the View commit.
 *
 * The three rows here exercise the three points on the optimisation
 * curve:
 *
 *   1. **runtime row** — full motif resolver path. Theme lookup,
 *      responsive resolver, `StyleSheet.create` per render, prop
 *      filtering. The cost the compiler exists to remove.
 *   2. **compiled row** — what the compiler emits. Pre-baked
 *      `StyleSheet`-id reference passed through `<Box>`'s `style`
 *      prop. Box's fast path detects that there are no live style
 *      props in `rest` and short-circuits to a plain View commit.
 *   3. **vanilla row** — `<View style={...}>` directly. No motif
 *      wrapper at all. Floor: pure React + RN.
 *
 * What the bench measures: motif's JS-side work (resolver, theme
 * lookups, prop filtering, the wrapper function call). What it does
 * NOT measure: native shadow-tree commit cost. jsdom doesn't run a
 * real native renderer; the View mock just produces DOM `<div>`
 * nodes. Native commit cost is shared by all three rows so the
 * relative numbers between them — which is what the acceptance
 * threshold compares — are still meaningful.
 *
 * Each iteration mounts a fresh React root, renders, and unmounts
 * synchronously. Same harness shape as `native-container` — measures
 * cold mount, which is the dominant cost in real apps for list
 * surfaces and screen-mount transitions.
 */

const ROW_COUNT = 200;

const theme: Theme = {
  name: 'bench',
  tokens: {
    space: { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 6: 24, 8: 32 },
    colors: { brand: { 500: '#3b82f6' } },
  },
};

// Pre-resolved literal style — what the compiler emits for
// `p="$4" bg="$colors.brand.500"` after walking the theme. Hoisted
// into a single `StyleSheet.create` block per file (the compiler's
// real artefact); the bench mimics that structure.
const compiledSheet = StyleSheet.create({
  id0: { padding: 16, backgroundColor: '#3b82f6' } as ViewStyle,
});

function RuntimeRow(): ReactElement {
  return createElement(Box, { p: '$4', bg: '$colors.brand.500' });
}

function CompiledRow(): ReactElement {
  // Compiler-emitted shape: `<Box>` wrapper still present (compiler
  // doesn't strip on native — the StyleSheet hoisting pass leaves
  // the wrapper since RN's commit pipeline differs from web's). The
  // wrapper's resolver path bails because there are no live style
  // props in `rest`.
  return createElement(Box, { style: compiledSheet.id0 });
}

function VanillaRow(): ReactElement {
  // Pure RN — no motif wrapper. Floor for the relative comparison.
  return createElement(View, { style: compiledSheet.id0 });
}

function makeRows(Row: () => ReactElement): ReactElement[] {
  const items: ReactElement[] = [];
  for (let i = 0; i < ROW_COUNT; i++) items.push(createElement(Row, { key: i }));
  return items;
}

function buildTree(Row: () => ReactElement): ReactElement {
  return createElement(
    ThemeProvider,
    { themes: [theme], active: 'bench' },
    createElement(Box, null, ...makeRows(Row)),
  );
}

function buildVanillaTree(Row: () => ReactElement): ReactElement {
  // Vanilla row doesn't read motif's theme — skip the provider so
  // its number reflects pure RN cost without any motif overhead.
  return createElement(View, null, ...makeRows(Row));
}

function renderOnce(tree: ReactElement): void {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const root = createRoot(host);
  act(() => root.render(tree));
  act(() => root.unmount());
  document.body.removeChild(host);
}

describe(`native compile-path — render ${ROW_COUNT} boxes`, () => {
  bench(`runtime — ${ROW_COUNT} <Box p="$4" bg="$colors.brand.500" /> (resolver path)`, () => {
    renderOnce(buildTree(RuntimeRow));
  });

  bench(`compiled — ${ROW_COUNT} <Box style={hoistedSheet.id0} /> (resolver bypass)`, () => {
    renderOnce(buildTree(CompiledRow));
  });

  bench(`vanilla — ${ROW_COUNT} <View style={...} /> (no motif wrapper)`, () => {
    renderOnce(buildVanillaTree(VanillaRow));
  });
});
