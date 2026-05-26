/**
 * Output-range classification and interpolation for `useTransform`.
 *
 * Numeric outputs interpolate piecewise-linearly per the existing
 * runtime; this module adds two non-numeric paths:
 *
 *   - **Color**: hex (`#rgb` / `#rrggbb` / `#rrggbbaa`) and CSS
 *     `rgb()` / `rgba()` strings. Interpolation is linear in sRGB
 *     space — OKLab / perceptual interpolation is a follow-up.
 *
 *   - **Unit-matched**: same-suffix length strings (`'8px'` ↔ `'16px'`,
 *     `'1rem'` ↔ `'2rem'`, `'25%'` ↔ `'75%'`). The unit suffix is
 *     stripped, the numeric part is lerped, and the suffix is
 *     re-appended.
 *
 * Mixed shapes (`'8px'` ↔ `'1rem'`, `'red'` ↔ `'#0000ff'` is fine but
 * `'red'` ↔ `'4px'` is not) fall back to step-function selection —
 * the v1 useTransform behaviour, unchanged.
 *
 * Theme-token strings (`'$colors.red'`) are NOT resolved here; the
 * resolver lives in `@usemotif/core` and `useTransform` doesn't read
 * the theme. Token-aware interpolation is a separate follow-up.
 */

/** Classification picked at hook setup; the interpolator dispatches
 * per segment via the same tag (every segment of the output range
 * shares the same classification — we don't mix paths within one
 * range). */
export type OutputRangeKind = 'numeric' | 'color' | 'unit-matched' | 'step';

/** Parsed-color tuple: r, g, b in 0–255; a in 0–1. */
interface ParsedColor {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a: number;
}

/**
 * Classify a `useTransform` output range. Empty / single-entry ranges
 * are trivially numeric or step; multi-entry ranges are classified by
 * the most permissive uniform path that fits every entry.
 *
 * - All entries numeric → `'numeric'`
 * - All entries parse as colors (hex, rgb, rgba) → `'color'`
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
 * `'step'` returns `outputLow` (consumer's segment start) — same as
 * the existing v1 behaviour.
 */
export function interpolateOutputs(
  kind: OutputRangeKind,
  outputLow: string | number,
  outputHigh: string | number,
  t: number,
): string | number {
  if (kind === 'numeric') {
    // Caller already ensures both are numeric in this path; the cast
    // is safe.
    return (outputLow as number) + ((outputHigh as number) - (outputLow as number)) * t;
  }
  if (kind === 'color') {
    return interpolateColors(outputLow as string, outputHigh as string, t);
  }
  if (kind === 'unit-matched') {
    return interpolateUnitMatched(outputLow as string, outputHigh as string, t);
  }
  return outputLow;
}

// ─── Color parsing + interpolation ──────────────────────────────────

/** `#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`. */
const HEX_PATTERN = /^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

/** `rgb(r,g,b)`, `rgba(r,g,b,a)`, with comma or whitespace separation,
 * channels as integers OR percentages, alpha as `0..1` or `0..100%`. */
const RGB_PATTERN =
  /^rgba?\(\s*([\d.]+%?)\s*[,\s]\s*([\d.]+%?)\s*[,\s]\s*([\d.]+%?)\s*(?:[,/]\s*([\d.]+%?)\s*)?\)$/;

function parseColor(value: string): ParsedColor | null {
  if (value.length === 0) return null;
  if (value[0] === '#') return parseHex(value);
  if (value.startsWith('rgb')) return parseRgb(value);
  return null;
}

function parseHex(value: string): ParsedColor | null {
  const m = HEX_PATTERN.exec(value);
  if (m === null) return null;
  const digits = m[1]!;
  // Expand 3/4-digit short form to 6/8.
  const expanded =
    digits.length === 3 || digits.length === 4
      ? digits
          .split('')
          .map((c) => c + c)
          .join('')
      : digits;
  const r = parseInt(expanded.slice(0, 2), 16);
  const g = parseInt(expanded.slice(2, 4), 16);
  const b = parseInt(expanded.slice(4, 6), 16);
  const a = expanded.length === 8 ? parseInt(expanded.slice(6, 8), 16) / 255 : 1;
  return { r, g, b, a };
}

function parseRgb(value: string): ParsedColor | null {
  const m = RGB_PATTERN.exec(value);
  if (m === null) return null;
  const r = parseChannel(m[1]!, 255);
  const g = parseChannel(m[2]!, 255);
  const b = parseChannel(m[3]!, 255);
  const a = m[4] === undefined ? 1 : parseChannel(m[4], 1);
  if ([r, g, b, a].some(Number.isNaN)) return null;
  return { r, g, b, a };
}

function parseChannel(raw: string, range: number): number {
  if (raw.endsWith('%')) {
    return (parseFloat(raw) / 100) * range;
  }
  return parseFloat(raw);
}

function interpolateColors(low: string, high: string, t: number): string {
  const lc = parseColor(low);
  const hc = parseColor(high);
  // Defence in depth — the classifier already filtered these, but if
  // a malformed value slipped through (custom transformer chains, e.g.)
  // fall back to the segment's starting value rather than throwing.
  if (lc === null || hc === null) return low;
  const r = Math.round(lerp(lc.r, hc.r, t));
  const g = Math.round(lerp(lc.g, hc.g, t));
  const b = Math.round(lerp(lc.b, hc.b, t));
  const a = lerp(lc.a, hc.a, t);
  // Drop alpha when both inputs were fully opaque so the output stays
  // a tidy `rgb(...)` rather than always promoting to `rgba(...)`.
  return a === 1
    ? `rgb(${r}, ${g}, ${b})`
    : `rgba(${r}, ${g}, ${b}, ${roundAlpha(a)})`;
}

/** Trim trailing zeros for alpha so `1` stays `1` and `0.5` stays `0.5`. */
function roundAlpha(a: number): string {
  return Number.isInteger(a) ? a.toString() : a.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// ─── Unit-matched interpolation ─────────────────────────────────────

/** Numeric + unit suffix. Supports negative and decimal values; the
 * unit is any CSS length unit (px, em, rem, %, vh, vw, …). */
const LENGTH_PATTERN = /^(-?\d+(?:\.\d+)?)([a-zA-Z%]+)$/;

function interpolateUnitMatched(low: string, high: string, t: number): string {
  const lm = LENGTH_PATTERN.exec(low);
  const hm = LENGTH_PATTERN.exec(high);
  // Same defence-in-depth as the colour path — should never fire when
  // the classifier did its job.
  if (lm === null || hm === null) return low;
  const lo = parseFloat(lm[1]!);
  const hi = parseFloat(hm[1]!);
  const unit = lm[2]!;
  return `${lerp(lo, hi, t)}${unit}`;
}
