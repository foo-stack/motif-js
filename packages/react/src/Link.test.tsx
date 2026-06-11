/** @vitest-environment jsdom */
import { renderToStaticMarkup } from 'react-dom/server';
import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Link } from './Link.js';
import { _resetStyleCacheForTesting } from './style-cache.js';

let container: HTMLElement;
let root: Root;
function clientRender(node: ReactNode): void {
  act(() => root.render(node));
}
function emittedCss(): string {
  return document.head.querySelector('style[data-motif-style-cache]')?.textContent ?? '';
}

describe('Link (web)', () => {
  beforeEach(() => {
    _resetStyleCacheForTesting();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });
  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    document.head.querySelectorAll('style[data-motif-style-cache]').forEach((el) => el.remove());
  });

  it('renders <a href> by default', () => {
    const html = renderToStaticMarkup(<Link href="/x">link</Link>);
    expect(html).toMatch(/<a[^>]*href="\/x"/);
  });

  it('target=_blank auto-injects rel=noopener noreferrer', () => {
    const html = renderToStaticMarkup(
      <Link href="https://x" target="_blank">
        ext
      </Link>,
    );
    expect(html).toContain('target="_blank"');
    expect(html).toContain('noopener noreferrer');
  });

  it('explicit rel wins over the auto default', () => {
    const html = renderToStaticMarkup(
      <Link href="https://x" target="_blank" rel="external">
        ext
      </Link>,
    );
    expect(html).toContain('rel="external"');
    expect(html).not.toContain('noopener');
  });

  // #251 — the decoration is emitted as a class rule (not inline style), so
  // the `_hover` pseudo rule can win the cascade. Previously an inline
  // `text-decoration` always beat the hover rule, so hover never underlined.
  it('underline=always underlines via a class rule, not inline style', () => {
    clientRender(
      <Link href="/x" underline="always">
        x
      </Link>,
    );
    const a = container.querySelector('a')!;
    // Not inline — that was the bug (inline beats the hover pseudo rule).
    expect(a.style.textDecoration).toBe('');
    // The base class block carries the underline.
    expect(emittedCss()).toMatch(/text-decoration:\s*underline/);
  });

  it('underline=hover keeps the base off inline so the hover rule can win', () => {
    clientRender(
      <Link href="/x" underline="hover">
        x
      </Link>,
    );
    const a = container.querySelector('a')!;
    // The base `none` must not be inline (specificity 1,0,0,0) or it would
    // beat the `:hover` rule and the link would never underline on hover.
    expect(a.style.textDecoration).toBe('');
    const css = emittedCss();
    expect(css).toContain(':hover');
    expect(css).toMatch(/text-decoration:\s*underline/);
  });
});
