import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { lockScroll } from './_scroll-lock.js';

/** Gives `documentElement.clientWidth` a real value, which jsdom otherwise
 *  reports as 0 because it runs no layout. Returns the undo. */
function stubViewport(clientWidth: number): () => void {
  const descriptor = Object.getOwnPropertyDescriptor(
    Object.getPrototypeOf(document.documentElement),
    'clientWidth',
  );
  Object.defineProperty(document.documentElement, 'clientWidth', {
    configurable: true,
    get: () => clientWidth,
  });
  return () => {
    delete (document.documentElement as unknown as Record<string, unknown>)['clientWidth'];
    if (descriptor) {
      Object.defineProperty(
        Object.getPrototypeOf(document.documentElement),
        'clientWidth',
        descriptor,
      );
    }
  };
}

describe('lockScroll', () => {
  beforeEach(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  });

  afterEach(() => {
    document.body.removeAttribute('style');
  });

  it('sets overflow hidden on the body', () => {
    const release = lockScroll();
    expect(document.body.style.overflow).toBe('hidden');
    release();
  });

  it('restores the exact prior inline style, leaving no leftover property', () => {
    const release = lockScroll();
    release();
    // Not 'visible' or 'auto': the property should be gone entirely.
    expect(document.body.style.overflow).toBe('');
    expect(document.body.getAttribute('style')).toBe('');
  });

  it('restores a consumer overflow:hidden rather than clearing it', () => {
    document.body.style.overflow = 'hidden';
    const release = lockScroll();
    expect(document.body.style.overflow).toBe('hidden');
    release();
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('stays locked while a nested lock is outstanding', () => {
    const releaseOuter = lockScroll();
    const releaseInner = lockScroll();

    releaseInner();
    expect(document.body.style.overflow).toBe('hidden');

    releaseOuter();
    expect(document.body.style.overflow).toBe('');
  });

  it('ignores a release called twice, so strict mode cannot unlock early', () => {
    const releaseOuter = lockScroll();
    const releaseInner = lockScroll();

    releaseInner();
    releaseInner();
    expect(document.body.style.overflow).toBe('hidden');

    releaseOuter();
    expect(document.body.style.overflow).toBe('');
  });

  it('compensates for the scrollbar width and removes the padding on release', () => {
    const undo = stubViewport(1009); // window.innerWidth is 1024 in jsdom
    try {
      const release = lockScroll();
      expect(document.body.style.paddingRight).toBe('15px');
      release();
      expect(document.body.style.paddingRight).toBe('');
    } finally {
      undo();
    }
  });

  it('adds the scrollbar width to existing padding rather than replacing it', () => {
    const undo = stubViewport(1009);
    document.body.style.paddingRight = '8px';
    try {
      const release = lockScroll();
      expect(document.body.style.paddingRight).toBe('23px');
      release();
      expect(document.body.style.paddingRight).toBe('8px');
    } finally {
      undo();
    }
  });

  it('does not pad when no scrollbar is measurable', () => {
    const release = lockScroll();
    expect(document.body.style.paddingRight).toBe('');
    release();
  });
});

describe('lockScroll touch handling', () => {
  /** Makes an element look scrollable to `isScrollable`, which jsdom
   *  otherwise defeats by reporting every dimension as 0. */
  function makeScrollable(element: HTMLElement): void {
    element.style.overflowY = 'auto';
    Object.defineProperty(element, 'scrollHeight', { configurable: true, value: 500 });
    Object.defineProperty(element, 'clientHeight', { configurable: true, value: 100 });
  }

  function touchMoveOn(target: EventTarget, touchCount = 1): TouchEvent {
    const event = new Event('touchmove', { bubbles: true, cancelable: true }) as TouchEvent;
    Object.defineProperty(event, 'touches', {
      value: Array.from({ length: touchCount }, () => ({})),
    });
    target.dispatchEvent(event);
    return event;
  }

  let background: HTMLDivElement;
  let overlay: HTMLDivElement;
  let scroller: HTMLDivElement;

  beforeEach(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';

    background = document.createElement('div');
    overlay = document.createElement('div');
    scroller = document.createElement('div');
    overlay.append(scroller);
    document.body.append(background, overlay);
  });

  afterEach(() => {
    background.remove();
    overlay.remove();
    document.body.removeAttribute('style');
  });

  it('prevents a touchmove that started on background content', () => {
    const release = lockScroll(overlay);
    expect(touchMoveOn(background).defaultPrevented).toBe(true);
    release();
  });

  it('allows a touchmove inside a scrollable element within the overlay', () => {
    makeScrollable(scroller);
    const release = lockScroll(overlay);
    expect(touchMoveOn(scroller).defaultPrevented).toBe(false);
    release();
  });

  it('still prevents a touchmove over the overlay when nothing there scrolls', () => {
    const release = lockScroll(overlay);
    expect(touchMoveOn(scroller).defaultPrevented).toBe(true);
    release();
  });

  it('leaves multi-touch gestures alone so pinch-zoom keeps working', () => {
    const release = lockScroll(overlay);
    expect(touchMoveOn(background, 2).defaultPrevented).toBe(false);
    release();
  });

  it('stops preventing once the last lock is released', () => {
    const release = lockScroll(overlay);
    release();
    expect(touchMoveOn(background).defaultPrevented).toBe(false);
  });

  it('attaches and removes the listener exactly once across nested locks', () => {
    const add = vi.spyOn(document, 'addEventListener');
    const remove = vi.spyOn(document, 'removeEventListener');
    try {
      const releaseOuter = lockScroll(overlay);
      const releaseInner = lockScroll(overlay);
      const touchAdds = add.mock.calls.filter(([type]) => type === 'touchmove');
      expect(touchAdds).toHaveLength(1);
      expect(touchAdds[0]?.[2]).toEqual({ passive: false });

      releaseInner();
      expect(remove.mock.calls.filter(([type]) => type === 'touchmove')).toHaveLength(0);

      releaseOuter();
      expect(remove.mock.calls.filter(([type]) => type === 'touchmove')).toHaveLength(1);
    } finally {
      add.mockRestore();
      remove.mockRestore();
    }
  });

  it('keeps the inner overlay scrollable when a second lock nests', () => {
    const inner = document.createElement('div');
    makeScrollable(inner);
    document.body.append(inner);

    const releaseOuter = lockScroll(overlay);
    const releaseInner = lockScroll(inner);

    expect(touchMoveOn(inner).defaultPrevented).toBe(false);
    expect(touchMoveOn(background).defaultPrevented).toBe(true);

    releaseInner();
    // The inner region is gone, so its subtree is background again.
    expect(touchMoveOn(inner).defaultPrevented).toBe(true);

    releaseOuter();
    inner.remove();
  });
});
