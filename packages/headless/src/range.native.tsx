import type { ReactElement } from 'react';
import { nativeStubWarn } from './_native-stub.js';

/**
 * Native range family — Slider / RangeSlider / Progress /
 * RatingInput. Real ports need RN's PanResponder for the drag
 * behaviour and `accessibilityRole="adjustable"` for screen-reader
 * value reporting. Until that lands, the native variants null-render
 * and warn once.
 */

export interface SliderProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
}
export function Slider(_props: SliderProps): ReactElement | null {
  nativeStubWarn('Slider');
  return null;
}

export interface RangeSliderProps {
  value?: [number, number];
  defaultValue?: [number, number];
  onValueChange?: (next: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}
export function RangeSlider(_props: RangeSliderProps): ReactElement | null {
  nativeStubWarn('RangeSlider');
  return null;
}

export interface ProgressProps {
  value: number | null;
  max?: number;
}
export function Progress(_props: ProgressProps): ReactElement | null {
  nativeStubWarn('Progress');
  return null;
}

export interface RatingInputProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (next: number) => void;
  count?: number;
  allowHalf?: boolean;
  disabled?: boolean;
  renderItem: (info: { index: number; filled: boolean; half: boolean }) => ReactElement;
}
export function RatingInput(_props: RatingInputProps): ReactElement | null {
  nativeStubWarn('RatingInput');
  return null;
}
