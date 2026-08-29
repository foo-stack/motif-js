import { Box, SSRStyleCollector, ThemeProvider } from '@usemotif/react';
import type { Theme } from '@usemotif/core';
import { createElement, type ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import { bench, describe } from 'vitest';

/**
 * The dynamic-theme-switch workload — render a tree of {@link N} token-driven
 * nodes under a light theme, then under a dark theme: the round trip a theme
 * toggle pays.
 *
 * This is where motif's CSS-variable strategy is structurally ahead. Every
 * styled node references its colours as `var(--colors-…)`, so the two themes
 * produce the *same* hashed rules — switching themes swaps the variable scope
 * at the root, not the per-node styles. The marginal cost of the second
 * (dark) render is therefore flat in the node count.
 *
 * An engine that resolves theme values into per-node class atoms re-derives
 * every node on switch, so its second render scales with the tree size. The
 * Tamagui row renders the same tree under its light then dark theme for the
 * comparison.
 *
 * Apples-to-apples: identical {@link N}-node tree, two themes that differ only
 * in colour values, fresh per-request style context per render.
 */

const N = 300;

// ─────────── Motif rows ───────────────────────────────────────────

const light: Theme = {
  name: 'light',
  tokens: {
    space: { 2: 8 },
    colors: { surface: '#ffffff', text: '#0f172a', accent: '#2563eb' },
  },
};
const dark: Theme = {
  name: 'dark',
  tokens: {
    space: { 2: 8 },
    colors: { surface: '#0f172a', text: '#f8fafc', accent: '#60a5fa' },
  },
};

function MotifNode(): ReactElement {
  return createElement(Box, {
    p: '$2',
    bg: '$colors.surface',
    color: '$colors.text',
    borderColor: '$colors.accent',
    borderWidth: 1,
  });
}

function buildMotifTree(active: 'light' | 'dark'): ReactElement {
  const nodes: ReactElement[] = [];
  for (let i = 0; i < N; i++) nodes.push(createElement(MotifNode, { key: i }));
  return createElement(
    ThemeProvider,
    { themes: [light, dark], active },
    createElement('div', null, ...nodes),
  );
}

function renderMotifSwitch(): string {
  // The mount render plus the post-switch render — the full cost a theme
  // toggle pays end to end.
  const lightHtml = new SSRStyleCollector().collect(() => renderToString(buildMotifTree('light')));
  const darkHtml = new SSRStyleCollector().collect(() => renderToString(buildMotifTree('dark')));
  return lightHtml + darkHtml;
}

// ─────────── Tamagui row ──────────────────────────────────────────

import {
  TamaguiProvider,
  Theme as TamaguiTheme,
  View as TamaguiView,
  createTamagui,
} from '@tamagui/core';
import { config as tamaguiBaseConfig } from '@tamagui/config/v3';
const tamaguiConfig = createTamagui(tamaguiBaseConfig);
type TamaguiConfig = typeof tamaguiConfig;
declare module '@tamagui/core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TamaguiCustomConfig extends TamaguiConfig {}
}
function buildTamaguiTree(active: 'light' | 'dark'): ReactElement {
  const nodes: ReactElement[] = [];
  for (let i = 0; i < N; i++) {
    nodes.push(
      createElement(TamaguiView, {
        key: i,
        padding: '$2',
        backgroundColor: '$background',
        // Tamagui's `View` rejects `color` (a Text-only prop); the motif row
        // carries it, so Tamagui has one fewer prop to resolve here.
        borderColor: '$borderColor',
        borderWidth: 1,
      }),
    );
  }
  return createElement(
    TamaguiProvider,
    // Required from Tamagui 2.x. The inner `Theme` still drives the switch
    // being measured; this only gives the provider a starting point.
    { config: tamaguiConfig, defaultTheme: active },
    createElement(TamaguiTheme, { name: active }, ...nodes),
  );
}
function renderTamaguiSwitch(): string {
  return renderToString(buildTamaguiTree('light')) + renderToString(buildTamaguiTree('dark'));
}

// ─────────── Benches ──────────────────────────────────────────────

describe(`theme switch — ${N} token-driven nodes, light → dark`, () => {
  bench(`motif — ${N} <Box> via CSS variables`, () => {
    renderMotifSwitch();
  });

  bench(`Tamagui — ${N} <View> with <Theme> swap`, () => {
    renderTamaguiSwitch();
  });
});
