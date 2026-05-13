import { Box, SSRStyleCollector, ThemeProvider } from '@motif-js/react';
import type { Theme } from '@motif-js/core';
import { createElement, type CSSProperties, type ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import { bench, describe } from 'vitest';

/**
 * Render-heavy bench: list of N items, each with style props.
 *
 * Motif rows tell our own story (runtime → compiled → stripped → vanilla
 * floor). Cross-library rows give "why motif over X" numbers for the
 * comparison docs.
 *
 * Apples-to-apples constraints:
 * - Same render-tree shape (200 items).
 * - Each iteration runs in a fresh per-request context — motif resets the
 *   `SSRStyleCollector`, Stitches resets the sheet via `getCssText()`,
 *   Tamagui's CSS atoms dedupe globally and we measure the post-warmup
 *   cost (matches what a real app sees from the second request onward).
 * - All rows produce visually equivalent output: 16px padding,
 *   #3b82f6 background.
 *
 * NativeWind is intentionally not benched here: it requires a Babel
 * preset that runs at build time (Metro / Tailwind transforms class
 * names → React Native style objects), and there is no production-
 * grade SSR path for the web target without standing up that pipeline.
 * A separate bench harness for NativeWind belongs alongside
 * `benchmarks/native-container/` if it lands later.
 */

const N = 200;

// ─────────── Motif rows ───────────────────────────────────────────

const theme: Theme = {
  name: 'bench',
  tokens: {
    space: { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 6: 24, 8: 32 },
    colors: { brand: { 500: '#3b82f6' } },
  },
};

const COMPILED_STYLE: CSSProperties = { padding: 16, backgroundColor: '#3b82f6' };

function RuntimeRow(): ReactElement {
  return createElement(Box, { p: '$4', bg: '$colors.brand.500' });
}

function CompiledRow(): ReactElement {
  // Pre-wrapper-stripping shape: style baked but `<Box>` wrapper still
  // present. Box's fast-path early-returns but the React function call
  // is still paid.
  return createElement(Box, { style: COMPILED_STYLE });
}

function CompiledStrippedRow(): ReactElement {
  // Post-wrapper-stripping shape: compiler replaced `<Box>` with `<div>`.
  return createElement('div', { style: COMPILED_STYLE });
}

function VanillaInlineRow(): ReactElement {
  return createElement('div', { style: COMPILED_STYLE });
}

// ─────────── Vanilla-CSS row ──────────────────────────────────────
//
// Pure stylesheet route: no motif / no CSS-in-JS. The class-based shape
// represents how a Tailwind-without-engine or hand-written CSS app
// would deliver the same visual output. We inject the rule once, then
// render `<div className="bench-box">` rows.

const VANILLA_CSS = `.bench-box{padding:16px;background-color:#3b82f6;}`;
function VanillaCssRow(): ReactElement {
  return createElement('div', { className: 'bench-box' });
}
function renderVanillaCssTree(): string {
  return `<style>${VANILLA_CSS}</style>${renderToString(buildTree(VanillaCssRow, false))}`;
}

// ─────────── Stitches row ─────────────────────────────────────────
//
// `@stitches/react` is in maintenance mode but remains the canonical
// CSS-in-JS-with-zero-runtime-overhead reference. Each iteration calls
// `getCssText()` to flush the sheet — that emits the dedupe'd style
// blob and is the SSR-equivalent of motif's `SSRStyleCollector`.

import { createStitches } from '@stitches/react';
const stitches = createStitches({
  theme: {
    space: { 4: '16px' },
    colors: { brand500: '#3b82f6' },
  },
});
const StitchesBox = stitches.styled('div', {
  padding: '$4',
  backgroundColor: '$brand500',
});
function StitchesRow(): ReactElement {
  return createElement(StitchesBox, {});
}
function renderStitchesTree(): string {
  // Pull the cached sheet, render, then flush — mirrors what the
  // standard SSR pattern in the Stitches docs does.
  stitches.reset();
  const html = renderToString(buildTree(StitchesRow, false));
  const css = stitches.getCssText();
  return `<style>${css}</style>${html}`;
}

// ─────────── Tamagui row ──────────────────────────────────────────
//
// Tamagui's web target compiles atomic classes via `@tamagui/core`'s
// runtime; the `optimizer` Babel plugin can extract them at build
// time. We measure the runtime path here (no Babel optimizer) — a real
// Tamagui-compiled app will be faster, but motif's compiled-stripped
// row is the equivalent fully-optimized comparison.

import { TamaguiProvider, View as TamaguiView, createTamagui } from '@tamagui/core';
import { config as tamaguiBaseConfig } from '@tamagui/config/v3';
const tamaguiConfig = createTamagui(tamaguiBaseConfig);
type TamaguiConfig = typeof tamaguiConfig;
declare module '@tamagui/core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TamaguiCustomConfig extends TamaguiConfig {}
}
function TamaguiRow(): ReactElement {
  return createElement(TamaguiView, { padding: '$4', backgroundColor: '$blue10' });
}
function renderTamaguiTree(): string {
  // Tamagui's CSS atoms are emitted to a shared registry on first
  // render and dedupe across the process — we accept that cost as
  // representative of a steady-state production renderer.
  return renderToString(
    createElement(TamaguiProvider, { config: tamaguiConfig }, buildTreeNoTheme(TamaguiRow)),
  );
}

// ─────────── Tree builders ────────────────────────────────────────

function buildTree(Row: () => ReactElement, withMotifTheme: boolean): ReactElement {
  const items: ReactElement[] = [];
  for (let i = 0; i < N; i++) {
    items.push(createElement(Row, { key: i }));
  }
  if (!withMotifTheme) return createElement('div', null, ...items);
  return createElement(ThemeProvider, { themes: [theme], active: 'bench' }, ...items);
}
function buildTreeNoTheme(Row: () => ReactElement): ReactElement {
  return buildTree(Row, false);
}

// ─────────── Benches ──────────────────────────────────────────────

describe('list of boxes — server-side render', () => {
  bench(`motif runtime — ${N} <Box p={...} bg={...}>`, () => {
    new SSRStyleCollector().collect(() => renderToString(buildTree(RuntimeRow, true)));
  });

  bench(`motif compiled — ${N} <Box style={...}> (pre-strip shape)`, () => {
    new SSRStyleCollector().collect(() => renderToString(buildTree(CompiledRow, true)));
  });

  bench(`motif compiled-stripped — ${N} <div style={...}> (post-strip shape)`, () => {
    new SSRStyleCollector().collect(() => renderToString(buildTree(CompiledStrippedRow, true)));
  });

  bench(`vanilla inline — ${N} <div style={...}> (no engine)`, () => {
    renderToString(buildTree(VanillaInlineRow, false));
  });

  bench(`vanilla CSS — ${N} <div className="..."> + stylesheet`, () => {
    renderVanillaCssTree();
  });

  bench(`Stitches — ${N} styled('div')`, () => {
    renderStitchesTree();
  });

  bench(`Tamagui — ${N} <View padding="$4">`, () => {
    renderTamaguiTree();
  });
});
