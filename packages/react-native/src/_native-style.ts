import { Dimensions, type ViewStyle } from 'react-native';

/**
 * Translate a web-shaped resolved style into one React Native understands.
 *
 * `resolveStyles` is platform-agnostic: it emits CSS-shaped values (a
 * `box-shadow` string, a `transform` string, `cursor`, `overflowX`, …) that
 * the web renderer consumes directly but that RN either ignores or chokes on.
 * Feeding that output straight into `StyleSheet.create` means
 * `<Box shadow="$md" />` renders no iOS shadow and no Android elevation, a
 * literal `transform="rotate(45deg)"` is dropped (RN wants an array of
 * single-key objects), and web-only keys leak through as dev warnings.
 *
 * This pass runs once on the resolved base style before any native render
 * path, so every downstream consumer (plain View, enter/exit, motion values)
 * gets a sanitized style.
 */

/**
 * Keys that are meaningful on the web but have no RN equivalent. RN warns on
 * (or ignores) them, so they're dropped rather than passed through.
 */
const WEB_ONLY_KEYS: ReadonlySet<string> = new Set([
  'cursor',
  'overflowX',
  'overflowY',
  'objectFit',
  'outline',
  'outlineStyle',
  'outlineWidth',
  'outlineColor',
  'outlineOffset',
  'maskImage',
  'clipPath',
  'userSelect',
  'whiteSpace',
  'wordBreak',
  'overflowWrap',
  'hyphens',
  'textOverflow',
  'boxSizing',
  'appearance',
]);

/**
 * Per-side `border-*-style` props. RN only understands a single
 * `borderStyle`, so these collapse onto it (first side wins) and the
 * per-side key is dropped — otherwise RN warns on e.g.
 * `borderLeftStyle`, which the package's own `Blockquote` emits.
 */
const BORDER_SIDE_STYLE_KEYS: ReadonlySet<string> = new Set([
  'borderTopStyle',
  'borderRightStyle',
  'borderBottomStyle',
  'borderLeftStyle',
]);

/**
 * Web `font-family` generics with no concrete RN/iOS face. A stack led
 * by one of these is the platform's default UI font expressed for the
 * web; RN has no multi-family fallback, so we either map it to RN's
 * `'monospace'` generic or drop it (system default) rather than passing
 * a name iOS logs as "Unrecognized font family".
 */
const WEB_GENERIC_FONTS: ReadonlySet<string> = new Set([
  'system-ui',
  '-apple-system',
  'blinkmacsystemfont',
  'ui-sans-serif',
  'ui-serif',
  'ui-monospace',
  'ui-rounded',
  'sans-serif',
  'serif',
  'cursive',
  'fantasy',
]);

/** Matches a single `<number>vw` / `<number>vh` viewport-unit length. */
// The numeric part is written `\d+(?:\.\d+)?|\.\d+` rather than the tempting
// `\d*\.?\d+`. The latter lets a run of digits be split between `\d*` and `\d+`
// O(n) ways for each end position the failing `(vw|vh)$` suffix forces the
// engine to retry — polynomial backtracking (ReDoS) on adversarial input, and
// style values can come from untrusted design-token JSON. These two
// alternatives are mutually exclusive (one starts with a digit, the other a
// dot) and contain no adjacent same-class quantifiers, so matching is linear
// while accepting the identical set (`1`, `1.5`, `.5`, with an optional sign).
const VIEWPORT_UNIT_RE = /^(-?(?:\d+(?:\.\d+)?|\.\d+))(vw|vh)$/;

export function sanitizeNativeStyle(style: Record<string, unknown>): Record<string, unknown> {
  let out: Record<string, unknown> | null = null;
  // Lazily clone: most styles need no translation, so the common path returns
  // the input untouched without allocating.
  const patch = (mutate: (target: Record<string, unknown>) => void): void => {
    out ??= { ...style };
    mutate(out);
  };

  for (const key in style) {
    const value = style[key];
    if (key === 'boxShadow') {
      patch((target) => {
        delete target.boxShadow;
        if (typeof value === 'string') {
          const shadow = parseBoxShadow(value);
          if (shadow !== null) Object.assign(target, shadow);
        }
      });
    } else if (key === 'transform' && typeof value === 'string') {
      patch((target) => {
        const arr = parseTransformString(value);
        if (arr === null) delete target.transform;
        else target.transform = arr;
      });
    } else if (key === 'textDecoration') {
      // RN spells it `textDecorationLine`; the CSS shorthand no-ops + warns.
      patch((target) => {
        delete target.textDecoration;
        if (target.textDecorationLine === undefined && typeof value === 'string') {
          target.textDecorationLine = value;
        }
      });
    } else if (BORDER_SIDE_STYLE_KEYS.has(key)) {
      patch((target) => {
        delete target[key];
        if (target.borderStyle === undefined) target.borderStyle = value;
      });
    } else if (
      key === 'fontFamily' &&
      typeof value === 'string' &&
      needsFontFamilyTranslation(value)
    ) {
      patch((target) => {
        const family = translateFontFamily(value);
        if (family === null) delete target.fontFamily;
        else target.fontFamily = family;
      });
    } else if (typeof value === 'string' && VIEWPORT_UNIT_RE.test(value)) {
      // `vw`/`vh` aren't parseable by RN — resolve against the window.
      patch((target) => {
        target[key] = convertViewportUnit(value);
      });
    } else if (key.startsWith('background') && key !== 'backgroundColor') {
      // `backgroundImage`/`backgroundClip`/… have no RN analogue;
      // `backgroundColor` is the one member RN understands.
      patch((target) => {
        delete target[key];
      });
    } else if (key.startsWith('grid')) {
      // RN has no grid layout; drop the whole `grid*` family.
      patch((target) => {
        delete target[key];
      });
    } else if (WEB_ONLY_KEYS.has(key)) {
      patch((target) => {
        delete target[key];
      });
    }
  }

  return out ?? style;
}

interface NativeShadow {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowRadius: number;
  shadowOpacity: number;
  elevation: number;
}

/**
 * Parse a CSS `box-shadow` value (`offsetX offsetY blur [spread] color`) into
 * RN's discrete shadow props. Multi-layer shadows (comma-separated) collapse
 * to the first layer — RN renders a single shadow. `none` and unparseable
 * input yield `null` (caller just drops the shadow). Spread is ignored (no RN
 * analogue); `elevation` is approximated from the blur radius for Android.
 */
export function parseBoxShadow(value: string): NativeShadow | null {
  const trimmed = value.trim();
  if (trimmed === '' || trimmed === 'none') return null;

  // First layer only. The motif shadow tokens use CSS Color 4 space syntax
  // (`rgb(0 0 0 / 0.1)`) with no commas inside the color, so a top-level comma
  // split cleanly separates layers.
  const layer = (trimmed.split(',')[0] ?? '').trim();
  if (layer === '') return null;

  // Peel the trailing color token off the end.
  const colorMatch = layer.match(/(rgba?\([^)]*\)|#[0-9a-fA-F]{3,8}|[a-zA-Z]+)\s*$/);
  if (colorMatch === null) return null;
  const colorStr = colorMatch[1]!;
  const lengths = layer.slice(0, colorMatch.index).trim().split(/\s+/).filter(Boolean);
  if (lengths.length < 2) return null;

  const offsetX = toPx(lengths[0]!);
  const offsetY = toPx(lengths[1]!);
  const blur = lengths.length >= 3 ? toPx(lengths[2]!) : 0;
  if (offsetX === null || offsetY === null || blur === null) return null;

  const { color, opacity } = splitColorAlpha(colorStr);

  return {
    shadowColor: color,
    shadowOffset: { width: offsetX, height: offsetY },
    shadowRadius: blur,
    shadowOpacity: opacity,
    // RN has no exact box-shadow→elevation mapping; the blur radius is the
    // closest perceptual analogue for Android's material elevation.
    elevation: Math.max(0, Math.round(blur)),
  };
}

function toPx(token: string): number | null {
  const n = Number.parseFloat(token);
  return Number.isNaN(n) ? null : n;
}

/**
 * Split a color into an opaque color string + an alpha for `shadowOpacity`.
 * RN multiplies `shadowColor` by `shadowOpacity`, so the alpha is lifted out
 * and the color emitted opaque. A CSS Color 4 `rgb(r g b / a)` is normalised
 * to RN-friendly comma form. Non-rgb colors keep `opacity: 1`.
 */
function splitColorAlpha(colorStr: string): { color: string; opacity: number } {
  const rgb = colorStr.match(/^rgba?\(([^)]*)\)$/);
  if (rgb === null) return { color: colorStr, opacity: 1 };
  // Channels may be comma- or space-separated; alpha after a comma or slash.
  const parts = rgb[1]!.split(/[,/]/).map((s) => s.trim());
  const channels = (parts[0] ?? '').includes(' ')
    ? (parts[0] ?? '').split(/\s+/).filter(Boolean)
    : parts.slice(0, 3);
  const alphaToken = (parts[0] ?? '').includes(' ') ? parts[1] : parts[3];
  const [r, g, b] = channels;
  if (r === undefined || g === undefined || b === undefined) return { color: colorStr, opacity: 1 };
  const alpha = alphaToken !== undefined ? Number.parseFloat(alphaToken) : 1;
  return {
    color: `rgb(${r}, ${g}, ${b})`,
    opacity: Number.isNaN(alpha) ? 1 : alpha,
  };
}

type TransformEntry = Record<string, string | number>;

/**
 * Parse a CSS `transform` string (`rotate(45deg) translateX(10px) scale(1.2)`)
 * into RN's array-of-single-key-objects form. Length functions become numbers
 * (DIP); angle/skew functions keep their unit string. Returns `null` if
 * nothing parses (caller drops the prop).
 */
export function parseTransformString(value: string): TransformEntry[] | null {
  const out: TransformEntry[] = [];
  const fnRe = /([a-zA-Z]+)\(([^)]*)\)/g;
  let match: RegExpExecArray | null;
  while ((match = fnRe.exec(value)) !== null) {
    const fn = match[1]!;
    const rawArg = (match[2] ?? '').trim();
    if (fn === 'translate' || fn === 'scale') {
      const parts = rawArg
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (parts.length >= 2) {
        // Two-arg shorthand expands to its X/Y axes (RN has no `translate`/
        // two-arg `scale`).
        out.push({ [`${fn}X`]: axisValue(fn, parts[0]!) });
        out.push({ [`${fn}Y`]: axisValue(fn, parts[1]!) });
      } else if (parts.length === 1) {
        // One arg: uniform `scale` is native; single-axis `translate(x)` maps
        // to translateX (CSS leaves Y at 0).
        if (fn === 'scale') out.push({ scale: axisValue(fn, parts[0]!) });
        else out.push({ translateX: axisValue(fn, parts[0]!) });
      }
      continue;
    }
    out.push({ [fn]: axisValue(fn, rawArg) });
  }
  return out.length > 0 ? out : null;
}

function axisValue(fn: string, arg: string): string | number {
  // Angles and skews stay strings (RN wants `'45deg'`); everything else is a
  // unitless/length number.
  if (fn.startsWith('rotate') || fn.startsWith('skew')) return arg;
  // RN accepts percentage strings for translateX/translateY — preserve them
  // so the absolute-centering idiom (`translate(-50%, -50%)`) keeps meaning a
  // percentage of the element, not a DIP. Matches `transform-composer`.
  if (arg.endsWith('%')) return arg;
  const n = Number.parseFloat(arg);
  return Number.isNaN(n) ? arg : n;
}

/**
 * Decide whether a `font-family` value needs RN translation: a
 * multi-font CSS stack (has a comma) or a lone web-generic keyword.
 * A single concrete family name (`'Inter'`) passes through untouched.
 */
function needsFontFamilyTranslation(value: string): boolean {
  if (value.includes(',')) return true;
  return WEB_GENERIC_FONTS.has(stripFontToken(value));
}

function stripFontToken(token: string): string {
  return token
    .trim()
    .replace(/^["']|["']$/g, '')
    .toLowerCase();
}

/**
 * Translate a web `font-family` stack to a single RN-resolvable family,
 * or `null` to drop the prop (fall back to the system default). A stack
 * led by a web generic (`system-ui`, …) is the default UI font — map
 * monospace variants to RN's `'monospace'` and let the rest fall back.
 * A stack the author led with a concrete family keeps that family.
 */
function translateFontFamily(value: string): string | null {
  const families = value
    .split(',')
    .map((f) => f.trim().replace(/^["']|["']$/g, ''))
    .filter(Boolean);
  const first = (families[0] ?? '').toLowerCase();
  if (first === '' || WEB_GENERIC_FONTS.has(first)) {
    return /mono/i.test(value) ? 'monospace' : null;
  }
  return families[0] ?? null;
}

/** Resolve a `vw`/`vh` length against the current window dimensions. */
function convertViewportUnit(value: string): number | string {
  const match = VIEWPORT_UNIT_RE.exec(value);
  if (match === null) return value;
  const n = Number.parseFloat(match[1]!);
  if (Number.isNaN(n)) return value;
  const win = Dimensions.get('window');
  const basis = match[2] === 'vw' ? win.width : win.height;
  return (n / 100) * basis;
}

export type { NativeShadow };
export { WEB_ONLY_KEYS };
export type NativeViewStyle = ViewStyle;
