import { Box, SSRStyleCollector, ThemeProvider } from '@usemotif/react';
import type { Theme } from '@usemotif/core';
import { createElement, type ComponentType, type CSSProperties, type ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import { bench, describe } from 'vitest';

/**
 * The adversarial data-table workload — 100 rows × 12 columns = 1,200 styled
 * cells, the shape where atomic-CSS libraries demonstrably crack (Tamagui's
 * own issue #3448 reports 2.7–8.6× slowdowns versus RN / RNW on this exact
 * pattern).
 *
 * Why a table is the worst case: every cell carries the same handful of style
 * props, zebra-striped rows force a second background variant, and the tree is
 * wide and shallow. A per-prop atomic engine re-derives and dedupes class
 * atoms for all 1,200 cells; motif resolves each cell against its cached
 * style map and emits one hashed rule per distinct declaration set.
 *
 * Rows tell two stories:
 * - Motif's own ladder: runtime → compiled-stripped → vanilla floor.
 * - Cross-library: why motif over Tamagui or hand-written CSS on the
 *   table workload specifically.
 *
 * Apples-to-apples: identical 100×12 tree, visually equivalent cells (8px/12px
 * padding, 1px bottom border, zebra background), fresh per-request style
 * context each iteration (post-warmup steady state, matching a real SSR app
 * from the second request onward).
 */

const ROWS = 100;
const COLS = 12;

// ─────────── Motif rows ───────────────────────────────────────────

const theme: Theme = {
  name: 'bench',
  tokens: {
    space: { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16 },
    colors: {
      zebra: { even: '#ffffff', odd: '#f8fafc' },
      ink: { 700: '#334155' },
      line: { 200: '#e2e8f0' },
    },
  },
};

const CELL_EVEN: CSSProperties = {
  paddingTop: 8,
  paddingBottom: 8,
  paddingLeft: 12,
  paddingRight: 12,
  borderBottomWidth: 1,
  borderBottomColor: '#e2e8f0',
  borderBottomStyle: 'solid',
  color: '#334155',
  fontSize: 14,
  backgroundColor: '#ffffff',
};
const CELL_ODD: CSSProperties = { ...CELL_EVEN, backgroundColor: '#f8fafc' };

function MotifRuntimeCell(rowEven: boolean): ReactElement {
  return createElement(Box, {
    as: 'td',
    py: '$2',
    px: '$3',
    borderBottomWidth: 1,
    borderBottomColor: '$colors.line.200',
    color: '$colors.ink.700',
    fontSize: 14,
    bg: rowEven ? '$colors.zebra.even' : '$colors.zebra.odd',
  });
}

function MotifStrippedCell(rowEven: boolean): ReactElement {
  // Post-compile shape: the compiler replaced `<Box>` with a `<td>` and baked
  // the resolved style object.
  return createElement('td', { style: rowEven ? CELL_EVEN : CELL_ODD });
}

function VanillaInlineCell(rowEven: boolean): ReactElement {
  return createElement('td', { style: rowEven ? CELL_EVEN : CELL_ODD });
}

// ─────────── Vanilla-CSS row ──────────────────────────────────────

const VANILLA_CSS =
  `.c{padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#334155;font-size:14px;}` +
  `.c.e{background:#ffffff;}.c.o{background:#f8fafc;}`;
function VanillaCssCell(rowEven: boolean): ReactElement {
  return createElement('td', { className: rowEven ? 'c e' : 'c o' });
}
function renderVanillaCssTable(): string {
  return `<style>${VANILLA_CSS}</style>${renderToString(buildTable(VanillaCssCell, false))}`;
}

// ─────────── StyleX row ───────────────────────────────────────────
//
// The compile-time atomic-CSS peer, and the right comparison for motif's
// *compiled-stripped* row rather than the runtime one. The Vitest config runs
// StyleX's plugin, so the `stylex.create` below is transformed exactly as it
// would be in a real build.
//
// No `<style>` blob per iteration on purpose: StyleX writes its stylesheet
// once at build time and an app serves it statically, so the per-request cost
// really is class resolution plus render.

import * as stylex from '@stylexjs/stylex';
const stylexStyles = stylex.create({
  cell: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
    borderBottom: '1px solid #e2e8f0',
    color: '#334155',
    fontSize: 14,
  },
  even: { background: '#ffffff' },
  odd: { background: '#f8fafc' },
});
function StyleXCell(rowEven: boolean): ReactElement {
  return createElement(
    'td',
    stylex.props(stylexStyles.cell, rowEven ? stylexStyles.even : stylexStyles.odd),
  );
}
function renderStyleXTable(): string {
  return renderToString(buildTable(StyleXCell, false));
}

// ─────────── Emotion row ──────────────────────────────────────────
//
// The runtime CSS-in-JS baseline, and the closest peer to `motif runtime`:
// Emotion resolves and inserts styles while rendering rather than at build
// time. A scoped instance gives a cache that can be flushed per iteration,
// the equivalent of the fresh per-request context the other rows get.
//
// Every declaration is passed per cell, matching the motif runtime row rather
// than hoisting the static ones into a shared class.

import createEmotion from '@emotion/css/create-instance';
const emotion = createEmotion({ key: 'bench' });
function EmotionCell(rowEven: boolean): ReactElement {
  return createElement('td', {
    className: emotion.css({
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 12,
      paddingRight: 12,
      borderBottom: '1px solid #e2e8f0',
      color: '#334155',
      fontSize: 14,
      background: rowEven ? '#ffffff' : '#f8fafc',
    }),
  });
}
function renderEmotionTable(): string {
  emotion.flush();
  const html = renderToString(buildTable(EmotionCell, false));
  const css = Object.values(emotion.cache.inserted).join('');
  return `<style>${css}</style>${html}`;
}

// ─────────── Tamagui row ──────────────────────────────────────────

import { TamaguiProvider, createTamagui, styledHtml } from '@tamagui/core';
import { config as tamaguiBaseConfig } from '@tamagui/config/v3';
const tamaguiConfig = createTamagui(tamaguiBaseConfig);
type TamaguiConfig = typeof tamaguiConfig;
declare module '@tamagui/core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TamaguiCustomConfig extends TamaguiConfig {}
}
// Tamagui 2.x dropped the `tag` prop on `View`; `styledHtml` is how an HTML
// element is targeted now.
//
// It carries the tag only. Every style prop stays at the call site, paid per
// cell, because that is what the motif runtime row does and what the old
// `<View tag="td">` row did. Baking the four static props into the styled
// component would move them to module scope and hand Tamagui a faster shape
// than the rows it is compared against.
//
// The options parameter for a `td` expands to a union TypeScript refuses to
// represent (TS2590), so it is passed as `never` and the component is typed by
// hand. That bounds the checker, not the runtime. It is a Tamagui typing
// limitation, and `never` is used rather than `any` because `any` is a lint
// error in this repo.
const TamaguiCellBase = styledHtml('td', {} as never) as unknown as ComponentType<{
  paddingVertical: string;
  paddingHorizontal: string;
  borderBottomWidth: number;
  borderBottomColor: string;
  backgroundColor: string;
}>;
function TamaguiCell(rowEven: boolean): ReactElement {
  return createElement(TamaguiCellBase, {
    paddingVertical: '$2',
    paddingHorizontal: '$3',
    borderBottomWidth: 1,
    borderBottomColor: '$color4',
    // Still two style props short of the other rows: Tamagui's element rejects
    // the text props `color` and `fontSize`, a small handicap in Tamagui's
    // favour that predates this pin bump.
    backgroundColor: rowEven ? '$background' : '$backgroundHover',
  });
}
function renderTamaguiTable(): string {
  return renderToString(
    createElement(
      TamaguiProvider,
      // Required from Tamagui 2.x; the provider no longer infers a starting theme.
      { config: tamaguiConfig, defaultTheme: 'light' },
      buildTableNoTheme(TamaguiCell),
    ),
  );
}

// ─────────── Tree builders ────────────────────────────────────────

function buildRow(Cell: (rowEven: boolean) => ReactElement, r: number): ReactElement {
  const cells: ReactElement[] = [];
  const even = r % 2 === 0;
  for (let c = 0; c < COLS; c++) {
    cells.push(createElement('span', { key: c }, Cell(even)));
  }
  return createElement('tr', { key: r }, ...cells);
}

function buildTable(
  Cell: (rowEven: boolean) => ReactElement,
  withMotifTheme: boolean,
): ReactElement {
  const rows: ReactElement[] = [];
  for (let r = 0; r < ROWS; r++) rows.push(buildRow(Cell, r));
  const table = createElement('table', null, createElement('tbody', null, ...rows));
  if (!withMotifTheme) return table;
  return createElement(ThemeProvider, { themes: [theme], active: 'bench' }, table);
}
function buildTableNoTheme(Cell: (rowEven: boolean) => ReactElement): ReactElement {
  return buildTable(Cell, false);
}

// ─────────── Benches ──────────────────────────────────────────────

describe(`data table — ${ROWS}×${COLS} server-side render`, () => {
  bench(`motif runtime — ${ROWS * COLS} <Box as="td">`, () => {
    new SSRStyleCollector().collect(() =>
      renderToString(buildTable((e) => MotifRuntimeCell(e), true)),
    );
  });

  bench(`motif compiled-stripped — ${ROWS * COLS} <td style={...}>`, () => {
    new SSRStyleCollector().collect(() =>
      renderToString(buildTable((e) => MotifStrippedCell(e), true)),
    );
  });

  bench(`vanilla inline — ${ROWS * COLS} <td style={...}> (no engine)`, () => {
    renderToString(buildTable((e) => VanillaInlineCell(e), false));
  });

  bench(`vanilla CSS — ${ROWS * COLS} <td className="..."> + stylesheet`, () => {
    renderVanillaCssTable();
  });

  bench(`StyleX — ${ROWS * COLS} stylex.props(...) (compiled)`, () => {
    renderStyleXTable();
  });

  bench(`Emotion — ${ROWS * COLS} css({ ... })`, () => {
    renderEmotionTable();
  });

  bench(`Tamagui — ${ROWS * COLS} styledHtml('td')`, () => {
    renderTamaguiTable();
  });
});
