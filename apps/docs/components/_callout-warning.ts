/**
 * Development-only warning for a Callout variant outside the declared union.
 *
 * MDX is not typechecked, so a page can pass any string. The component falls
 * back to `info` rather than crashing, because an unknown variant used to make
 * the icon `undefined` and rendering `<undefined />` unmounts the whole route:
 * four pages shipped blank for months on one mistyped word. But a silent
 * fallback trades a loud failure for a quiet one. A mistyped `danger` renders
 * as a neutral note, and the warning a reader is meant to heed loses its
 * severity with nothing anywhere saying so.
 *
 * Guarded on `import.meta.env.DEV`, which the docs bundler replaces with a
 * literal so the call is dropped from a production build, and deduplicated
 * because a page can render many callouts and a flooded console is one nobody
 * reads. Mirrors
 * the `warnIf*` helpers in `packages/react/src/_dev-warnings.ts`, which exist
 * for this same class of silently-wrong-rather-than-broken problem.
 */
const warned = new Set<string>();

export function warnOnUnknownVariant(variant: string | undefined, known: readonly string[]): void {
  if (!import.meta.env.DEV) return;
  if (variant === undefined || known.includes(variant)) return;
  if (warned.has(variant)) return;
  warned.add(variant);
  // eslint-disable-next-line no-console
  console.warn(
    `[docs] <Callout variant="${variant}"> is not a known variant, so it renders ` +
      `as "info" and loses its intended severity. Known variants: ${known.join(', ')}.`,
  );
}

/** Test seam: the dedupe set persists for the process life otherwise. */
export function resetVariantWarnings(): void {
  warned.clear();
}
