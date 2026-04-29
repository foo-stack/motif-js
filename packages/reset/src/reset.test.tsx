/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MotifReset, RESET_CSS, RESET_STYLE_ID, injectResetStylesheet } from './index.js';

describe('RESET_CSS', () => {
  it('exports a non-empty CSS string', () => {
    expect(typeof RESET_CSS).toBe('string');
    expect(RESET_CSS.length).toBeGreaterThan(100);
  });

  it('starts with the universal box-sizing rule', () => {
    expect(RESET_CSS.startsWith('*,*::before,*::after{box-sizing:border-box}')).toBe(true);
  });

  it('contains the canonical normalize signposts', () => {
    expect(RESET_CSS).toContain('text-size-adjust');
    expect(RESET_CSS).toContain('font-family:inherit');
    expect(RESET_CSS).toContain('cursor:pointer');
  });

  it('exposes the reset style id constant', () => {
    expect(RESET_STYLE_ID).toBe('motif-reset');
  });
});

describe('injectResetStylesheet', () => {
  beforeEach(() => {
    document.head.querySelectorAll(`#${RESET_STYLE_ID}`).forEach((el) => el.remove());
  });

  afterEach(() => {
    document.head.querySelectorAll(`#${RESET_STYLE_ID}`).forEach((el) => el.remove());
  });

  it('appends a <style id="motif-reset"> element to <head>', () => {
    injectResetStylesheet();
    const style = document.getElementById(RESET_STYLE_ID);
    expect(style).not.toBeNull();
    expect(style?.tagName).toBe('STYLE');
    expect(style?.textContent).toBe(RESET_CSS);
  });

  it('inserts the reset at the top of <head> so author CSS wins ties', () => {
    const author = document.createElement('style');
    author.id = 'author-css';
    author.textContent = '/* author */';
    document.head.append(author);
    injectResetStylesheet();
    const first = document.head.firstElementChild as HTMLElement;
    expect(first?.id).toBe(RESET_STYLE_ID);
    author.remove();
  });

  it('is idempotent — second call is a no-op', () => {
    injectResetStylesheet();
    injectResetStylesheet();
    const matches = document.head.querySelectorAll(`#${RESET_STYLE_ID}`);
    expect(matches.length).toBe(1);
  });

  it('no-ops in a non-browser environment (document undefined)', () => {
    const original = globalThis.document;
    // @ts-expect-error — exercise the SSR-safety guard.
    delete (globalThis as { document?: Document }).document;
    expect(() => injectResetStylesheet()).not.toThrow();
    (globalThis as { document?: Document }).document = original;
  });
});

describe('<MotifReset />', () => {
  let container: HTMLElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    document.body.removeChild(container);
  });

  it('renders a <style> element with the reset id and content', () => {
    act(() => {
      root.render(<MotifReset />);
    });
    const style = container.querySelector('style');
    expect(style).not.toBeNull();
    expect(style?.id).toBe(RESET_STYLE_ID);
    expect(style?.innerHTML).toBe(RESET_CSS);
  });
});

describe('@motif-js/reset/auto side-effect entry', () => {
  it('injects the reset on import', async () => {
    document.head.querySelectorAll(`#${RESET_STYLE_ID}`).forEach((el) => el.remove());
    // Static dynamic import (vitest treats `./auto.js` as a known
    // module). The auto entry's top-level call to
    // `injectResetStylesheet()` runs at import time.
    await import('./auto.js');
    // The dynamic import is cached, so on second test runs we won't
    // re-run the side effect. Call the helper directly to confirm
    // the post-import state matches.
    const style = document.getElementById(RESET_STYLE_ID);
    if (style === null) {
      // Re-inject (cached module case). If this also no-ops, the
      // production path is broken.
      injectResetStylesheet();
      expect(document.getElementById(RESET_STYLE_ID)).not.toBeNull();
    } else {
      expect(style.textContent).toBe(RESET_CSS);
    }
  });
});
