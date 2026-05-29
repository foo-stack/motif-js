import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';
import { createElement, type ReactElement } from 'react';
import type { Theme } from '@usemotif/core';
import { defaultTestTheme } from '@usemotif/test-utils';
import { IconButton } from './IconButton.js';
import { ThemeProvider } from './Theme.js';
import { SSRStyleCollector, _resetStyleCacheForTesting } from './style-cache.js';

function renderWithTheme(theme: Theme, node: ReactElement): string {
  const collector = new SSRStyleCollector();
  const html = collector.collect(() =>
    renderToStaticMarkup(
      createElement(ThemeProvider, { themes: [theme], active: theme.name }, node),
    ),
  );
  return collector.getStyleTag() + html;
}

/** `defaultTestTheme` defines no `gray` scale; this adds one. */
const grayTheme: Theme = {
  name: 'gray',
  tokens: {
    ...defaultTestTheme.tokens,
    colors: {
      ...defaultTestTheme.tokens.colors,
      gray: { 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 900: '#111827' },
    },
  },
};

describe('IconButton (web)', () => {
  it('renders a button with required aria-label', () => {
    const html = renderToStaticMarkup(
      <IconButton aria-label="Add">
        <span>+</span>
      </IconButton>,
    );
    expect(html).toMatch(/<button/);
    expect(html).toMatch(/aria-label="Add"/);
  });

  it('renders the icon prop when provided', () => {
    const html = renderToStaticMarkup(
      <IconButton aria-label="Add" icon={<span data-icon="plus">+</span>} />,
    );
    expect(html).toContain('data-icon="plus"');
  });

  it('size=md sets a 36px square', () => {
    const html = renderToStaticMarkup(
      <IconButton aria-label="x">
        <span>x</span>
      </IconButton>,
    );
    expect(html).toContain('width:36px');
    expect(html).toContain('height:36px');
  });

  it('disabled emits the native disabled attr', () => {
    const html = renderToStaticMarkup(
      <IconButton aria-label="x" disabled>
        <span>x</span>
      </IconButton>,
    );
    expect(html).toMatch(/disabled/);
  });

  it('marks the inner icon as aria-hidden', () => {
    const html = renderToStaticMarkup(
      <IconButton aria-label="x">
        <span>X</span>
      </IconButton>,
    );
    expect(html).toMatch(/aria-hidden="true"/);
  });
});

// Regression (#111): parity with Button — neutral/ghost reference
// $colors.gray.*, which a hand-authored theme need not define. Without a
// fallback the IconButton emitted unresolved var(--colors-gray-*).
describe('IconButton — neutral intent without a gray scale', () => {
  afterEach(() => {
    _resetStyleCacheForTesting();
  });

  it('falls back to a literal grey when the theme defines no gray scale', () => {
    const html = renderWithTheme(
      defaultTestTheme,
      <IconButton aria-label="x" intent="neutral">
        <span>x</span>
      </IconButton>,
    );
    expect(html).toMatch(/background-color:\s*#e5e7eb/);
    expect(html).not.toContain('var(--colors-gray-200)');
    expect(html).not.toContain('var(--colors-gray-900)');
  });

  it('ghost variant does not emit an unresolved gray hover tint', () => {
    const html = renderWithTheme(
      defaultTestTheme,
      <IconButton aria-label="x" variant="ghost">
        <span>x</span>
      </IconButton>,
    );
    expect(html).not.toContain('var(--colors-gray-100)');
  });

  it('still prefers the theme gray scale when one is defined', () => {
    const html = renderWithTheme(
      grayTheme,
      <IconButton aria-label="x" intent="neutral">
        <span>x</span>
      </IconButton>,
    );
    expect(html).toMatch(/var\(--colors-gray-200\)/);
  });
});
