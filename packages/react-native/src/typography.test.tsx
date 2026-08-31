import type { Theme } from '@usemotif/core';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Blockquote, Code, Heading, Kbd, Paragraph } from './typography.js';
import { ThemeProvider } from './Theme.js';

const theme: Theme = {
  name: 'test',
  tokens: {
    fontSizes: { sm: 14, md: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30 },
    fontWeights: { bold: 700 },
    fontFamilies: { mono: 'monospace' },
    colors: {
      surface: { muted: '#eee', raised: '#fff' },
      text: { default: '#111', muted: '#888' },
      border: { default: '#ccc' },
    },
    radii: { sm: 4 },
    space: { 1: 4, 1.5: 6, 2: 8, 4: 16, px: 1 },
    borderWidths: { hairline: 1 },
  },
};

let container: HTMLElement;
let root: Root;
function render(node: React.ReactNode): void {
  act(() => root.render(node));
}
function styleOnFirstText(): Record<string, unknown> {
  const el = container.querySelector('[data-motif-host="Text"]');
  if (el === null) throw new Error('No Text host');
  const raw = el.getAttribute('data-motif-style');
  if (raw === null) return {};
  const parsed = JSON.parse(raw) as unknown;
  if (Array.isArray(parsed)) {
    return parsed.reduce<Record<string, unknown>>((acc, x) => Object.assign(acc, x ?? {}), {});
  }
  return parsed as Record<string, unknown>;
}
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe('typography (native)', () => {
  it('Heading defaults to level 2 → 2xl size', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Heading>Hi</Heading>
      </ThemeProvider>,
    );
    expect(styleOnFirstText().fontSize).toBe(24);
  });

  it('Heading level=1 → 3xl', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Heading level={1}>Hi</Heading>
      </ThemeProvider>,
    );
    expect(styleOnFirstText().fontSize).toBe(30);
  });

  it('Heading sets accessibilityRole=header', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Heading>Hi</Heading>
      </ThemeProvider>,
    );
    const el = container.querySelector('[data-motif-host="Text"]')!;
    expect(el.getAttribute('accessibilityrole')).toBe('header');
  });

  it('Paragraph applies default md font-size + line-height resolved to px', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Paragraph>Hi</Paragraph>
      </ThemeProvider>,
    );
    const s = styleOnFirstText();
    expect(s.fontSize).toBe(16);
    // 1.6 ratio × 16px font-size - RN lineHeight is absolute DIPs.
    expect(s.lineHeight).toBe(25.6);
  });

  it('Heading resolves its unitless line-height against its font-size', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Heading level={4}>Hi</Heading>
      </ThemeProvider>,
    );
    const s = styleOnFirstText();
    // level 4 → $lg (18) in the test theme; 1.2 ratio × 18.
    expect(s.fontSize).toBe(18);
    expect(s.lineHeight).toBeCloseTo(21.6);
  });

  it('absolute (>= 4) line-height passes through unchanged', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Paragraph lineHeight={26}>Hi</Paragraph>
      </ThemeProvider>,
    );
    expect(styleOnFirstText().lineHeight).toBe(26);
  });

  it('Code applies monospace + bg tint', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Code>x</Code>
      </ThemeProvider>,
    );
    const s = styleOnFirstText();
    expect(s.fontFamily).toBe('monospace');
    expect(s.backgroundColor).toBe('#eee');
  });

  it('Kbd has a border', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Kbd>⌘K</Kbd>
      </ThemeProvider>,
    );
    expect(styleOnFirstText().borderColor).toBe('#ccc');
  });

  it('Blockquote renders with a left border', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Blockquote>x</Blockquote>
      </ThemeProvider>,
    );
    const view = container.querySelector('[data-motif-host="View"]');
    expect(view).not.toBeNull();
    const raw = view!.getAttribute('data-motif-style');
    if (raw !== null) {
      const parsed = JSON.parse(raw) as unknown;
      const merged = Array.isArray(parsed)
        ? parsed.reduce<Record<string, unknown>>((acc, x) => Object.assign(acc, x ?? {}), {})
        : (parsed as Record<string, unknown>);
      expect(merged.borderLeftColor).toBe('#ccc');
    }
  });
});
