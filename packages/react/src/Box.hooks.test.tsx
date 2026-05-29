/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Box } from './Box.js';

let container: HTMLElement;
let root: Root;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

function render(node: React.ReactNode): void {
  act(() => {
    root.render(node);
  });
}

describe('Box — stable hook count across renders', () => {
  // Regression: the SSR-collector hook used to run AFTER the compiled-output
  // fast-path early return, so a Box with no style props called 0 hooks and a
  // Box with a style prop called 1. Toggling a style prop at the same element
  // position changed the hook count between renders and crashed React with
  // "Rendered more/fewer hooks than during the previous render".
  it('does not crash when a style prop is toggled on a Box at the same position', () => {
    render(<Box>plain</Box>);
    expect(() => render(<Box p={4}>plain</Box>)).not.toThrow();
    expect(() => render(<Box>plain</Box>)).not.toThrow();
    expect(container.textContent).toBe('plain');
  });

  it('does not crash when a conditional style prop flips between present and absent', () => {
    const view = (on: boolean): React.ReactElement => (
      <Box {...(on ? { bg: '$colors.surface.base' } : {})}>content</Box>
    );
    render(view(false));
    expect(() => render(view(true))).not.toThrow();
    expect(() => render(view(false))).not.toThrow();
  });

  it('does not crash when toggling a pseudo bag on/off', () => {
    render(<Box>x</Box>);
    expect(() => render(<Box _hover={{ opacity: 0.5 }}>x</Box>)).not.toThrow();
    expect(() => render(<Box>x</Box>)).not.toThrow();
  });
});
