import { isTokenRef } from './token.js';
import type {
  ScaleName,
  Theme,
  TokenMap,
  TokenNode,
  TokenRef,
  TokenScale,
  TokenValue,
} from './types.js';

/**
 * Scales whose numeric values represent CSS lengths and should be emitted
 * with a `px` suffix in CSS-variable output. Non-length scales (font weight,
 * line height, opacity, z-index) keep their numbers bare.
 */
const LENGTH_SCALES: ReadonlySet<string> = new Set<ScaleName>([
  'space',
  'sizes',
  'radii',
  'fontSizes',
  'borderWidths',
  'letterSpacings',
]);

/**
 * CSS custom-property names allow letters, digits, hyphens, and underscores.
 * Token-key segments may contain dots (e.g. `0.5`, `2.5`) — those become
 * underscores in the output so the var name stays valid CSS.
 */
function encodeSegment(segment: string): string {
  return segment.replaceAll('.', '_');
}

/**
 * Build a CSS custom-property name from a scale name and the path inside it.
 *
 * @example
 *   tokenPathToCssVarName('colors', ['blue', '500']) → '--colors-blue-500'
 *   tokenPathToCssVarName('space', ['0.5'])          → '--space-0_5'
 */
export function tokenPathToCssVarName(scale: string, path: readonly string[]): string {
  return `--${[scale, ...path.map(encodeSegment)].join('-')}`;
}

/**
 * Convert a `$`-prefixed token reference into its `var(--...)` form.
 *
 * Bare references like `$primary` need a default scale to know which scale
 * the lookup belongs to. Explicit references like `$colors.blue.500`
 * already carry the scale and ignore `defaultScale`.
 *
 * Returns `undefined` if the reference cannot be encoded (no scale info).
 */
export function tokenRefToCssVar(ref: TokenRef, defaultScale?: string): string | undefined {
  const segments = ref.slice(1).split('.');
  const [head, ...rest] = segments;
  if (head === undefined) return undefined;

  // Detect "is the head a known scale name?" via the simplest heuristic:
  // explicit refs always begin with one of the canonical scale names. If the
  // head matches none, fall back to `defaultScale`.
  const knownScales = new Set<string>([
    'colors',
    'space',
    'sizes',
    'radii',
    'fontSizes',
    'fontWeights',
    'fontFamilies',
    'lineHeights',
    'letterSpacings',
    'shadows',
    'zIndices',
    'borderWidths',
    'opacities',
    'durations',
    'easings',
  ]);

  let scale: string;
  let path: string[];

  if (knownScales.has(head)) {
    scale = head;
    path = rest;
  } else if (defaultScale !== undefined) {
    scale = defaultScale;
    path = segments;
  } else {
    return undefined;
  }

  return `var(${tokenPathToCssVarName(scale, path)})`;
}

/**
 * Format the right-hand side of a CSS custom property declaration.
 *
 * - Token references emit `var(--...)`.
 * - Numbers in length scales emit `Npx`; non-length numbers emit bare numbers.
 * - Strings pass through unchanged.
 */
function formatValue(value: TokenNode, scale: string): string | undefined {
  if (isTokenRef(value)) return tokenRefToCssVar(value, scale);
  if (typeof value === 'number') {
    return LENGTH_SCALES.has(scale) ? `${value}px` : String(value);
  }
  if (typeof value === 'string') return value;
  return undefined; // an interior scale node, not a leaf — skip
}

/**
 * Walk a scale node and emit declarations for every leaf. Path is the
 * accumulated key segments leading to the current node.
 */
function walkScale(
  scale: string,
  node: TokenScale<TokenValue>,
  path: readonly string[],
  out: Map<string, string>,
): void {
  for (const key in node) {
    const next = node[key];
    if (next === undefined) continue;
    const nextPath = [...path, key];
    if (typeof next === 'object' && !isTokenRef(next as unknown as string)) {
      walkScale(scale, next as TokenScale<TokenValue>, nextPath, out);
    } else {
      const formatted = formatValue(next, scale);
      if (formatted !== undefined) {
        out.set(tokenPathToCssVarName(scale, nextPath), formatted);
      }
    }
  }
}

/**
 * Flatten a theme's token tree to a Map of CSS-variable name → value string.
 * Used to render a CSS block, but exposed independently in case the caller
 * wants to attach the vars some other way (e.g. inline style on a wrapper).
 */
export function themeToCssVars(theme: Theme): ReadonlyMap<string, string> {
  const out = new Map<string, string>();
  for (const scaleName in theme.tokens) {
    const scale = (theme.tokens as TokenMap)[scaleName];
    if (scale === undefined) continue;
    walkScale(scaleName, scale, [], out);
  }
  return out;
}

/**
 * Render a complete CSS block scoped to `[data-theme="<name>"]`. Drop this
 * directly into a `<style>` element to make the theme available via the
 * CSS-variable cascade.
 */
export function themeToCssBlock(theme: Theme): string {
  const vars = themeToCssVars(theme);
  const lines: string[] = [`[data-theme="${theme.name}"] {`];
  for (const [name, value] of vars) {
    lines.push(`  ${name}: ${value};`);
  }
  lines.push('}');
  return lines.join('\n');
}

/**
 * Render a CSS block for several themes, concatenated. Convenient for
 * shipping every theme variant in a single `<style>` element.
 */
export function themesToCssBlock(themes: readonly Theme[]): string {
  return themes.map((t) => themeToCssBlock(t)).join('\n\n');
}
