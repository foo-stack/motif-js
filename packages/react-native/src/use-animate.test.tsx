/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { useAnimate } from './use-animate.js';

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

describe('native useAnimate (stub)', () => {
  it('returns a scope ref and an animate function', () => {
    let scope: { current: unknown } | undefined;
    let animateFn: unknown;
    function Probe(): null {
      const [s, a] = useAnimate();
      scope = s;
      animateFn = a;
      return null;
    }
    render(<Probe />);
    expect(scope).toBeDefined();
    expect(typeof animateFn).toBe('function');
  });

  it('resolves immediately and logs a one-time dev warning', async () => {
    let animateFn!: ReturnType<typeof useAnimate>[1];
    function Probe(): null {
      const [, a] = useAnimate();
      animateFn = a;
      return null;
    }
    render(<Probe />);

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    let scope2!: { current: unknown };
    function Probe2(): null {
      const [s] = useAnimate();
      scope2 = s;
      return null;
    }
    render(<Probe2 />);

    const controls = animateFn(scope2, { opacity: 0 }, { duration: 0.3 });
    await controls.finished;
    // Stub returns resolved controls; cancel/pause/play are no-ops.
    expect(typeof controls.cancel).toBe('function');
    expect(() => controls.cancel()).not.toThrow();
    expect(() => controls.pause()).not.toThrow();
    expect(() => controls.play()).not.toThrow();

    warnSpy.mockRestore();
  });
});
