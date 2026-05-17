import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Box } from './Box.js';
import { Direction } from './Direction.js';
import { ThemeProvider } from './Theme.js';
import { useDirection } from './direction-context.js';
import { __setIsRTL } from './__test-setup__/react-native-mock.js';

let container: HTMLElement;
let root: Root;

function render(node: ReactNode): void {
  act(() => root.render(node));
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

/** Resolved style of the first rendered View host. */
function firstViewStyle(): Record<string, unknown> {
  const el = container.querySelector('[data-motif-host="View"]');
  if (el === null) throw new Error('No View host');
  const raw = el.getAttribute('data-motif-style');
  if (raw === null) return {};
  const parsed = JSON.parse(raw) as unknown;
  return Array.isArray(parsed)
    ? parsed.reduce<Record<string, unknown>>((acc, x) => Object.assign(acc, x ?? {}), {})
    : (parsed as Record<string, unknown>);
}

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  __setIsRTL(false);
});

describe('Direction (native)', () => {
  it('useDirection defaults to ltr with no provider', () => {
    const { result, Probe } = makeProbe();
    render(<Probe />);
    expect(result.current).toBe('ltr');
  });

  it('useDirection falls back to I18nManager.isRTL with no provider', () => {
    __setIsRTL(true);
    const { result, Probe } = makeProbe();
    render(<Probe />);
    expect(result.current).toBe('rtl');
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

  it('a Box under <Direction> gets the Yoga direction style injected', () => {
    render(
      <ThemeProvider themes={[{ name: 't', tokens: {} }]} active="t">
        <Direction value="rtl">
          <Box />
        </Direction>
      </ThemeProvider>,
    );
    expect(firstViewStyle().direction).toBe('rtl');
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
