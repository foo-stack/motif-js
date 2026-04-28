import type { Theme } from '@motif-js/core';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Button } from './Button.js';
import { ThemeProvider } from './Theme.js';

const theme: Theme = {
  name: 'test',
  tokens: {
    colors: {
      action: {
        primary: { bg: '#3b82f6', fg: '#ffffff', hover: '#2563eb' },
        danger: { bg: '#ef4444', fg: '#ffffff', hover: '#dc2626' },
        success: { bg: '#16a34a', fg: '#ffffff', hover: '#15803d' },
      },
      gray: { 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 900: '#111827' },
    },
    space: { 1: 4, 1.5: 6, 2: 8, 2.5: 10, 3: 12, 4: 16, 5: 20, 6: 24 },
    fontSizes: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20 },
    radii: { sm: 4, md: 8, lg: 12 },
    fontWeights: { semibold: 600 },
    sizes: { full: '100%' },
  },
};

let container: HTMLElement;
let root: Root;

function render(node: React.ReactNode): void {
  act(() => root.render(node));
}

function pressable(): HTMLElement {
  const el = container.querySelector('[data-motif-host="Pressable"]');
  if (el === null) throw new Error('No Pressable found');
  return el as HTMLElement;
}

function styleOn(el: HTMLElement): Record<string, unknown> {
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

describe('native Button — variant matrix', () => {
  it('solid + primary applies primary bg + fg tokens', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Button>X</Button>
      </ThemeProvider>,
    );
    const style = styleOn(pressable());
    expect(style.backgroundColor).toBe('#3b82f6');
    expect(style.color).toBe('#ffffff');
  });

  it('outline + primary makes background transparent', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Button variant="outline">X</Button>
      </ThemeProvider>,
    );
    const style = styleOn(pressable());
    expect(style.backgroundColor).toBe('transparent');
    expect(style.color).toBe('#3b82f6');
    expect(style.borderColor).toBe('#3b82f6');
  });

  it('ghost has transparent background and transparent border', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Button variant="ghost">X</Button>
      </ThemeProvider>,
    );
    const style = styleOn(pressable());
    expect(style.backgroundColor).toBe('transparent');
    expect(style.borderColor).toBe('transparent');
  });

  it('intent=danger swaps to action.danger.bg', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Button intent="danger">X</Button>
      </ThemeProvider>,
    );
    expect(styleOn(pressable()).backgroundColor).toBe('#ef4444');
  });

  it('intent=neutral falls back to gray.200', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Button intent="neutral">X</Button>
      </ThemeProvider>,
    );
    expect(styleOn(pressable()).backgroundColor).toBe('#e5e7eb');
  });

  it('size=xl uses the xl token bag', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Button size="xl">X</Button>
      </ThemeProvider>,
    );
    const style = styleOn(pressable());
    expect(style.fontSize).toBe(20);
    expect(style.paddingLeft).toBe(24);
  });
});

describe('native Button — disabled / loading / fullWidth', () => {
  it('fullWidth sets width to the $full token (100%)', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Button fullWidth>X</Button>
      </ThemeProvider>,
    );
    expect(styleOn(pressable()).width).toBe('100%');
  });

  it('loading sets accessibilityState.busy', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Button loading>X</Button>
      </ThemeProvider>,
    );
    const stateRaw = pressable().getAttribute('data-motif-prop-accessibilityState');
    if (stateRaw !== null) {
      const parsed = JSON.parse(stateRaw) as { busy?: boolean; disabled?: boolean };
      expect(parsed.busy).toBe(true);
      expect(parsed.disabled).toBe(true);
    }
  });
});
