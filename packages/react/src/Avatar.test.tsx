/** @vitest-environment jsdom */
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Avatar } from './Avatar.js';

describe('Avatar (web)', () => {
  it('renders initials when no src is provided', () => {
    const html = renderToStaticMarkup(<Avatar name="Jane Doe" />);
    expect(html).toContain('JD');
  });

  it('falls back to first 2 chars when given a single word', () => {
    const html = renderToStaticMarkup(<Avatar name="anil" />);
    expect(html).toContain('AN');
  });

  it('renders an <img> when src is set', () => {
    const html = renderToStaticMarkup(<Avatar name="Jane" src="/x.png" />);
    expect(html).toMatch(/<img[^>]*src="\/x.png"/);
    expect(html).toMatch(/alt="Jane"/);
  });

  it('size=xl sets 80×80', () => {
    const html = renderToStaticMarkup(<Avatar name="X" size="xl" />);
    expect(html).toContain('width:80px');
    expect(html).toContain('height:80px');
  });

  it('square shape uses rounded radius (not circle)', () => {
    const html = renderToStaticMarkup(<Avatar name="X" shape="square" />);
    expect(html).not.toContain('--radii-full');
  });

  it('falls back to "?" for an empty name', () => {
    const html = renderToStaticMarkup(<Avatar name="" />);
    expect(html).toContain('?');
  });
});

describe('Avatar — errored state resets across src changes', () => {
  let container: HTMLElement;
  let root: Root;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });
  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  // Regression: a boolean `errored` stayed true across src changes, so a
  // new valid src kept showing initials. Tracking the failed src instead
  // lets a new src re-attempt the image.
  it('re-attempts the image when src changes after a previous error', () => {
    act(() => root.render(<Avatar name="Jane" src="/broken.png" />));
    let img = container.querySelector('img')!;
    expect(img).not.toBeNull();
    // First image fails → initials shown.
    act(() => img.dispatchEvent(new Event('error')));
    expect(container.querySelector('img')).toBeNull();
    expect(container.textContent).toContain('JA');
    // A new, different src must render an <img> again (not stay on initials).
    act(() => root.render(<Avatar name="Jane" src="/fixed.png" />));
    img = container.querySelector('img')!;
    expect(img).not.toBeNull();
    expect(img.getAttribute('src')).toBe('/fixed.png');
  });
});
