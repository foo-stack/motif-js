import { isMotionValue, type MotionValue } from '@usemotif/core';
import { createElement, useEffect, useState, type ElementType, type ReactElement } from 'react';
import { SVG_PRIMITIVES } from './Svg.js';

/**
 * Props for {@link Path}. Mirrors the web `PathProps` shape so glyphs
 * and consumer code work cross-platform.
 *
 * `d`, `stroke`, `fill`, `strokeWidth` and friends pass through to the
 * underlying `react-native-svg` `Path` component. When the peer dep
 * isn't installed, this component returns `null` (Box's icon shell
 * already renders a sized placeholder around it).
 */
export interface PathProps {
  /** SVG path data string. */
  d?: string;
  /** Stroke colour. Default inherited from the parent `<Svg>`. */
  stroke?: string;
  /** Fill colour. Default inherited from the parent `<Svg>`. */
  fill?: string;
  /** Stroke width in path-units. */
  strokeWidth?: number | string;
  /** Stroke linecap. */
  strokeLinecap?: 'butt' | 'round' | 'square';
  /** Stroke linejoin. */
  strokeLinejoin?: 'miter' | 'round' | 'bevel';
  /** Opacity, 0..1. */
  opacity?: number;
  /**
   * Stroke-drawing progress, normalized to `0..1`. Accepts a literal
   * number or a {@link MotionValue}. When set, motif emits
   * `pathLength="1"` plus `strokeDasharray="1 1"` and a
   * `strokeDashoffset` that walks between hidden (`1`) and fully
   * drawn (`0`). Omit to render a plain `<Path>` with no dash mechanics.
   */
  pathLength?: number | MotionValue<number>;
  /** Other react-native-svg `Path` attrs (escape hatch). */
  [key: string]: unknown;
}

/**
 * `react-native-svg` `<Path>` with optional `pathLength` stroke-
 * drawing animation. Drop-in replacement for the bare `Path` primitive
 * exposed by motif's `Icon` render prop when stroke-drawing is wanted.
 *
 * Returns `null` when `react-native-svg` isn't installed — the
 * containing `<Svg>` already rendered a sized `Box` placeholder, so
 * the icon stays the right size; the path just doesn't paint.
 *
 * @example
 * ```tsx
 * import { Svg, Path, useMotionValue } from '@usemotif/react-native';
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
 * Same `pathLength` mechanics as the web variant — SVG's intrinsic
 * `pathLength="1"` normalises the dasharray / dashoffset units to a
 * `0..1` range regardless of the real path geometry. The leaf
 * re-renders on every MV change in v1; UI-thread driver routing for
 * `pathLength` is a separate follow-up.
 */
export function Path({ pathLength, ...rest }: PathProps): ReactElement | null {
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

  const NativePath = SVG_PRIMITIVES?.Path as ElementType | undefined;
  if (NativePath === undefined) return null;

  if (pathLength === undefined) {
    return createElement(NativePath, rest);
  }
  return createElement(NativePath, {
    ...rest,
    pathLength: 1,
    strokeDasharray: '1 1',
    strokeDashoffset: 1 - progress,
  });
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
