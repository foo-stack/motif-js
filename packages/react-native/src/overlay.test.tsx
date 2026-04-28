import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { __setDimensions } from './__test-setup__/react-native-mock.js';
import { Hide, LiveRegion, Show, VisuallyHidden } from './overlay.js';

let container: HTMLElement;
let root: Root;

function render(node: React.ReactNode): void {
  act(() => root.render(node));
}

beforeEach(() => {
  __setDimensions(800);
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe('native overlay — VisuallyHidden / LiveRegion smoke', () => {
  it('VisuallyHidden zero-sizes the wrapping View off-screen', () => {
    render(<VisuallyHidden>screen reader only</VisuallyHidden>);
    const view = container.querySelector('[data-motif-host="View"]')!;
    const raw = view.getAttribute('data-motif-style') ?? '{}';
    const parsed = JSON.parse(raw) as unknown;
    const style: Record<string, unknown> = Array.isArray(parsed)
      ? parsed.reduce<Record<string, unknown>>((acc, x) => Object.assign(acc, x ?? {}), {})
      : (parsed as Record<string, unknown>);
    expect(style.width).toBe(0);
    expect(style.height).toBe(0);
    expect(style.position).toBe('absolute');
    expect(view.textContent).toContain('screen reader only');
  });

  it('LiveRegion sets accessibilityLiveRegion to the resolved politeness', () => {
    render(<LiveRegion politeness="assertive">attention</LiveRegion>);
    const view = container.querySelector('[data-motif-host="View"]')!;
    expect(view.getAttribute('accessibilityLiveRegion')).toBe('assertive');
  });

  it("LiveRegion politeness='off' maps to 'none'", () => {
    render(<LiveRegion politeness="off">attention</LiveRegion>);
    const view = container.querySelector('[data-motif-host="View"]')!;
    expect(view.getAttribute('accessibilityLiveRegion')).toBe('none');
  });
});

describe('native Show / Hide — viewport visibility', () => {
  it('Show above="md" renders when viewport >= md', () => {
    __setDimensions(900);
    render(
      <Show above="md">
        <span data-testid="visible">x</span>
      </Show>,
    );
    expect(container.querySelector('[data-testid="visible"]')).not.toBeNull();
  });

  it('Show above="md" hides when viewport < md', () => {
    __setDimensions(500);
    render(
      <Show above="md">
        <span data-testid="visible">x</span>
      </Show>,
    );
    expect(container.querySelector('[data-testid="visible"]')).toBeNull();
  });

  it('Hide above="md" is the inverse of Show', () => {
    __setDimensions(900);
    render(
      <Hide above="md">
        <span data-testid="x">x</span>
      </Hide>,
    );
    expect(container.querySelector('[data-testid="x"]')).toBeNull();
  });

  it('Show below="md" renders only when viewport < md', () => {
    __setDimensions(500);
    render(
      <Show below="md">
        <span data-testid="x">x</span>
      </Show>,
    );
    expect(container.querySelector('[data-testid="x"]')).not.toBeNull();
  });
});
