/**
 * Marks everything behind an overlay `inert` and `aria-hidden`, and puts
 * the DOM back exactly as it was on release.
 *
 * `inert` removes the background from the tab order and from pointer
 * events; `aria-hidden` covers assistive tech that does not implement
 * `inert` yet. WAI-ARIA's modal pattern wants both.
 *
 * Reference-counted per node, because nested overlays overlap: a Dialog
 * opened over a Drawer marks the Drawer too, and closing the Dialog must
 * not un-mark anything the Drawer still needs hidden.
 */
interface MarkRecord {
  count: number;
  previousAriaHidden: string | null;
  hadInert: boolean;
}

const marks = new Map<Element, MarkRecord>();

const NOOP = (): void => {};

/** Elements that render nothing, so hiding them is pointless noise. */
const NON_RENDERED = new Set(['SCRIPT', 'STYLE', 'LINK']);

/**
 * Finds the node whose siblings form the background: walk up from the
 * overlay's own element to the child of the portal target.
 *
 * `Portal` only inserts its `data-theme` wrapper when a theme is in
 * scope, so the overlay sits one or two levels below the target depending
 * on the consumer's setup. Resolving by walking rather than by assuming a
 * fixed depth is what makes both cases work.
 *
 * Returns null for a detached node, where there is no background to hide.
 */
function resolveBoundary(node: HTMLElement, target: HTMLElement): HTMLElement | null {
  let current: HTMLElement = node;
  let parent = current.parentElement;

  while (parent !== null) {
    if (parent === target) return current;
    current = parent;
    parent = current.parentElement;
  }
  return null;
}

/**
 * A live region must keep announcing while a modal is open, so toasts
 * still reach the user. That holds for a wrapper containing one too:
 * `aria-hidden` on an ancestor silences the region inside it.
 */
function shouldMark(element: Element): boolean {
  if (NON_RENDERED.has(element.tagName)) return false;
  return !element.matches('[aria-live]') && element.querySelector('[aria-live]') === null;
}

/**
 * Hides every sibling of the overlay's top-level container and returns
 * the release.
 *
 * The release is idempotent, so React strict mode's double cleanup in
 * development cannot decrement a node's count twice and reveal the
 * background early.
 *
 * No-op on the server, and for a node that is not in the document.
 */
export function isolateBackground(
  node: HTMLElement,
  target: HTMLElement = document.body,
): () => void {
  if (typeof document === 'undefined') return NOOP;

  const boundary = resolveBoundary(node, target);
  if (boundary === null) return NOOP;

  const affected: Element[] = [];

  for (const sibling of Array.from(target.children)) {
    if (sibling === boundary) continue;
    if (!shouldMark(sibling)) continue;

    const existing = marks.get(sibling);
    if (existing === undefined) {
      marks.set(sibling, {
        count: 1,
        previousAriaHidden: sibling.getAttribute('aria-hidden'),
        hadInert: sibling.hasAttribute('inert'),
      });
      sibling.setAttribute('inert', '');
      sibling.setAttribute('aria-hidden', 'true');
    } else {
      existing.count += 1;
    }
    affected.push(sibling);
  }

  let released = false;
  return () => {
    if (released) return;
    released = true;

    for (const sibling of affected) {
      const record = marks.get(sibling);
      if (record === undefined) continue;

      record.count -= 1;
      if (record.count > 0) continue;

      marks.delete(sibling);
      if (!record.hadInert) sibling.removeAttribute('inert');
      if (record.previousAriaHidden === null) {
        sibling.removeAttribute('aria-hidden');
      } else {
        sibling.setAttribute('aria-hidden', record.previousAriaHidden);
      }
    }
  };
}
