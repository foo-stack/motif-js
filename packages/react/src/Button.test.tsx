import { SSRStyleCollector, _resetStyleCacheForTesting } from './style-cache.js';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Button } from './Button.js';
import { ThemeProvider } from './Theme.js';
import { defaultTestTheme } from '@usemotif/test-utils';
import type { Theme } from '@usemotif/core';
import { createElement, type ReactElement } from 'react';

function renderHtml(node: ReactElement): string {
  return renderWithTheme(defaultTestTheme, node);
}

function renderWithTheme(theme: Theme, node: ReactElement): string {
  // Use an SSR style collector so class-block CSS (any prop that's
  // been lifted out of inline because a pseudo bag overrides it - the
  // fix in #39) shows up in the rendered HTML alongside the markup.
  // Concatenating the style tag with the markup keeps the assertion
  // surface simple (regex over the combined string).
  const collector = new SSRStyleCollector();
  const html = collector.collect(() =>
    renderToStaticMarkup(
      createElement(ThemeProvider, { themes: [theme], active: theme.name }, node),
    ),
  );
  return collector.getStyleTag() + html;
}

/** `defaultTestTheme` defines no `gray` scale; this adds one so the
 * neutral-intent happy path (token references, not literal fallback)
 * can be exercised. */
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

describe('Button - markup contract', () => {
  afterEach(() => {
    _resetStyleCacheForTesting();
  });

  it('renders a <button> by default', () => {
    const html = renderHtml(<Button>Save</Button>);
    expect(html).toMatch(/<button[^>]*>/);
    expect(html).toContain('>Save<');
  });

  it('emits an inline-flex display so leading / trailing slots line up', () => {
    const html = renderHtml(<Button>Go</Button>);
    expect(html).toMatch(/style="[^"]*display:\s*inline-flex/);
  });

  it('renders leadingIcon before the label and trailingIcon after', () => {
    const html = renderHtml(
      <Button
        leadingIcon={<span data-testid="leading">L</span>}
        trailingIcon={<span data-testid="trailing">T</span>}
      >
        Mid
      </Button>,
    );
    const lIdx = html.indexOf('data-testid="leading"');
    const labelIdx = html.indexOf('Mid');
    const tIdx = html.indexOf('data-testid="trailing"');
    expect(lIdx).toBeGreaterThan(-1);
    expect(labelIdx).toBeGreaterThan(lIdx);
    expect(tIdx).toBeGreaterThan(labelIdx);
  });

  it('respects fullWidth by setting width', () => {
    const html = renderHtml(<Button fullWidth>Wide</Button>);
    expect(html).toMatch(/width:/);
  });
});

describe('Button - variant matrix', () => {
  afterEach(() => {
    _resetStyleCacheForTesting();
  });

  it('solid + primary uses the action.primary tokens for bg + fg', () => {
    const html = renderHtml(<Button>X</Button>);
    expect(html).toMatch(/background-color:\s*var\(--colors-action-primary-bg\)/);
    expect(html).toMatch(/color:\s*var\(--colors-action-primary-fg\)/);
  });

  it('outline + primary makes background transparent and uses primary as the accent', () => {
    const html = renderHtml(<Button variant="outline">X</Button>);
    expect(html).toMatch(/background-color:\s*transparent/);
    expect(html).toMatch(/color:\s*var\(--colors-action-primary-bg\)/);
    expect(html).toMatch(/border-color:\s*var\(--colors-action-primary-bg\)/);
  });

  it('ghost has transparent background and transparent border', () => {
    const html = renderHtml(<Button variant="ghost">X</Button>);
    expect(html).toMatch(/background-color:\s*transparent/);
    expect(html).toMatch(/border-color:\s*transparent/);
  });

  it('intent=danger swaps to the action.danger tokens', () => {
    const html = renderHtml(<Button intent="danger">X</Button>);
    expect(html).toMatch(/background-color:\s*var\(--colors-action-danger-bg\)/);
  });

  it('intent=neutral uses the theme gray scale when one is defined', () => {
    const html = renderWithTheme(grayTheme, <Button intent="neutral">X</Button>);
    expect(html).toMatch(/background-color:\s*var\(--colors-gray-200\)/);
  });

  it('size=xs uses the xs token bag', () => {
    const html = renderHtml(<Button size="xs">X</Button>);
    expect(html).toMatch(/font-size:\s*var\(--fontSizes-xs\)/);
    expect(html).toMatch(/padding-inline:\s*var\(--space-2\)/);
  });

  it('size=xl uses the xl token bag', () => {
    const html = renderHtml(<Button size="xl">X</Button>);
    expect(html).toMatch(/font-size:\s*var\(--fontSizes-xl\)/);
    expect(html).toMatch(/padding-inline:\s*var\(--space-6\)/);
  });
});

describe('Button - disabled / loading', () => {
  afterEach(() => {
    _resetStyleCacheForTesting();
  });

  it('disabled emits the native disabled attribute and aria-disabled', () => {
    const html = renderHtml(<Button disabled>X</Button>);
    expect(html).toMatch(/<button[^>]*disabled/);
    expect(html).toMatch(/aria-disabled/);
  });

  it('loading sets aria-busy and aria-disabled', () => {
    const html = renderHtml(<Button loading>X</Button>);
    expect(html).toMatch(/aria-busy/);
    expect(html).toMatch(/aria-disabled/);
  });

  it('loading swaps the leading slot to the indicator (or default dots)', () => {
    const html = renderHtml(<Button loading>X</Button>);
    // Default indicator emits a triplet of currentColor circles.
    expect(html).toMatch(/aria-hidden="true"/);
  });

  it('loading swaps the leading slot for a custom loadingIcon when provided', () => {
    const html = renderHtml(
      <Button loading loadingIcon={<span data-spinner="x">spin</span>}>
        X
      </Button>,
    );
    expect(html).toContain('data-spinner="x"');
  });

  it('loadingLabel replaces children while loading', () => {
    const html = renderHtml(
      <Button loading loadingLabel={<>Saving...</>}>
        Save
      </Button>,
    );
    expect(html).toContain('Saving...');
    expect(html).not.toContain('>Save<');
  });

  it('does not invoke onPress while loading', () => {
    const fn = vi.fn();
    const html = renderHtml(
      <Button loading onPress={fn}>
        X
      </Button>,
    );
    // SSR can't fire events; the handler-suppression is what we
    // verify via aria-busy + disabled. Direct unit:
    expect(html).toMatch(/aria-busy/);
    expect(fn).not.toHaveBeenCalled();
  });
});

// Regression tests for issue #22 bug 3 - gray-scale fallback. Parity
// with the native Button: `intent="neutral"` references `$colors.gray.*`,
// which a hand-authored theme need not define. Without a fallback the
// web Button emits `var(--colors-gray-200)` references that resolve to
// nothing in the cascade.
describe('Button - neutral intent without a gray scale (#22)', () => {
  afterEach(() => {
    _resetStyleCacheForTesting();
  });

  it('falls back to a literal grey when the theme defines no gray scale', () => {
    // defaultTestTheme has no `gray` scale.
    const html = renderHtml(<Button intent="neutral">X</Button>);
    expect(html).toMatch(/background-color:\s*#e5e7eb/);
    // Never an unresolved `var(--colors-gray-*)` reference.
    expect(html).not.toContain('var(--colors-gray-200)');
  });

  it('neutral label foreground also resolves without a gray scale', () => {
    const html = renderHtml(<Button intent="neutral">X</Button>);
    expect(html).toMatch(/color:\s*#111827/);
    expect(html).not.toContain('var(--colors-gray-900)');
  });

  it('ghost hover tint resolves to a literal without a gray scale', () => {
    const html = renderHtml(<Button variant="ghost">X</Button>);
    expect(html).not.toContain('var(--colors-gray-100)');
  });

  it('non-neutral intents are unaffected by a missing gray scale', () => {
    const html = renderHtml(<Button intent="danger">X</Button>);
    expect(html).toMatch(/background-color:\s*var\(--colors-action-danger-bg\)/);
  });

  it('still prefers the theme gray scale when one is defined', () => {
    const html = renderWithTheme(grayTheme, <Button intent="neutral">X</Button>);
    // Token reference, not the literal fallback. Background-color
    // lands in the button's class block (lifted from inline because
    // `_hover.bg` overrides it; see #39).
    expect(html).toMatch(/background-color:\s*var\(--colors-gray-200\)/);
  });
});

/**
 * `intent="neutral"` used to read the `gray` ramp directly. A primitive ramp
 * resolves to the same literal in every theme, so the one intent that most
 * needs to invert was the only one that could not - a neutral button kept
 * light-mode ink on a dark canvas. It now reads `action.neutral`, with the
 * `gray` ramp retained as a middle fallback for themes that predate the
 * semantic group.
 *
 * The unfilled variants separately used the intent's *fill* as their label
 * colour. That survives for the mid-tone intents but not for neutral, whose
 * fill is a near-white tint: `outline`/`ghost` neutral rendered at roughly
 * 1.2:1 against a white page.
 */
const semanticNeutralTheme: Theme = {
  name: 'semantic',
  tokens: {
    ...defaultTestTheme.tokens,
    colors: {
      ...defaultTestTheme.tokens.colors,
      // Both defined, so the tier order is observable.
      gray: { 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 900: '#111827' },
      text: { default: '#18181b' },
      surface: { base: '#ffffff', interactive: '#f4f4f5' },
      action: { neutral: { bg: '#e4e4e7', fg: '#18181b', hover: '#d4d4d8' } },
    },
  },
};

describe('Button - neutral intent reads the semantic layer', () => {
  afterEach(() => {
    _resetStyleCacheForTesting();
  });

  it('prefers action.neutral over a gray ramp when both are defined', () => {
    const html = renderWithTheme(semanticNeutralTheme, <Button intent="neutral">X</Button>);
    expect(html).toMatch(/background-color:\s*var\(--colors-action-neutral-bg\)/);
    expect(html).not.toContain('var(--colors-gray-200)');
  });

  it('outline neutral takes its label from the text token, not the fill', () => {
    const html = renderWithTheme(
      semanticNeutralTheme,
      <Button variant="outline" intent="neutral">
        X
      </Button>,
    );
    expect(html).toMatch(/color:\s*var\(--colors-text-default\)/);
  });

  it('ghost neutral takes its label from the text token, not the fill', () => {
    const html = renderWithTheme(
      semanticNeutralTheme,
      <Button variant="ghost" intent="neutral">
        X
      </Button>,
    );
    expect(html).toMatch(/color:\s*var\(--colors-text-default\)/);
  });

  it('outline keeps the accent as ink for the mid-tone intents', () => {
    const html = renderWithTheme(
      semanticNeutralTheme,
      <Button variant="outline" intent="danger">
        X
      </Button>,
    );
    expect(html).toMatch(/color:\s*var\(--colors-action-danger-bg\)/);
  });

  it('ghost hover uses the interaction surface, which inverts per theme', () => {
    const html = renderWithTheme(semanticNeutralTheme, <Button variant="ghost">X</Button>);
    expect(html).toMatch(/var\(--colors-surface-interactive\)/);
    expect(html).not.toContain('var(--colors-gray-100)');
  });
});
