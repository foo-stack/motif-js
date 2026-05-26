/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { createMotionValue, createTheme, type MotionValue } from '@usemotif/core';
import { ThemeContext } from './theme-context.js';
import { useMotionValue, useTransform } from './use-motion-value.js';

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

describe('useMotionValue', () => {
  it('returns a motion value initialised with the argument', () => {
    let captured: MotionValue<number> | undefined;
    function Probe(): null {
      captured = useMotionValue(42);
      return null;
    }
    render(<Probe />);
    expect(captured?.get()).toBe(42);
  });

  it('returns a stable reference across re-renders', () => {
    let captured: MotionValue<number> | undefined;
    function Probe(): null {
      captured = useMotionValue(0);
      return null;
    }
    render(<Probe />);
    const first = captured;
    render(<Probe />);
    expect(captured).toBe(first);
  });

  it('does NOT reset the value when re-rendered with a different `initial`', () => {
    let captured: MotionValue<number> | undefined;
    function Probe({ initial }: { initial: number }): null {
      captured = useMotionValue(initial);
      return null;
    }
    render(<Probe initial={0} />);
    captured?.set(50);
    render(<Probe initial={999} />);
    // The new `initial=999` is ignored — MV holds its set value.
    expect(captured?.get()).toBe(50);
  });

  it('updates do not trigger a re-render', () => {
    let captured: MotionValue<number> | undefined;
    let renderCount = 0;
    function Probe(): null {
      renderCount++;
      captured = useMotionValue(0);
      return null;
    }
    render(<Probe />);
    expect(renderCount).toBe(1);
    act(() => {
      captured?.set(1);
      captured?.set(2);
      captured?.set(3);
    });
    expect(renderCount).toBe(1);
  });
});

describe('useTransform (range form)', () => {
  it('linearly interpolates numeric outputs', () => {
    const source = createMotionValue(0);
    let derived: MotionValue<number> | undefined;
    function Probe(): null {
      derived = useTransform(source, [0, 200], [1, 0]);
      return null;
    }
    render(<Probe />);
    expect(derived?.get()).toBe(1);

    act(() => source.set(100));
    expect(derived?.get()).toBeCloseTo(0.5);

    act(() => source.set(200));
    expect(derived?.get()).toBe(0);
  });

  it('clamps to edge values outside the input range', () => {
    const source = createMotionValue(0);
    let derived: MotionValue<number> | undefined;
    function Probe(): null {
      derived = useTransform(source, [0, 100], [0, 1]);
      return null;
    }
    render(<Probe />);

    act(() => source.set(-50));
    expect(derived?.get()).toBe(0);

    act(() => source.set(500));
    expect(derived?.get()).toBe(1);
  });

  it('supports piecewise-linear interpolation across >2 stops', () => {
    const source = createMotionValue(0);
    let derived: MotionValue<number> | undefined;
    function Probe(): null {
      derived = useTransform(source, [0, 100, 200], [0, 10, 0]);
      return null;
    }
    render(<Probe />);

    act(() => source.set(50));
    expect(derived?.get()).toBeCloseTo(5);

    act(() => source.set(150));
    expect(derived?.get()).toBeCloseTo(5);
  });

  it('interpolates between hex colours in sRGB', () => {
    const source = createMotionValue(0);
    let derived: MotionValue<string> | undefined;
    function Probe(): null {
      derived = useTransform(source, [0, 1], ['#ff0000', '#0000ff']);
      return null;
    }
    render(<Probe />);
    expect(derived?.get()).toBe('#ff0000');

    act(() => source.set(0.5));
    expect(derived?.get()).toBe('rgb(128, 0, 128)');

    act(() => source.set(1));
    expect(derived?.get()).toBe('#0000ff');
  });

  it('interpolates between unit-matched strings', () => {
    const source = createMotionValue(0);
    let derived: MotionValue<string> | undefined;
    function Probe(): null {
      derived = useTransform(source, [0, 1], ['8px', '16px']);
      return null;
    }
    render(<Probe />);
    expect(derived?.get()).toBe('8px');

    act(() => source.set(0.5));
    expect(derived?.get()).toBe('12px');

    act(() => source.set(1));
    expect(derived?.get()).toBe('16px');
  });

  it('falls back to step function for unrecognised string outputs', () => {
    const source = createMotionValue(0);
    let derived: MotionValue<string> | undefined;
    function Probe(): null {
      derived = useTransform(source, [0, 1], ['flex', 'block']);
      return null;
    }
    render(<Probe />);
    expect(derived?.get()).toBe('flex');

    act(() => source.set(0.4));
    expect(derived?.get()).toBe('flex');

    act(() => source.set(1));
    expect(derived?.get()).toBe('block');
  });

  it('throws when ranges have mismatched lengths', () => {
    const source = createMotionValue(0);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    function Probe(): null {
      useTransform(source, [0, 100], [0]);
      return null;
    }
    expect(() => render(<Probe />)).toThrow(/inputRange and outputRange must have the same length/);
    errorSpy.mockRestore();
  });

  it('unsubscribes from source when the component unmounts', () => {
    const source = createMotionValue(0);
    function Probe(): null {
      useTransform(source, [0, 1], [0, 1]);
      return null;
    }
    render(<Probe />);

    // Sanity: source has a subscriber. We probe by mutating and checking
    // no error fires; deeper coverage in core's motion-value.test.ts.
    act(() => root.unmount());
    // Re-create root for the afterEach unmount path.
    root = createRoot(container);
    // After unmount the derived MV is no longer reachable, but we can
    // verify the source is still functional (set doesn't crash on a
    // dangling subscriber that's been cleaned up).
    expect(() => source.set(1)).not.toThrow();
  });
});

describe('useTransform (function form)', () => {
  it('runs the transformer on every source change', () => {
    const source = createMotionValue(0);
    let derived: MotionValue<number> | undefined;
    function Probe(): null {
      derived = useTransform(source, (v) => v * 2);
      return null;
    }
    render(<Probe />);
    expect(derived?.get()).toBe(0);

    act(() => source.set(7));
    expect(derived?.get()).toBe(14);
  });

  it('picks up the latest transformer without re-subscribing', () => {
    const source = createMotionValue(0);
    let derived: MotionValue<number> | undefined;
    function Probe({ factor }: { factor: number }): null {
      derived = useTransform(source, (v) => v * factor);
      return null;
    }
    render(<Probe factor={2} />);
    act(() => source.set(5));
    expect(derived?.get()).toBe(10);

    render(<Probe factor={3} />);
    act(() => source.set(5));
    // No-op: source value is still 5; derived was last set with factor=2.
    // The new transformer takes effect on the next source change.
    expect(derived?.get()).toBe(10);

    act(() => source.set(6));
    expect(derived?.get()).toBe(18);
  });
});

describe('useTransform — theme-aware token outputs (native)', () => {
  const theme = createTheme({
    name: 'light',
    tokens: {
      colors: {
        brand: {
          red: '#ff0000',
          blue: '#0000ff',
        },
      },
    },
  });

  it('resolves $color tokens to their theme literals before interpolating', () => {
    const source = createMotionValue(0);
    let derived: MotionValue<string> | undefined;
    function Probe(): null {
      derived = useTransform(source, [0, 1], ['$colors.brand.red', '$colors.brand.blue']);
      return null;
    }
    render(
      <ThemeContext.Provider value={{ themes: [theme], active: 'light' }}>
        <Probe />
      </ThemeContext.Provider>,
    );
    expect(derived?.get()).toBe('#ff0000');
    act(() => source.set(0.5));
    expect(derived?.get()).toBe('rgb(128, 0, 128)');
    act(() => source.set(1));
    expect(derived?.get()).toBe('#0000ff');
  });

  it('passes raw token strings through when no theme is in scope', () => {
    const source = createMotionValue(0);
    let derived: MotionValue<string> | undefined;
    function Probe(): null {
      derived = useTransform(source, [0, 1], ['$colors.brand.red', '$colors.brand.blue']);
      return null;
    }
    render(<Probe />);
    expect(derived?.get()).toBe('$colors.brand.red');
  });
});
