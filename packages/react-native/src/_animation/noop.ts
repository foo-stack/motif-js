import { composeTransformAxesNative, type TransformAxes } from '@usemotif/core';
import { useEffect, useRef, useState } from 'react';
import type {
  MotionDriver,
  MotionDriverEntryOptions,
  MotionDriverExitOptions,
  MotionValueDriverBinding,
  MotionValueDriverResult,
  SpringBackingHandle,
  SpringBackingOptions,
} from './types.js';

/**
 * No-op driver. Renders `from` for one paint, then drops the overlay -
 * effectively a single-frame "entry animation" with zero interpolation.
 *
 * Used in tests where we don't want a real animation loop, and as the
 * absolute fallback when neither Reanimated nor RN's `Animated` API
 * are usable (e.g. pathological test environments). Production apps
 * never resolve to this driver.
 */
export const noopDriver: MotionDriver = {
  name: 'noop',
  useEntryAnimation(opts: MotionDriverEntryOptions): Record<string, string | number> | null {
    const [settled, setSettled] = useState(false);
    const delayMs = opts.delayMs ?? 0;
    useEffect(() => {
      // Honour delay so stagger-driven tests still observe the
      // pre-settled overlay for the configured window. Without delay
      // the noop driver still flips synchronously.
      if (delayMs <= 0) {
        setSettled(true);
        return undefined;
      }
      const t = setTimeout(() => setSettled(true), delayMs);
      return () => clearTimeout(t);
    }, [delayMs]);
    return settled ? null : opts.from;
  },
  useExitAnimation(opts: MotionDriverExitOptions): Record<string, string | number> {
    // Single-frame exit: render `from` while idle, then on `active` snap
    // to `to` and signal completion. Tests use this for deterministic
    // exits. Keyed on `active` (default true) so a direct caller that
    // mounts the hook only while exiting still settles, while
    // `BoxWithExitNative` - which keeps the hook mounted across the open
    // phase (#219) - stays idle until the boundary flips to exiting.
    const active = opts.active ?? true;
    const [settled, setSettled] = useState(false);
    useEffect(() => {
      if (!active) return;
      setSettled(true);
      opts.onComplete();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active]);
    return settled ? opts.to : opts.from;
  },
  useMotionValueBacking(bindings: readonly MotionValueDriverBinding[]): MotionValueDriverResult {
    // Snap to each binding's initial value and do not subscribe. Tests
    // that need to observe `.set()` updates should register either the
    // `animatedDriver` or a custom test driver - the noop is the
    // single-frame "render the value once" surface for determinism.
    //
    // Transform-axis bindings compose into RN's array form via the
    // core composer so the snapshot shape matches what the animated
    // driver produces (one `transform` slot, axes in canonical order).
    const overlay: Record<string, unknown> = {};
    const transformAxes: TransformAxes = {};
    let hasTransformAxes = false;
    for (const b of bindings) {
      const value = b.mv.get();
      if (b.transformAxis !== undefined) {
        if (typeof value === 'string' || typeof value === 'number') {
          transformAxes[b.transformAxis] = value;
        }
        hasTransformAxes = true;
      } else {
        overlay[b.cssProperty] = value;
      }
    }
    if (hasTransformAxes) {
      const composed = composeTransformAxesNative(transformAxes);
      if (composed !== undefined) overlay.transform = composed;
    }
    return { overlay };
  },
  useSpringBacking(opts: SpringBackingOptions): SpringBackingHandle {
    // Snap-to-target backing: every retarget assigns the value
    // synchronously and fires subscribers once. Matches the noop driver
    // contract - useful for tests that want determinism without an
    // animation loop.
    const valueRef = useRef<number>(opts.initial);
    const subscribersRef = useRef<Set<(value: number) => void>>(new Set());
    return {
      get(): number {
        return valueRef.current;
      },
      setTarget(target: number): void {
        valueRef.current = target;
        for (const cb of subscribersRef.current) cb(target);
      },
      subscribe(cb: (value: number) => void): () => void {
        subscribersRef.current.add(cb);
        return () => {
          subscribersRef.current.delete(cb);
        };
      },
    };
  },
};
