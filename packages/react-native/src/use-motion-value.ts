import { createMotionValue, type MotionValue } from '@usemotif/core';
import { useEffect, useRef, useState } from 'react';

// Duplicate of `packages/react/src/use-motion-value.ts`. Both
// platform packages own their own copy of these hooks so each one
// ships a complete `useMotionValue` / `useTransform` surface without
// reaching into a sibling package. Bodies are React-only and have no
// DOM or RN-specific code, so they stay in sync via convention — if
// you change one, change the other.

/**
 * Create a motion value scoped to the calling component's lifetime.
 *
 * The returned reference is stable across renders. Subsequent renders
 * with a different `initial` argument do NOT reset the value — the
 * initial is only used on first mount (matches framer-motion's
 * `useMotionValue` semantics; consumers wanting to drive the value
 * externally call `.set()`).
 *
 * Updates via `.set()` notify subscribers synchronously and do NOT
 * trigger a React re-render. Consuming primitives (`Box`, styled
 * components) subscribe to the value and write to the DOM directly.
 */
export function useMotionValue(initial: number): MotionValue<number>;
export function useMotionValue(initial: string): MotionValue<string>;
export function useMotionValue<T extends string | number>(initial: T): MotionValue<T>;
export function useMotionValue<T extends string | number>(initial: T): MotionValue<T> {
  // `useState` with a lazy initialiser runs `createMotionValue` once
  // per mount; the setter is intentionally discarded — MVs are not
  // React state, they're an out-of-band value channel.
  const [mv] = useState(() => createMotionValue(initial));
  return mv as MotionValue<T>;
}

/**
 * Derive a motion value from a source motion value. Two forms:
 *
 * 1. **Range form:** `useTransform(source, inputRange, outputRange)`.
 *    `source` must be a `MotionValue<number>`. `inputRange` is a
 *    sorted-ascending list of numeric breakpoints; `outputRange` is
 *    the corresponding values at each breakpoint. Numeric outputs are
 *    piecewise-linear interpolated; string outputs use a step function
 *    (the output of the segment the input falls into). Inputs outside
 *    the range clamp to the nearest edge value.
 *
 * 2. **Function form:** `useTransform(source, transformer)`. Runs
 *    `transformer(source.get())` on every source change. The
 *    transformer should be pure; non-pure transformers may run more
 *    than expected as ranges / closures stabilise.
 *
 * The returned value is a derived `MotionValue` that subscribes to the
 * source on mount and unsubscribes on unmount. Re-rendering with
 * different range arrays / transformer fns picks up the new mapping
 * without re-subscribing.
 *
 * @remarks
 * v1 limitations:
 * - String outputs use step functions, not real interpolation.
 *   Color blending (`['$colors.red', '$colors.blue']` at progress
 *   0.5 → some purple) is not supported in v1.
 * - The input range must be monotonically ascending; non-monotone
 *   ranges have undefined behaviour.
 */
export function useTransform<O extends string | number>(
  source: MotionValue<number>,
  inputRange: readonly number[],
  outputRange: readonly O[],
): MotionValue<O>;
export function useTransform<S extends string | number, O extends string | number>(
  source: MotionValue<S>,
  transformer: (value: S) => O,
): MotionValue<O>;
export function useTransform(
  source: MotionValue<string | number>,
  rangeOrFn: ((value: string | number) => string | number) | readonly number[],
  outputRange?: readonly (string | number)[],
): MotionValue<string | number> {
  // Stash current arguments in a ref so the source subscriber closure
  // always reads the freshest ranges / transformer without forcing a
  // re-subscription on every render. The effect deps are `[source]`
  // only — stable for the lifetime of the source MV.
  const argsRef = useRef<{
    rangeOrFn: ((value: string | number) => string | number) | readonly number[];
    outputRange: readonly (string | number)[] | undefined;
  }>({ rangeOrFn, outputRange });
  argsRef.current = { rangeOrFn, outputRange };

  // A stable function that reads from `argsRef` on every call. Lives
  // for the component's lifetime; never reallocated.
  const transformRef = useRef<((value: string | number) => string | number) | undefined>(undefined);
  if (transformRef.current === undefined) {
    transformRef.current = (value: string | number) => {
      const args = argsRef.current;
      if (typeof args.rangeOrFn === 'function') return args.rangeOrFn(value);
      // The range form constrains `source` to `MotionValue<number>` at
      // the type level — at runtime we still receive `string | number`
      // because the impl signature widens for both overloads.
      return interpolate(value as number, args.rangeOrFn, args.outputRange as readonly (string | number)[]);
    };
  }
  const transform = transformRef.current;

  const [derived] = useState(() => createMotionValue(transform(source.get()) as never));

  useEffect(() => {
    // Re-seed in case the source value diverged between the lazy
    // `useState` initialiser running and this effect firing.
    derived.set(transform(source.get()) as never);
    return source.on('change', (v) => {
      derived.set(transform(v) as never);
    });
  }, [source, derived, transform]);

  return derived;
}

/**
 * Piecewise-linear interpolation (numeric output) or step selection
 * (string output) across an ascending input range.
 *
 * Edges clamp: input below `inputRange[0]` returns `outputRange[0]`;
 * input above `inputRange[last]` returns `outputRange[last]`.
 */
function interpolate(
  value: number,
  inputRange: readonly number[],
  outputRange: readonly (string | number)[],
): string | number {
  if (inputRange.length !== outputRange.length) {
    throw new Error(
      `[motif] useTransform: inputRange and outputRange must have the same length ` +
        `(got ${inputRange.length} and ${outputRange.length})`,
    );
  }
  const last = inputRange.length - 1;
  if (value <= inputRange[0]!) return outputRange[0]!;
  if (value >= inputRange[last]!) return outputRange[last]!;

  for (let i = 1; i <= last; i++) {
    const hi = inputRange[i]!;
    if (value <= hi) {
      const lo = inputRange[i - 1]!;
      const t = (value - lo) / (hi - lo);
      const outLo = outputRange[i - 1]!;
      const outHi = outputRange[i]!;
      if (typeof outLo === 'number' && typeof outHi === 'number') {
        return outLo + t * (outHi - outLo);
      }
      // Non-numeric output: step function — return the segment's
      // starting output until the input crosses into the next segment.
      // (Real interpolation for colour / unit strings is a follow-up.)
      return outLo;
    }
  }
  // Unreachable given the clamp above; satisfies the type checker.
  return outputRange[last]!;
}
