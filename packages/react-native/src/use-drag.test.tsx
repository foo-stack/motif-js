/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { useDrag, type DragInfo } from './use-drag.js';

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

type Captured = ReturnType<typeof useDrag>;

function Probe({
  onResult,
  options,
}: {
  onResult: (r: Captured) => void;
  options?: Parameters<typeof useDrag>[0];
}): null {
  const r = useDrag(options);
  onResult(r);
  return null;
}

/**
 * The RN mock's `PanResponder.create(config)` returns
 * `{ panHandlers: { ...config } }` — so the panHandlers bag IS the
 * handler config. We invoke handlers directly to simulate gestures.
 */
type PanCallbacks = {
  onPanResponderGrant?: () => void;
  onPanResponderMove?: (
    e: unknown,
    s: { dx: number; dy: number; vx: number; vy: number },
  ) => void;
  onPanResponderRelease?: () => void;
  onPanResponderTerminate?: () => void;
};

describe('native useDrag', () => {
  it('returns dragProps, x/y motion values, and isDragging=false initially', () => {
    const captured = vi.fn();
    render(<Probe onResult={captured} />);
    const r = captured.mock.calls[0]![0] as Captured;
    expect(r.x.get()).toBe(0);
    expect(r.y.get()).toBe(0);
    expect(r.isDragging).toBe(false);
    expect(typeof r.dragProps).toBe('object');
  });

  it('updates x/y on PanResponder move events', () => {
    const captured = vi.fn();
    render(<Probe onResult={captured} />);
    const r = captured.mock.calls[0]![0] as Captured;
    const handlers = r.dragProps as PanCallbacks;

    act(() => {
      handlers.onPanResponderGrant?.();
    });
    act(() => {
      handlers.onPanResponderMove?.({}, { dx: 50, dy: 30, vx: 0, vy: 0 });
    });
    expect(r.x.get()).toBe(50);
    expect(r.y.get()).toBe(30);
  });

  it('clamps to constraints', () => {
    const captured = vi.fn();
    render(<Probe onResult={captured} options={{ constraints: { right: 20 } }} />);
    const r = captured.mock.calls[0]![0] as Captured;
    const handlers = r.dragProps as PanCallbacks;

    act(() => {
      handlers.onPanResponderGrant?.();
    });
    act(() => {
      handlers.onPanResponderMove?.({}, { dx: 100, dy: 0, vx: 0, vy: 0 });
    });
    expect(r.x.get()).toBe(20);
  });

  it('locks to single axis', () => {
    const captured = vi.fn();
    render(<Probe onResult={captured} options={{ axis: 'y' }} />);
    const r = captured.mock.calls[0]![0] as Captured;
    const handlers = r.dragProps as PanCallbacks;

    act(() => {
      handlers.onPanResponderGrant?.();
    });
    act(() => {
      handlers.onPanResponderMove?.({}, { dx: 30, dy: 50, vx: 0, vy: 0 });
    });
    expect(r.x.get()).toBe(0);
    expect(r.y.get()).toBe(50);
  });

  it('fires onDragStart / onDrag / onDragEnd callbacks', () => {
    const onDragStart = vi.fn();
    const onDrag = vi.fn();
    const onDragEnd = vi.fn();
    const captured = vi.fn();
    render(
      <Probe
        onResult={captured}
        options={{ onDragStart, onDrag, onDragEnd }}
      />,
    );
    const r = captured.mock.calls[0]![0] as Captured;
    const handlers = r.dragProps as PanCallbacks;

    act(() => {
      handlers.onPanResponderGrant?.();
    });
    expect(onDragStart).toHaveBeenCalled();

    act(() => {
      handlers.onPanResponderMove?.({}, { dx: 40, dy: 0, vx: 0.5, vy: 0 });
    });
    expect(onDrag).toHaveBeenCalled();
    const info = onDrag.mock.calls.at(-1)![0] as DragInfo;
    expect(info.offset).toEqual({ x: 40, y: 0 });
    expect(info.velocity.x).toBe(500); // RN's vx is DIPs/ms — scaled ×1000

    act(() => {
      handlers.onPanResponderRelease?.();
    });
    expect(onDragEnd).toHaveBeenCalled();
  });
});

describe('useDrag — dragElastic (native)', () => {
  it('overshoots past constraints with diminishing returns', () => {
    const captured = vi.fn();
    render(
      <Probe
        onResult={captured}
        options={{ constraints: { left: -100, right: 100 }, dragElastic: 0.5 }}
      />,
    );
    const r = captured.mock.calls[0]![0] as Captured;
    const handlers = r.dragProps as PanCallbacks;

    act(() => handlers.onPanResponderGrant?.());
    act(() => handlers.onPanResponderMove?.({}, { dx: 200, dy: 0, vx: 0, vy: 0 }));
    // Bound 100, elastic 0.5 → 100 + (200 - 100) * 0.5 = 150.
    expect(r.x.get()).toBe(150);
  });

  it('clamps hard when dragElastic is omitted', () => {
    const captured = vi.fn();
    render(
      <Probe
        onResult={captured}
        options={{ constraints: { left: -100, right: 100 } }}
      />,
    );
    const r = captured.mock.calls[0]![0] as Captured;
    const handlers = r.dragProps as PanCallbacks;

    act(() => handlers.onPanResponderGrant?.());
    act(() => handlers.onPanResponderMove?.({}, { dx: 200, dy: 0, vx: 0, vy: 0 }));
    expect(r.x.get()).toBe(100);
  });
});

describe('useDrag — dragMomentum (native)', () => {
  it('schedules a settle rAF on release when dragMomentum is true', () => {
    const originalRaf = globalThis.requestAnimationFrame;
    const rafCalls: Array<FrameRequestCallback> = [];
    globalThis.requestAnimationFrame = ((cb: FrameRequestCallback) => {
      rafCalls.push(cb);
      return 1;
    }) as typeof globalThis.requestAnimationFrame;
    const originalCaf = globalThis.cancelAnimationFrame;
    globalThis.cancelAnimationFrame = (() => undefined) as typeof globalThis.cancelAnimationFrame;

    try {
      const captured = vi.fn();
      render(
        <Probe
          onResult={captured}
          options={{ constraints: { left: -100, right: 100 }, dragMomentum: true }}
        />,
      );
      const r = captured.mock.calls[0]![0] as Captured;
      const handlers = r.dragProps as PanCallbacks;

      act(() => handlers.onPanResponderGrant?.());
      act(() => handlers.onPanResponderMove?.({}, { dx: 30, dy: 0, vx: 0, vy: 0 }));
      const before = rafCalls.length;
      act(() => handlers.onPanResponderRelease?.());
      expect(rafCalls.length).toBeGreaterThan(before);
    } finally {
      globalThis.requestAnimationFrame = originalRaf;
      globalThis.cancelAnimationFrame = originalCaf;
    }
  });
});
