import {
  Box,
  ThemeProvider,
  VirtualList,
  registerVirtualListImpl,
  type VirtualListImpl,
  type VirtualListProps,
} from '@motif-js/react-native';
import type { Theme } from '@motif-js/core';
import { act, createElement, type ReactElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterAll, bench, describe } from 'vitest';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/**
 * VirtualList wrapper-overhead bench.
 *
 * **What this bench measures:** the JS-side cost of motif's
 * `<VirtualList>` wrapper at scale — the registry indirection (does
 * an impl exist? is the row count above threshold?), the fallback
 * `data.map` over a `<ScrollView>`, and the hand-off to a registered
 * impl. Plus the impl's own per-row `keyOf` / `renderItem` calls.
 *
 * **What it does NOT measure** (and the file-level docs of T3.2's
 * deferred-work entry call this out): real virtualization gains from
 * `@shopify/flash-list` on a device. FlashList virtualizes via
 * `onLayout`-driven windowing on the UI thread; the
 * `react-native` mock used by vitest produces DOM nodes synchronously
 * and doesn't model windowing. That makes any "X rows mount" number
 * an overestimate of the real-device cost.
 *
 * For the bench to capture motif's wrapper overhead specifically, the
 * impl-registered row uses a **synthetic windowed impl** — it slices
 * the data to the first `WINDOW` items and renders only those. This
 * mirrors the real perf shape FlashList delivers (constant-cost mount)
 * without depending on FlashList's native module being loadable in
 * the test environment.
 *
 * The `flashListImpl` adapter from
 * `@motif-js/react-native/flash-list` is NOT exercised here because
 * `@shopify/flash-list` reaches into `Animated.createAnimatedComponent`
 * at module load, which the test-environment RN mock doesn't expose.
 * Real-device validation of the FlashList wrapper belongs to a
 * follow-on bench harness once the v0.4.x window also lands on-device
 * tooling.
 *
 * Three rows at `LIST_SIZE`:
 *
 *   1. **fallback (no impl)** — `<VirtualList>` falls back to a
 *      `<ScrollView>` that maps over every item. Cost scales linearly
 *      with `LIST_SIZE`.
 *   2. **registered, below threshold** — impl present but
 *      `data.length < threshold`, so the wrapper still routes through
 *      the fallback. Validates that registration alone doesn't cost
 *      anything until the threshold is hit.
 *   3. **registered, above threshold (windowed)** — full impl path.
 *      Synthetic impl renders only `WINDOW` items regardless of
 *      `data.length` — proves the wrapper hands off correctly and
 *      gives a representative number for the constant-cost mount
 *      shape a real virtualizer would deliver.
 */

const LIST_SIZE = 1000;
const BELOW_THRESHOLD = 25;
const WINDOW = 30;

const theme: Theme = {
  name: 'bench',
  tokens: { space: { 4: 16 }, colors: { brand: { 500: '#3b82f6' } } },
};

interface Row {
  readonly id: string;
  readonly label: string;
}

const ROWS_LARGE: Row[] = Array.from({ length: LIST_SIZE }, (_, i) => ({
  id: `row-${i}`,
  label: `Row ${i}`,
}));
const ROWS_SMALL: Row[] = ROWS_LARGE.slice(0, BELOW_THRESHOLD);

/**
 * Synthetic windowed impl — slices `data` to the first `WINDOW`
 * items. Stand-in for FlashList's UI-thread windowing so the bench
 * runs without a native module dependency.
 */
const windowedImpl: VirtualListImpl = function WindowedImpl<T>(
  props: VirtualListProps<T>,
): ReactElement {
  const { data, renderItem, keyOf } = props;
  const visible = data.slice(0, WINDOW);
  return createElement(
    Box,
    null,
    ...visible.map((item, i) =>
      createElement(Box, { key: keyOf?.(item, i) ?? i }, renderItem(item, i) as React.ReactNode),
    ),
  );
};

afterAll(() => {
  registerVirtualListImpl(null);
});

function Item({ row }: { row: Row }): ReactElement {
  return createElement(Box, { p: '$4' as const }, row.label);
}

function FallbackTree(): ReactElement {
  return createElement(
    ThemeProvider,
    { themes: [theme], active: 'bench' },
    createElement(VirtualList<Row>, {
      data: ROWS_LARGE,
      renderItem: (row: Row) => createElement(Item, { row }),
      keyOf: (row: Row) => row.id,
    }),
  );
}

function BelowThresholdTree(): ReactElement {
  return createElement(
    ThemeProvider,
    { themes: [theme], active: 'bench' },
    createElement(VirtualList<Row>, {
      data: ROWS_SMALL,
      renderItem: (row: Row) => createElement(Item, { row }),
      keyOf: (row: Row) => row.id,
    }),
  );
}

function AboveThresholdTree(): ReactElement {
  return createElement(
    ThemeProvider,
    { themes: [theme], active: 'bench' },
    createElement(VirtualList<Row>, {
      data: ROWS_LARGE,
      renderItem: (row: Row) => createElement(Item, { row }),
      keyOf: (row: Row) => row.id,
    }),
  );
}

function renderOnce(tree: ReactElement): void {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const root = createRoot(host);
  act(() => root.render(tree));
  act(() => root.unmount());
  document.body.removeChild(host);
}

describe('VirtualList wrapper overhead — JS-side mount cost', () => {
  bench(`fallback — ${LIST_SIZE} rows, no impl, ScrollView + data.map`, () => {
    registerVirtualListImpl(null);
    renderOnce(FallbackTree());
  });

  bench(`below threshold — ${BELOW_THRESHOLD} rows, impl registered, registry bypasses to fallback`, () => {
    registerVirtualListImpl(windowedImpl);
    renderOnce(BelowThresholdTree());
  });

  bench(`above threshold — ${LIST_SIZE} rows, windowedImpl active, mounts only ${WINDOW} rows`, () => {
    registerVirtualListImpl(windowedImpl);
    renderOnce(AboveThresholdTree());
  });
});
