import { act, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ColorPicker, formatColor, parseColor } from './specialized.js';

let container: HTMLElement;
let root: Root;

function render(node: React.ReactNode): void {
  act(() => root.render(node));
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

function press(key: string, opts: { shift?: boolean } = {}): void {
  const active = document.activeElement ?? document.body;
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    shiftKey: opts.shift === true,
  });
  act(() => {
    active.dispatchEvent(event);
  });
}

describe('parseColor', () => {
  it('parses #rrggbb', () => {
    const c = parseColor('#ff0000');
    expect(c.h).toBeCloseTo(0, 1);
    expect(c.s).toBeCloseTo(1, 2);
    expect(c.v).toBeCloseTo(1, 2);
    expect(c.a).toBe(1);
  });

  it('parses short #rgb', () => {
    expect(parseColor('#f00').h).toBeCloseTo(0, 1);
    expect(parseColor('#0f0').h).toBeCloseTo(120, 1);
    expect(parseColor('#00f').h).toBeCloseTo(240, 1);
  });

  it('parses #rrggbbaa', () => {
    expect(parseColor('#ff000080').a).toBeCloseTo(0.5, 1);
  });

  it('parses rgb() and rgba()', () => {
    const a = parseColor('rgb(0, 255, 0)');
    expect(a.h).toBeCloseTo(120, 1);
    expect(a.a).toBe(1);
    const b = parseColor('rgba(0, 0, 255, 0.5)');
    expect(b.h).toBeCloseTo(240, 1);
    expect(b.a).toBeCloseTo(0.5, 2);
  });

  it('parses hsl() and hsla()', () => {
    const a = parseColor('hsl(0, 100%, 50%)');
    expect(a.h).toBeCloseTo(0, 1);
    expect(a.s).toBeCloseTo(1, 2);
    expect(a.v).toBeCloseTo(1, 2);
    const b = parseColor('hsla(120, 100%, 50%, 0.5)');
    expect(b.h).toBeCloseTo(120, 1);
    expect(b.a).toBeCloseTo(0.5, 2);
  });

  it('falls back to opaque black on garbage input', () => {
    expect(parseColor('garbage')).toEqual({ h: 0, s: 0, v: 0, a: 1 });
  });
});

describe('formatColor', () => {
  it('formats hex from HSV', () => {
    const c = parseColor('#3b82f6');
    expect(formatColor(c, 'hex').toLowerCase()).toBe('#3b82f6');
  });

  it('round-trips hex through rgb', () => {
    const c = parseColor('#3b82f6');
    const rgb = formatColor(c, 'rgb');
    expect(rgb).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
    const back = parseColor(rgb);
    expect(formatColor(back, 'hex').toLowerCase()).toBe('#3b82f6');
  });

  it('emits rgba when alpha < 1', () => {
    const c = { h: 0, s: 1, v: 1, a: 0.5 };
    expect(formatColor(c, 'rgb')).toMatch(/^rgba\(255, 0, 0, 0\.5\)$/);
  });

  it('emits hsl with percentages', () => {
    const c = { h: 120, s: 1, v: 1, a: 1 };
    const out = formatColor(c, 'hsl');
    expect(out).toMatch(/^hsl\(120, 100%, 50%\)$/);
  });
});

describe('ColorPicker — UI', () => {
  it('renders SV plane, hue slider, and format toggle', () => {
    render(<ColorPicker defaultValue="#ff0000" />);
    // The SV plane is a slider (not role="application", which suppressed
    // browse mode for the whole subtree — see #207).
    expect(document.querySelector('[role="application"]')).toBeNull();
    expect(
      document.querySelector('[role="slider"][aria-label="Saturation and value selector"]'),
    ).not.toBeNull();
    expect(document.querySelectorAll('[role="slider"]').length).toBeGreaterThanOrEqual(1);
    expect(document.querySelector('[role="radiogroup"]')).not.toBeNull();
  });

  it('does NOT render alpha slider for hex format', () => {
    render(<ColorPicker defaultValue="#ff0000" allowAlpha format="hex" />);
    const sliders = Array.from(document.querySelectorAll('[role="slider"]'));
    expect(sliders.find((s) => s.getAttribute('aria-label') === 'Alpha')).toBeUndefined();
  });

  it('renders alpha slider when allowAlpha + non-hex format', () => {
    render(<ColorPicker defaultValue="rgba(255,0,0,0.5)" allowAlpha format="rgb" />);
    const sliders = Array.from(document.querySelectorAll('[role="slider"]'));
    expect(sliders.find((s) => s.getAttribute('aria-label') === 'Alpha')).not.toBeUndefined();
  });

  it('hue slider arrow keys nudge value', () => {
    function Harness(): React.ReactElement {
      const [v, setV] = useState('#ff0000');
      return (
        <>
          <ColorPicker value={v} onValueChange={setV} format="rgb" />
          <span data-testid="value">{v}</span>
        </>
      );
    }
    render(<Harness />);
    const hue = document.querySelector('[role="slider"][aria-label="Hue"]')! as HTMLDivElement;
    act(() => hue.focus());
    press('ArrowRight');
    const v = container.querySelector('[data-testid="value"]')!.textContent!;
    // Hue went from 0 to 1 → still red-ish but not pure red.
    expect(v).not.toBe('rgb(255, 0, 0)');
    expect(v).toMatch(/^rgb\(/);
  });

  it('format toggle switches output format', () => {
    let captured = '';
    function Harness(): React.ReactElement {
      const [v, setV] = useState('#ff0000');
      const [fmt, setFmt] = useState<'hex' | 'rgb' | 'hsl'>('hex');
      return (
        <ColorPicker
          value={v}
          onValueChange={(next) => {
            captured = next;
            setV(next);
          }}
          format={fmt}
          onFormatChange={setFmt}
        />
      );
    }
    render(<Harness />);
    const radios = Array.from(document.querySelectorAll('[role="radio"]')) as HTMLButtonElement[];
    const rgb = radios.find((r) => r.textContent === 'rgb')!;
    act(() => rgb.click());
    // Format change alone doesn't fire onValueChange; nudge a slider to see new format.
    const hue = document.querySelector('[role="slider"][aria-label="Hue"]')! as HTMLDivElement;
    act(() => hue.focus());
    press('ArrowRight');
    expect(captured).toMatch(/^rgb/);
  });

  it('aria-checked reflects active format', () => {
    render(<ColorPicker defaultValue="#ff0000" format="rgb" />);
    const radios = Array.from(document.querySelectorAll('[role="radio"]'));
    const checked = radios.find((r) => r.getAttribute('aria-checked') === 'true')!;
    expect(checked.textContent).toBe('rgb');
  });

  it('SV plane responds to ArrowDown (lower V)', () => {
    let captured = '';
    function Harness(): React.ReactElement {
      const [v, setV] = useState('#ff0000');
      return (
        <ColorPicker
          value={v}
          onValueChange={(next) => {
            captured = next;
            setV(next);
          }}
          format="rgb"
        />
      );
    }
    render(<Harness />);
    const plane = document.querySelector('[role="slider"][aria-label="Saturation and value selector"]')! as HTMLDivElement;
    act(() => plane.focus());
    press('ArrowDown');
    expect(captured).not.toBe('rgb(255, 0, 0)');
    // Value dropped → less bright red.
    const m = /^rgb\((\d+), (\d+), (\d+)\)$/.exec(captured);
    expect(m).not.toBeNull();
    expect(Number(m![1])).toBeLessThan(255);
  });

  it('Shift takes larger SV plane steps', () => {
    let lastVal = '';
    function Harness(): React.ReactElement {
      const [v, setV] = useState('#ff0000');
      return (
        <ColorPicker
          value={v}
          onValueChange={(next) => {
            lastVal = next;
            setV(next);
          }}
          format="rgb"
        />
      );
    }
    render(<Harness />);
    const plane = document.querySelector('[role="slider"][aria-label="Saturation and value selector"]')! as HTMLDivElement;
    act(() => plane.focus());
    press('ArrowDown', { shift: true });
    const m = /^rgb\((\d+), (\d+), (\d+)\)$/.exec(lastVal);
    // 1 - 0.1 = 0.9 V → red ≈ 230. Far from 255.
    expect(Number(m![1])).toBeLessThanOrEqual(230);
  });
});
