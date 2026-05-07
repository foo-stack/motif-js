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
  if (face.weight !== undefined) lines.push(`  font-weight: ${face.weight};`);
  if (face.style !== undefined) lines.push(`  font-style: ${face.style};`);
  if (face.display !== undefined) lines.push(`  font-display: ${face.display};`);
  if (face.stretch !== undefined) lines.push(`  font-stretch: ${face.stretch};`);
  if (face.unicodeRange !== undefined) lines.push(`  unicode-range: ${face.unicodeRange};`);
  if (face.fontVariationSettings !== undefined) {
    lines.push(`  font-variation-settings: ${face.fontVariationSettings};`);
  }
  if (face.fontFeatureSettings !== undefined) {
    lines.push(`  font-feature-settings: ${face.fontFeatureSettings};`);
  }
  lines.push('}');
  return lines.join('\n');
}

/**
 * Wrap a font-family in quotes when it contains characters that aren't
 * safe to leave bare (whitespace, punctuation). Single-word identifiers
 * pass through unchanged so `font-family: Inter` stays terse.
 */
function quoteFamily(family: string): string {
  return /^[A-Za-z_][\w-]*$/.test(family) ? family : `'${family.replaceAll("'", "\\'")}'`;
}

/**
 * Render `src:` for one face. String shorthand emits a single `url(...)`
 * with no `format()`; an array emits comma-separated entries with the
 * format/tech descriptors as supplied.
 */
function formatSrc(src: string | readonly FontSource[]): string {
  if (typeof src === 'string') return `url('${src}')`;
  return src.map((s) => formatSrcEntry(s)).join(',\n       ');
}

function formatSrcEntry(s: FontSource): string {
  let out = `url('${s.url}')`;
  if (s.format !== undefined) out += ` format('${s.format}')`;
  if (s.tech !== undefined) out += ` tech(${s.tech})`;
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
    bodyDecls.push(`  ${cssProp}: ${resolveRootValue(value)};`);
  }

  const selectionDecls: string[] = [];
  if (merged.selectionBackground !== undefined) {
    selectionDecls.push(`  background-color: ${resolveRootValue(merged.selectionBackground)};`);
  }
  if (merged.selectionColor !== undefined) {
    selectionDecls.push(`  color: ${resolveRootValue(merged.selectionColor)};`);
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
export function themesRuntimeCss(themes: readonly Theme[]): string {
  const parts = [
    fontFacesToCss(themes),
    rootResetsToCss(themes),
    reducedMotionGuardCss(themes),
  ].filter((p) => p.length > 0);
  return parts.join('\n\n');
}
