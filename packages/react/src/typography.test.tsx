import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Blockquote, Code, Heading, Kbd, Paragraph } from './typography.js';

describe('typography (web)', () => {
  it('Heading defaults to h2', () => {
    const html = renderToStaticMarkup(<Heading>Hi</Heading>);
    expect(html).toMatch(/^<h2/);
  });

  it('Heading level=1 renders h1 with the largest font-size token', () => {
    const html = renderToStaticMarkup(<Heading level={1}>Hi</Heading>);
    expect(html).toMatch(/^<h1/);
    expect(html).toMatch(/font-size:.*3xl/);
  });

  it('Heading level=6 maps to h6 with the smallest size', () => {
    const html = renderToStaticMarkup(<Heading level={6}>Hi</Heading>);
    expect(html).toMatch(/^<h6/);
    expect(html).toMatch(/font-size:.*--fontSizes-sm/);
  });

  it('Paragraph renders <p>', () => {
    const html = renderToStaticMarkup(<Paragraph>Hi</Paragraph>);
    expect(html).toMatch(/^<p/);
  });

  it('Code renders <code> with monospace font + tinted bg', () => {
    const html = renderToStaticMarkup(<Code>x</Code>);
    expect(html).toMatch(/<code/);
    expect(html).toMatch(/font-family:.*--fontFamilies-mono/);
    expect(html).toMatch(/background-color/);
  });

  it('Kbd renders <kbd> with bordered look', () => {
    const html = renderToStaticMarkup(<Kbd>⌘K</Kbd>);
    expect(html).toMatch(/<kbd/);
    expect(html).toMatch(/border-color/);
  });

  it('Blockquote renders <blockquote> with a left accent border', () => {
    const html = renderToStaticMarkup(<Blockquote>Be excellent.</Blockquote>);
    expect(html).toMatch(/<blockquote/);
    expect(html).toMatch(/border-left-/);
  });

  it('Blockquote with cite renders the citation in a <cite>', () => {
    const html = renderToStaticMarkup(
      <Blockquote cite="— Bill & Ted">Be excellent to each other.</Blockquote>,
    );
    expect(html).toContain('<cite');
    expect(html).toContain('Bill &amp; Ted');
  });

  // #275 — the docstring's italic opt-out must actually be honourable.
  it('Blockquote is italic by default and accepts a fontStyle:normal opt-out', () => {
    expect(renderToStaticMarkup(<Blockquote>x</Blockquote>)).toMatch(/font-style:\s*italic/);
    const opted = renderToStaticMarkup(<Blockquote style={{ fontStyle: 'normal' }}>x</Blockquote>);
    expect(opted).toMatch(/font-style:\s*normal/);
    expect(opted).not.toMatch(/font-style:\s*italic/);
  });
});
