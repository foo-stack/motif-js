'use client';

import { Box, keyframes, type BoxProps } from 'usemotif';

const pulse = keyframes({
  '0%, 100%': { opacity: 1 },
  '50%': { opacity: 0.4 },
});

// Hoisted so the prop is a stable reference (lint: no-new-object). Box's
// `animation` runs through motif's reduced-motion guard, so the pulse collapses
// automatically under `prefers-reduced-motion` (same as Spinner).
const PULSE_ANIMATION = {
  name: pulse,
  duration: '1.5s',
  easing: 'ease-in-out',
  iterationCount: 'infinite',
} as const;

export interface SkeletonProps extends Omit<BoxProps, 'children' | 'width' | 'height'> {
  /** Width (number → px). Default `100%`. */
  readonly width?: number | string;
  /** Height (number → px). Default 16. Ignored when `circle` (height = width). */
  readonly height?: number | string;
  /** Render a circle (height tracks width, fully rounded) - e.g. an avatar placeholder. */
  readonly circle?: boolean;
}

/**
 * A themed loading placeholder - a muted block that gently pulses. Decorative
 * (`aria-hidden`); the pulse honors `prefers-reduced-motion` automatically.
 *
 * ```tsx
 * <Skeleton width={240} height={20} />
 * <Skeleton circle width={40} />
 * ```
 */
export function Skeleton({ width = '100%', height = 16, circle = false, ...rest }: SkeletonProps) {
  return (
    <Box
      aria-hidden
      width={width}
      height={circle ? width : height}
      bg="$colors.surface.muted"
      borderRadius={circle ? '$radii.full' : '$radii.md'}
      animation={PULSE_ANIMATION}
      {...rest}
    />
  );
}
