/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRoot, type Root } from 'react-dom/client';
import { act, useRef, type RefObject } from 'react';
import { Box } from '../Box.js';
import { _resetDevWarningsForTesting } from '../_dev-warnings.js';
import { _resetStyleCacheForTesting } from '../style-cache.js';
import { getMotionDriver, registerMotionDriver } from './index.js';
import { cssDriver } from './css.js';
import { parseTimeMs, waapiDriver } from './waapi.js';

interface RecordedAnimation {
  readonly keyframes: unknown;
  readonly options: KeyframeAnimationOptions | number | undefined;
  cancel: () => void;
  /** Controllable in tests: resolve to simulate the animation finishing. */
  finish: () => void;
  readonly finished: Promise<void>;
}

/** Hoisted so the JSX prop isn't a fresh object each render (lint: no-unstable-props). */
const HIDDEN = { opacity: 0 };

let recorded: RecordedAnimation[] = [];
let cancelled = 0;
let container: HTMLElement;
let root: Root;

function render(node: React.ReactNode): HTMLElement {
  act(() => {
    root.render(node);
  });
  return container;
}

beforeEach(() => {
  _resetStyleCacheForTesting();
  _resetDevWarningsForTesting();
  document.head.innerHTML = '';
  document.body.innerHTML = '';
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);

  recorded = [];
  cancelled = 0;
  // jsdom has no Element.animate — install a recording stub (mirrors the
  // WAAPI mock in use-animate.test.tsx).
  (Element.prototype as unknown as { animate: unknown }).animate = function (
    keyframes: unknown,
    options: KeyframeAnimationOptions | number | undefined,
  ): RecordedAnimation {
    let resolveFinished!: () => void;
    let rejectFinished!: () => void;
    const finished = new Promise<void>((resolve, reject) => {
      resolveFinished = resolve;
      // The real WAAPI rejects `finished` when an animation is cancelled.
      rejectFinished = () => reject(new DOMException('cancelled', 'AbortError'));
    });
    // Swallow the cancel rejection here too, so an unhandled rejection from the
    // mock's own promise never trips the test runner.
    finished.catch(() => {});
    const anim: RecordedAnimation = {
      keyframes,
      options,
      cancel: (): void => {
        cancelled += 1;
        rejectFinished();
      },
      finish: (): void => resolveFinished(),
      finished,
    };
    recorded.push(anim);
    return anim;
  };
});

afterEach(() => {
  registerMotionDriver(null);
  act(() => {
    root.unmount();
  });
  document.body.removeChild(container);
  _resetStyleCacheForTesting();
  _resetDevWarningsForTesting();
  document.head.innerHTML = '';
  document.body.innerHTML = '';
  delete (Element.prototype as unknown as { animate?: unknown }).animate;
  vi.restoreAllMocks();
  // `vi.stubGlobal` (used by the reduced-motion cases) is NOT undone by
  // restoreAllMocks — without this the matchMedia stub leaks into later tests.
  vi.unstubAllGlobals();
});

describe('parseTimeMs', () => {
  it('parses ms and s tokens', () => {
    expect(parseTimeMs('200ms')).toBe(200);
    expect(parseTimeMs('0.2s')).toBe(200);
    expect(parseTimeMs('1s')).toBe(1000);
  });

  it('returns 0 for empty / unparseable input', () => {
    expect(parseTimeMs('')).toBe(0);
    expect(parseTimeMs(undefined)).toBe(0);
    expect(parseTimeMs('not-a-time')).toBe(0);
  });
});

describe('motion driver registry', () => {
  it('defaults to the css driver', () => {
    expect(getMotionDriver()).toBe(cssDriver);
    expect(getMotionDriver().name).toBe('css');
  });

  it('swaps to a registered driver and reverts on null', () => {
    registerMotionDriver(waapiDriver);
    expect(getMotionDriver().name).toBe('waapi');
    registerMotionDriver(null);
    expect(getMotionDriver()).toBe(cssDriver);
  });
});

describe('cssDriver (default)', () => {
  it('overlays enterStyle then removes it after rAF — no element.animate', async () => {
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame');
    render(<Box enterStyle={HIDDEN} transition="opacity 200ms ease" data-testid="x" />);
    const el = container.querySelector('[data-testid="x"]') as HTMLElement;

    expect(el.style.opacity).toBe('0');
    // The CSS path never touches the Web Animations API.
    expect(recorded).toHaveLength(0);

    const flush = rafSpy.mock.calls[0]![0] as FrameRequestCallback;
    act(() => {
      flush(0);
    });
    expect(el.style.opacity).toBe('');
  });
});

describe('waapiDriver (opt-in)', () => {
  it('drives entry via element.animate with a backwards-filled [from, {}]', () => {
    registerMotionDriver(waapiDriver);
    render(<Box enterStyle={HIDDEN} transition="opacity 200ms ease" data-testid="x" />);
    const el = container.querySelector('[data-testid="x"]') as HTMLElement;

    expect(recorded).toHaveLength(1);
    const { keyframes, options } = recorded[0]!;
    expect(keyframes).toEqual([{ opacity: 0 }, {}]);
    expect(options).toMatchObject({ fill: 'backwards', delay: 0 });
    expect((options as KeyframeAnimationOptions).duration).toBe(200);

    // The driver returns no React overlay — the element renders at rest and
    // the visual from-state comes from WAAPI's backwards fill, not inline CSS.
    expect(el.style.opacity).toBe('');
  });

  it('cancels the animation on unmount', () => {
    registerMotionDriver(waapiDriver);
    render(<Box enterStyle={HIDDEN} transition="opacity 200ms ease" />);
    expect(recorded).toHaveLength(1);
    act(() => {
      root.unmount();
    });
    expect(cancelled).toBe(1);
  });

  it('skips animation under prefers-reduced-motion', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query.includes('reduce'),
      media: query,
      addEventListener: (): void => {},
      removeEventListener: (): void => {},
    }));
    registerMotionDriver(waapiDriver);
    render(<Box enterStyle={HIDDEN} transition="opacity 200ms ease" />);
    expect(recorded).toHaveLength(0);
  });
});

// Probe that drives the active driver's exit hook directly — the host (Box)
// wiring of the presence phase lands in a later increment; here we exercise the
// driver seam itself.
const EXIT_TO = { opacity: 0 };
function ExitProbe({ active, onComplete }: { active: boolean; onComplete: () => void }) {
  const ref = useRef<HTMLDivElement | null>(null);
  getMotionDriver().useExit(ref as RefObject<HTMLElement | null>, {
    to: EXIT_TO,
    active,
    onComplete,
  });
  return <div ref={ref} data-testid="ep" />;
}

describe('driver exit seam (useExit)', () => {
  it('cssDriver.useExit is a no-op — no element.animate, never settles', () => {
    const onComplete = vi.fn();
    render(<ExitProbe active onComplete={onComplete} />);
    expect(recorded).toHaveLength(0);
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('waapiDriver.useExit animates toward the exit overlay off-thread', () => {
    registerMotionDriver(waapiDriver);
    const onComplete = vi.fn();
    render(<ExitProbe active onComplete={onComplete} />);
    expect(recorded).toHaveLength(1);
    const { keyframes, options } = recorded[0]!;
    // `[{}, to]`: from the live resting style toward the exit overlay.
    expect(keyframes).toEqual([{}, { opacity: 0 }]);
    expect(options).toMatchObject({ fill: 'forwards' });
    expect((options as KeyframeAnimationOptions).duration).toBe(200);
    // Not settled until the animation finishes.
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('waapiDriver.useExit settles via onComplete when the animation finishes', async () => {
    registerMotionDriver(waapiDriver);
    const onComplete = vi.fn();
    render(<ExitProbe active onComplete={onComplete} />);
    await act(async () => {
      recorded[0]!.finish();
      await Promise.resolve();
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('waapiDriver.useExit cancels (no settle) when the exit is interrupted', async () => {
    registerMotionDriver(waapiDriver);
    const onComplete = vi.fn();
    render(<ExitProbe active onComplete={onComplete} />);
    // Re-shown mid-exit: active flips false → the off-thread animation cancels
    // and the settle is suppressed (the element stays mounted).
    render(<ExitProbe active={false} onComplete={onComplete} />);
    expect(cancelled).toBe(1);
    await act(async () => {
      await Promise.resolve();
    });
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('waapiDriver.useExit settles immediately under reduced motion (no animate)', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query.includes('reduce'),
      media: query,
      addEventListener: (): void => {},
      removeEventListener: (): void => {},
    }));
    registerMotionDriver(waapiDriver);
    const onComplete = vi.fn();
    render(<ExitProbe active onComplete={onComplete} />);
    expect(recorded).toHaveLength(0);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
