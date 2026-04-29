/** @vitest-environment jsdom */
/**
 * Reanimated driver tests run against the **fallback path** —
 * `react-native-reanimated` isn't installed in
 * `@motif-js/react-native`'s devDependencies, so `tryRequire` lands
 * on `null` and the driver degrades to JS-thread interpolation.
 *
 * **What this file covers:**
 *
 * - The driver implements the full `MotionDriver` interface, with a
 *   stable name + both motion hooks. (Structural conformance.)
 * - The fallback path's exit hook eventually fires `onComplete` once
 *   the JS-thread rAF loop reaches `t=1`, exercising the same exit
 *   contract every other driver implements.
 *
 * **What this file deliberately doesn't cover:** the UI-thread
 * `useSharedValue` / `useAnimatedStyle` / `Animated.View` integration.
 * That path is only exercisable when Reanimated is actually loadable,
 * which requires the peer dep (and ideally a real native runtime).
 * The contract is documented and reviewable from the source; running
 * a real worklet inside vitest+jsdom would test our mock more than
 * the driver.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, useEffect } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { reanimatedDriver } from './reanimated.js';
import type { MotionDriver } from './types.js';

let container: HTMLElement;
let root: Root;

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
});

describe('reanimatedDriver — interface conformance', () => {
  it('implements the full MotionDriver shape', () => {
    const driver: MotionDriver = reanimatedDriver;
    expect(driver.name).toBe('reanimated');
    expect(typeof driver.useEntryAnimation).toBe('function');
    expect(typeof driver.useExitAnimation).toBe('function');
  });

  it('reports AnimatedHost as undefined on the fallback path (peer not loadable)', () => {
    // Without the peer dep installed, `tryRequire` resolves to null
    // and the driver runs through JS-thread setState. AnimatedHost
    // staying undefined keeps Box on the plain RN `View`.
    expect(reanimatedDriver.AnimatedHost).toBeUndefined();
  });
});

describe('reanimatedDriver — fallback path (peer missing)', () => {
  it('useEntryAnimation eventually settles to null', async () => {
    let captured: Record<string, unknown> | null | undefined = undefined;
    function Probe(): null {
      const overlay = reanimatedDriver.useEntryAnimation({
        from: { opacity: 0 },
        to: { opacity: 1 },
        durationMs: 0,
        easing: 'ease',
      });
      useEffect(() => {
        captured = overlay;
      });
      captured = overlay;
      return null;
    }
    act(() => {
      root.render(<Probe />);
    });
    // Allow the rAF loop to settle (jsdom polyfills rAF as setTimeout).
    await new Promise((resolve) => setTimeout(resolve, 50));
    act(() => {
      root.render(<Probe />);
    });
    expect(captured).toBeNull();
  });

  it('useExitAnimation fires onComplete once the rAF loop reaches t=1', async () => {
    let completeCount = 0;
    function Probe(): null {
      reanimatedDriver.useExitAnimation({
        from: { opacity: 1 },
        to: { opacity: 0 },
        durationMs: 0,
        easing: 'ease',
        onComplete: () => {
          completeCount++;
        },
      });
      return null;
    }
    act(() => {
      root.render(<Probe />);
    });
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(completeCount).toBeGreaterThanOrEqual(1);
  });
});
