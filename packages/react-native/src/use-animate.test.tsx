/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, type ReactNode, type RefObject } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { useAnimate } from './use-animate.js';
import { registerMotionDriver } from './_animation/index.js';
import type { MotionDriver } from './_animation/types.js';

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
  registerMotionDriver(null);
});

describe('native useAnimate - interface', () => {
  it('returns a scope ref and an animate function', () => {
    let scope: RefObject<unknown> | undefined;
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
});

describe('native useAnimate - driver delegation', () => {
  it('forwards target / keyframes / options to driver.useImperativeAnimate', () => {
    type Call = { target: unknown; keyframes: unknown; options: unknown };
    const calls: Call[] = [];
    const driver: MotionDriver = {
      name: 'capture-animate',
      useEntryAnimation: () => null,
      useExitAnimation: () => ({}),
      useImperativeAnimate: () => (target, keyframes, options) => {
        calls.push({ target, keyframes, options });
        return {
          finished: Promise.resolve(),
          cancel: () => undefined,
          pause: () => undefined,
          play: () => undefined,
        };
      },
    };
    registerMotionDriver(driver);

    let scope!: RefObject<unknown>;
    let animateFn!: ReturnType<typeof useAnimate>[1];
    function Probe(): null {
      const [s, a] = useAnimate();
      scope = s;
      animateFn = a;
      return null;
    }
    render(<Probe />);

    animateFn(scope, { opacity: 0 }, { duration: 0.5 });
    expect(calls).toHaveLength(1);
    expect(calls[0]!.target).toBe(scope);
    expect(calls[0]!.keyframes).toEqual({ opacity: 0 });
    expect(calls[0]!.options).toEqual({ duration: 0.5 });
  });

  it('falls back to immediate-resolve stub when driver lacks useImperativeAnimate', async () => {
    const driver: MotionDriver = {
      name: 'no-animate',
      useEntryAnimation: () => null,
      useExitAnimation: () => ({}),
    };
    registerMotionDriver(driver);

    let scope!: RefObject<unknown>;
    let animateFn!: ReturnType<typeof useAnimate>[1];
    function Probe(): null {
      const [s, a] = useAnimate();
      scope = s;
      animateFn = a;
      return null;
    }
    render(<Probe />);

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const controls = animateFn(scope, { opacity: 0 }, { duration: 0.3 });
    await controls.finished;
    expect(() => controls.cancel()).not.toThrow();
    warnSpy.mockRestore();
  });
});

describe('animatedDriver - useImperativeAnimate', () => {
  it('writes per-frame styles to the target ref via setNativeProps', async () => {
    // The default `animatedDriver` is registered automatically. Build
    // a fake host with a setNativeProps spy so we can observe writes.
    const sets: Array<Record<string, unknown>> = [];
    const fakeView = {
      setNativeProps: (props: { style: Record<string, unknown> }) => {
        sets.push(props.style);
      },
    };
    const ref = { current: fakeView } as { current: typeof fakeView | null };

    let animateFn!: ReturnType<typeof useAnimate>[1];
    function Probe(): null {
      const [, a] = useAnimate();
      animateFn = a;
      return null;
    }
    render(<Probe />);

    const controls = animateFn(ref as RefObject<unknown>, { opacity: [1, 0] }, { duration: 0.1 });
    // The mock RN Animated.timing snaps to toValue immediately and
    // notifies the listener once. We expect at least one setNativeProps
    // write with the toValue applied.
    await controls.finished;
    expect(sets.length).toBeGreaterThanOrEqual(1);
    expect(sets[sets.length - 1]).toEqual({ opacity: 0 });
  });

  it('resolves immediately for selector-string targets (not supported on native)', async () => {
    let animateFn!: ReturnType<typeof useAnimate>[1];
    function Probe(): null {
      const [, a] = useAnimate();
      animateFn = a;
      return null;
    }
    render(<Probe />);
    const controls = animateFn('.does-not-resolve', { opacity: 0 });
    await controls.finished;
    expect(() => controls.cancel()).not.toThrow();
  });
});
