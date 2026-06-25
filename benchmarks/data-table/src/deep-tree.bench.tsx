import { Box, SSRStyleCollector, ThemeProvider } from '@usemotif/react';
import type { Theme } from '@usemotif/core';
import { createElement, type CSSProperties, type ReactElement, type ReactNode } from 'react';
import { renderToString } from 'react-dom/server';
import { bench, describe } from 'vitest';

/**
 * The deep-tree mount workload — a single chain of {@link DEPTH} nested styled
 * containers, each adding padding and a background. Where the data-table bench
 * is wide and shallow, this is narrow and deep: it isolates the per-node mount
 * cost of a styling engine when nesting (and therefore context reads,
 * theme lookups, and style merges) compounds with depth.
 *
 * Cross-platform libraries that re-resolve theme context at every level pay
 * for the depth twice — once to read context, once to merge. Motif resolves
 * each node against the same cached style map regardless of nesting.
 *
 * Apples-to-apples: identical nesting depth and visual output (4px padding per
 * level, alternating background), fresh per-request style context each
 * iteration.
 */

const DEPTH = 150;

// ─────────── Motif rows ───────────────────────────────────────────

const theme: Theme = {
  name: 'bench',
  tokens: {
    space: { 1: 4 },
    colors: { layer: { a: '#ffffff', b: '#f1f5f9' } },
  },
};

const LAYER_A: CSSProperties = { padding: 4, backgroundColor: '#ffffff' };
const LAYER_B: CSSProperties = { padding: 4, backgroundColor: '#f1f5f9' };

function nestMotifRuntime(depth: number): ReactElement {
  let node: ReactNode = null;
  for (let i = depth - 1; i >= 0; i--) {
    node = createElement(
      Box,
      { p: '$1', bg: i % 2 === 0 ? '$colors.layer.a' : '$colors.layer.b' },
      node,
    );
  }
  return node as ReactElement;
}

function nestMotifStripped(depth: number): ReactElement {
  let node: ReactNode = null;
  for (let i = depth - 1; i >= 0; i--) {
    node = createElement('div', { style: i % 2 === 0 ? LAYER_A : LAYER_B }, node);
  }
  return node as ReactElement;
}

// ─────────── Tamagui row ──────────────────────────────────────────

import { TamaguiProvider, View as TamaguiView, createTamagui } from '@tamagui/core';
import { config as tamaguiBaseConfig } from '@tamagui/config/v3';
const tamaguiConfig = createTamagui(tamaguiBaseConfig);
type TamaguiConfig = typeof tamaguiConfig;
declare module '@tamagui/core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TamaguiCustomConfig extends TamaguiConfig {}
}
function nestTamagui(depth: number): ReactElement {
  let node: ReactNode = null;
  for (let i = depth - 1; i >= 0; i--) {
    node = createElement(
      TamaguiView,
      { padding: '$1', backgroundColor: i % 2 === 0 ? '$background' : '$backgroundHover' },
      node,
    );
  }
  return node as ReactElement;
}

// ─────────── Tree wrappers ────────────────────────────────────────

function withMotifTheme(tree: ReactElement): ReactElement {
  return createElement(ThemeProvider, { themes: [theme], active: 'bench' }, tree);
}

// ─────────── Benches ──────────────────────────────────────────────

describe(`deep tree — ${DEPTH}-level nested mount`, () => {
  bench(`motif runtime — ${DEPTH} nested <Box p bg>`, () => {
    new SSRStyleCollector().collect(() => renderToString(withMotifTheme(nestMotifRuntime(DEPTH))));
  });

  bench(`motif compiled-stripped — ${DEPTH} nested <div style={...}>`, () => {
    new SSRStyleCollector().collect(() => renderToString(withMotifTheme(nestMotifStripped(DEPTH))));
  });

  bench(`vanilla inline — ${DEPTH} nested <div style={...}> (no engine)`, () => {
    renderToString(nestMotifStripped(DEPTH));
  });

  bench(`Tamagui — ${DEPTH} nested <View padding bg>`, () => {
    renderToString(createElement(TamaguiProvider, { config: tamaguiConfig }, nestTamagui(DEPTH)));
  });
});
