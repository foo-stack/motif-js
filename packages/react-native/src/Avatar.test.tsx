import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react';
import type { Theme } from '@usemotif/core';
import { Avatar } from './Avatar.js';
import { ThemeProvider } from './Theme.js';

const theme: Theme = {
  name: 'test',
  tokens: {
    colors: { surface: { muted: '#f0f0f0' } },
    fontWeights: { semibold: 600 },
  },
};

let container: HTMLElement;
let root: Root;

function render(node: React.ReactNode): void {
  act(() =>
    root.render(
      <ThemeProvider themes={[theme]} active="test">
        {node}
      </ThemeProvider>,
    ),
  );
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

describe('Native Avatar', () => {
  it('renders initials when no src is provided', () => {
    render(<Avatar name="Jane Doe" />);
    expect(container.querySelector('[data-motif-host="Image"]')).toBeNull();
    expect(container.textContent).toContain('JD');
  });

  it('renders an Image host when src is set', () => {
    render(<Avatar name="Jane" src="/x.png" />);
    const img = container.querySelector('[data-motif-host="Image"]');
    expect(img).not.toBeNull();
    expect(img?.getAttribute('accessibilityLabel')).toBe('Jane');
  });

  // #160 — a one-way `errored` boolean stayed true across src changes, so a
  // new valid src kept showing initials. Tracking the failed src lets a new
  // src re-attempt the image.
  it('re-attempts the image when src changes after a previous error', () => {
    render(<Avatar name="Jane" src="/broken.png" />);
    const img = container.querySelector('[data-motif-host="Image"]')!;
    expect(img).not.toBeNull();

    // First image fails → initials shown.
    act(() => {
      img.dispatchEvent(new Event('error'));
    });
    expect(container.querySelector('[data-motif-host="Image"]')).toBeNull();
    expect(container.textContent).toContain('JA');

    // A new, different src must render an Image again (not stay on initials).
    render(<Avatar name="Jane" src="/fixed.png" />);
    const next = container.querySelector('[data-motif-host="Image"]');
    expect(next).not.toBeNull();
    expect(next?.getAttribute('accessibilityLabel')).toBe('Jane');
  });
});
