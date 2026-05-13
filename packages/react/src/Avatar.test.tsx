import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
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
