import { Box, SSRStyleCollector, ThemeProvider } from '@usemotif/react';
import type { Theme } from '@usemotif/core';
import { createElement, type CSSProperties, type ReactElement } from 'react';
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
 * - Cross-library: why motif over Tamagui / Stitches / hand-written CSS on the
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

// ─────────── Stitches row ─────────────────────────────────────────

import { createStitches } from '@stitches/react';
const stitches = createStitches({
  theme: {
    space: { 2: '8px', 3: '12px' },
    colors: { even: '#ffffff', odd: '#f8fafc', ink: '#334155', line: '#e2e8f0' },
    fontSizes: { sm: '14px' },
  },
});
const StitchesCell = stitches.styled('td', {
  paddingTop: '$2',
  paddingBottom: '$2',
  paddingLeft: '$3',
  paddingRight: '$3',
  borderBottom: '1px solid $line',
  color: '$ink',
  fontSize: '$sm',
  variants: {
    zebra: { even: { backgroundColor: '$even' }, odd: { backgroundColor: '$odd' } },
  },
});
function StitchesCellRow(rowEven: boolean): ReactElement {
  return createElement(StitchesCell, { zebra: rowEven ? 'even' : 'odd' });
}
function renderStitchesTable(): string {
  stitches.reset();
  const html = renderToString(buildTable(StitchesCellRow, false));
  const css = stitches.getCssText();
  return `<style>${css}</style>${html}`;
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
function TamaguiCell(rowEven: boolean): ReactElement {
  return createElement(TamaguiView, {
    tag: 'td',
    paddingVertical: '$2',
    paddingHorizontal: '$3',
    borderBottomWidth: 1,
    borderBottomColor: '$color4',
    // Tamagui's `View` rejects the text props `color` and `fontSize`, so it
    // carries two fewer style props per cell than the other libraries — a
    // small handicap in Tamagui's favour.
    backgroundColor: rowEven ? '$background' : '$backgroundHover',
  });
}
function renderTamaguiTable(): string {
  return renderToString(
    createElement(TamaguiProvider, { config: tamaguiConfig }, buildTableNoTheme(TamaguiCell)),
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

  bench(`Stitches — ${ROWS * COLS} styled('td')`, () => {
    renderStitchesTable();
  });

  bench(`Tamagui — ${ROWS * COLS} <View tag="td">`, () => {
    renderTamaguiTable();
  });
});
