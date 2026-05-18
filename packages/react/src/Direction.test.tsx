/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Direction } from './Direction.js';
import { useDirection } from './direction-context.js';

let container: HTMLElement;
let root: Root;

function render(node: ReactNode): void {
  act(() => {
    root.render(node);
  });
}

/** Probe that records the direction `useDirection()` reports. */
function makeProbe(): { result: { current: string | undefined }; Probe: () => null } {
  const result: { current: string | undefined } = { current: undefined };
  function Probe(): null {
    result.current = useDirection();
    return null;
  }
  return { result, Probe };
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

describe('Direction (web)', () => {
  it('useDirection defaults to ltr with no provider', () => {
    const { result, Probe } = makeProbe();
    render(<Probe />);
    expect(result.current).toBe('ltr');
  });

  it('provides the value to useDirection', () => {
    const { result, Probe } = makeProbe();
    render(
      <Direction value="rtl">
        <Probe />
      </Direction>,
    );
    expect(result.current).toBe('rtl');
  });

  it('renders a dir-carrying boundary that adds no layout box', () => {
    render(<Direction value="rtl">content</Direction>);
    const boundary = container.querySelector('[dir="rtl"]');
    expect(boundary).not.toBeNull();
    expect((boundary as HTMLElement).style.display).toBe('contents');
  });

  it('nested providers override the direction for an inner subtree', () => {
    const outer = makeProbe();
    const inner = makeProbe();
    render(
      <Direction value="rtl">
        <outer.Probe />
        <Direction value="ltr">
          <inner.Probe />
        </Direction>
      </Direction>,
    );
    expect(outer.result.current).toBe('rtl');
    expect(inner.result.current).toBe('ltr');
  });
});
