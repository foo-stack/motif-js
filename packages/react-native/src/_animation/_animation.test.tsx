/** @vitest-environment jsdom */
import { act, useEffect } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { animatedDriver } from './animated.js';
import { getMotionDriver, registerMotionDriver } from './index.js';
import { noopDriver } from './noop.js';
import type { MotionDriver, MotionDriverEntryOptions } from './types.js';

let container: HTMLElement;
let root: Root;

function captureDriver(
  driver: MotionDriver,
  opts: MotionDriverEntryOptions,
): { current: () => Record<string, unknown> | null } {
  let captured: Record<string, unknown> | null | undefined;
  function Probe(): null {
    const overlay = driver.useEntryAnimation(opts);
    useEffect(() => {
      captured = overlay;
    });
    captured = overlay;
    return null;
  }
  act(() => {
    root.render(<Probe />);
  });
  return {
    current: () => {
      if (captured === undefined) throw new Error('overlay not captured yet');
      return captured;
    },
  };
}

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => {
    root.unmount();
  });
  document.body.removeChild(container);
  registerMotionDriver(null);
});

describe('motion driver registry', () => {
  it('defaults to the animated driver', () => {
    expect(getMotionDriver().name).toBe('animated');
  });

  it('registerMotionDriver swaps the active driver', () => {
    registerMotionDriver(noopDriver);
    expect(getMotionDriver().name).toBe('noop');
  });

  it('registerMotionDriver(null) reverts to the default', () => {
    registerMotionDriver(noopDriver);
    registerMotionDriver(null);
    expect(getMotionDriver().name).toBe('animated');
  });
});

describe('noopDriver', () => {
  it('returns from-style on the first paint, then null', () => {
    const probe = captureDriver(noopDriver, {
      from: { opacity: 0 },
      to: { opacity: 1 },
      durationMs: 200,
      easing: 'ease',
    });
    // After the post-mount effect runs, overlay drops to null.
    expect(probe.current()).toBeNull();
  });
});

describe('animatedDriver (RN Animated, JS-thread)', () => {
  it('settles to null when the timing animation reaches toValue', () => {
    // The mock's Animated.timing fires `value=1` synchronously on
    // start(), so the listener flips overlay to null in the same tick.
    const probe = captureDriver(animatedDriver, {
      from: { opacity: 0 },
      to: { opacity: 1 },
      durationMs: 200,
      easing: 'ease',
    });
    expect(probe.current()).toBeNull();
  });

  it('exposes a sane name for diagnostics', () => {
    expect(animatedDriver.name).toBe('animated');
  });
});

describe('useExitAnimation — driver contract', () => {
  function captureExit(
    driver: MotionDriver,
    opts: Parameters<MotionDriver['useExitAnimation']>[0],
  ): { current: () => Record<string, unknown> } {
    let captured: Record<string, unknown> | undefined;
    function Probe(): null {
      const overlay = driver.useExitAnimation(opts);
      useEffect(() => {
        captured = overlay;
      });
      captured = overlay;
      return null;
    }
    act(() => {
      root.render(<Probe />);
    });
    return {
      current: () => {
        if (captured === undefined) throw new Error('overlay not captured');
        return captured;
      },
    };
  }

  it('noopDriver renders `from` then snaps to `to` and signals onComplete', () => {
    let completed = 0;
    const probe = captureExit(noopDriver, {
      from: { opacity: 1 },
      to: { opacity: 0 },
      durationMs: 200,
      easing: 'ease',
      onComplete: () => {
        completed++;
      },
    });
    expect(probe.current()).toEqual({ opacity: 0 });
    expect(completed).toBe(1);
  });

  it('animatedDriver fires onComplete once when progress hits 1', () => {
    let completed = 0;
    const probe = captureExit(animatedDriver, {
      from: { opacity: 1 },
      to: { opacity: 0 },
      durationMs: 200,
      easing: 'ease',
      onComplete: () => {
        completed++;
      },
    });
    // The mock's Animated.timing snaps to value=1 synchronously, so
    // the driver lands on `to` and signals immediately.
    expect(probe.current()).toEqual({ opacity: 0 });
    expect(completed).toBe(1);
  });

  // #219 - the boundary keeps the exit hook mounted across the open
  // phase, so the driver must stay idle (emit `from`, never signal)
  // until `active` flips true. Only `BoxWithExitNative` passes
  // `active: false`; direct callers omit it and default to active.
  it('noopDriver stays idle and emits `from` while active is false', () => {
    let completed = 0;
    const probe = captureExit(noopDriver, {
      from: { opacity: 1 },
      to: { opacity: 0 },
      durationMs: 200,
      easing: 'ease',
      active: false,
      onComplete: () => {
        completed++;
      },
    });
    expect(probe.current()).toEqual({ opacity: 1 });
    expect(completed).toBe(0);
  });

  it('animatedDriver stays idle and does not signal while active is false', () => {
    let completed = 0;
    const probe = captureExit(animatedDriver, {
      from: { opacity: 1 },
      to: { opacity: 0 },
      durationMs: 200,
      easing: 'ease',
      active: false,
      onComplete: () => {
        completed++;
      },
    });
    expect(probe.current()).toEqual({ opacity: 1 });
    expect(completed).toBe(0);
  });
});
