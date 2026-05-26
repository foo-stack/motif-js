/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { useDrag, type DragInfo } from './use-drag.js';

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

/**
 * Synthesise a PointerEvent. jsdom supports the constructor but
 * doesn't fire pointer events from `dispatchEvent` on every Element
 * the way real browsers do — we explicitly construct each event
 * shape and dispatch to the target.
 */
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

/**
 * Stub setPointerCapture / releasePointerCapture on a freshly-created
 * element so the hook's invocation doesn't throw in jsdom (which
 * doesn't implement the methods by default).
 */
function stubPointerCapture(el: HTMLElement): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (el as any).setPointerCapture = () => undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (el as any).releasePointerCapture = () => undefined;
}

type Captured = ReturnType<typeof useDrag>;

function Probe({
  onResult,
  options,
}: {
  onResult: (r: Captured) => void;
  options?: Parameters<typeof useDrag>[0];
}): ReactNode {
  const r = useDrag(options);
  onResult(r);
  return <div {...r.dragProps} data-testid="target" />;
}

describe('useDrag', () => {
  it('returns dragProps, x/y motion values, and an initial isDragging=false', () => {
    const captured = vi.fn();
    render(<Probe onResult={captured} />);
    const r = captured.mock.calls[0]![0] as Captured;
    expect(typeof r.dragProps.onPointerDown).toBe('function');
    expect(r.x.get()).toBe(0);
    expect(r.y.get()).toBe(0);
    expect(r.isDragging).toBe(false);
  });

  it('updates x/y on pointer move while a drag is in flight', () => {
    const captured = vi.fn();
    render(<Probe onResult={captured} />);
    const target = container.querySelector('[data-testid="target"]') as HTMLElement;
    stubPointerCapture(target);
    const r = captured.mock.calls[0]![0] as Captured;

    // Pointer-down on the target — fires the React synthetic event
    // through React's delegation. The act() wrapper flushes
    // pending state updates.
    act(() => {
      target.dispatchEvent(pointerEvent('pointerdown', { clientX: 0, clientY: 0 }));
    });
    act(() => {
      target.dispatchEvent(pointerEvent('pointermove', { clientX: 50, clientY: 30 }));
    });

    expect(r.x.get()).toBe(50);
    expect(r.y.get()).toBe(30);
  });

  it('clamps to constraints', () => {
    const captured = vi.fn();
    render(
      <Probe
        onResult={captured}
        options={{ constraints: { left: -10, right: 20, top: 0, bottom: 50 } }}
      />,
    );
    const target = container.querySelector('[data-testid="target"]') as HTMLElement;
    stubPointerCapture(target);
    const r = captured.mock.calls[0]![0] as Captured;

    act(() => {
      target.dispatchEvent(pointerEvent('pointerdown', { clientX: 0, clientY: 0 }));
    });
    act(() => {
      target.dispatchEvent(pointerEvent('pointermove', { clientX: 100, clientY: 100 }));
    });
    expect(r.x.get()).toBe(20); // right clamp
    expect(r.y.get()).toBe(50); // bottom clamp

    act(() => {
      target.dispatchEvent(pointerEvent('pointermove', { clientX: -100, clientY: -100 }));
    });
    expect(r.x.get()).toBe(-10); // left clamp
    expect(r.y.get()).toBe(0); // top clamp
  });

  it('locks to a single axis when `axis: "x"` is set', () => {
    const captured = vi.fn();
    render(<Probe onResult={captured} options={{ axis: 'x' }} />);
    const target = container.querySelector('[data-testid="target"]') as HTMLElement;
    stubPointerCapture(target);
    const r = captured.mock.calls[0]![0] as Captured;

    act(() => {
      target.dispatchEvent(pointerEvent('pointerdown', { clientX: 0, clientY: 0 }));
    });
    act(() => {
      target.dispatchEvent(pointerEvent('pointermove', { clientX: 30, clientY: 30 }));
    });
    expect(r.x.get()).toBe(30);
    expect(r.y.get()).toBe(0);
  });

  it('fires onDragStart / onDrag / onDragEnd with info snapshots', () => {
    const onDragStart = vi.fn();
    const onDrag = vi.fn();
    const onDragEnd = vi.fn();
    const captured = vi.fn();
    render(
      <Probe
        onResult={captured}
        options={{ onDragStart, onDrag, onDragEnd }}
      />,
    );
    const target = container.querySelector('[data-testid="target"]') as HTMLElement;
    stubPointerCapture(target);

    act(() => {
      target.dispatchEvent(pointerEvent('pointerdown', { clientX: 10, clientY: 20 }));
    });
    expect(onDragStart).toHaveBeenCalledTimes(1);
    expect((onDragStart.mock.calls[0]![0] as DragInfo).offset).toEqual({ x: 0, y: 0 });

    act(() => {
      target.dispatchEvent(pointerEvent('pointermove', { clientX: 50, clientY: 60 }));
    });
    expect(onDrag).toHaveBeenCalled();
    const moveInfo = onDrag.mock.calls.at(-1)![0] as DragInfo;
    expect(moveInfo.offset).toEqual({ x: 40, y: 40 });

    act(() => {
      target.dispatchEvent(pointerEvent('pointerup'));
    });
    expect(onDragEnd).toHaveBeenCalledTimes(1);
  });

  it('transitions isDragging true/false across the drag lifecycle', () => {
    const captures: Captured[] = [];
    const captured = (r: Captured): void => {
      captures.push(r);
    };
    render(<Probe onResult={captured} />);
    const target = container.querySelector('[data-testid="target"]') as HTMLElement;
    stubPointerCapture(target);

    expect(captures[0]!.isDragging).toBe(false);

    act(() => {
      target.dispatchEvent(pointerEvent('pointerdown', { clientX: 0, clientY: 0 }));
    });
    expect(captures.at(-1)!.isDragging).toBe(true);

    act(() => {
      target.dispatchEvent(pointerEvent('pointerup'));
    });
    expect(captures.at(-1)!.isDragging).toBe(false);
  });
});
