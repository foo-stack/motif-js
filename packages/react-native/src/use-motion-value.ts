import {
  classifyOutputRange,
  createMotionValue,
  interpolateOutputs,
  type MotionValue,
  type OutputRangeKind,
} from '@usemotif/core';
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
 * Output ranges of numbers interpolate piecewise-linearly. Strings
 * are classified at hook setup:
 *
 *   - All entries are CSS colors (`#rgb`, `#rrggbb`, `#rrggbbaa`,
 *     `rgb(...)`, `rgba(...)`) → linear sRGB interpolation between
 *     segment endpoints. Alpha is interpolated too; output collapses
 *     to `rgb(...)` when both endpoints are fully opaque.
 *   - All entries share a CSS length unit (`'8px' / '16px'`,
 *     `'1rem' / '2rem'`, `'25% / '75%'`) → strip the unit, lerp
 *     numerically, re-append.
 *   - Otherwise → step function (returns the segment's starting
 *     value), same as the v1 fallback.
 *
 * Token-string outputs (`'$colors.red'`) are NOT resolved here —
 * `useTransform` doesn't read the theme. Use the function form
 * (`useTransform(source, (v) => …)`) to do theme-aware logic.
 *
 * The input range must be monotonically ascending; non-monotone
 * ranges have undefined behaviour.
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
  // re-subscription on every render. `outputKind` is memoised against
  // the outputRange identity so the colour / unit classifier only
  // walks the range once per outputRange instance (not per source
  // change).
  const argsRef = useRef<{
    rangeOrFn: ((value: string | number) => string | number) | readonly number[];
    outputRange: readonly (string | number)[] | undefined;
    outputKind: OutputRangeKind;
    lastOutputRangeIdentity: readonly (string | number)[] | undefined;
  }>({
    rangeOrFn,
    outputRange,
    outputKind: outputRange === undefined ? 'step' : classifyOutputRange(outputRange),
    lastOutputRangeIdentity: outputRange,
  });
  if (argsRef.current.lastOutputRangeIdentity !== outputRange) {
    argsRef.current.outputKind = outputRange === undefined ? 'step' : classifyOutputRange(outputRange);
    argsRef.current.lastOutputRangeIdentity = outputRange;
  }
  argsRef.current.rangeOrFn = rangeOrFn;
  argsRef.current.outputRange = outputRange;

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
      return interpolate(
        value as number,
        args.rangeOrFn,
        args.outputRange as readonly (string | number)[],
        args.outputKind,
      );
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
 * Piecewise-linear interpolation across an ascending input range,
 * dispatching per-segment via the `kind` classification computed once
 * at hook setup. Colour and unit-matched output ranges interpolate
 * real values; mixed / unrecognised string ranges step at the
 * segment boundary (same as the v1 behaviour).
 *
 * Edges clamp: input below `inputRange[0]` returns `outputRange[0]`;
 * input above `inputRange[last]` returns `outputRange[last]`.
 */
function interpolate(
  value: number,
  inputRange: readonly number[],
  outputRange: readonly (string | number)[],
  kind: OutputRangeKind,
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
      return interpolateOutputs(kind, outputRange[i - 1]!, outputRange[i]!, t);
    }
  }
  // Unreachable given the clamp above; satisfies the type checker.
  return outputRange[last]!;
}
