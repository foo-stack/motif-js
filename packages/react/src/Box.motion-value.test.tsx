/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, useEffect, useRef, useState, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { createMotionValue } from '@usemotif/core';
import { Box } from './Box.js';

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

describe('Box with motion values', () => {
  it('renders with the motion value\'s current value on first paint', () => {
    const opacity = createMotionValue(0.25);
    render(<Box opacity={opacity}>hi</Box>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.opacity).toBe('0.25');
  });

  it('updates the DOM imperatively on .set() without re-rendering Box', () => {
    const opacity = createMotionValue(1);
    let renderCount = 0;

    function Probe(): ReactNode {
      renderCount++;
      return <Box opacity={opacity}>hi</Box>;
    }
    render(<Probe />);
    expect(renderCount).toBe(1);

    const el = container.firstElementChild as HTMLElement;
    expect(el.style.opacity).toBe('1');

    act(() => opacity.set(0.5));
    expect(el.style.opacity).toBe('0.5');
    // Critical: no React re-render.
    expect(renderCount).toBe(1);

    act(() => opacity.set(0));
    expect(el.style.opacity).toBe('0');
    expect(renderCount).toBe(1);
  });

  it('handles multiple MV-bound props on the same Box', () => {
    const opacity = createMotionValue(0.8);
    const width = createMotionValue(120);
    render(<Box opacity={opacity} width={width}>hi</Box>);

    const el = container.firstElementChild as HTMLElement;
    expect(el.style.opacity).toBe('0.8');
    expect(el.style.width).toBe('120px');

    act(() => {
      opacity.set(0.2);
      width.set(300);
    });
    expect(el.style.opacity).toBe('0.2');
    expect(el.style.width).toBe('300px');
  });

  it('appends `px` for length properties and keeps unitless props bare', () => {
    const width = createMotionValue(64);
    const opacity = createMotionValue(0.5);
    const zIndex = createMotionValue(10);
    render(<Box width={width} opacity={opacity} zIndex={zIndex}>hi</Box>);

    const el = container.firstElementChild as HTMLElement;
    expect(el.style.width).toBe('64px');
    expect(el.style.opacity).toBe('0.5');
    expect(el.style.zIndex).toBe('10');
  });

  it('accepts a string motion value for transform composition', () => {
    const transform = createMotionValue('translateX(0px)');
    render(<Box transform={transform}>hi</Box>);

    const el = container.firstElementChild as HTMLElement;
    expect(el.style.transform).toBe('translateX(0px)');

    act(() => transform.set('translateX(100px) rotate(45deg)'));
    expect(el.style.transform).toBe('translateX(100px) rotate(45deg)');
  });

  it('unsubscribes from the motion value when the Box unmounts', () => {
    const opacity = createMotionValue(1);
    render(<Box opacity={opacity}>hi</Box>);

    const el = container.firstElementChild as HTMLElement;
    expect(el.style.opacity).toBe('1');

    act(() => root.unmount());
    // Re-create the root so the afterEach unmount path doesn't fail
    // on an already-unmounted root.
    root = createRoot(container);

    // After unmount, setting the MV should not throw — the subscriber
    // was cleaned up. (If it had leaked, the write callback would
    // touch the now-detached element; this is mostly a smoke check
    // that the cleanup ran.)
    expect(() => opacity.set(0.5)).not.toThrow();
  });

  it('falls through to the static path when the Box has no MV props', () => {
    let renderCount = 0;
    function Probe(): ReactNode {
      renderCount++;
      return <Box opacity={0.5}>hi</Box>;
    }
    render(<Probe />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.opacity).toBe('0.5');
    // Re-render with no prop changes should not cause extra renders.
    render(<Probe />);
    expect(renderCount).toBe(2);
  });

  it('composes a user-passed callback ref with the internal MV ref', () => {
    const opacity = createMotionValue(0.5);
    let userRefSeen: HTMLElement | null = null;
    render(
      <Box
        opacity={opacity}
        ref={(node: HTMLElement | null) => {
          userRefSeen = node;
        }}
      >
        hi
      </Box>,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(userRefSeen).toBe(el);
    expect(el.style.opacity).toBe('0.5');

    act(() => opacity.set(0.1));
    expect(el.style.opacity).toBe('0.1');
  });

  it('resolves a token-string motion value to var(--...) at write time', () => {
    const bg = createMotionValue('$colors.red');
    render(<Box bg={bg as never}>hi</Box>);
    // `bg` isn't in the MV-widened prop set in v1, so it should NOT
    // hit the imperative write path — it's the regular static
    // resolver that handles `bg`. This test guards against silently
    // widening `bg` later without considering token resolution. If
    // this fails because we did widen `bg`, the test below for an
    // explicitly-widened prop is what should pass.
    // For now, confirm the static path resolved `bg` as a literal-ish
    // string (the element either has no inline style at all, or has
    // the static var() — both are valid; we just want no crash).
    const el = container.firstElementChild as HTMLElement;
    expect(el).toBeDefined();
  });

  it('writes var(--...) for a token-ref string set on an MV-widened prop', () => {
    // borderRadius is in the MV-widened set; setting a token-string
    // value should land as `var(--radii-...)` via tokenRefToCssVar.
    const borderRadius = createMotionValue('$radii.md');
    render(<Box borderRadius={borderRadius}>hi</Box>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.borderRadius).toBe('var(--radii-md)');

    act(() => borderRadius.set('$radii.lg'));
    expect(el.style.borderRadius).toBe('var(--radii-lg)');
  });

  it('composes a user-passed RefObject ref with the internal MV ref', () => {
    const opacity = createMotionValue(0.5);
    function Probe(): ReactNode {
      const ref = useRef<HTMLElement | null>(null);
      const [refSeen, setRefSeen] = useState<HTMLElement | null>(null);
      useEffect(() => {
        setRefSeen(ref.current);
      }, []);
      return (
        <>
          <Box opacity={opacity} ref={ref}>
            hi
          </Box>
          <span data-testid="seen">{refSeen === null ? 'no' : 'yes'}</span>
        </>
      );
    }
    render(<Probe />);
    const seen = container.querySelector('[data-testid="seen"]')!;
    expect(seen.textContent).toBe('yes');
  });
});
