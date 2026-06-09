'use client';

import { useEffect, useRef, type RefObject } from 'react';

/**
 * Ref shape returned by {@link useAnimate}. Attach it to an element
 * (`<Box ref={scope}>`) and pass the same ref back to `animate(scope, …)`
 * to target that element. Selector targets resolve to elements WITHIN
 * the scope (`scope.current.querySelectorAll(selector)`).
 *
 * Standard `RefObject` shape so it composes with everything else
 * React expects.
 */
export type AnimationScope = RefObject<HTMLElement | null>;

/**
 * Animation target — either the {@link AnimationScope} ref itself
 * (animates the scoped root element) or a CSS selector string
 * resolved within the scope.
 */
export type AnimateTarget = AnimationScope | string;

/**
 * Options for one {@link AnimateFn} call. All durations are in
 * **seconds** (matches framer-motion's convention; CSS-friendly under
 * the hood). `easing` accepts any CSS timing function — keywords
 * (`'linear'`, `'ease-in-out'`) or `cubic-bezier(...)` strings.
 */
export interface AnimationOptions {
  /** Duration in seconds. Default `0.3`. */
  duration?: number;
  /** Delay before the animation starts, in seconds. Default `0`. */
  delay?: number;
  /** CSS easing function. Default `'ease-in-out'`. */
  easing?: string;
}

/**
 * Controls handle returned by {@link AnimateFn}. `finished` resolves
 * when the animation settles so consumers can `await` sequences;
 * `cancel` / `pause` / `play` map to the underlying Web Animations
 * primitives. The controls remain valid until the component unmounts;
 * the hook auto-cancels any in-flight animations at unmount.
 */
export interface AnimationControls {
  /** Resolves when the animation settles. Rejects if the animation is
   * cancelled — `await` consumers should `try/catch` around sequences
   * they want to be robust to unmount during. */
  finished: Promise<void>;
  /** Cancel the animation immediately; the element snaps back to its
   * pre-animation style. */
  cancel(): void;
  /** Pause the animation in place. */
  pause(): void;
  /** Resume a paused animation. */
  play(): void;
}

/**
 * Animate function returned by {@link useAnimate}. Accepts either a
 * scope ref (animates the scoped root) or a CSS selector string
 * (animates every element matching the selector inside the scope).
 *
 * `keyframes` is a single style bag — the runtime animates from the
 * element's current computed style to the provided values. The
 * keyframes shape matches CSS property camelCase (`borderRadius`,
 * not `border-radius`).
 *
 * When the target is a selector that matches multiple elements, all
 * elements animate in parallel and `controls.finished` resolves when
 * the LAST one settles.
 */
export interface AnimateFn {
  (
    target: AnimateTarget,
    keyframes: Record<string, string | number>,
    options?: AnimationOptions,
  ): AnimationControls;
}

/**
 * Hook returning `[scope, animate]` for imperative animations.
 *
 * `scope` is a ref you attach to a parent element; `animate` is a
 * function that drives an imperative animation against any element
 * inside that scope (either the scoped root itself or a selector
 * match).
 *
 * Web implementation uses the Web Animations API (`Element.animate`)
 * under the hood — animations run off the main thread where
 * supported, and the returned controls map 1:1 to the platform's
 * `Animation` interface.
 *
 * @example
 * ```tsx
 * const [scope, animate] = useAnimate();
 *
 * async function runIntro() {
 *   await animate(scope, { opacity: 1 }, { duration: 0.3 }).finished;
 *   await animate('.row', { x: 100 }, { duration: 0.4, delay: 0.1 }).finished;
 * }
 *
 * return (
 *   <Box ref={scope}>
 *     {rows.map(r => <Row key={r.id} className="row" {...r} />)}
 *     <Button onPress={runIntro}>Animate</Button>
 *   </Box>
 * );
 * ```
 *
 * @remarks
 * In-flight animations are cancelled when the component unmounts;
 * the underlying `Animation` objects are cleaned up via WAAPI's own
 * `cancel()`.
 *
 * Honour user reduced-motion at the call site — branch on
 * `useReducedMotion()` or `prefers-reduced-motion: reduce` and either
 * skip the animation or pass `duration: 0` / `delay: 0`.
 */
export function useAnimate(): [AnimationScope, AnimateFn] {
  const scope = useRef<HTMLElement | null>(null);
  // Track every Animation we've started so we can cancel them on
  // unmount. Settled animations evict themselves from the set via the
  // `finish` callback below.
  const animationsRef = useRef<Set<Animation>>(new Set());

  const animateFn = useRef<AnimateFn | null>(null);
  if (animateFn.current === null) {
    animateFn.current = (target, keyframes, options) => {
      const elements = resolveTargets(target, scope.current);
      if (elements.length === 0) {
        // No targets — return controls that resolve immediately. This
        // matches Web Animations' tolerant behaviour and lets sequences
        // continue without throwing on a mistyped selector.
        return {
          finished: Promise.resolve(),
          cancel: () => undefined,
          pause: () => undefined,
          play: () => undefined,
        };
      }

      const durationMs = (options?.duration ?? 0.3) * 1000;
      const delayMs = (options?.delay ?? 0) * 1000;
      const easing = options?.easing ?? 'ease-in-out';

      // WAAPI accepts a `PropertyIndexedKeyframes` shape (single object
      // with per-property values) — the browser treats the absence of
      // a starting frame as "current computed style". We pass our
      // bag through as-is.
      const animations: Animation[] = [];
      for (const el of elements) {
        const anim = el.animate(keyframes as PropertyIndexedKeyframes, {
          duration: durationMs,
          delay: delayMs,
          easing,
          fill: 'forwards',
        });
        animationsRef.current.add(anim);
        // Evict from the live set once settled so the unmount cleanup
        // only cancels actually-in-flight animations.
        const evict = (): void => {
          animationsRef.current.delete(anim);
        };
        anim.addEventListener('finish', evict);
        anim.addEventListener('cancel', evict);
        animations.push(anim);
      }

      // `finished` resolves when the last animation settles and *rejects* if
      // any animation is cancelled before completion — matching the documented
      // `AnimationControls.finished` contract and the semantics of
      // `Promise.all` over `Animation.finished`. Consumers that `try/catch` to
      // detect a cancelled sequence see the rejection.
      const finished = Promise.all(animations.map((a) => a.finished)).then(() => undefined);
      // Attach an internal no-op rejection handler so an *ignored* cancellation
      // (the common case — most callers never read `finished`) doesn't surface
      // as an unhandled promise rejection. This does not swallow the rejection
      // for real consumers: promise handlers are independent, so a separate
      // `await finished` / `finished.catch(...)` still receives it.
      finished.catch(() => undefined);

      return {
        finished,
        cancel: () => {
          for (const a of animations) a.cancel();
        },
        pause: () => {
          for (const a of animations) a.pause();
        },
        play: () => {
          for (const a of animations) a.play();
        },
      };
    };
  }

  useEffect(
    () => () => {
      // Cancel every in-flight animation when the component unmounts.
      // The evict listeners attached above clean up the set lazily;
      // here we just walk a copy in case `cancel()` mutates the set.
      const live = Array.from(animationsRef.current);
      for (const a of live) a.cancel();
      animationsRef.current.clear();
    },
    [],
  );

  return [scope, animateFn.current];
}

/**
 * Resolve an {@link AnimateTarget} to a concrete element list. Refs
 * pointing at a mounted element resolve to that single element;
 * selector strings resolve via `scope.querySelectorAll` against the
 * scope root. Missing scopes / unmounted refs return an empty list
 * (the caller no-ops gracefully).
 */
function resolveTargets(target: AnimateTarget, scopeEl: HTMLElement | null): HTMLElement[] {
  if (typeof target === 'string') {
    if (scopeEl === null) return [];
    return Array.from(scopeEl.querySelectorAll<HTMLElement>(target));
  }
  const el = target.current;
  return el === null ? [] : [el];
}
