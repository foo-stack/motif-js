/**
 * Color parsing + cross-space conversion for `useTransform`.
 *
 * The interpolator (in `output-interpolator.ts`) recognises every
 * format here and lerps in the requested {@link ColorSpace}. Output is
 * always emitted as `rgb()` / `rgba()` so every consumer renderer
 * accepts it without further work.
 */

/**
 * The interpolation space. `'srgb'` is the cheapest (direct lerp of
 * 8-bit channels) and matches v1's behaviour. `'oklab'` and `'oklch'`
 * are perceptually uniform — saturated hue rotations stay vivid
 * instead of muddying through grey at the midpoint. Hue in OKLCh
 * interpolates along the shortest arc.
 */
export type ColorSpace = 'srgb' | 'oklab' | 'oklch';

/** Parsed-color tuple in sRGB space. r/g/b are 0..255 floats; a is 0..1. */
export interface ParsedColor {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a: number;
}

// ─── Parsers ────────────────────────────────────────────────────────

/** `#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`. */
const HEX_PATTERN = /^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

// Separators are written as single character classes (`[\s,]+` between
// channels, `[\s,/]+` before the alpha) rather than `\s*[,\s]\s*`. The latter
// nests `\s` inside the class *and* on both sides, which lets a run of
// whitespace be partitioned many ways — polynomial backtracking (ReDoS) on
// adversarial input, and these values can come from untrusted design-token
// JSON. A single bounded quantifier over a class that shares no characters
// with the numeric tokens has no such ambiguity, while accepting the same
// comma-, space-, or slash-delimited forms (including CSS Color 4's
// `rgb(255 0 0 0.5)`).

/** `rgb(r,g,b)` / `rgba(r,g,b,a)` with comma or whitespace separators;
 * channels as integers OR percentages; alpha as `0..1` or `0..100%`. */
const RGB_PATTERN =
  /^rgba?\(\s*([\d.]+%?)[\s,]+([\d.]+%?)[\s,]+([\d.]+%?)(?:[\s,/]+([\d.]+%?))?\s*\)$/;

/** `hsl(h, s%, l%)` / `hsla(h, s%, l%, a)` — comma or whitespace separators,
 * including a fully space-delimited alpha (`hsl(0 100% 50% 0.5)`). */
const HSL_PATTERN =
  /^hsla?\(\s*([\d.]+)(deg|rad|turn)?[\s,]+([\d.]+)%[\s,]+([\d.]+)%(?:[\s,/]+([\d.]+%?))?\s*\)$/;

/** `oklab(L a b)` or `oklab(L a b / α)`. L is `0..1` (or `0..100%`); a/b unconstrained. */
const OKLAB_PATTERN =
  /^oklab\(\s*([\d.]+%?)\s+(-?[\d.]+%?)\s+(-?[\d.]+%?)(?:\s*\/\s*([\d.]+%?))?\s*\)$/;

/** `oklch(L C h)` or `oklch(L C h / α)`. L is `0..1` (or `0..100%`); C is `0..0.4`-ish; h is degrees. */
const OKLCH_PATTERN =
  /^oklch\(\s*([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+)(deg|rad|turn)?(?:\s*\/\s*([\d.]+%?))?\s*\)$/;

/** Try every recognised format; return the parsed sRGB tuple, or `null`. */
export function parseColor(value: string): ParsedColor | null {
  if (value.length === 0) return null;
  if (value[0] === '#') return parseHex(value);
  if (value.startsWith('rgb')) return parseRgb(value);
  if (value.startsWith('hsl')) return parseHsl(value);
  if (value.startsWith('oklab')) return parseOklab(value);
  if (value.startsWith('oklch')) return parseOklch(value);
  return parseNamed(value);
}

function parseHex(value: string): ParsedColor | null {
  const m = HEX_PATTERN.exec(value);
  if (m === null) return null;
  const digits = m[1]!;
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

function parseHsl(value: string): ParsedColor | null {
  const m = HSL_PATTERN.exec(value);
  if (m === null) return null;
  const h = normaliseHueDeg(parseFloat(m[1]!), m[2]);
  const s = parseFloat(m[3]!) / 100;
  const l = parseFloat(m[4]!) / 100;
  const a = m[5] === undefined ? 1 : parseChannel(m[5], 1);
  if ([h, s, l, a].some(Number.isNaN)) return null;
  const { r, g, b } = hslToRgb(h, s, l);
  return { r, g, b, a };
}

function parseOklab(value: string): ParsedColor | null {
  const m = OKLAB_PATTERN.exec(value);
  if (m === null) return null;
  const L = parsePercentOrUnit(m[1]!);
  const a = parsePercentOrSigned(m[2]!, 0.4);
  const bComp = parsePercentOrSigned(m[3]!, 0.4);
  const alpha = m[4] === undefined ? 1 : parseChannel(m[4], 1);
  if ([L, a, bComp, alpha].some(Number.isNaN)) return null;
  const { r, g, b } = oklabToSrgb({ L, a, b: bComp });
  return { r, g, b, a: alpha };
}

function parseOklch(value: string): ParsedColor | null {
  const m = OKLCH_PATTERN.exec(value);
  if (m === null) return null;
  const L = parsePercentOrUnit(m[1]!);
  const C = parsePercentOrSigned(m[2]!, 0.4);
  const h = normaliseHueDeg(parseFloat(m[3]!), m[4]);
  const alpha = m[5] === undefined ? 1 : parseChannel(m[5], 1);
  if ([L, C, h, alpha].some(Number.isNaN)) return null;
  const lab = oklchToOklab({ L, C, h });
  const { r, g, b } = oklabToSrgb(lab);
  return { r, g, b, a: alpha };
}

function parseNamed(value: string): ParsedColor | null {
  const hex = NAMED_COLORS[value.toLowerCase()];
  if (hex === undefined) return null;
  return parseHex(hex);
}

function parseChannel(raw: string, range: number): number {
  if (raw.endsWith('%')) return (parseFloat(raw) / 100) * range;
  return parseFloat(raw);
}

/** Parse a value that may be `0..1` unitless or `0..100%`. Returns 0..1. */
function parsePercentOrUnit(raw: string): number {
  if (raw.endsWith('%')) return parseFloat(raw) / 100;
  return parseFloat(raw);
}

/** Parse signed value; `%` interpreted as a percentage of `max`. */
function parsePercentOrSigned(raw: string, max: number): number {
  if (raw.endsWith('%')) return (parseFloat(raw) / 100) * max;
  return parseFloat(raw);
}

function normaliseHueDeg(value: number, unit: string | undefined): number {
  if (unit === 'rad') return ((value * 180) / Math.PI + 360) % 360;
  if (unit === 'turn') return (value * 360 + 360) % 360;
  return ((value % 360) + 360) % 360;
}

// ─── Named colors (CSS Level 1/2/3 — 148 names) ─────────────────────

const NAMED_COLORS: Record<string, string> = {
  aliceblue: '#f0f8ff',
  antiquewhite: '#faebd7',
  aqua: '#00ffff',
  aquamarine: '#7fffd4',
  azure: '#f0ffff',
  beige: '#f5f5dc',
  bisque: '#ffe4c4',
  black: '#000000',
  blanchedalmond: '#ffebcd',
  blue: '#0000ff',
  blueviolet: '#8a2be2',
  brown: '#a52a2a',
  burlywood: '#deb887',
  cadetblue: '#5f9ea0',
  chartreuse: '#7fff00',
  chocolate: '#d2691e',
  coral: '#ff7f50',
  cornflowerblue: '#6495ed',
  cornsilk: '#fff8dc',
  crimson: '#dc143c',
  cyan: '#00ffff',
  darkblue: '#00008b',
  darkcyan: '#008b8b',
  darkgoldenrod: '#b8860b',
  darkgray: '#a9a9a9',
  darkgreen: '#006400',
  darkgrey: '#a9a9a9',
  darkkhaki: '#bdb76b',
  darkmagenta: '#8b008b',
  darkolivegreen: '#556b2f',
  darkorange: '#ff8c00',
  darkorchid: '#9932cc',
  darkred: '#8b0000',
  darksalmon: '#e9967a',
  darkseagreen: '#8fbc8f',
  darkslateblue: '#483d8b',
  darkslategray: '#2f4f4f',
  darkslategrey: '#2f4f4f',
  darkturquoise: '#00ced1',
  darkviolet: '#9400d3',
  deeppink: '#ff1493',
  deepskyblue: '#00bfff',
  dimgray: '#696969',
  dimgrey: '#696969',
  dodgerblue: '#1e90ff',
  firebrick: '#b22222',
  floralwhite: '#fffaf0',
  forestgreen: '#228b22',
  fuchsia: '#ff00ff',
  gainsboro: '#dcdcdc',
  ghostwhite: '#f8f8ff',
  gold: '#ffd700',
  goldenrod: '#daa520',
  gray: '#808080',
  green: '#008000',
  greenyellow: '#adff2f',
  grey: '#808080',
  honeydew: '#f0fff0',
  hotpink: '#ff69b4',
  indianred: '#cd5c5c',
  indigo: '#4b0082',
  ivory: '#fffff0',
  khaki: '#f0e68c',
  lavender: '#e6e6fa',
  lavenderblush: '#fff0f5',
  lawngreen: '#7cfc00',
  lemonchiffon: '#fffacd',
  lightblue: '#add8e6',
  lightcoral: '#f08080',
  lightcyan: '#e0ffff',
  lightgoldenrodyellow: '#fafad2',
  lightgray: '#d3d3d3',
  lightgreen: '#90ee90',
  lightgrey: '#d3d3d3',
  lightpink: '#ffb6c1',
  lightsalmon: '#ffa07a',
  lightseagreen: '#20b2aa',
  lightskyblue: '#87cefa',
  lightslategray: '#778899',
  lightslategrey: '#778899',
  lightsteelblue: '#b0c4de',
  lightyellow: '#ffffe0',
  lime: '#00ff00',
  limegreen: '#32cd32',
  linen: '#faf0e6',
  magenta: '#ff00ff',
  maroon: '#800000',
  mediumaquamarine: '#66cdaa',
  mediumblue: '#0000cd',
  mediumorchid: '#ba55d3',
  mediumpurple: '#9370db',
  mediumseagreen: '#3cb371',
  mediumslateblue: '#7b68ee',
  mediumspringgreen: '#00fa9a',
  mediumturquoise: '#48d1cc',
  mediumvioletred: '#c71585',
  midnightblue: '#191970',
  mintcream: '#f5fffa',
  mistyrose: '#ffe4e1',
  moccasin: '#ffe4b4',
  navajowhite: '#ffdead',
  navy: '#000080',
  oldlace: '#fdf5e6',
  olive: '#808000',
  olivedrab: '#6b8e23',
  orange: '#ffa500',
  orangered: '#ff4500',
  orchid: '#da70d6',
  palegoldenrod: '#eee8aa',
  palegreen: '#98fb98',
  paleturquoise: '#afeeee',
  palevioletred: '#db7093',
  papayawhip: '#ffefd5',
  peachpuff: '#ffdab9',
  peru: '#cd853f',
  pink: '#ffc0cb',
  plum: '#dda0dd',
  powderblue: '#b0e0e6',
  purple: '#800080',
  rebeccapurple: '#663399',
  red: '#ff0000',
  rosybrown: '#bc8f8f',
  royalblue: '#4169e1',
  saddlebrown: '#8b4513',
  salmon: '#fa8072',
  sandybrown: '#f4a460',
  seagreen: '#2e8b57',
  seashell: '#fff5ee',
  sienna: '#a0522d',
  silver: '#c0c0c0',
  skyblue: '#87ceeb',
  slateblue: '#6a5acd',
  slategray: '#708090',
  slategrey: '#708090',
  snow: '#fffafa',
  springgreen: '#00ff7f',
  steelblue: '#4682b4',
  tan: '#d2b48c',
  teal: '#008080',
  thistle: '#d8bfd8',
  tomato: '#ff6347',
  transparent: '#00000000',
  turquoise: '#40e0d0',
  violet: '#ee82ee',
  wheat: '#f5deb3',
  white: '#ffffff',
  whitesmoke: '#f5f5f5',
  yellow: '#ffff00',
  yellowgreen: '#9acd32',
};

// ─── HSL ↔ sRGB ─────────────────────────────────────────────────────

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hPrime = h / 60;
  const x = c * (1 - Math.abs((hPrime % 2) - 1));
  let r1 = 0;
  let g1 = 0;
  let b1 = 0;
  if (hPrime < 1) {
    r1 = c;
    g1 = x;
  } else if (hPrime < 2) {
    r1 = x;
    g1 = c;
  } else if (hPrime < 3) {
    g1 = c;
    b1 = x;
  } else if (hPrime < 4) {
    g1 = x;
    b1 = c;
  } else if (hPrime < 5) {
    r1 = x;
    b1 = c;
  } else {
    r1 = c;
    b1 = x;
  }
  const m = l - c / 2;
  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

// ─── sRGB ↔ OKLab ───────────────────────────────────────────────────

/** Decode an sRGB 8-bit channel (0..255) to linear-light 0..1. */
function srgbToLinear(c: number): number {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

/** Encode linear-light 0..1 to sRGB 8-bit (rounded). */
function linearToSrgb(v: number): number {
  const c = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  return Math.round(Math.min(1, Math.max(0, c)) * 255);
}

interface OklabColor {
  readonly L: number;
  readonly a: number;
  readonly b: number;
}

interface OklchColor {
  readonly L: number;
  readonly C: number;
  /** Hue in degrees, `0..360`. */
  readonly h: number;
}

/**
 * Convert sRGB (8-bit r/g/b, alpha untouched) to OKLab. Conversion
 * matrices are from Björn Ottosson's OKLab spec
 * (https://bottosson.github.io/posts/oklab/).
 */
export function srgbToOklab(color: ParsedColor): OklabColor {
  const r = srgbToLinear(color.r);
  const g = srgbToLinear(color.g);
  const b = srgbToLinear(color.b);

  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const lp = Math.cbrt(l);
  const mp = Math.cbrt(m);
  const sp = Math.cbrt(s);

  return {
    L: 0.2104542553 * lp + 0.793617785 * mp - 0.0040720468 * sp,
    a: 1.9779984951 * lp - 2.428592205 * mp + 0.4505937099 * sp,
    b: 0.0259040371 * lp + 0.7827717662 * mp - 0.808675766 * sp,
  };
}

/** Inverse of {@link srgbToOklab}. */
export function oklabToSrgb(lab: OklabColor): { r: number; g: number; b: number } {
  const lp = lab.L + 0.3963377774 * lab.a + 0.2158037573 * lab.b;
  const mp = lab.L - 0.1055613458 * lab.a - 0.0638541728 * lab.b;
  const sp = lab.L - 0.0894841775 * lab.a - 1.291485548 * lab.b;

  const l = lp * lp * lp;
  const m = mp * mp * mp;
  const s = sp * sp * sp;

  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const b = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  return {
    r: linearToSrgb(r),
    g: linearToSrgb(g),
    b: linearToSrgb(b),
  };
}

/** OKLab → OKLCh: polar form of the (a, b) chroma plane. */
export function oklabToOklch(lab: OklabColor): OklchColor {
  const C = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
  let h = (Math.atan2(lab.b, lab.a) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { L: lab.L, C, h };
}

/** Inverse of {@link oklabToOklch}. */
export function oklchToOklab(lch: OklchColor): OklabColor {
  const rad = (lch.h * Math.PI) / 180;
  return {
    L: lch.L,
    a: lch.C * Math.cos(rad),
    b: lch.C * Math.sin(rad),
  };
}

// ─── Interpolation in each space ────────────────────────────────────

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Shortest-arc lerp on a circular `0..360` quantity. */
function lerpHue(a: number, b: number, t: number): number {
  const diff = ((b - a + 540) % 360) - 180;
  return (a + diff * t + 360) % 360;
}

/**
 * Interpolate two parsed sRGB colors in the requested {@link ColorSpace}
 * and return a CSS `rgb()` / `rgba()` output. Alpha is always
 * interpolated linearly; output collapses to `rgb(...)` when both
 * endpoints are fully opaque.
 */
export function interpolateInSpace(
  low: ParsedColor,
  high: ParsedColor,
  t: number,
  space: ColorSpace,
): string {
  const alpha = lerp(low.a, high.a, t);
  let r: number;
  let g: number;
  let b: number;

  if (space === 'srgb') {
    r = Math.round(lerp(low.r, high.r, t));
    g = Math.round(lerp(low.g, high.g, t));
    b = Math.round(lerp(low.b, high.b, t));
  } else if (space === 'oklab') {
    const labLo = srgbToOklab(low);
    const labHi = srgbToOklab(high);
    const out = oklabToSrgb({
      L: lerp(labLo.L, labHi.L, t),
      a: lerp(labLo.a, labHi.a, t),
      b: lerp(labLo.b, labHi.b, t),
    });
    r = out.r;
    g = out.g;
    b = out.b;
  } else {
    const lchLo = oklabToOklch(srgbToOklab(low));
    const lchHi = oklabToOklch(srgbToOklab(high));
    const out = oklabToSrgb(
      oklchToOklab({
        L: lerp(lchLo.L, lchHi.L, t),
        C: lerp(lchLo.C, lchHi.C, t),
        h: lerpHue(lchLo.h, lchHi.h, t),
      }),
    );
    r = out.r;
    g = out.g;
    b = out.b;
  }

  // Decide rgb vs rgba on the *rounded* alpha string, not the raw float:
  // an interpolated 0.9999 rounds to "1", so an exact `alpha === 1` check
  // would emit `rgba(…, 1)` — a fully-opaque color in rgba form — instead
  // of collapsing to `rgb(…)`.
  const a = roundAlpha(alpha);
  return a === '1' ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a})`;
}

function roundAlpha(a: number): string {
  return Number.isInteger(a) ? a.toString() : a.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
}
