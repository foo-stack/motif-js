import { TRANSFORM_AXIS_NAMES, type TransformAxis } from './style-props.js';

/**
 * Per-axis resolved values gathered by the style resolvers before
 * composition. Keys are axis names from {@link TRANSFORM_AXIS_NAMES};
 * values are resolved CSS values (literal `string | number` or a token
 * `var(--…)` reference).
 *
 * Numeric values for translate axes serialise as `Npx` on web (px is
 * implied for length axes); rotation / skew numerics serialise as
 * `Ndeg`. Scale numerics are unitless. Pre-stringified inputs pass
 * through unchanged.
 */
export type TransformAxes = Partial<Record<TransformAxis, string | number>>;

/** Axes that represent a degree-valued rotation or skew. */
const ANGLE_AXES: ReadonlySet<TransformAxis> = new Set<TransformAxis>([
  'rotate',
  'rotateX',
  'rotateY',
  'rotateZ',
  'skew',
  'skewX',
  'skewY',
]);

/** Axes that represent a length translation. */
const LENGTH_AXES: ReadonlySet<TransformAxis> = new Set<TransformAxis>(['x', 'y', 'z']);

/**
 * Map an axis name to its CSS `transform` function name. `x` becomes
 * `translateX`, `y` → `translateY`, `z` → `translateZ`; everything
 * else matches the axis name directly.
 */
function axisToCssFunction(axis: TransformAxis): string {
  if (axis === 'x') return 'translateX';
  if (axis === 'y') return 'translateY';
  if (axis === 'z') return 'translateZ';
  return axis;
}

/**
 * Serialise an axis value into its CSS-function argument. Numeric
 * inputs pick the right unit per axis category:
 *
 * - length axes (`x`/`y`/`z`) → `Npx`
 * - angle axes (`rotate*`/`skew*`) → `Ndeg`
 * - scale axes (`scale*`) → unitless `N`
 *
 * String inputs pass through unchanged so callers can specify
 * alternate units (`'0.5turn'`, `'4em'`, etc.) or `var(--…)`
 * references.
 */
function serialiseAxisValueWeb(axis: TransformAxis, value: string | number): string {
  if (typeof value === 'string') return value;
  if (LENGTH_AXES.has(axis)) return `${value}px`;
  if (ANGLE_AXES.has(axis)) return `${value}deg`;
  return String(value);
}

/**
 * Compose a transform-axes bag into a single CSS `transform` string.
 * Axes are emitted in canonical order (declared in
 * {@link TRANSFORM_AXIS_NAMES}); axes whose value is `undefined` are
 * skipped. Returns `undefined` if no axes are set.
 *
 * @example
 *   composeTransformAxesWeb({ x: 10, rotate: 45, scale: 0.9 });
 *   // → 'translateX(10px) rotate(45deg) scale(0.9)'
 */
export function composeTransformAxesWeb(axes: TransformAxes): string | undefined {
  const parts: string[] = [];
  for (const axis of TRANSFORM_AXIS_NAMES) {
    const value = axes[axis];
    if (value === undefined) continue;
    parts.push(`${axisToCssFunction(axis)}(${serialiseAxisValueWeb(axis, value)})`);
  }
  return parts.length === 0 ? undefined : parts.join(' ');
}

/**
 * One entry in React Native's `transform` array. RN expects a list of
 * single-key objects, where the key is the axis name and the value is
 * either a number (for `translateX/Y/Z`, `scaleX/Y`, `scale`) or a
 * unit-bearing string (for `rotate`, `rotateX/Y/Z`, `skewX/Y`).
 *
 * RN does **not** support a `skew` shorthand (only `skewX` / `skewY`),
 * so the composer emits both axes when `skew` is the sole input.
 */
export type NativeTransformEntry =
  | { translateX: number }
  | { translateY: number }
  | { translateZ: number }
  | { rotate: string }
  | { rotateX: string }
  | { rotateY: string }
  | { rotateZ: string }
  | { scale: number }
  | { scaleX: number }
  | { scaleY: number }
  | { skewX: string }
  | { skewY: string };

/**
 * Compose a transform-axes bag into RN's `transform` array form. Same
 * canonical order as the web composer; numeric translates and scales
 * stay numeric, rotations and skews stringify to `Ndeg` (RN doesn't
 * accept a number for those).
 *
 * Returns `undefined` if no axes are set.
 *
 * @remarks
 * The `skew` shorthand (no axis suffix) has no RN equivalent — it
 * expands to a pair of `skewX` + `skewY` entries with the same
 * angle. The web composer emits the CSS `skew(N)` shorthand instead.
 */
export function composeTransformAxesNative(
  axes: TransformAxes,
): readonly NativeTransformEntry[] | undefined {
  const entries: NativeTransformEntry[] = [];
  for (const axis of TRANSFORM_AXIS_NAMES) {
    const value = axes[axis];
    if (value === undefined) continue;

    if (axis === 'x') {
      entries.push({ translateX: numericOrZero(value) });
    } else if (axis === 'y') {
      entries.push({ translateY: numericOrZero(value) });
    } else if (axis === 'z') {
      entries.push({ translateZ: numericOrZero(value) });
    } else if (axis === 'scale') {
      entries.push({ scale: numericOrZero(value) });
    } else if (axis === 'scaleX') {
      entries.push({ scaleX: numericOrZero(value) });
    } else if (axis === 'scaleY') {
      entries.push({ scaleY: numericOrZero(value) });
    } else if (axis === 'rotate') {
      entries.push({ rotate: angleString(value) });
    } else if (axis === 'rotateX') {
      entries.push({ rotateX: angleString(value) });
    } else if (axis === 'rotateY') {
      entries.push({ rotateY: angleString(value) });
    } else if (axis === 'rotateZ') {
      entries.push({ rotateZ: angleString(value) });
    } else if (axis === 'skew') {
      // RN has no `skew` shorthand — expand to skewX + skewY.
      const s = angleString(value);
      entries.push({ skewX: s });
      entries.push({ skewY: s });
    } else if (axis === 'skewX') {
      entries.push({ skewX: angleString(value) });
    } else if (axis === 'skewY') {
      entries.push({ skewY: angleString(value) });
    }
  }
  return entries.length === 0 ? undefined : entries;
}

/** Coerce a string-or-number to a number for RN's numeric transform
 * slots. Pre-stringified inputs like `'10px'` get parsed via `parseFloat`;
 * an unparseable string falls through as `0`. */
function numericOrZero(value: string | number): number {
  if (typeof value === 'number') return value;
  const n = parseFloat(value);
  return Number.isNaN(n) ? 0 : n;
}

/** Coerce an angle axis to RN's `Ndeg` string form. */
function angleString(value: string | number): string {
  if (typeof value === 'string') return value;
  return `${value}deg`;
}
