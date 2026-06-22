/** @vitest-environment jsdom */
/**
 * `useMedia` / `useBreakpoint` (web). Verifies the breakpoint-match map, the
 * SSR-default-then-reconcile lifecycle, and the load-bearing behavior: a
 * resize that crosses a breakpoint re-renders, one that stays in-band does
 * not.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, type ReactElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { useBreakpoint, useMedia } from './use-media.js';

let container: HTMLElement;
let root: Root;

function render(node: ReactElement): void {
  act(() => {
    root.render(node);
  });
}

// jsdom doesn't fire resize on its own — set innerWidth and dispatch one,
// mirroring overlay.test.tsx.
function setViewport(width: number): void {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
  act(() => {
    window.dispatchEvent(new Event('resize'));
  });
}

let renderCount = 0;

function MediaProbe(): ReactElement {
  renderCount++;
  const media = useMedia();
  return (
    <div
      data-testid="probe"
      data-sm={String(media.sm)}
      data-md={String(media.md)}
      data-lg={String(media.lg)}
      data-xl={String(media.xl)}
      data-xxl={String(media['2xl'])}
    />
  );
}

function BreakpointProbe(): ReactElement {
  const bp = useBreakpoint();
  return <div data-testid="bp" data-active={bp} />;
}

function probe(): DOMStringMap {
  return (container.querySelector('[data-testid="probe"]') as HTMLElement).dataset;
}

beforeEach(() => {
  renderCount = 0;
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => {
    root.unmount();
  });
  document.body.removeChild(container);
});

describe('useMedia', () => {
  it('reports a min-width match map for a wide viewport', () => {
    setViewport(1280);
    render(<MediaProbe />);
    const d = probe();
    expect(d.sm).toBe('true');
    expect(d.md).toBe('true');
    expect(d.lg).toBe('true');
    expect(d.xl).toBe('true');
    expect(d.xxl).toBe('false'); // 1280 < 1536
  });

  it('reports all-false below the smallest breakpoint', () => {
    setViewport(375);
    render(<MediaProbe />);
    const d = probe();
    expect(d.sm).toBe('false');
    expect(d.md).toBe('false');
    expect(d.lg).toBe('false');
  });

  it('reconciles from the SSR default to the real width on mount', () => {
    // 500 is narrower than the 1024 SSR default; after the mount effect runs,
    // md must read false even though the SSR default (1024) would be true.
    setViewport(500);
    render(<MediaProbe />);
    expect(probe().md).toBe('false');
  });

  it('re-renders when a resize crosses a breakpoint, not when it stays in-band', () => {
    setViewport(800); // md band [768, 1024)
    render(<MediaProbe />);
    const afterMount = renderCount;
    expect(probe().md).toBe('true');

    setViewport(700); // crosses below md (768) → re-render
    const afterCross = renderCount;
    expect(afterCross).toBeGreaterThan(afterMount);
    expect(probe().md).toBe('false');

    setViewport(650); // still in [640, 768) → no boundary crossed → no re-render
    expect(renderCount).toBe(afterCross);

    setViewport(500); // crosses below sm (640) → re-render
    expect(renderCount).toBeGreaterThan(afterCross);
    expect(probe().sm).toBe('false');
  });
});

describe('useBreakpoint', () => {
  it('returns the largest matching breakpoint name', () => {
    setViewport(800);
    render(<BreakpointProbe />);
    expect((container.querySelector('[data-testid="bp"]') as HTMLElement).dataset.active).toBe(
      'md',
    );
  });

  it('returns "base" below the smallest breakpoint', () => {
    setViewport(400);
    render(<BreakpointProbe />);
    expect((container.querySelector('[data-testid="bp"]') as HTMLElement).dataset.active).toBe(
      'base',
    );
  });
});
