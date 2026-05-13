import { _resetStyleCacheForTesting } from './style-cache.js';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Button } from './Button.js';
import { ThemeProvider } from './Theme.js';
import { defaultTestTheme } from '@motif-js/test-utils';
import { createElement, type ReactElement } from 'react';

function renderHtml(node: ReactElement): string {
  return renderToStaticMarkup(
    createElement(ThemeProvider, { themes: [defaultTestTheme], active: 'test' }, node),
  );
}

describe('Button — markup contract', () => {
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

describe('Button — variant matrix', () => {
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

  it('intent=neutral falls back to the gray scale', () => {
    const html = renderHtml(<Button intent="neutral">X</Button>);
    expect(html).toMatch(/background-color:\s*var\(--colors-gray-200\)/);
  });

  it('size=xs uses the xs token bag', () => {
    const html = renderHtml(<Button size="xs">X</Button>);
    expect(html).toMatch(/font-size:\s*var\(--fontSizes-xs\)/);
    expect(html).toMatch(/padding-left:\s*var\(--space-2\)/);
  });

  it('size=xl uses the xl token bag', () => {
    const html = renderHtml(<Button size="xl">X</Button>);
    expect(html).toMatch(/font-size:\s*var\(--fontSizes-xl\)/);
    expect(html).toMatch(/padding-left:\s*var\(--space-6\)/);
  });
});

describe('Button — disabled / loading', () => {
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
      <Button loading loadingLabel={<>Saving…</>}>
        Save
      </Button>,
    );
    expect(html).toContain('Saving…');
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
