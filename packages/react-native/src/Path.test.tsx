/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { createMotionValue } from '@usemotif/core';
import { Path } from './Path.js';
import { SVG_PRIMITIVES } from './Svg.js';

let container: HTMLElement;
let root: Root;

function render(node: ReactNode): void {
  act(() => {
    root.render(node);
  });
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

describe('native Path — peer missing', () => {
  it('SVG_PRIMITIVES is null in the test env', () => {
    // Sanity-check the test env so the assertions below make sense.
    expect(SVG_PRIMITIVES).toBeNull();
  });

  it('renders to nothing when the peer is not installed', () => {
    render(<Path d="M0 0 L10 10" pathLength={0.5} />);
    // Path bails to null; nothing lands in the container.
    expect(container.children.length).toBe(0);
  });

  it('still subscribes to a MotionValue without throwing', () => {
    // The hook runs even when the render output is null, so MV
    // subscription path should be safe. The unsubscribe on unmount is
    // also exercised via afterEach's root.unmount.
    const mv = createMotionValue(0.25);
    const log = vi.fn();
    const unsub = mv.on('change', log);
    render(<Path d="M0 0" pathLength={mv} />);
    act(() => {
      mv.set(0.75);
    });
    expect(log).toHaveBeenCalledWith(0.75);
    unsub();
  });
});
