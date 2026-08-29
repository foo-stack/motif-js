/**
 * Locks scrolling on `document.body` while an overlay is open, and restores
 * the page exactly as it was on release.
 *
 * Reference-counted at module scope: a Dialog opened over a Drawer locks
 * twice and only the last release restores, so closing the inner overlay
 * cannot hand scrolling back while the outer one is still up.
 *
 * The release is idempotent. React strict mode double-invokes effect
 * cleanup in development, and a second decrement would unlock the page
 * with an overlay still on screen.
 */
let lockCount = 0;
let restore: (() => void) | null = null;

/**
 * Subtrees whose own scrollable elements stay scrollable while the page
 * behind them is locked, one per outstanding lock. Nested overlays each
 * contribute their own, so a Dialog over a Drawer keeps both scrollable.
 */
const allowRegions: HTMLElement[] = [];

const NOOP = (): void => {};

/**
 * Measures the scrollbar that `overflow: hidden` is about to remove.
 * Returns 0 when the viewport has no classic scrollbar (overlay
 * scrollbars, or a page that never overflowed), in which case there is
 * nothing to compensate for.
 */
function scrollbarWidth(): number {
  const { clientWidth } = document.documentElement;
  // Environments that run no layout (jsdom, and anything rendering
  // headless without a viewport) report 0 here while `innerWidth` still
  // reports the configured window size. Subtracting would call the entire
  // window a scrollbar and pad the body by ~1000px. A real viewport is
  // never 0 wide, so treat it as "no measurement available".
  if (clientWidth <= 0) return 0;
  return Math.max(0, window.innerWidth - clientWidth);
}

/** Whether this element can actually consume a vertical scroll gesture. */
function isScrollable(element: Element): boolean {
  const { overflowY } = window.getComputedStyle(element);
  if (overflowY !== 'auto' && overflowY !== 'scroll') return false;
  return element.scrollHeight > element.clientHeight;
}

/**
 * Walks up from the touched node looking for something inside an allowed
 * region that can scroll. Stops at the region boundary so a gesture that
 * merely starts over the overlay, but has nothing scrollable under it,
 * still gets prevented.
 */
function findScrollableWithinAllowedRegion(target: Node): boolean {
  const region = allowRegions.find((candidate) => candidate.contains(target));
  if (region === undefined) return false;

  let node: Element | null =
    target instanceof Element ? target : (target.parentElement as Element | null);

  while (node !== null) {
    if (isScrollable(node)) return true;
    if (node === region) return false;
    node = node.parentElement;
  }
  return false;
}

/**
 * `overflow: hidden` on the body does not stop touch scrolling in iOS
 * Safari, so the lock is incomplete without also cancelling the gesture.
 *
 * A `touchmove` is dispatched to the node the touch *started* on, so the
 * event target is enough to decide this - no separate `touchstart`
 * bookkeeping needed.
 */
function handleTouchMove(event: TouchEvent): void {
  // Leave pinch-zoom alone; cancelling it would break zoom inside an
  // overlay, which is an accessibility regression rather than a fix.
  if (event.touches.length > 1) return;
  if (event.target instanceof Node && findScrollableWithinAllowedRegion(event.target)) return;
  if (event.cancelable) event.preventDefault();
}

/**
 * Acquires the lock and returns its release.
 *
 * Pass the overlay's own element as `allowWithin` so scrollable content
 * inside it keeps working on touch devices while the page behind it is
 * frozen. Omitting it locks touch scrolling everywhere.
 *
 * No-op on the server, where there is no document to lock.
 */
export function lockScroll(allowWithin?: HTMLElement): () => void {
  if (typeof document === 'undefined') return NOOP;

  lockCount += 1;
  if (allowWithin !== undefined) allowRegions.push(allowWithin);

  if (lockCount === 1) {
    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const gap = scrollbarWidth();

    body.style.overflow = 'hidden';

    // Removing the scrollbar widens the viewport, which shifts fixed and
    // centred content left by its width. Hold the page still by replacing
    // the scrollbar with padding. Read the computed value rather than the
    // inline one so a stylesheet's padding is preserved, not discarded.
    if (gap > 0) {
      const current = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;
      body.style.paddingRight = `${current + gap}px`;
    }

    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    restore = () => {
      // Assigning the captured inline value back removes the property
      // entirely when it was previously unset, which is what makes this an
      // exact restore rather than a hardcoded default.
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }

  let released = false;
  return () => {
    if (released) return;
    released = true;

    if (allowWithin !== undefined) {
      const index = allowRegions.lastIndexOf(allowWithin);
      if (index !== -1) allowRegions.splice(index, 1);
    }

    lockCount -= 1;
    if (lockCount === 0) {
      restore?.();
      restore = null;
    }
  };
}
