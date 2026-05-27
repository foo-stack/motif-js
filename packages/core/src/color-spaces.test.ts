import { describe, expect, it } from 'vitest';
import {
  interpolateInSpace,
  oklabToSrgb,
  parseColor,
  srgbToOklab,
  type ParsedColor,
} from './color-spaces.js';

describe('parseColor — extended formats', () => {
  it('parses hex (existing path still works)', () => {
    expect(parseColor('#ff0000')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });

  it('parses rgb / rgba (existing path still works)', () => {
    expect(parseColor('rgb(10, 20, 30)')).toEqual({ r: 10, g: 20, b: 30, a: 1 });
    expect(parseColor('rgba(10, 20, 30, 0.5)')).toEqual({ r: 10, g: 20, b: 30, a: 0.5 });
  });

  it('parses hsl as sRGB tuple', () => {
    // hsl(0 100% 50%) = red
    const red = parseColor('hsl(0, 100%, 50%)');
    expect(red).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    // hsl(240 100% 50%) = blue
    const blue = parseColor('hsl(240, 100%, 50%)');
    expect(blue).toEqual({ r: 0, g: 0, b: 255, a: 1 });
    // hsl(120 100% 50%) = green
    const green = parseColor('hsl(120, 100%, 50%)');
    expect(green).toEqual({ r: 0, g: 255, b: 0, a: 1 });
  });

  it('parses hsla with whitespace-separator + slash alpha', () => {
    const c = parseColor('hsl(0 100% 50% / 0.5)');
    expect(c).toEqual({ r: 255, g: 0, b: 0, a: 0.5 });
  });

  it('parses css named colors', () => {
    expect(parseColor('red')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    expect(parseColor('steelblue')).toEqual({ r: 70, g: 130, b: 180, a: 1 });
    expect(parseColor('rebeccapurple')).toEqual({ r: 102, g: 51, b: 153, a: 1 });
    expect(parseColor('definitelynotacolor')).toBeNull();
  });

  it('parses oklab and round-trips back to a similar sRGB', () => {
    // oklab(0.628 0.225 0.126) ≈ pure red sRGB.
    const c = parseColor('oklab(0.628 0.225 0.126)');
    expect(c).not.toBeNull();
    expect(c!.r).toBeGreaterThan(250);
    expect(c!.g).toBeLessThan(10);
    expect(c!.b).toBeLessThan(10);
  });

  it('parses oklch (polar form)', () => {
    // oklch(0.628 0.258 29.23) ≈ pure red.
    const c = parseColor('oklch(0.628 0.258 29.23)');
    expect(c).not.toBeNull();
    expect(c!.r).toBeGreaterThan(250);
    expect(c!.g).toBeLessThan(10);
    expect(c!.b).toBeLessThan(10);
  });
});

describe('OKLab conversion', () => {
  it('round-trips red within rounding error', () => {
    const red: ParsedColor = { r: 255, g: 0, b: 0, a: 1 };
    const lab = srgbToOklab(red);
    const back = oklabToSrgb(lab);
    expect(back.r).toBe(255);
    expect(back.g).toBe(0);
    expect(back.b).toBe(0);
  });

  it('round-trips a mid-gray', () => {
    const gray: ParsedColor = { r: 128, g: 128, b: 128, a: 1 };
    const lab = srgbToOklab(gray);
    const back = oklabToSrgb(lab);
    expect(back.r).toBe(128);
    expect(back.g).toBe(128);
    expect(back.b).toBe(128);
  });
});

describe('interpolateInSpace', () => {
  const red: ParsedColor = { r: 255, g: 0, b: 0, a: 1 };
  const blue: ParsedColor = { r: 0, g: 0, b: 255, a: 1 };

  it('srgb midpoint of red→blue is a muddy purple', () => {
    expect(interpolateInSpace(red, blue, 0.5, 'srgb')).toBe('rgb(128, 0, 128)');
  });

  it('oklab midpoint of red→blue stays vivid (more red+blue than srgb)', () => {
    const mid = interpolateInSpace(red, blue, 0.5, 'oklab');
    // The OKLab midpoint should not be the dim sRGB lerp; it lands on
    // a brighter magenta. We assert higher combined r+b than the sRGB
    // case (256) — empirically ~280-330 across implementations.
    const m = /^rgb\((\d+), (\d+), (\d+)\)$/.exec(mid);
    expect(m).not.toBeNull();
    const r = parseInt(m![1]!, 10);
    const b = parseInt(m![3]!, 10);
    expect(r + b).toBeGreaterThan(256);
  });

  it('oklch interpolates hue along the shortest arc', () => {
    // red (h≈29°) → blue (h≈264°). Shortest arc goes BACKWARDS through
    // ~340° → ~0° → ~30° → … to 264° if we go forward (235°), or
    // 29 → 0 → -55 (=305) going backward (125°). Shortest is backward.
    // We assert that the midpoint has a hue closer to that backward
    // path (i.e. closer to ~340° / a pink-magenta in sRGB) rather than
    // sitting at ~146° (green) which is the forward midpoint.
    const mid = interpolateInSpace(red, blue, 0.5, 'oklch');
    const m = /^rgb\((\d+), (\d+), (\d+)\)$/.exec(mid);
    expect(m).not.toBeNull();
    const g = parseInt(m![2]!, 10);
    // A pink-magenta has low green; a green midpoint would have very
    // high green. Assert green stays low.
    expect(g).toBeLessThan(100);
  });

  it('drops alpha to rgb() when both endpoints are opaque', () => {
    expect(interpolateInSpace(red, blue, 0.5, 'srgb')).toMatch(/^rgb\(/);
  });

  it('emits rgba() when an endpoint has alpha < 1', () => {
    const translucent: ParsedColor = { r: 0, g: 0, b: 255, a: 0.5 };
    const out = interpolateInSpace(red, translucent, 0.5, 'srgb');
    expect(out).toMatch(/^rgba\(/);
  });
});
