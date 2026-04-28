import { Box, Container, ThemeProvider } from '@motif-js/react-native';
import type { Theme } from '@motif-js/core';
import { act, createElement, type ReactElement } from 'react';
import { createRoot } from 'react-dom/client';
import { bench, describe } from 'vitest';

// React 19 prints "current testing environment is not configured to
// support act(...)" unless this flag is set. Bench iterations call
// `act()` to flush the reconciler synchronously — set the flag once
// at module load so the noise doesn't drown the report.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/**
 * Native container-query polyfill perf bench.
 *
 * The polyfill (`packages/react-native/src/Container.tsx`) wraps a Box,
 * tracks its width via `View.onLayout`, exposes the width via context,
 * and lets descendants address it with `@<bp>` / `@<name>.<bp>` keys.
 * The cost concentrates in two places:
 *
 *   1. one extra `useMemo` + `Context.Provider` per Container, plus
 *      the Container's own `useState` / `useRef` / `onLayout` callback;
 *   2. per-descendant `@`-key resolution inside the responsive style
 *      builder, which reads `useContext(ContainerContext)` and walks
 *      the named-width map.
 *
 * Each row mounts a fresh React root, renders, and unmounts. That
 * measures the cold-render cost — what an app pays on screen mount or
 * when the polyfill commits a new width and forces a subtree
 * re-render. (A "warm update" bench was tried and rejected: a stable
 * children prop hits React's reconcile-bailout fastpath, so the
 * numbers measured the bailout cost, not the polyfill. The first-
 * render numbers below are the right proxy for the polyfill's hot
 * path — they include every line the polyfill would re-execute on a
 * width change.)
 *
 * Three rows, each rendering 100 Box rows with the same visual output:
 *
 *   - **vanilla** — `<Box>` host, no Container in the tree. Descendant
 *     Boxes use static `p="$4"`. Floor: pays motif's resolver but no
 *     polyfill at all.
 *   - **Container — non-responsive children** — Container in the
 *     tree, but children still use `p="$4"`. Isolates the wrapper
 *     cost (Container's own state + Provider + descendants' extra
 *     `useContext` lookup).
 *   - **Container — @md responsive children** — Container in the tree
 *     and children use `p={{ base: '$1', '@md': '$8' }}`. Full
 *     polyfill: every descendant goes through @-key resolution.
 */

const theme: Theme = {
  name: 'bench',
  tokens: {
    space: { 1: 4, 2: 8, 4: 16, 8: 32 },
    colors: { brand: { 500: '#3b82f6' } },
  },
};

const ROW_COUNT = 100;

function StaticBoxRow(): ReactElement {
  return createElement(Box, { p: '$4', bg: '$colors.brand.500' });
}

function ResponsiveBoxRow(): ReactElement {
  return createElement(Box, {
    p: { base: '$1', '@md': '$8' },
    bg: '$colors.brand.500',
  });
}

function makeRows(Row: () => ReactElement): ReactElement[] {
  const items: ReactElement[] = [];
  for (let i = 0; i < ROW_COUNT; i++) items.push(createElement(Row, { key: i }));
  return items;
}

function VanillaTree(): ReactElement {
  return createElement(
    ThemeProvider,
    { themes: [theme], active: 'bench' },
    createElement(Box, null, ...makeRows(StaticBoxRow)),
  );
}

function ContainerStaticTree(): ReactElement {
  return createElement(
    ThemeProvider,
    { themes: [theme], active: 'bench' },
    createElement(Container, { testID: 'cont' }, ...makeRows(StaticBoxRow)),
  );
}

function ContainerResponsiveTree(): ReactElement {
  return createElement(
    ThemeProvider,
    { themes: [theme], active: 'bench' },
    createElement(Container, { testID: 'cont' }, ...makeRows(ResponsiveBoxRow)),
  );
}

function renderOnce(tree: ReactElement): void {
  // Each iteration mounts into a fresh DOM host so React's commit /
  // diff machinery starts from zero. Synchronous unmount keeps the
  // dev-mode StrictMode cleanup from leaking across runs.
  const host = document.createElement('div');
  document.body.appendChild(host);
  const root = createRoot(host);
  act(() => root.render(tree));
  act(() => root.unmount());
  document.body.removeChild(host);
}

describe(`native container-query polyfill — render ${ROW_COUNT} boxes`, () => {
  bench('vanilla — Box host, no Container', () => {
    renderOnce(VanillaTree());
  });

  bench('Container — non-responsive children (wrapper cost)', () => {
    renderOnce(ContainerStaticTree());
  });

  bench('Container — @md responsive children (full polyfill)', () => {
    renderOnce(ContainerResponsiveTree());
  });
});
