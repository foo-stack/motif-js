import { Box, SSRStyleCollector, ThemeProvider } from '@usemotif/react';
import type { Theme } from '@usemotif/core';
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
 * - Each iteration runs in a fresh per-request context - motif resets the
 *   `SSRStyleCollector`, and Tamagui's CSS atoms dedupe globally so we measure
 *   the post-warmup cost (what a real app sees from the second request
 *   onward).
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

// ─────────── Emotion row ──────────────────────────────────────────
//
// The runtime CSS-in-JS baseline, and the closest peer to `motif runtime`:
// Emotion resolves and inserts styles while rendering rather than at build
// time. A scoped instance via `create-instance` gives a cache that can be
// flushed per iteration, which is the equivalent of the fresh per-request
// context the motif and Tamagui rows get.

import createEmotion from '@emotion/css/create-instance';
const emotion = createEmotion({ key: 'bench' });
function EmotionRow(): ReactElement {
  return createElement('div', {
    className: emotion.css({ padding: 16, backgroundColor: '#3b82f6' }),
  });
}
function renderEmotionTree(): string {
  emotion.flush();
  const html = renderToString(buildTree(EmotionRow, false));
  const css = Object.values(emotion.cache.inserted).join('');
  return `<style>${css}</style>${html}`;
}

// ─────────── StyleX row ───────────────────────────────────────────
//
// The compile-time atomic-CSS peer, and the right comparison for motif's
// *compiled* rows rather than the runtime ones. The Vitest config runs
// StyleX's plugin, so `stylex.create` below is transformed exactly as it
// would be in a real build; `props.className` is the pair of atomic classes
// that transform produced.
//
// No `<style>` blob is emitted per iteration on purpose. StyleX writes its
// stylesheet once at build time and an app serves it statically, so the
// per-request cost really is class resolution plus render. Adding a
// serialization step would invent work StyleX does not do.

import * as stylex from '@stylexjs/stylex';
const stylexStyles = stylex.create({
  box: { padding: 16, backgroundColor: '#3b82f6' },
});
function StyleXRow(): ReactElement {
  return createElement('div', stylex.props(stylexStyles.box));
}
function renderStyleXTree(): string {
  return renderToString(buildTree(StyleXRow, false));
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
    createElement(
      TamaguiProvider,
      // Required from Tamagui 2.x; the provider no longer infers a starting theme.
      { config: tamaguiConfig, defaultTheme: 'light' },
      buildTreeNoTheme(TamaguiRow),
    ),
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

  bench(`StyleX — ${N} stylex.props(...) (compiled)`, () => {
    renderStyleXTree();
  });

  bench(`Emotion — ${N} css({ padding, backgroundColor })`, () => {
    renderEmotionTree();
  });

  bench(`Tamagui — ${N} <View padding="$4">`, () => {
    renderTamaguiTree();
  });
});
