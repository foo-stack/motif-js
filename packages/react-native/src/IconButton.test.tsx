import type { Theme } from '@motif-js/core';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { IconButton } from './IconButton.js';
import { ThemeProvider } from './Theme.js';

const theme: Theme = {
  name: 'test',
  tokens: {
    colors: {
      action: { primary: { bg: '#3b82f6', fg: '#ffffff', hover: '#2563eb' } },
      gray: { 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 900: '#111' },
    },
    fontSizes: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20 },
    radii: { sm: 4, md: 8, lg: 12 },
  },
};

let container: HTMLElement;
let root: Root;
function render(node: React.ReactNode): void {
  act(() => root.render(node));
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

describe('IconButton (native)', () => {
  it('renders a Pressable', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <IconButton accessibilityLabel="Add">
          <span>+</span>
        </IconButton>
      </ThemeProvider>,
    );
    expect(container.querySelector('[data-motif-host="Pressable"]')).not.toBeNull();
  });

  it('size md sets 36×36', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <IconButton accessibilityLabel="x">
          <span>x</span>
        </IconButton>
      </ThemeProvider>,
    );
    const el = container.querySelector('[data-motif-host="Pressable"]')!;
    const raw = el.getAttribute('data-motif-style')!;
    const parsed = JSON.parse(raw) as unknown;
    const merged = Array.isArray(parsed)
      ? parsed.reduce<Record<string, unknown>>((acc, x) => Object.assign(acc, x ?? {}), {})
      : (parsed as Record<string, unknown>);
    expect(merged.width).toBe(36);
    expect(merged.height).toBe(36);
  });
});
