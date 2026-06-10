import type { Theme } from '@usemotif/core';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Link } from './Link.js';
import { ThemeProvider } from './Theme.js';

const theme: Theme = {
  name: 'test',
  tokens: { colors: { action: { primary: { bg: '#3b82f6' } } } },
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

describe('Link (native)', () => {
  it('renders a Pressable with accessibilityRole=link', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Link href="https://x">Go</Link>
      </ThemeProvider>,
    );
    const el = container.querySelector('[data-motif-host="Pressable"]')!;
    expect(el.getAttribute('accessibilityrole')).toBe('link');
  });

  it('contains a Text child for the label', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Link href="https://x">Go</Link>
      </ThemeProvider>,
    );
    expect(container.querySelector('[data-motif-host="Text"]')).not.toBeNull();
  });

  // #220 — the link color must resolve onto the label Text (RN Views don't
  // cascade color and have no `inherit` keyword). Previously the color went
  // to the Pressable and the Text rendered `color="inherit"` → black label.
  it('applies the resolved link color to the label Text, not the Pressable', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Link href="https://x">Go</Link>
      </ThemeProvider>,
    );
    const text = container.querySelector('[data-motif-host="Text"]')!;
    const textStyle = (JSON.parse(text.getAttribute('data-motif-style')!) as unknown[]).reduce<
      Record<string, unknown>
    >((acc, x) => Object.assign(acc, x ?? {}), {});
    expect(textStyle.color).toBe('#3b82f6');
    // No invalid `inherit` color anywhere.
    expect(JSON.stringify(textStyle)).not.toContain('inherit');

    const pressable = container.querySelector('[data-motif-host="Pressable"]')!;
    const pressStyle = (
      JSON.parse(pressable.getAttribute('data-motif-style')!) as unknown[]
    ).reduce<Record<string, unknown>>((acc, x) => Object.assign(acc, x ?? {}), {});
    expect(pressStyle.color).toBeUndefined();
  });

  it('honours an explicit color prop on the label Text', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Link href="https://x" color="#ff0000">
          Go
        </Link>
      </ThemeProvider>,
    );
    const text = container.querySelector('[data-motif-host="Text"]')!;
    const textStyle = (JSON.parse(text.getAttribute('data-motif-style')!) as unknown[]).reduce<
      Record<string, unknown>
    >((acc, x) => Object.assign(acc, x ?? {}), {});
    expect(textStyle.color).toBe('#ff0000');
  });
});
