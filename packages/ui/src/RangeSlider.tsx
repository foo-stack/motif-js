'use client';

import {
  RangeSlider as HeadlessRangeSlider,
  type RangeSliderProps as HeadlessRangeSliderProps,
} from '@usemotif/headless';
import { useMemo, type CSSProperties } from 'react';

export interface RangeSliderProps extends Omit<
  HeadlessRangeSliderProps,
  'style' | 'thumbStyle' | 'fillStyle'
> {
  /** Track length (number → px). Default 200. */
  readonly width?: number | string;
}

// The headless renders its own track / fill / thumb `<div>`s and positions them
// by percent; the kit paints them through inline token CSS vars (hex fallbacks).
const FILL_STYLE: CSSProperties = {
  top: 0,
  height: '100%',
  borderRadius: 'var(--radii-full, 9999px)',
  background: 'var(--colors-action-primary-bg, #2563eb)',
};
const THUMB_STYLE: CSSProperties = {
  top: '50%',
  width: 16,
  height: 16,
  transform: 'translate(-50%, -50%)',
  borderRadius: 'var(--radii-full, 9999px)',
  background: 'var(--colors-surface-default, #fff)',
  border: '2px solid var(--colors-action-primary-bg, #2563eb)',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
  cursor: 'pointer',
};

/**
 * Themed two-thumb range slider over the accessible headless `RangeSlider`
 * (per-thumb `aria-valuemin`/`max` that clamp against each other, arrow-key
 * navigation). The track, filled segment, and both thumbs are themed.
 *
 * ```tsx
 * <RangeSlider defaultValue={[20, 80]} min={0} max={100} aria-label="Price range" />
 * ```
 */
export function RangeSlider({ width = 200, ...rest }: RangeSliderProps) {
  const disabled = rest.disabled ?? false;
  const trackStyle = useMemo<CSSProperties>(
    () => ({
      width,
      height: 6,
      borderRadius: 'var(--radii-full, 9999px)',
      background: 'var(--colors-surface-muted, #e5e7eb)',
      opacity: disabled ? 0.5 : 1,
    }),
    [width, disabled],
  );
  return (
    <HeadlessRangeSlider
      {...rest}
      style={trackStyle}
      fillStyle={FILL_STYLE}
      thumbStyle={THUMB_STYLE}
    />
  );
}
