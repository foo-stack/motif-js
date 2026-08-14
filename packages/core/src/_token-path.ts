/**
 * Decimal-key handling for `$`-token paths, shared by the resolver and the
 * CSS-variable emitter.
 *
 * The default `space` scale (and `sizes`, which spreads it) ships the
 * half-step keys `0.5`, `1.5`, `2.5`, `3.5`. Splitting a reference on `.`
 * turns `$space.1.5` into `['space', '1', '5']`, which looks up
 * `space['1']['5']` — nothing — so those values are unreachable by the syntax
 * every other token uses, and the declaration is dropped.
 *
 * Merging two adjacent all-digit segments back into one decimal key is
 * unambiguous for this token system: scales are flat maps of scalar values,
 * and the one nested scale (`colors`) is keyed by a non-numeric family name
 * first (`$colors.blue.500`), so a digits-then-digits boundary only ever
 * arises from a decimal key.
 *
 * `resolveToken` applies this only after the plain path fails, so a theme
 * that genuinely nests a numeric key under a numeric key keeps its existing
 * meaning.
 */

/**
 * Merge adjacent all-digit segments into a single decimal key.
 *
 * Returns `segments` **by reference** when there is nothing to merge, so
 * callers can skip the retry with an identity check.
 *
 * @example
 *   mergeDecimalSegments(['space', '1', '5'])     → ['space', '1.5']
 *   mergeDecimalSegments(['colors', 'blue', '500']) → same reference
 */
const DIGITS = /^\d+$/;

export function mergeDecimalSegments(segments: readonly string[]): readonly string[] {
  let out: string[] | undefined;
  for (let i = 0; i < segments.length; i++) {
    const a = segments[i]!;
    const b = segments[i + 1];
    if (b !== undefined && DIGITS.test(a) && DIGITS.test(b)) {
      out ??= segments.slice(0, i);
      out.push(`${a}.${b}`);
      i++;
    } else {
      out?.push(a);
    }
  }
  return out ?? segments;
}

/** Split a `$`-prefixed reference into segments, merging decimal keys. */
export function splitTokenPath(ref: string): readonly string[] {
  return mergeDecimalSegments(ref.slice(1).split('.'));
}
