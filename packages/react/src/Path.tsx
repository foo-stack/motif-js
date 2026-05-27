'use client';

import { isMotionValue, type MotionValue } from '@usemotif/core';
import { useEffect, useState, type ReactElement, type SVGAttributes } from 'react';

/**
 * Props for {@link Path}. Extends the standard SVG `path` attributes
 * but redefines `pathLength` to accept a motion value in addition to a
 * literal number — that's the surface that drives the stroke-drawing
 * animation.
 */
export interface PathProps extends Omit<SVGAttributes<SVGPathElement>, 'pathLength'> {
  /**
   * Stroke-drawing progress, normalized to `0..1`. `0` hides the
   * stroke entirely, `1` draws it fully. Pass a literal number or a
   * {@link MotionValue} to animate.
   *
   * When set, motif emits `pathLength="1"` on the underlying `<path>`
   * (SVG's intrinsic-length normalization) along with
   * `stroke-dasharray="1 1"` and a `stroke-dashoffset` that walks
   * between hidden (`1`) and fully drawn (`0`). Other dash-related
   * attributes set explicitly on the element are preserved.
   *
   * Omit the prop to render a plain `<path>` with no dash mechanics —
   * the stroke renders as usual.
   */
  pathLength?: number | MotionValue<number>;
}

/**
 * SVG `<path>` with optional `pathLength` animation. Use as a
 * drop-in replacement for the lowercase `path` tag inside `<Svg>`
 * (or in the `Icon` render prop) when you need stroke-drawing.
 *
 * @example
 * ```tsx
 * import { Svg } from '@usemotif/react';
 * import { Path } from '@usemotif/react';
 *
 * function DrawingArrow() {
 *   const progress = useMotionValue(0);
 *   useEffect(() => { progress.set(1); }, []);
 *   return (
 *     <Svg viewBox="0 0 24 24">
 *       <Path d="M5 12h14M13 6l6 6-6 6" pathLength={progress} />
 *     </Svg>
 *   );
 * }
 * ```
 *
 * @remarks
 * Internally the animation uses SVG's intrinsic `pathLength="1"` and a
 * `stroke-dashoffset` that walks between `1` (hidden) and `0` (drawn).
 * Setting `pathLength` to a {@link MotionValue} subscribes to the value
 * and re-renders this leaf when it changes; for production motion
 * paths the leaf re-render is cheap, but consumers tracking real
 * 60fps animation should drive the stroke via CSS transitions or
 * Web Animations API on a stable target (the v1 wrapper doesn't fan
 * out to those — separate follow-up).
 *
 * Honour user reduced-motion preference at the consumer level —
 * branch on `useReducedMotion()` and pass `1` directly when reduced
 * motion is on.
 */
export function Path({ pathLength, ...rest }: PathProps): ReactElement {
  const [progress, setProgress] = useState<number>(() => readProgress(pathLength));

  useEffect(() => {
    if (pathLength === undefined) return undefined;
    if (typeof pathLength === 'number') {
      setProgress(pathLength);
      return undefined;
    }
    if (isMotionValue(pathLength)) {
      const initial = pathLength.get();
      if (typeof initial === 'number') setProgress(initial);
      return pathLength.on('change', (v) => {
        if (typeof v === 'number') setProgress(v);
      });
    }
    return undefined;
  }, [pathLength]);

  if (pathLength === undefined) return <path {...rest} />;
  // `strokeDasharray` / `strokeDashoffset` use the SVG attribute names
  // via React's camelCased prop API; they translate to the matching
  // CSS-style attributes on the rendered DOM node.
  return <path pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - progress} {...rest} />;
}

function readProgress(value: number | MotionValue<number> | undefined): number {
  if (value === undefined) return 1;
  if (typeof value === 'number') return value;
  if (isMotionValue(value)) {
    const v = value.get();
    return typeof v === 'number' ? v : 1;
  }
  return 1;
}
