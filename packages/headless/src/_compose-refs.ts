import type { Ref } from 'react';

/**
 * Merge several refs into one callback ref. A Trigger that needs to
 * attach its own ref to a consumer's child must compose — not replace —
 * any ref the consumer already put there, or the consumer's ref silently
 * never fires.
 *
 * ```tsx
 * cloneElement(child, { ref: mergeRefs(child.props.ref, internalRef) });
 * ```
 *
 * `null`/`undefined` entries are skipped; object refs get `.current`
 * assigned, function refs are called.
 */
export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>): (node: T | null) => void {
  return (node: T | null) => {
    for (const ref of refs) {
      if (ref === null || ref === undefined) continue;
      if (typeof ref === 'function') {
        ref(node);
      } else {
        (ref as { current: T | null }).current = node;
      }
    }
  };
}
