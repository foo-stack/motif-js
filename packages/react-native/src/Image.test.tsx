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

  // #159 — status is reset to 'loading' when src changes. Without the
  // effect, a previously-loaded image keeps the old frame (and a failed
  // one keeps the fallback) for the new src.
  it('resets to the placeholder overlay when src changes after load', () => {
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Image src="a.jpg" alt="" w={100} h={100} placeholder={<Box testID="ph" />} />
      </ThemeProvider>,
    );
    // Image finishes loading → placeholder overlay clears.
    const img = container.querySelector('[data-motif-host="Image"]')!;
    act(() => {
      img.dispatchEvent(new Event('load'));
    });
    expect(container.querySelector('[testID="ph"]')).toBeNull();

    // New src → status resets to 'loading' → placeholder shows again.
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Image src="b.jpg" alt="" w={100} h={100} placeholder={<Box testID="ph" />} />
      </ThemeProvider>,
    );
    expect(container.querySelector('[testID="ph"]')).not.toBeNull();
  });

  // #244 — the wrapped path used to discard `style` and route the
  // consumer's onLoad/onError onto the wrapper View (where they never
  // fire). Style now lands on the wrapper; handlers compose onto the image.
  it('applies the user style to the wrapper and composes onError onto the inner image', () => {
    let errored = false;
    render(
      <ThemeProvider themes={[theme]} active="test">
        <Image
          src="x.jpg"
          alt=""
          w={100}
          h={100}
          style={{ borderWidth: 2 }}
          onError={() => {
            errored = true;
          }}
          placeholder={<Box testID="ph" />}
        />
      </ThemeProvider>,
    );
    const wrapper = container.querySelector('[data-motif-host="View"]')!;
    const wrapperStyle = (
      JSON.parse(wrapper.getAttribute('data-motif-style')!) as unknown[]
    ).reduce<Record<string, unknown>>((acc, x) => Object.assign(acc, x ?? {}), {});
    expect(wrapperStyle.borderWidth).toBe(2);

    const img = container.querySelector('[data-motif-host="Image"]')!;
    act(() => {
      img.dispatchEvent(new Event('error'));
    });
    expect(errored).toBe(true);
    // The internal status machine still advanced (fallback → placeholder).
    expect(container.querySelector('[testID="ph"]')).not.toBeNull();
  });
});
