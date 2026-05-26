/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { useLayoutAnimation } from './use-layout-animation.js';

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
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe('native useLayoutAnimation', () => {
  it('returns ref + onLayout + style bindings consumers spread onto a Box', () => {
    let captured: ReturnType<typeof useLayoutAnimation> | undefined;
    function Probe(): null {
      captured = useLayoutAnimation();
      return null;
    }
    render(<Probe />);
    expect(captured).toBeDefined();
    expect(captured!.ref.current).toBeNull();
    expect(typeof captured!.onLayout).toBe('function');
    expect(captured!.style).toBeDefined();
  });

  it('does not animate on the first onLayout (records baseline only)', () => {
    let captured: ReturnType<typeof useLayoutAnimation> | undefined;
    function Probe(): null {
      captured = useLayoutAnimation();
      return null;
    }
    render(<Probe />);
    const ev = { nativeEvent: { layout: { x: 0, y: 0, width: 100, height: 100 } } };
    expect(() =>
      captured!.onLayout!(ev as Parameters<NonNullable<NonNullable<typeof captured>['onLayout']>>[0]),
    ).not.toThrow();
  });

  it('applies an inverse transform on subsequent layout deltas', () => {
    let captured: ReturnType<typeof useLayoutAnimation> | undefined;
    function Probe(): null {
      captured = useLayoutAnimation();
      return null;
    }
    render(<Probe />);

    captured!.onLayout!({
      nativeEvent: { layout: { x: 0, y: 0, width: 100, height: 100 } },
    } as Parameters<NonNullable<NonNullable<typeof captured>['onLayout']>>[0]);
    captured!.onLayout!({
      nativeEvent: { layout: { x: 50, y: 30, width: 200, height: 50 } },
    } as Parameters<NonNullable<NonNullable<typeof captured>['onLayout']>>[0]);

    // The style.transform shape carries Animated.Value entries; after
    // the second onLayout fires, the values are set to the inverse
    // delta. We just assert the shape is present and the entries are
    // Animated.Value instances (mock returns __animatedValue serial).
    const transform = captured!.style!.transform as ReadonlyArray<Record<string, unknown>>;
    expect(transform.length).toBe(4);
    expect(transform[0]).toHaveProperty('translateX');
    expect(transform[1]).toHaveProperty('translateY');
    expect(transform[2]).toHaveProperty('scaleX');
    expect(transform[3]).toHaveProperty('scaleY');
  });
});
