import type { Theme } from '@motif-js/core';
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
});
