import {
  Box,
  ThemeProvider,
  registerMotionDriver,
  noopDriver,
  useExitTransitionNative,
} from '@motif-js/react-native';
import type { Theme } from '@motif-js/core';
import { act, createElement, type ReactElement, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { afterAll, beforeAll, bench, describe } from 'vitest';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/**
 * Native motion-exit cost bench — pairs with the D2 / T1.2-deferral
 * work that wired `exitStyle` through a presence-boundary contract.
 *
 * The exit path does measurable extra work at mount time:
 *
 *   - **`useExitTransitionNative`** (the parent) sets up phase
 *     state, a fallback timer, and a `pendingExits` registration
 *     set — three useState/useRef hooks plus a memoised context
 *     value.
 *   - **`<ExitBoundary>`** (returned from the hook) mounts a
 *     `PresenceContext.Provider` whose value updates every time
 *     `phase` flips.
 *   - **`<Box exitStyle={...}>`** (each descendant) reads the
 *     context, dispatches through `BoxWithExitNative`, and calls
 *     the registered driver's `useExitAnimation` *every render* —
 *     even outside the exit phase. The driver call is a no-op pair
 *     (`from`/`to` both empty, duration 0) when `phase === 'open'`,
 *     but it's still a hook invocation per descendant.
 *
 * The bench compares three rows at 100 boxes each, all rendered
 * once and unmounted (cold mount cost):
 *
 *   1. **plain** — `<Box>` rows, no exit prop, no boundary. Floor
 *      for the relative comparison.
 *   2. **with boundary, no exitStyle** — `<ExitBoundary>` wraps the
 *      rows but the descendants don't opt in. Isolates the
 *      boundary's own overhead (phase state, context provider).
 *   3. **full exit path** — `<ExitBoundary>` + every descendant has
 *      `exitStyle={{ opacity: 0 }}`. Full per-row driver cost.
 *
 * The noop driver is registered for determinism — `useExitAnimation`
 * resolves on a single tick instead of running through rAF /
 * `Animated.timing`. That keeps each iteration's wall-clock cost
 * bounded; the bench measures motif's wrapper / context / driver
 * dispatch overhead, not the actual interpolation loop (which
 * varies by driver).
 */

const ROW_COUNT = 100;

const theme: Theme = {
  name: 'bench',
  tokens: { space: { 4: 16 }, colors: { brand: { 500: '#3b82f6' } } },
};

beforeAll(() => {
  // Deterministic exit: noop driver snaps to `to` and signals
  // onComplete in a single effect, so the boundary settles in the
  // same act() call as the unmount. No rAF / setState loop.
  registerMotionDriver(noopDriver);
});

afterAll(() => {
  registerMotionDriver(null);
});

function PlainRow(): ReactElement {
  return createElement(Box, { p: '$4', bg: '$colors.brand.500' });
}

function ExitRow(): ReactElement {
  return createElement(Box, {
    p: '$4',
    bg: '$colors.brand.500',
    exitStyle: { opacity: 0 },
  });
}

function makeRows(Row: () => ReactElement): ReactElement[] {
  const items: ReactElement[] = [];
  for (let i = 0; i < ROW_COUNT; i++) items.push(createElement(Row, { key: i }));
  return items;
}

interface BoundaryProps {
  open: boolean;
  children?: ReactNode;
}
function Boundary({ open, children }: BoundaryProps): ReactElement | null {
  const { shouldRender, ExitBoundary } = useExitTransitionNative(open);
  if (!shouldRender) return null;
  return createElement(ExitBoundary, null, children);
}

function PlainTree(): ReactElement {
  return createElement(
    ThemeProvider,
    { themes: [theme], active: 'bench' },
    createElement(Box, null, ...makeRows(PlainRow)),
  );
}

function BoundaryNoExitTree(): ReactElement {
  return createElement(
    ThemeProvider,
    { themes: [theme], active: 'bench' },
    createElement(Boundary, { open: true }, createElement(Box, null, ...makeRows(PlainRow))),
  );
}

function FullExitTree(): ReactElement {
  return createElement(
    ThemeProvider,
    { themes: [theme], active: 'bench' },
    createElement(Boundary, { open: true }, createElement(Box, null, ...makeRows(ExitRow))),
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

describe(`native motion exit — render ${ROW_COUNT} boxes`, () => {
  bench('plain — Box rows, no boundary, no exitStyle', () => {
    renderOnce(PlainTree());
  });

  bench('boundary only — ExitBoundary wraps rows, no exitStyle on descendants', () => {
    renderOnce(BoundaryNoExitTree());
  });

  bench('full path — ExitBoundary + exitStyle on every descendant', () => {
    renderOnce(FullExitTree());
  });
});
