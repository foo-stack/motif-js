/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { createTheme, isMotionValue, type MotionValue } from '@usemotif/core';
import { ThemeContext } from './theme-context.js';
import { useSpring, type SpringConfig } from './use-spring.js';

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

let rafCallbacks: Array<(time: number) => void>;
let currentTime: number;
let nextRafId: number;

beforeEach(() => {
  rafCallbacks = [];
  currentTime = 0;
  nextRafId = 1;
  globalThis.requestAnimationFrame = ((cb: FrameRequestCallback) => {
    const id = nextRafId++;
    rafCallbacks.push(cb);
    return id;
  }) as typeof globalThis.requestAnimationFrame;
  globalThis.cancelAnimationFrame = (() => undefined) as typeof globalThis.cancelAnimationFrame;
  Object.defineProperty(globalThis, 'performance', {
    value: { now: () => currentTime },
    configurable: true,
  });
});

function advanceFrame(ms = 16): void {
  currentTime += ms;
  const cbs = rafCallbacks;
  rafCallbacks = [];
  act(() => {
    for (const cb of cbs) cb(currentTime);
  });
}

function runToSettle(maxFrames = 600): number {
  let frames = 0;
  while (rafCallbacks.length > 0 && frames < maxFrames) {
    advanceFrame(16);
    frames++;
  }
  return frames;
}

function Probe({
  initial,
  config,
  onValue,
}: {
  initial: number;
  config?: SpringConfig | string;
  onValue: (v: MotionValue<number>) => void;
}): null {
  const v = useSpring(initial, config);
  onValue(v);
  return null;
}

describe('native useSpring', () => {
  it('returns a motion value (brand-checked)', () => {
    const captured = vi.fn();
    render(<Probe initial={0} onValue={captured} />);
    expect(isMotionValue(captured.mock.calls[0]![0])).toBe(true);
  });

  it('settles exactly on the target after enough frames', () => {
    const captured = vi.fn();
    render(<Probe initial={0} onValue={captured} />);
    const mv = captured.mock.calls[0]![0] as MotionValue<number>;
    act(() => mv.set(100));
    runToSettle();
    expect(mv.get()).toBe(100);
  });

  it('notifies subscribers each frame the value changes', () => {
    const captured = vi.fn();
    render(<Probe initial={0} onValue={captured} />);
    const mv = captured.mock.calls[0]![0] as MotionValue<number>;

    const onChange = vi.fn();
    const unsubscribe = mv.on('change', onChange);

    act(() => mv.set(100));
    advanceFrame(16);
    advanceFrame(16);
    expect(onChange.mock.calls.length).toBeGreaterThanOrEqual(2);
    unsubscribe();
  });

  it('resolves a spring token from the theme', () => {
    const theme = createTheme({
      name: 'test',
      tokens: {
        animations: {
          fast: { type: 'spring', stiffness: 400, damping: 40 },
        },
      },
    });
    const captured = vi.fn();
    render(
      <ThemeContext.Provider value={{ themes: [theme], active: theme.name }}>
        <Probe initial={0} config="$animations.fast" onValue={captured} />
      </ThemeContext.Provider>,
    );
    const mv = captured.mock.calls[0]![0] as MotionValue<number>;
    act(() => mv.set(100));
    runToSettle();
    expect(mv.get()).toBe(100);
  });

  it('motion-value updates do not trigger React renders', () => {
    const captured = vi.fn();
    render(<Probe initial={0} onValue={captured} />);
    const mv = captured.mock.calls[0]![0] as MotionValue<number>;
    const renderCountAfterMount = captured.mock.calls.length;

    act(() => mv.set(100));
    runToSettle();

    expect(captured.mock.calls.length).toBe(renderCountAfterMount);
  });
});
