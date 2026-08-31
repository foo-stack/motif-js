/**
 * Return a copy of `els` sorted by document order.
 *
 * Roving-focus registries collect elements as they *mount*, which only
 * matches visual order on the first render - an item rendered
 * conditionally later is appended to the end while sitting mid-DOM.
 * Sorting by `compareDocumentPosition` before arrow-key / Home / End
 * navigation keeps traversal in visual order regardless of mount order.
 */
export function inDomOrder<T extends Element>(els: readonly T[]): T[] {
  return [...els].sort((a, b) => {
    if (a === b) return 0;
    return (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0 ? -1 : 1;
  });
}
