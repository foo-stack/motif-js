import { splitTokenPath } from './_token-path.js';
import type { ScaleName, Theme, TokenNode, TokenScale } from './types.js';

/**
 * Dev-only warning: fires when a `$`-reference fails to resolve against the
 * active theme.
 *
 * An unresolvable reference is dropped silently - the style prop it backs
 * simply does not appear in the output. That is the correct runtime
 * behaviour (a missing token should never throw mid-render), but it makes a
 * typo, a renamed token, or a kit that expects a token the theme never
 * defines indistinguishable from a deliberate design choice. A hover state
 * that never fires looks intentional.
 *
 * The message reports the deepest path segment that *did* resolve and the
 * keys available there, so `$colors.surface.default` against a theme whose
 * surface group is `base | muted | raised` names the three candidates rather
 * than just reporting a miss.
 *
 * Wrapped in `process.env.NODE_ENV !== 'production'` at the call site so
 * production bundlers tree-shake the call. The body is also guarded so
 * direct callers (tests) get the production no-op when
 * `NODE_ENV === 'production'`.
 *
 * Each unique `(theme, ref, defaultScale)` triple warns at most once per
 * process - a ref that resolves in one theme and not another is exactly the
 * bug worth reporting twice, so the theme name is part of the key.
 */
export function warnUnresolvedTokenRef(
  ref: string,
  theme: Theme,
  defaultScale: ScaleName | undefined,
): void {
  if (process.env.NODE_ENV === 'production') return;

  const cacheKey = `${theme.name}|${ref}|${defaultScale ?? ''}`;
  if (unresolvedWarned.has(cacheKey)) return;
  unresolvedWarned.add(cacheKey);

  // eslint-disable-next-line no-console
  console.warn(
    `[motif] ${ref} does not resolve against theme "${theme.name}" and will be ` +
      `dropped from the output.${describeNearestNode(ref, theme, defaultScale)}`,
  );
}

const unresolvedWarned = new Set<string>();

/** Test-only: reset the warning dedup cache. */
export function _resetDevWarningsForTesting(): void {
  unresolvedWarned.clear();
}

/**
 * Build the " ... has no `x` (available: a, b, c)" tail of the warning by
 * walking as far down the path as the theme allows.
 *
 * Scale detection here tests `theme.tokens` membership rather than the
 * canonical scale list, which keeps this module free of an import cycle with
 * `token.ts` and costs nothing: a head that names a known scale the theme
 * omits has no keys to suggest anyway.
 */
function describeNearestNode(
  ref: string,
  theme: Theme,
  defaultScale: ScaleName | undefined,
): string {
  // Same segmentation as the resolver, so the "available:" list describes the
  // node the lookup actually failed at.
  const segments = splitTokenPath(ref);
  const [head, ...rest] = segments;
  if (head === undefined) return '';

  const tokens = theme.tokens as Record<string, TokenNode | undefined>;

  let node: TokenNode | undefined;
  let walked: string[];
  let remaining: readonly string[];

  if (Object.hasOwn(tokens, head)) {
    node = tokens[head];
    walked = [head];
    remaining = rest;
  } else if (defaultScale !== undefined && Object.hasOwn(tokens, defaultScale)) {
    node = tokens[defaultScale];
    walked = [defaultScale];
    remaining = segments;
  } else {
    const scales = Object.keys(tokens).sort().join(', ');
    return ` The theme defines no \`${head}\` scale (available: ${scales}).`;
  }

  for (const seg of remaining) {
    if (node === null || node === undefined || typeof node !== 'object') break;
    if (!Object.hasOwn(node, seg)) {
      const keys = Object.keys(node).sort().join(', ');
      const path = walked.join('.');
      return keys === ''
        ? ` \`${path}\` is empty.`
        : ` \`${path}\` has no \`${seg}\` (available: ${keys}).`;
    }
    node = (node as TokenScale)[seg];
    walked.push(seg);
  }

  // The whole path existed, so the miss is the leaf's own shape - an interior
  // node used as a value, or a `$`-ref chain that dead-ends further down.
  if (typeof node === 'object' && node !== null) {
    const keys = Object.keys(node).sort().join(', ');
    return ` \`${walked.join('.')}\` is a group, not a value (contains: ${keys}).`;
  }
  return '';
}
