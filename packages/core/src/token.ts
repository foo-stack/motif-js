import type { ScaleName, Theme, TokenNode, TokenRef, TokenScale, TokenValue } from './types.js';

const KNOWN_SCALES: readonly ScaleName[] = [
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
];

const KNOWN_SCALE_SET: ReadonlySet<string> = new Set(KNOWN_SCALES);

/** Type guard: is the given value a `$`-prefixed token reference? */
export function isTokenRef(value: unknown): value is TokenRef {
  return typeof value === 'string' && value.length > 1 && value.charCodeAt(0) === 36;
}

/**
 * Walk a dotted path inside a token scale. Returns `undefined` if any segment
 * does not exist or hits a non-object before the end of the path.
 */
function walkPath(node: TokenNode | undefined, segments: readonly string[]): TokenNode | undefined {
  let current: TokenNode | undefined = node;
  for (const seg of segments) {
    if (current === undefined || current === null) return undefined;
    if (typeof current !== 'object') return undefined;
    current = (current as TokenScale)[seg];
  }
  return current;
}

export interface ResolveTokenOptions {
  /**
   * If the reference is bare (e.g. `$primary` without a known scale prefix),
   * the resolver will first try to find it inside this scale. Style-prop
   * resolution sets this from the prop's associated scale.
   */
  readonly defaultScale?: ScaleName;
}

/**
 * Resolve a token reference to its underlying value.
 *
 * Resolution rules:
 *
 * 1. Strip the leading `$`, split on `.`.
 * 2. If the first segment is a known scale name (`colors`, `space`, ...),
 *    look up `theme.tokens.<scale>.<rest>`.
 * 3. Otherwise, if `defaultScale` is provided, look up
 *    `theme.tokens.<defaultScale>.<segments>`.
 * 4. If the resolved node is itself a `TokenRef` (semantic → primitive),
 *    recurse. Cycles are detected and short-circuit to `undefined`.
 *
 * Returns `undefined` if the path cannot be resolved.
 */
export function resolveToken(
  ref: TokenRef,
  theme: Theme,
  options: ResolveTokenOptions = {},
): TokenValue | undefined {
  return resolveTokenInner(ref, theme, options, new Set());
}

function resolveTokenInner(
  ref: TokenRef,
  theme: Theme,
  options: ResolveTokenOptions,
  seen: Set<string>,
): TokenValue | undefined {
  if (seen.has(ref)) return undefined;
  seen.add(ref);

  const segments = ref.slice(1).split('.');
  const [head, ...rest] = segments;
  if (head === undefined) return undefined;

  let node: TokenNode | undefined;

  if (KNOWN_SCALE_SET.has(head)) {
    const scale = theme.tokens[head];
    node = walkPath(scale as TokenNode | undefined, rest);
  } else if (options.defaultScale !== undefined) {
    const scale = theme.tokens[options.defaultScale];
    node = walkPath(scale as TokenNode | undefined, segments);
  }

  if (node === undefined) return undefined;
  if (isTokenRef(node)) {
    return resolveTokenInner(node, theme, options, seen);
  }
  if (typeof node === 'object') return undefined; // hit an interior scale, not a leaf
  return node;
}

/**
 * Resolve every `$…` token reference in an output range against the
 * active theme. Used by `useTransform` so consumers can write
 * `[" $colors.brand.red", "$colors.brand.blue"]` and have the
 * interpolator see the resolved literals.
 *
 * - Non-string entries pass through unchanged.
 * - Strings that aren't token refs pass through unchanged.
 * - Token refs that resolve to a string / number replace the raw ref.
 * - Token refs that fail to resolve (typo, missing theme) pass
 *   through unchanged — same graceful-degrade as the rest of the
 *   token surface.
 *
 * Returns a freshly-allocated array; callers can pass the result
 * straight to `classifyOutputRange` / `interpolateOutputs`.
 */
export function resolveOutputRangeTokens<O extends string | number>(
  outputRange: readonly O[],
  theme: Theme | undefined,
): readonly (string | number)[] {
  const out: (string | number)[] = [];
  for (let i = 0; i < outputRange.length; i++) {
    const entry = outputRange[i] as O;
    if (typeof entry !== 'string' || !isTokenRef(entry)) {
      out.push(entry);
      continue;
    }
    if (theme === undefined) {
      out.push(entry);
      continue;
    }
    const resolved = resolveToken(entry, theme);
    out.push(resolved === undefined || typeof resolved === 'object' ? entry : resolved);
  }
  return out;
}

/**
 * Resolve any value that may be a token reference. Non-references pass
 * through unchanged. References that fail to resolve return `undefined`,
 * which callers can treat as a bailout.
 */
export function resolveValue<V extends TokenValue>(
  value: V | TokenRef | undefined,
  theme: Theme | undefined,
  options: ResolveTokenOptions = {},
): V | TokenValue | undefined {
  if (value === undefined) return undefined;
  if (!isTokenRef(value)) return value;
  if (theme === undefined) return undefined;
  return resolveToken(value, theme, options);
}

export { KNOWN_SCALES };
