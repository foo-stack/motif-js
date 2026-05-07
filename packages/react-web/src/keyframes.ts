import { makeKeyframe, type Keyframe, type KeyframeDef } from '@motif-js/core';

export type { Keyframe, KeyframeDef };

/**
 * Define a CSS `@keyframes` rule. Returns a {@link Keyframe} object
 * carrying the stable hash-based animation name plus the rule body.
 *
 * The function is **pure** — the `@keyframes` rule is registered with
 * the runtime style cache only when the returned `Keyframe` is passed
 * to a Box / styled component's `animation` prop. This keeps the
 * helper safe to call at module top level without forcing a side
 * effect at import time.
 *
 * @example
 *
 * ```tsx
 * import { keyframes } from '@motif-js/react';
 *
 * const spin = keyframes({
 *   '0%': { transform: 'rotate(0deg)' },
 *   '100%': { transform: 'rotate(360deg)' },
 * });
 *
 * <Box animation={{ name: spin, duration: '1s', easing: 'linear', iterationCount: 'infinite' }} />
 * ```
 *
 * Identical definitions hash to identical names, so multiple call
 * sites that produce the same body share a single emitted
 * `@keyframes` rule.
 */
export function keyframes(def: KeyframeDef): Keyframe {
  return makeKeyframe(def);
}
