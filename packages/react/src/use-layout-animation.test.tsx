/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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

/**
 * jsdom doesn't lay out, so `getBoundingClientRect` returns zeroed
 * values. We override the prototype to read a per-test "current rect"
 * so tests can change the rect BEFORE each render — the hook's
 * useLayoutEffect runs synchronously during the render's act flush
 * and reads through the prototype at that moment.
 */
let pendingRect: { x: number; y: number; width: number; height: number };
const origGetBoundingClientRect = Element.prototype.getBoundingClientRect;
beforeEach(() => {
  pendingRect = { x: 0, y: 0, width: 0, height: 0 };
  Element.prototype.getBoundingClientRect = function () {
    const r = pendingRect;
    return {
      x: r.x,
      y: r.y,
      width: r.width,
      height: r.height,
      left: r.x,
      top: r.y,
      right: r.x + r.width,
      bottom: r.y + r.height,
      toJSON: () => null,
    } as DOMRect;
  };
});
afterEach(() => {
  Element.prototype.getBoundingClientRect = origGetBoundingClientRect;
});

function setRect(rect: { x: number; y: number; width: number; height: number }): void {
  pendingRect = rect;
}

/**
 * Polyfill rAF for synchronous, deterministic test execution. The
 * synchronous variant fires the callback immediately so tests can
 * observe the post-rAF transform clear. Individual tests that need
 * the inverse-transform to be visible BEFORE the rAF tick install a
 * queued variant inline.
 */
const originalRAF = window.requestAnimationFrame;
const originalCAF = window.cancelAnimationFrame;
beforeEach(() => {
  window.requestAnimationFrame = ((cb: FrameRequestCallback) => {
    cb(0);
    return 0;
  }) as typeof window.requestAnimationFrame;
  window.cancelAnimationFrame = (() => undefined) as typeof window.cancelAnimationFrame;
});
afterEach(() => {
  window.requestAnimationFrame = originalRAF;
  window.cancelAnimationFrame = originalCAF;
});

/** Install a queued rAF variant — returns an array of callbacks that
 * tests flush manually. Lets tests observe state BEFORE the rAF fires. */
function queueRaf(): Array<() => void> {
  const queued: Array<() => void> = [];
  window.requestAnimationFrame = ((cb: FrameRequestCallback) => {
    queued.push(() => cb(0));
    return queued.length;
  }) as typeof window.requestAnimationFrame;
  return queued;
}

describe('useLayoutAnimation', () => {
  it('returns a ref that consumers attach to an element', () => {
    function Probe(): ReactNode {
      const { ref } = useLayoutAnimation<HTMLDivElement>();
      return <div ref={ref} data-testid="target" />;
    }
    setRect({ x: 0, y: 0, width: 100, height: 100 });
    render(<Probe />);
    const el = container.querySelector('[data-testid="target"]') as HTMLElement;
    expect(el).toBeDefined();
  });

  it('does not apply a transform on first commit', () => {
    function Probe(): ReactNode {
      const { ref } = useLayoutAnimation<HTMLDivElement>();
      return <div ref={ref} data-testid="target" />;
    }
    setRect({ x: 0, y: 0, width: 100, height: 100 });
    render(<Probe />);
    const el = container.querySelector('[data-testid="target"]') as HTMLElement;
    expect(el.style.transform).toBe('');
  });

  it('applies the inverse transform when position changes (held under queued rAF)', () => {
    function Probe({ trigger }: { trigger: number }): ReactNode {
      const { ref } = useLayoutAnimation<HTMLDivElement>();
      return <div ref={ref} data-testid="target" data-trigger={trigger} />;
    }

    setRect({ x: 0, y: 0, width: 100, height: 100 });
    render(<Probe trigger={0} />);
    const el = container.querySelector('[data-testid="target"]') as HTMLElement;

    const queued = queueRaf();
    setRect({ x: 50, y: 30, width: 100, height: 100 });
    render(<Probe trigger={1} />);

    // Inverse delta: prev - next = (0-50, 0-30) = (-50, -30). The
    // hook applies that translation synchronously inside the layout
    // effect, before the rAF tick clears it.
    expect(el.style.transform).toContain('translate(-50px, -30px)');
    expect(el.style.transformOrigin.length).toBeGreaterThan(0);

    // Flushing rAF clears the transform and installs the transition.
    queued[0]?.();
    expect(el.style.transform).toBe('');
    expect(el.style.transition).toContain('transform 300ms ease-in-out');
  });

  it('applies a scale component when size changes', () => {
    function Probe({ trigger }: { trigger: number }): ReactNode {
      const { ref } = useLayoutAnimation<HTMLDivElement>();
      return <div ref={ref} data-testid="target" data-trigger={trigger} />;
    }
    setRect({ x: 0, y: 0, width: 100, height: 100 });
    render(<Probe trigger={0} />);
    const el = container.querySelector('[data-testid="target"]') as HTMLElement;

    queueRaf();
    setRect({ x: 0, y: 0, width: 200, height: 50 });
    render(<Probe trigger={1} />);

    // sx = prev.width / next.width = 100/200 = 0.5
    // sy = prev.height / next.height = 100/50 = 2
    expect(el.style.transform).toContain('scale(0.5, 2)');
  });

  it('respects the `kind: "position"` option (no scale component)', () => {
    function Probe({ trigger }: { trigger: number }): ReactNode {
      const { ref } = useLayoutAnimation<HTMLDivElement>({ kind: 'position' });
      return <div ref={ref} data-testid="target" data-trigger={trigger} />;
    }
    setRect({ x: 0, y: 0, width: 100, height: 100 });
    render(<Probe trigger={0} />);
    const el = container.querySelector('[data-testid="target"]') as HTMLElement;

    queueRaf();
    setRect({ x: 50, y: 30, width: 200, height: 200 });
    render(<Probe trigger={1} />);

    expect(el.style.transform).toContain('translate(-50px, -30px)');
    expect(el.style.transform).toContain('scale(1, 1)');
  });

  it('respects the `kind: "size"` option (no translate component)', () => {
    function Probe({ trigger }: { trigger: number }): ReactNode {
      const { ref } = useLayoutAnimation<HTMLDivElement>({ kind: 'size' });
      return <div ref={ref} data-testid="target" data-trigger={trigger} />;
    }
    setRect({ x: 0, y: 0, width: 100, height: 100 });
    render(<Probe trigger={0} />);
    const el = container.querySelector('[data-testid="target"]') as HTMLElement;

    queueRaf();
    setRect({ x: 50, y: 30, width: 50, height: 50 });
    render(<Probe trigger={1} />);

    expect(el.style.transform).toContain('translate(0px, 0px)');
    expect(el.style.transform).toContain('scale(2, 2)');
  });

  it('uses the custom duration / easing when provided', () => {
    function Probe({ trigger }: { trigger: number }): ReactNode {
      const { ref } = useLayoutAnimation<HTMLDivElement>({ duration: 0.6, easing: 'linear' });
      return <div ref={ref} data-testid="target" data-trigger={trigger} />;
    }
    setRect({ x: 0, y: 0, width: 100, height: 100 });
    render(<Probe trigger={0} />);
    const el = container.querySelector('[data-testid="target"]') as HTMLElement;

    setRect({ x: 10, y: 0, width: 100, height: 100 });
    render(<Probe trigger={1} />);

    expect(el.style.transition).toContain('transform 600ms linear');
  });

  it('skips work when the rect does not change', () => {
    function Probe({ trigger }: { trigger: number }): ReactNode {
      const { ref } = useLayoutAnimation<HTMLDivElement>();
      return <div ref={ref} data-testid="target" data-trigger={trigger} />;
    }
    setRect({ x: 0, y: 0, width: 100, height: 100 });
    render(<Probe trigger={0} />);
    const el = container.querySelector('[data-testid="target"]') as HTMLElement;

    const transitionSpy = vi.spyOn(el.style, 'transition', 'set');
    // Same rect — no diff, no animation, no transition write.
    render(<Probe trigger={1} />);
    expect(transitionSpy).not.toHaveBeenCalled();
    transitionSpy.mockRestore();
  });

  it('updates the recorded rect across multiple commits', () => {
    function Probe({ x }: { x: number }): ReactNode {
      const { ref } = useLayoutAnimation<HTMLDivElement>();
      return <div ref={ref} data-testid="target" data-x={x} />;
    }
    setRect({ x: 0, y: 0, width: 100, height: 100 });
    render(<Probe x={0} />);

    setRect({ x: 10, y: 0, width: 100, height: 100 });
    render(<Probe x={1} />);

    setRect({ x: 30, y: 0, width: 100, height: 100 });
    render(<Probe x={2} />);

    const el = container.querySelector('[data-testid="target"]') as HTMLElement;
    // After the synchronous rAF tick, transform is cleared.
    expect(el.style.transform).toBe('');
  });
});
