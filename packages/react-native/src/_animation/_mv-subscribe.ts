import type { MotionValueDriverBinding } from './types.js';

/**
 * Stable per-object id, assigned lazily and held weakly so it never pins the
 * object. Used to fold a motion value's identity into a subscription
 * signature — see {@link motionValueSubscriptionKey}.
 */
const motionValueIds = new WeakMap<object, number>();
let nextMotionValueId = 0;
function motionValueId(mv: object): number {
  let id = motionValueIds.get(mv);
  if (id === undefined) {
    id = ++nextMotionValueId;
    motionValueIds.set(mv, id);
  }
  return id;
}

/**
 * A string that changes only when the set of (node ← motion-value) pairings
 * changes: a binding added or removed, or a different MV swapped onto an
 * existing node key. Renders that leave the pairings intact produce the same
 * string.
 *
 * Both native drivers subscribe one listener per binding inside a
 * `useEffect`. The binding *array* is a fresh identity every render, so an
 * effect that depended on it (or on nothing) would tear down and re-add every
 * listener each render. Depending on this key instead resubscribes only when
 * the pairing actually changes — the node key uses `transformAxis ?? cssProperty`,
 * matching how each driver keys its animated nodes, so swapping the MV on a
 * prop is caught while an unrelated re-render is not.
 */
export function motionValueSubscriptionKey(bindings: readonly MotionValueDriverBinding[]): string {
  return bindings
    .map((b) => `${b.transformAxis ?? b.cssProperty}:${motionValueId(b.mv)}`)
    .join('|');
}
