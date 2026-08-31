import type { Theme } from '@usemotif/core';
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

  // #266 - parity with the web semantic <button>.
  it('announces as a button (accessibilityRole=button)', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <IconButton accessibilityLabel="Add">
          <span>+</span>
        </IconButton>
      </ThemeProvider>,
    );
    const el = container.querySelector('[data-motif-host="Pressable"]')!;
    expect(el.getAttribute('accessibilityrole')).toBe('button');
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

  // Regression: the default loading dots used bg="currentColor", invisible
  // on RN. They must use the resolved icon foreground.
  it('loading dots use the resolved foreground, never currentColor', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <IconButton loading accessibilityLabel="busy" />
      </ThemeProvider>,
    );
    const backgrounds = Array.from(container.querySelectorAll('[data-motif-host="View"]'))
      .map((el) => {
        const raw = el.getAttribute('data-motif-style');
        if (raw === null) return undefined;
        const parsed = JSON.parse(raw) as unknown;
        const merged = Array.isArray(parsed)
          ? parsed.reduce<Record<string, unknown>>((acc, x) => Object.assign(acc, x ?? {}), {})
          : (parsed as Record<string, unknown>);
        return merged.backgroundColor;
      })
      .filter((bg) => bg !== undefined);
    expect(backgrounds).not.toContain('currentColor');
    expect(backgrounds).toContain('#ffffff'); // solid primary fg
  });
});

// #163 - parity with web IconButton/Button: neutral/ghost reference
// $colors.gray.*, which a hand-authored theme need not define. Without a
// fallback the native IconButton emitted unresolved (dropped) gray tokens
// and rendered colourless.
describe('IconButton (native) — neutral without a gray scale', () => {
  const noGray: Theme = {
    name: 'nogray',
    tokens: {
      colors: { action: { primary: { bg: '#3b82f6', fg: '#ffffff', hover: '#2563eb' } } },
      fontSizes: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20 },
      radii: { sm: 4, md: 8, lg: 12 },
    },
  };
  function mergedStyle(el: Element): Record<string, unknown> {
    const parsed = JSON.parse(el.getAttribute('data-motif-style')!) as unknown;
    return Array.isArray(parsed)
      ? parsed.reduce<Record<string, unknown>>((acc, x) => Object.assign(acc, x ?? {}), {})
      : (parsed as Record<string, unknown>);
  }

  it('falls back to a literal grey for neutral solid when no gray scale exists', () => {
    render(
      <ThemeProvider themes={[noGray]} active="nogray">
        <IconButton accessibilityLabel="x" intent="neutral">
          <span>x</span>
        </IconButton>
      </ThemeProvider>,
    );
    const merged = mergedStyle(container.querySelector('[data-motif-host="Pressable"]')!);
    expect(merged.backgroundColor).toBe('#e5e7eb');
    expect(merged.color).toBe('#111827');
  });

  it('still uses theme gray tokens when the scale is present', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <IconButton accessibilityLabel="x" intent="neutral">
          <span>x</span>
        </IconButton>
      </ThemeProvider>,
    );
    const merged = mergedStyle(container.querySelector('[data-motif-host="Pressable"]')!);
    expect(merged.backgroundColor).toBe('#e5e7eb'); // theme gray.200
  });
});
