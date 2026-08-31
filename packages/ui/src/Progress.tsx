'use client';

import { Progress as HeadlessProgress, useReducedMotion } from '@usemotif/headless';
import type { CSSProperties } from 'react';
import { keyframes } from 'usemotif';

export interface ProgressProps {
  /** 0..`max`, or `null` for an indeterminate (unknown-duration) bar. */
  readonly value: number | null;
  readonly max?: number;
  readonly 'aria-label'?: string;
}

const sweep = keyframes({
  '0%': { transform: 'translateX(-120%)' },
  '100%': { transform: 'translateX(420%)' },
});

// The headless Progress renders its own track + fill `<div>`s, themeable only
// through inline style - so the kit references motif's token CSS vars. The three
// fill variants are hoisted to stable references (lint: no-new-object), and the
// kit picks among them by determinate/indeterminate + reduced-motion.
const TRACK_STYLE: CSSProperties = {
  width: '100%',
  height: 8,
  borderRadius: 'var(--radii-full, 9999px)',
  background: 'var(--colors-surface-muted, #e5e7eb)',
};
const FILL_DETERMINATE: CSSProperties = {
  height: '100%',
  borderRadius: 'var(--radii-full, 9999px)',
  background: 'var(--colors-action-primary-bg, #2563eb)',
  transition: 'width 240ms ease',
};
const FILL_INDETERMINATE: CSSProperties = {
  height: '100%',
  borderRadius: 'var(--radii-full, 9999px)',
  background: 'var(--colors-action-primary-bg, #2563eb)',
  animation: `${sweep} 1.2s ease-in-out infinite`,
};
// Reduced-motion fallback: a static partial bar, no sweep.
const FILL_INDETERMINATE_STATIC: CSSProperties = {
  height: '100%',
  borderRadius: 'var(--radii-full, 9999px)',
  background: 'var(--colors-action-primary-bg, #2563eb)',
};

/**
 * Themed progress bar over the accessible headless `Progress` (`role="progressbar"`,
 * `aria-valuenow`). Pass a number for a determinate bar (it eases to the new
 * width) or `null` for an indeterminate sweep - which collapses to a static bar
 * under `prefers-reduced-motion`.
 *
 * ```tsx
 * <Progress value={70} aria-label="Uploading" />
 * <Progress value={null} aria-label="Loading" />
 * ```
 */
export function Progress({ value, max, 'aria-label': ariaLabel }: ProgressProps) {
  const reducedMotion = useReducedMotion();
  const fillStyle =
    value === null
      ? reducedMotion
        ? FILL_INDETERMINATE_STATIC
        : FILL_INDETERMINATE
      : FILL_DETERMINATE;
  return (
    <HeadlessProgress
      value={value}
      style={TRACK_STYLE}
      fillStyle={fillStyle}
      {...(max !== undefined ? { max } : {})}
      {...(ariaLabel !== undefined ? { 'aria-label': ariaLabel } : {})}
    />
  );
}
