import { escapeCssValue, wrapInLayer } from './css-emit.js';
import { tokenRefToCssVar } from './css-vars.js';
import { isTokenRef } from './token.js';
import type { FontFace, FontSource, StyleValue, Theme, ThemeRootStyles } from './types.js';

/**
 * Render a single `@font-face` declaration. Returns the rule body — no
 * surrounding whitespace beyond a trailing newline.
 */
function fontFaceToCss(face: FontFace): string {
  const lines: string[] = ['@font-face {'];
  lines.push(`  font-family: ${quoteFamily(face.family)};`);
  lines.push(`  src: ${formatSrc(face.src)};`);
  // Every descriptor below is interpolated into the same block, so the same
  // value-escaping that guards `themeToCssBlock` guards these too.
  if (face.weight !== undefined)
    lines.push(`  font-weight: ${escapeCssValue(String(face.weight))};`);
  if (face.style !== undefined) lines.push(`  font-style: ${escapeCssValue(face.style)};`);
  if (face.display !== undefined) lines.push(`  font-display: ${escapeCssValue(face.display)};`);
  if (face.stretch !== undefined) lines.push(`  font-stretch: ${escapeCssValue(face.stretch)};`);
  if (face.unicodeRange !== undefined) {
    lines.push(`  unicode-range: ${escapeCssValue(face.unicodeRange)};`);
  }
  if (face.fontVariationSettings !== undefined) {
    lines.push(`  font-variation-settings: ${escapeCssValue(face.fontVariationSettings)};`);
  }
  if (face.fontFeatureSettings !== undefined) {
    lines.push(`  font-feature-settings: ${escapeCssValue(face.fontFeatureSettings)};`);
  }
  lines.push('}');
  return lines.join('\n');
}

/**
 * Escape a string for safe interpolation inside a CSS single-quoted
 * string (`'…'`), as used for `font-family`, `url('…')`, and
 * `format('…')`. Without this a value containing `'` would close the
 * string and could inject further descriptors or declarations into the
 * `@font-face` block. Backslash is escaped first so it can't smuggle an
 * escape past us; newline / CR / FF can't appear literally in a CSS
 * string and become hex escapes.
 */
function escapeCssString(s: string): string {
  // eslint-disable-next-line no-control-regex
  return s.replace(/[\\'\n\r\f]/g, (ch) => {
    if (ch === '\\') return '\\\\';
    if (ch === "'") return "\\'";
    return `\\${ch.charCodeAt(0).toString(16)} `;
  });
}

/**
 * `tech()` takes unquoted keywords, so it can't be string-quoted like the
 * URL. Hex-escape anything outside the safe keyword charset (letters,
 * digits, hyphen, comma, space) so a `)` / `;` / `}` can't close the
 * function and break out of the block. CSS hex escapes stay valid in
 * keyword position, so legitimate values (`variations`, `color-COLRv1`)
 * are unchanged.
 */
function sanitizeTech(tech: string): string {
  // eslint-disable-next-line no-control-regex
  return tech.replace(/[^A-Za-z0-9,\- ]/g, (ch) => `\\${ch.charCodeAt(0).toString(16)} `);
}

/**
 * Wrap a font-family in quotes when it contains characters that aren't
 * safe to leave bare (whitespace, punctuation). Single-word identifiers
 * pass through unchanged so `font-family: Inter` stays terse.
 */
function quoteFamily(family: string): string {
  return /^[A-Za-z_][\w-]*$/.test(family) ? family : `'${escapeCssString(family)}'`;
}

/**
 * Render `src:` for one face. String shorthand emits a single `url(...)`
 * with no `format()`; an array emits comma-separated entries with the
 * format/tech descriptors as supplied.
 */
function formatSrc(src: string | readonly FontSource[]): string {
  if (typeof src === 'string') return `url('${escapeCssString(src)}')`;
  return src.map((s) => formatSrcEntry(s)).join(',\n       ');
}

function formatSrcEntry(s: FontSource): string {
  let out = `url('${escapeCssString(s.url)}')`;
  if (s.format !== undefined) out += ` format('${escapeCssString(s.format)}')`;
  if (s.tech !== undefined) out += ` tech(${sanitizeTech(s.tech)})`;
  return out;
}

/**
 * Stable identity for a font face. Used to dedupe identical `@font-face`
 * declarations across themes — light and dark almost always reference
 * the same font assets, so emitting the rule once is correct.
 */
function fontFaceKey(face: FontFace): string {
  const src =
    typeof face.src === 'string'
      ? face.src
      : face.src.map((s) => `${s.url}|${s.format ?? ''}|${s.tech ?? ''}`).join(';');
  return [
    face.family,
    face.weight ?? '',
    face.style ?? '',
    face.stretch ?? '',
    face.unicodeRange ?? '',
    src,
  ].join('::');
}

/**
 * Collect every `fonts` array across the supplied themes, dedupe by
 * identity, and emit one `@font-face` block per unique entry. Returns
 * an empty string when no theme registers fonts.
 */
export function fontFacesToCss(themes: readonly Theme[]): string {
  const seen = new Set<string>();
  const blocks: string[] = [];
  for (const theme of themes) {
    if (theme.fonts === undefined) continue;
    for (const face of theme.fonts) {
      const key = fontFaceKey(face);
      if (seen.has(key)) continue;
      seen.add(key);
      blocks.push(fontFaceToCss(face));
    }
  }
  return blocks.join('\n');
}

/**
 * Resolve a {@link StyleValue} to a CSS string. Token references become
 * `var(--scale-path)`; everything else passes through.
 */
function resolveRootValue(value: StyleValue): string {
  if (typeof value === 'number') return String(value);
  if (isTokenRef(value)) {
    const resolved = tokenRefToCssVar(value);
    return resolved ?? value;
  }
  return value;
}

const ROOT_PROP_MAP: Readonly<Record<keyof ThemeRootStyles, string>> = {
  background: 'background-color',
  color: 'color',
  fontFamily: 'font-family',
  fontSize: 'font-size',
  fontWeight: 'font-weight',
  lineHeight: 'line-height',
  letterSpacing: 'letter-spacing',
  fontFeatureSettings: 'font-feature-settings',
  fontVariationSettings: 'font-variation-settings',
  textRendering: 'text-rendering',
  WebkitFontSmoothing: '-webkit-font-smoothing',
  MozOsxFontSmoothing: '-moz-osx-font-smoothing',
  // Selection slots are emitted as a separate block, not on body.
  selectionBackground: '',
  selectionColor: '',
};

const BODY_KEYS: readonly (keyof ThemeRootStyles)[] = [
  'background',
  'color',
  'fontFamily',
  'fontSize',
  'fontWeight',
  'lineHeight',
  'letterSpacing',
  'fontFeatureSettings',
  'fontVariationSettings',
  'textRendering',
  'WebkitFontSmoothing',
  'MozOsxFontSmoothing',
];

/**
 * Per-property "first theme that defines this property wins" merge. The
 * result is one declaration per property using token references — the
 * cascade resolves them per active theme automatically.
 *
 * Themes that disagree on the *token reference* itself for a property
 * are rare; when it happens, the first theme's reference wins. Document
 * that by passing `light` first.
 */
function mergeRootStyles(themes: readonly Theme[]): ThemeRootStyles {
  const merged: { -readonly [K in keyof ThemeRootStyles]?: StyleValue } = {};
  for (const theme of themes) {
    if (theme.root === undefined) continue;
    for (const key in theme.root) {
      if (!Object.hasOwn(theme.root, key)) continue;
      const k = key as keyof ThemeRootStyles;
      if (merged[k] !== undefined) continue;
      const v = theme.root[k];
      if (v !== undefined) merged[k] = v;
    }
  }
  return merged;
}

/**
 * Emit `body { ... }` and `::selection { ... }` declarations from the
 * union of every theme's `root` config. Token references emit as
 * `var(--...)` so the cascade picks up the right value per active
 * theme.
 *
 * Returns an empty string when no theme defines `root`.
 */
export function rootResetsToCss(themes: readonly Theme[]): string {
  const merged = mergeRootStyles(themes);
  const bodyDecls: string[] = [];
  for (const key of BODY_KEYS) {
    const value = merged[key];
    if (value === undefined) continue;
    const cssProp = ROOT_PROP_MAP[key];
    // `root` values come from the same untrusted design-token source as the
    // token scales, and this block is injected via `dangerouslySetInnerHTML`,
    // so escape exactly like `themeToCssBlock` does for token values.
    bodyDecls.push(`  ${cssProp}: ${escapeCssValue(resolveRootValue(value))};`);
  }

  const selectionDecls: string[] = [];
  if (merged.selectionBackground !== undefined) {
    selectionDecls.push(
      `  background-color: ${escapeCssValue(resolveRootValue(merged.selectionBackground))};`,
    );
  }
  if (merged.selectionColor !== undefined) {
    selectionDecls.push(`  color: ${escapeCssValue(resolveRootValue(merged.selectionColor))};`);
  }

  const blocks: string[] = [];
  if (bodyDecls.length > 0) blocks.push(`body {\n${bodyDecls.join('\n')}\n}`);
  if (selectionDecls.length > 0) blocks.push(`::selection {\n${selectionDecls.join('\n')}\n}`);
  return blocks.join('\n');
}

/**
 * `prefers-reduced-motion: reduce` guard. Forces all animations and
 * transitions to ~0ms so users who opted out of motion don't see
 * incidental component animations the app didn't account for.
 *
 * Emitted when **any** theme sets `reducedMotion: 'guard'`. Returns an
 * empty string otherwise.
 */
export function reducedMotionGuardCss(themes: readonly Theme[]): string {
  const wantsGuard = themes.some((t) => t.reducedMotion === 'guard');
  if (!wantsGuard) return '';
  return [
    '@media (prefers-reduced-motion: reduce) {',
    '  *, *::before, *::after {',
    '    animation-duration: 0.01ms !important;',
    '    animation-iteration-count: 1 !important;',
    '    transition-duration: 0.01ms !important;',
    '    scroll-behavior: auto !important;',
    '  }',
    '}',
  ].join('\n');
}

/**
 * One-shot helper: concatenate `@font-face`, body/`::selection`, and the
 * reduced-motion guard for the supplied themes, separated by blank
 * lines. Skips empty sections so the output stays compact.
 */
export function themesRuntimeCss(themes: readonly Theme[], layer?: string): string {
  const parts = [
    fontFacesToCss(themes),
    rootResetsToCss(themes),
    reducedMotionGuardCss(themes),
  ].filter((p) => p.length > 0);
  // The reduced-motion guard only works if it stays in the same layer as the
  // rules it overrides, so the whole block is layered together rather than
  // exempting `@font-face` (legal inside a layer, just inert there).
  return wrapInLayer(parts.join('\n\n'), layer);
}
