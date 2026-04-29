import { isTokenRef, resolveToken } from './token.js';
import type {
  AnimationToken,
  ScaleName,
  SpringAnimationToken,
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
    if (scaleName === 'animations') {
      // Animations are object leaves — emit a small fixed set of vars
      // per entry (duration + easing) so consumers can reference them
      // via the cascade. Token refs inside the animation entry are
      // resolved against this same theme.
      writeAnimationVars(scale as Record<string, AnimationToken>, theme, out);
      continue;
    }
    walkScale(scaleName, scale as TokenScale, [], out);
  }
  return out;
}

/**
 * Emit `--motif-anim-<name>-duration` / `--motif-anim-<name>-easing`
 * for each registered animation entry. Spring configs go through the
 * web spring → bezier approximation so the variable always carries a
 * usable CSS value. Used internally by `themeToCssVars`.
 */
function writeAnimationVars(
  animations: Record<string, AnimationToken>,
  theme: Theme,
  out: Map<string, string>,
): void {
  for (const [name, entry] of Object.entries(animations)) {
    const { duration, easing } = animationEntryToTiming(entry, theme);
    out.set(`--motif-anim-${name}-duration`, duration);
    out.set(`--motif-anim-${name}-easing`, easing);
  }
}

/**
 * Resolve one animation entry to its `{ duration, easing }` pair. Token
 * refs (`$durations.3`, `$easings.standard`) resolve against `theme`.
 * Springs go through {@link springToCssTiming}.
 */
export function animationEntryToTiming(
  entry: AnimationToken,
  theme: Theme | undefined,
): { duration: string; easing: string } {
  if (entry.type === 'spring') {
    const fitted = springToCssTimingForCss(entry);
    return {
      duration: resolveTimingPart(fitted.duration, theme, 'durations') ?? fitted.duration,
      easing: resolveTimingPart(fitted.easing, theme, 'easings') ?? fitted.easing,
    };
  }
  const duration = resolveTimingPart(entry.duration, theme, 'durations') ?? '200ms';
  const easing = resolveTimingPart(entry.easing, theme, 'easings') ?? 'ease';
  return { duration, easing };
}

function resolveTimingPart(
  value: string | undefined,
  theme: Theme | undefined,
  scale: 'durations' | 'easings',
): string | undefined {
  if (value === undefined) return undefined;
  if (!isTokenRef(value)) return value;
  if (theme === undefined) return undefined;
  const resolved = resolveToken(value, theme, { defaultScale: scale });
  return typeof resolved === 'string' ? resolved : undefined;
}

/** Local copy of springToCssTiming that returns a fixed { duration,
 * easing } pair suitable for CSS-variable emission. Mirrors the
 * exported `springToCssTiming` in motion.ts but lives here to avoid
 * a circular import. */
function springToCssTimingForCss(spring: SpringAnimationToken): {
  duration: string;
  easing: string;
} {
  if (spring.duration !== undefined && spring.easing !== undefined) {
    return { duration: spring.duration, easing: spring.easing };
  }
  const mass = spring.mass ?? 1;
  const stiffness = spring.stiffness ?? 100;
  const damping = spring.damping ?? 10;
  const ms = Math.round(220 * Math.sqrt(mass / Math.max(1, stiffness / 100)));
  const zeta = damping / (2 * Math.sqrt(Math.max(1, mass * stiffness)));
  const easing =
    zeta < 0.7
      ? 'cubic-bezier(0.34, 1.56, 0.64, 1)'
      : zeta < 1
        ? 'cubic-bezier(0.22, 1, 0.36, 1)'
        : 'cubic-bezier(0.4, 0, 0.2, 1)';
  return { duration: spring.duration ?? `${ms}ms`, easing: spring.easing ?? easing };
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
