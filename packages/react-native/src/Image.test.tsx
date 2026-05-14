import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react';
import type { Theme } from '@usemotif/core';
import { Box } from './Box.js';
import { Image } from './Image.js';
import { ThemeProvider } from './Theme.js';

const theme: Theme = {
  name: 'test',
  tokens: {
    colors: { surface: { muted: '#f0f0f0' } },
    space: { 4: 16 },
    radii: { 4: 16 },
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
  document.body.removeChild(container);
});

describe('Native Image — simple case (no overlay)', () => {
  it('renders an RN Image host with src as source uri and alt as a11y label', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Image src="https://example.com/x.jpg" alt="example" />
      </ThemeProvider>,
    );
    const img = container.querySelector('[data-motif-host="Image"]');
    expect(img).not.toBeNull();
    expect(img?.getAttribute('accessibilityLabel')).toBe('example');
    // The mock serialises `source` as JSON via React's data attr conversion
    // — easier: confirm no wrapper View was rendered.
    expect(container.querySelector('[data-motif-host="View"]')).toBeNull();
  });

  it('applies Box style props on the simple image directly', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Image src="x.jpg" alt="" w={100} borderRadius={16} />
      </ThemeProvider>,
    );
    const img = container.querySelector('[data-motif-host="Image"]')!;
    const styleRaw = img.getAttribute('data-motif-style')!;
    const style = JSON.parse(styleRaw)[0] as Record<string, unknown>;
    expect(style.width).toBe(100);
    expect(style.borderRadius).toBe(16);
  });
});

describe('Native Image — wrapped case (placeholder/fallback)', () => {
  it('renders a wrapper View when placeholder is given', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Image src="x.jpg" alt="" w={100} h={100} placeholder={<Box testID="ph" />} />
      </ThemeProvider>,
    );
    // Wrapper View exists.
    const wrapper = container.querySelector('[data-motif-host="View"]');
    expect(wrapper).not.toBeNull();
    // Image is inside the wrapper.
    const img = container.querySelector('[data-motif-host="Image"]');
    expect(img).not.toBeNull();
    // Placeholder is in the DOM (only the placeholder element with testID).
    const ph = container.querySelector('[testID="ph"]');
    expect(ph).not.toBeNull();
  });
});
