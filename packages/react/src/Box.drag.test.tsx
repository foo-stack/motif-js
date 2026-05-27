/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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

function pointerEvent(
  type: string,
  init: { clientX?: number; clientY?: number; pointerId?: number } = {},
): PointerEvent {
  const ev = new Event(type, { bubbles: true, cancelable: true }) as PointerEvent;
  Object.defineProperty(ev, 'pointerId', { value: init.pointerId ?? 1, configurable: true });
  Object.defineProperty(ev, 'clientX', { value: init.clientX ?? 0, configurable: true });
  Object.defineProperty(ev, 'clientY', { value: init.clientY ?? 0, configurable: true });
  return ev;
}

function stubPointerCapture(el: HTMLElement): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (el as any).setPointerCapture = () => undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (el as any).releasePointerCapture = () => undefined;
}

describe('Box — drag prop', () => {
  it('wires pointer handlers when drag is enabled', () => {
    act(() => {
      root.render(
        <Box drag data-testid="target">
          drag
        </Box>,
      );
    });
    const el = container.querySelector('[data-testid="target"]') as HTMLElement;
    expect(el).not.toBeNull();
    stubPointerCapture(el);
    // Pointer-down should not throw; we just verify the handler is
    // attached and proceeds without error.
    expect(() => {
      act(() => {
        el.dispatchEvent(pointerEvent('pointerdown', { clientX: 0, clientY: 0 }));
      });
    }).not.toThrow();
  });

  it('fires onDragStart / onDragEnd through the prop surface', () => {
    const onDragStart = vi.fn();
    const onDragEnd = vi.fn();
    act(() => {
      root.render(
        <Box drag onDragStart={onDragStart} onDragEnd={onDragEnd} data-testid="target">
          drag
        </Box>,
      );
    });
    const el = container.querySelector('[data-testid="target"]') as HTMLElement;
    stubPointerCapture(el);

    act(() => {
      el.dispatchEvent(pointerEvent('pointerdown', { clientX: 0, clientY: 0 }));
    });
    expect(onDragStart).toHaveBeenCalledTimes(1);

    act(() => {
      el.dispatchEvent(pointerEvent('pointerup'));
    });
    expect(onDragEnd).toHaveBeenCalledTimes(1);
  });

  it('composes drag pointer handler with a consumer-supplied onPointerDown', () => {
    const consumerPointerDown = vi.fn();
    const onDragStart = vi.fn();
    act(() => {
      root.render(
        <Box
          drag
          onPointerDown={consumerPointerDown}
          onDragStart={onDragStart}
          data-testid="target"
        >
          drag
        </Box>,
      );
    });
    const el = container.querySelector('[data-testid="target"]') as HTMLElement;
    stubPointerCapture(el);

    act(() => {
      el.dispatchEvent(pointerEvent('pointerdown', { clientX: 0, clientY: 0 }));
    });
    // Both handlers fired.
    expect(consumerPointerDown).toHaveBeenCalledTimes(1);
    expect(onDragStart).toHaveBeenCalledTimes(1);
  });

  it('applies dragConstraints when set', () => {
    // Verify the constraint propagates by checking that onDrag fires
    // with a clamped offset.
    const onDrag = vi.fn();
    act(() => {
      root.render(
        <Box drag dragConstraints={{ left: -50, right: 50 }} onDrag={onDrag} data-testid="target">
          drag
        </Box>,
      );
    });
    const el = container.querySelector('[data-testid="target"]') as HTMLElement;
    stubPointerCapture(el);

    act(() => {
      el.dispatchEvent(pointerEvent('pointerdown', { clientX: 0, clientY: 0 }));
    });
    act(() => {
      el.dispatchEvent(pointerEvent('pointermove', { clientX: 200, clientY: 0 }));
    });
    const lastInfo = onDrag.mock.calls.at(-1)![0];
    expect(lastInfo.offset.x).toBe(50);
  });
});
