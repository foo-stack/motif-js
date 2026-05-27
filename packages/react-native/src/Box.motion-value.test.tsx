/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { createMotionValue } from '@usemotif/core';
import { Box } from './Box.js';
import { registerMotionDriver } from './_animation/index.js';
import { noopDriver } from './_animation/noop.js';

let container: HTMLElement;
let root: Root;

function render(node: ReactNode): void {
  act(() => {
    root.render(node);
  });
}

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  // Default to the animated driver — explicitly set, in case a prior
  // test left a different driver registered.
  registerMotionDriver(null);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  registerMotionDriver(null);
});

function getMotifStyle(host: Element): unknown {
  const raw = host.getAttribute('data-motif-style');
  if (raw === null) return null;
  return JSON.parse(raw);
}

describe('native Box with motion values — default (animated) driver', () => {
  it('renders through Animated.View when motion values are present', () => {
    const opacity = createMotionValue(0.5);
    render(<Box opacity={opacity}>hi</Box>);
    const host = container.firstElementChild!;
    expect(host.getAttribute('data-motif-host')).toBe('Animated.View');
  });

  it('routes the motion value through an Animated.Value in the style overlay', () => {
    const opacity = createMotionValue(0.5);
    render(<Box opacity={opacity}>hi</Box>);
    const host = container.firstElementChild!;
    const style = getMotifStyle(host) as Array<Record<string, unknown>>;
    expect(Array.isArray(style)).toBe(true);
    // Find the slot containing the MV-backed opacity entry.
    const mvSlot = style.find(
      (s) =>
        s !== null &&
        typeof s === 'object' &&
        'opacity' in s &&
        typeof (s as Record<string, unknown>).opacity === 'object',
    ) as Record<string, { __animatedValue: true; value: number }> | undefined;
    expect(mvSlot).toBeDefined();
    expect(mvSlot!.opacity!.__animatedValue).toBe(true);
    expect(mvSlot!.opacity!.value).toBe(0.5);
  });

  it('updates the Animated.Value when .set() fires without re-rendering Box', () => {
    const opacity = createMotionValue(0.5);
    let renderCount = 0;
    function Probe(): ReactNode {
      renderCount++;
      return <Box opacity={opacity}>hi</Box>;
    }
    render(<Probe />);
    expect(renderCount).toBe(1);

    act(() => opacity.set(0.1));

    // Critical: Box did NOT re-render. The Animated.Value path
    // bypasses React's reconciliation.
    expect(renderCount).toBe(1);

    // Force a re-render so the host re-serialises the style and we
    // can read the post-set value. We re-render the parent — Box
    // itself never re-rendered on its own.
    render(<Probe />);
    const host = container.firstElementChild!;
    const style = getMotifStyle(host) as Array<Record<string, unknown>>;
    const mvSlot = style.find(
      (s) =>
        s !== null &&
        typeof s === 'object' &&
        'opacity' in s &&
        typeof (s as Record<string, unknown>).opacity === 'object',
    ) as Record<string, { value: number }> | undefined;
    expect(mvSlot!.opacity!.value).toBe(0.1);
  });

  it('handles multiple MV-bound props on one Box', () => {
    const opacity = createMotionValue(0.8);
    const width = createMotionValue(120);
    render(
      <Box opacity={opacity} width={width}>
        hi
      </Box>,
    );

    const host = container.firstElementChild!;
    const style = getMotifStyle(host) as Array<Record<string, unknown>>;
    const mvSlot = style.find(
      (s) => s !== null && typeof s === 'object' && 'opacity' in s && 'width' in s,
    ) as Record<string, { value: number }> | undefined;
    expect(mvSlot).toBeDefined();
    expect(mvSlot!.opacity!.value).toBe(0.8);
    expect(mvSlot!.width!.value).toBe(120);
  });

  it('warns and skips non-numeric MV values on native', () => {
    const transform = createMotionValue('translateX(0px)');
    /* eslint-disable no-console -- intentional console.warn override for assertion */
    const originalWarn = console.warn;
    const warnings: unknown[][] = [];
    console.warn = (...args: unknown[]) => {
      warnings.push(args);
    };
    try {
      render(<Box transform={transform}>hi</Box>);
      expect(
        warnings.some((args) =>
          String(args[0] ?? '').includes("motion value on 'transform' has non-numeric value"),
        ),
      ).toBe(true);
    } finally {
      console.warn = originalWarn;
    }
    /* eslint-enable no-console */
  });

  it('falls through to the non-MV codepath when no MV props', () => {
    render(<Box opacity={0.5}>hi</Box>);
    const host = container.firstElementChild!;
    // No MV → plain View, not Animated.View.
    expect(host.getAttribute('data-motif-host')).toBe('View');
  });
});

describe('native Box with transform shorthand motion values', () => {
  it('composes transform-axis MVs into the RN array form on initial render (animated driver)', () => {
    const x = createMotionValue(10);
    const rotate = createMotionValue(45);
    render(
      <Box x={x} rotate={rotate}>
        hi
      </Box>,
    );

    const host = container.firstElementChild!;
    expect(host.getAttribute('data-motif-host')).toBe('Animated.View');

    const style = getMotifStyle(host) as Array<Record<string, unknown>>;
    const overlay = style.find((s) => s !== null && typeof s === 'object' && 'transform' in s) as
      | { transform: Array<Record<string, unknown>> }
      | undefined;
    expect(overlay).toBeDefined();
    const arr = overlay!.transform;
    // Animated.Value mock serialises as { __animatedValue, value }.
    const translateX = arr.find((e) => 'translateX' in e);
    expect(translateX).toBeDefined();
    expect((translateX as { translateX: { value: number } }).translateX.value).toBe(10);
    // rotate runs through Animated.Value.interpolate in production; the
    // test mock returns the Animated.Value as-is, so we just assert
    // that a `rotate` entry exists.
    const rotateEntry = arr.find((e) => 'rotate' in e);
    expect(rotateEntry).toBeDefined();
  });

  it('with the noop driver, composes shorthand MVs into the literal array form', () => {
    registerMotionDriver(noopDriver);
    const x = createMotionValue(10);
    const rotate = createMotionValue(45);
    const scale = createMotionValue(0.9);
    render(
      <Box x={x} rotate={rotate} scale={scale}>
        hi
      </Box>,
    );

    const host = container.firstElementChild!;
    const style = getMotifStyle(host) as Array<Record<string, unknown>>;
    const overlay = style.find((s) => s !== null && typeof s === 'object' && 'transform' in s) as
      | { transform: Array<Record<string, unknown>> }
      | undefined;
    expect(overlay).toBeDefined();
    expect(overlay!.transform).toEqual([{ translateX: 10 }, { rotate: '45deg' }, { scale: 0.9 }]);
    registerMotionDriver(null);
  });

  it('transform-axis MV updates do not trigger React re-renders (animated driver)', () => {
    const x = createMotionValue(0);
    let renderCount = 0;
    function Probe(): ReactNode {
      renderCount++;
      return <Box x={x}>hi</Box>;
    }
    render(<Probe />);
    expect(renderCount).toBe(1);

    act(() => x.set(50));
    expect(renderCount).toBe(1);
    act(() => x.set(100));
    expect(renderCount).toBe(1);
  });
});

describe('native Box with motion values — noop driver', () => {
  beforeEach(() => {
    registerMotionDriver(noopDriver);
  });
  afterEach(() => {
    registerMotionDriver(null);
  });

  it('snaps to initial value without subscribing', () => {
    const opacity = createMotionValue(0.3);
    render(<Box opacity={opacity}>hi</Box>);

    const host = container.firstElementChild!;
    // Noop driver returns no Host override → plain View.
    expect(host.getAttribute('data-motif-host')).toBe('View');

    const style = getMotifStyle(host) as Array<Record<string, unknown>>;
    const mvSlot = style.find((s) => s !== null && typeof s === 'object' && 'opacity' in s) as
      | Record<string, number>
      | undefined;
    // Literal pass-through — opacity is the raw number from .get().
    expect(mvSlot!['opacity']).toBe(0.3);
  });

  it('does NOT subscribe — .set() has no effect on the rendered style', () => {
    const opacity = createMotionValue(0.3);
    render(<Box opacity={opacity}>hi</Box>);

    act(() => opacity.set(0.9));
    // No re-render triggered by noop driver; style stays at the
    // snapped initial value.
    const host = container.firstElementChild!;
    const style = getMotifStyle(host) as Array<Record<string, unknown>>;
    const mvSlot = style.find((s) => s !== null && typeof s === 'object' && 'opacity' in s) as
      | Record<string, number>
      | undefined;
    expect(mvSlot!['opacity']).toBe(0.3);
  });
});
