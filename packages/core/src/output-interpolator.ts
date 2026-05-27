/**
 * Output-range classification and interpolation for `useTransform`.
 *
 * Numeric outputs interpolate piecewise-linearly per the existing
 * runtime; this module adds two non-numeric paths:
 *
 *   - **Color**: hex (`#rgb` / `#rrggbb` / `#rrggbbaa`), CSS
 *     `rgb()` / `rgba()`, `hsl()` / `hsla()`, `oklab()`, `oklch()`,
 *     and the CSS named colors. Interpolation runs in the configured
 *     {@link ColorSpace} — `'srgb'` by default (matches v1), with
 *     `'oklab'` and `'oklch'` available for perceptually-uniform
 *     hue rotations.
 *
 *   - **Unit-matched**: same-suffix length strings (`'8px'` ↔ `'16px'`,
 *     `'1rem'` ↔ `'2rem'`, `'25%'` ↔ `'75%'`). The unit suffix is
 *     stripped, the numeric part is lerped, and the suffix is
 *     re-appended.
 *
 * Mixed shapes fall back to step-function selection — same as v1.
 *
 * Theme-token strings (`'$colors.red'`) are pre-resolved by
 * `resolveOutputRangeTokens` (in `token.ts`) before they reach the
 * classifier; consumers of this module never see `$…` strings.
 */

import {
  interpolateInSpace,
  parseColor,
  type ColorSpace,
  type ParsedColor,
} from './color-spaces.js';

export type { ColorSpace };

/** Classification picked at hook setup; the interpolator dispatches
 * per segment via the same tag (every segment of the output range
 * shares the same classification — we don't mix paths within one
 * range). */
export type OutputRangeKind = 'numeric' | 'color' | 'unit-matched' | 'step';

/**
 * Classify a `useTransform` output range. Empty / single-entry ranges
 * are trivially numeric or step; multi-entry ranges are classified by
 * the most permissive uniform path that fits every entry.
 *
 * - All entries numeric → `'numeric'`
 * - All entries parse as colors (any recognised format) → `'color'`
 * - All entries match a length pattern with the SAME unit suffix
 *   → `'unit-matched'`
 * - Otherwise → `'step'`
 */
export function classifyOutputRange(outputRange: readonly (string | number)[]): OutputRangeKind {
  if (outputRange.length === 0) return 'step';

  let allNumeric = true;
  let allColor = true;
  let allUnitMatched = true;
  let sharedUnit: string | undefined;

  for (const value of outputRange) {
    if (typeof value !== 'number') allNumeric = false;
    if (typeof value !== 'string' || parseColor(value) === null) allColor = false;
    if (typeof value === 'string') {
      const m = LENGTH_PATTERN.exec(value);
      if (m === null) {
        allUnitMatched = false;
      } else {
        const unit = m[2]!;
        if (sharedUnit === undefined) {
          sharedUnit = unit;
        } else if (sharedUnit !== unit) {
          allUnitMatched = false;
        }
      }
    } else {
      allUnitMatched = false;
    }
  }

  if (allNumeric) return 'numeric';
  if (allColor) return 'color';
  if (allUnitMatched && sharedUnit !== undefined) return 'unit-matched';
  return 'step';
}

/**
 * Interpolate between `outputLow` and `outputHigh` at progress `t`
 * (0..1 within the surrounding segment). The `kind` is the
 * classification computed once at hook setup and reused across every
 * source-value change.
 *
 * Color interpolation runs in the requested {@link ColorSpace}. The
 * default `'srgb'` matches v1's behaviour; `'oklab'` / `'oklch'` give
 * perceptually-uniform interpolation that keeps saturated hue
 * rotations vivid.
 *
 * `'step'` returns `outputLow` (consumer's segment start) — same as
 * the existing v1 behaviour.
 */
export function interpolateOutputs(
  kind: OutputRangeKind,
  outputLow: string | number,
  outputHigh: string | number,
  t: number,
  colorSpace: ColorSpace = 'srgb',
): string | number {
  if (kind === 'numeric') {
    return (outputLow as number) + ((outputHigh as number) - (outputLow as number)) * t;
  }
  if (kind === 'color') {
    return interpolateColors(outputLow as string, outputHigh as string, t, colorSpace);
  }
  if (kind === 'unit-matched') {
    return interpolateUnitMatched(outputLow as string, outputHigh as string, t);
  }
  return outputLow;
}

function interpolateColors(
  low: string,
  high: string,
  t: number,
  colorSpace: ColorSpace,
): string {
  const lc: ParsedColor | null = parseColor(low);
  const hc: ParsedColor | null = parseColor(high);
  // Defence in depth — the classifier already filtered these, but if
  // a malformed value slipped through (custom transformer chains, e.g.)
  // fall back to the segment's starting value rather than throwing.
  if (lc === null || hc === null) return low;
  return interpolateInSpace(lc, hc, t, colorSpace);
}

// ─── Unit-matched interpolation ─────────────────────────────────────

/** Numeric + unit suffix. Supports negative and decimal values; the
 * unit is any CSS length unit (px, em, rem, %, vh, vw, …). */
const LENGTH_PATTERN = /^(-?\d+(?:\.\d+)?)([a-zA-Z%]+)$/;

function interpolateUnitMatched(low: string, high: string, t: number): string {
  const lm = LENGTH_PATTERN.exec(low);
  const hm = LENGTH_PATTERN.exec(high);
  if (lm === null || hm === null) return low;
  const lo = parseFloat(lm[1]!);
  const hi = parseFloat(hm[1]!);
  const unit = lm[2]!;
  return `${lo + (hi - lo) * t}${unit}`;
}
