/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { useLayoutAnimation } from './use-layout-animation.js';

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

describe('native useLayoutAnimation (stub)', () => {
  it('returns a ref so cross-platform consumer code compiles', () => {
    let captured: { current: unknown } | undefined;
    function Probe(): null {
      captured = useLayoutAnimation();
      return null;
    }
    render(<Probe />);
    expect(captured).toBeDefined();
    expect(captured!.current).toBeNull();
  });
});
