'use client';

import { useLayoutEffect, useState, type RefObject } from 'react';
import { isReducedMotionSync } from '../_stagger-context.js';
import type { WebEntryOptions, WebEntryState, WebExitOptions, WebMotionDriver } from './types.js';

const DEFAULT_DURATION_MS = 200;

/**
 * Parse a CSS `<time>` token (`"200ms"`, `"0.2s"`) to milliseconds.
 * Returns `0` for an unparseable or empty value so callers can fall back.
 */
export function parseTimeMs(value: string | undefined): number {
  if (value === undefined) return 0;
  const trimmed = value.trim();
  if (trimmed === '') return 0;
  if (trimmed.endsWith('ms')) {
    const n = Number.parseFloat(trimmed.slice(0, -2));
    return Number.isFinite(n) ? n : 0;
  }
  if (trimmed.endsWith('s')) {
    const n = Number.parseFloat(trimmed.slice(0, -1));
    return Number.isFinite(n) ? n * 1000 : 0;
  }
  const n = Number.parseFloat(trimmed);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Off-main-thread web motion driver. Rather than toggling an overlay and
 * leaning on the CSS transition engine, it drives the entry with the Web
 * Animations API: a single `element.animate([from, {}], …)` the browser can
 * run on the compositor for `transform` / `opacity`, with imperative control
 * (cancel on unmount) the CSS path can't offer.
 *
 * Timing comes from the element's own resolved `transition`. Box bakes the
 * `transition` prop onto the element as CSS custom-property references, and
 * `getComputedStyle` resolves them through the active `[data-theme]` cascade,
 * so the WAAPI animation matches the declared timing without re-reading
 * tokens in JS. When no transition resolves, it falls back to 200ms ease.
 *
 * Opt in with `registerMotionDriver(waapiDriver)` at app startup. The driver
 * lives in its own module with no top-level side effects, so it tree-shakes
 * out of any bundle that never imports it.
 */
export const waapiDriver: WebMotionDriver = {
  name: 'waapi',
  needsRef: true,
  useEntry(ref: RefObject<HTMLElement | null>, opts: WebEntryOptions): WebEntryState {
    const [reducedMotion, setReducedMotion] = useState<boolean>(false);

    useLayoutEffect(() => {
      const el = ref.current;
      if (el === null) return undefined;
      if (isReducedMotionSync()) {
        setReducedMotion(true);
        return undefined;
      }
      // jsdom and very old engines may not implement element.animate.
      if (typeof el.animate !== 'function') return undefined;

      const cs = getComputedStyle(el);
      const durationMs = parseTimeMs(cs.transitionDuration) || DEFAULT_DURATION_MS;
      const timingFn = cs.transitionTimingFunction;
      const easing = timingFn !== '' && timingFn !== 'all' ? timingFn : 'ease';
      const delayMs = opts.delaySec * 1000;

      // `[from, {}]`: the empty final keyframe settles each animated property
      // at the element's own resting value. `fill: 'backwards'` shows the
      // from-state before the active phase (and during any stagger delay), so
      // there's no flash of the resting style. The layout effect runs before
      // paint, so the first painted frame is already the from-state — the same
      // no-FOUC guarantee the CSS driver gives, without a React overlay render.
      const anim = el.animate([{ ...opts.from }, {}], {
        duration: durationMs,
        delay: delayMs,
        easing,
        fill: 'backwards',
      });

      return () => {
        anim.cancel();
      };
      // Mount-only: the entry plays once, from the values captured at mount,
      // exactly like the CSS driver's one-shot overlay.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // WAAPI owns the visual; React renders the resting style directly.
    return { overlay: null, reducedMotion };
  },
  useExit(ref: RefObject<HTMLElement | null>, opts: WebExitOptions): void {
    const { to, active, onComplete } = opts;
    useLayoutEffect(() => {
      // Only act while the boundary holds the element in its exiting phase.
      if (!active) return undefined;
      const el = ref.current;
      // No element, reduced motion, or no WAAPI engine (jsdom / old browsers):
      // settle immediately so the boundary unmounts without waiting.
      if (el === null || isReducedMotionSync() || typeof el.animate !== 'function') {
        onComplete();
        return undefined;
      }

      // Exit timing comes from the element's own resolved `transition` (which
      // an `exitStyle.transition` can override for an asymmetric exit) — the
      // same source the CSS path reads, so the off-thread exit matches the
      // declared timing. `[{}, to]`: animate from the live resting style TO the
      // exit overlay; `fill: 'forwards'` holds the exit state for the frame
      // before unmount so there's no flash back to rest.
      const cs = getComputedStyle(el);
      const durationMs = parseTimeMs(cs.transitionDuration) || DEFAULT_DURATION_MS;
      const timingFn = cs.transitionTimingFunction;
      const easing = timingFn !== '' && timingFn !== 'all' ? timingFn : 'ease';
      const anim = el.animate([{}, { ...to }], { duration: durationMs, easing, fill: 'forwards' });

      let cancelled = false;
      anim.finished
        .then(() => {
          if (!cancelled) onComplete();
        })
        // `anim.cancel()` rejects the `finished` promise — that's the
        // interrupted-exit path (cleanup ran), not an error. Swallow it.
        .catch(() => {});

      return () => {
        // Interruption (re-shown mid-exit) or unmount: cancel the off-thread
        // animation and suppress the settle so the boundary doesn't unmount a
        // re-opened element.
        cancelled = true;
        anim.cancel();
      };
      // Keyed on `active`: the exit plays once when the boundary flips to
      // exiting, and tears down if it flips back. `to` / `onComplete` are read
      // at effect-run time.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active]);
  },
};
