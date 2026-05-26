import { describe, expect, it } from 'vitest';
import { composeTransformAxesNative, composeTransformAxesWeb } from './transform-composer.js';

describe('composeTransformAxesWeb', () => {
  it('returns undefined for an empty bag', () => {
    expect(composeTransformAxesWeb({})).toBeUndefined();
  });

  it('serialises length axes with px and rotations with deg', () => {
    const out = composeTransformAxesWeb({ x: 10, y: 20, rotate: 45, scale: 0.9 });
    expect(out).toBe('translateX(10px) translateY(20px) rotate(45deg) scale(0.9)');
  });

  it('emits axes in canonical order regardless of insertion order', () => {
    const out = composeTransformAxesWeb({ scale: 1.1, rotate: 30, x: 5 });
    expect(out).toBe('translateX(5px) rotate(30deg) scale(1.1)');
  });

  it('passes string values through unchanged (consumer-supplied units)', () => {
    const out = composeTransformAxesWeb({ x: '50%', rotate: '0.25turn' });
    expect(out).toBe('translateX(50%) rotate(0.25turn)');
  });

  it('emits scale as unitless, including fractional values', () => {
    expect(composeTransformAxesWeb({ scale: 0.5 })).toBe('scale(0.5)');
    expect(composeTransformAxesWeb({ scaleX: 2, scaleY: 0.5 })).toBe('scaleX(2) scaleY(0.5)');
  });

  it('separates rotateX/Y/Z when given alongside the 2D rotate', () => {
    const out = composeTransformAxesWeb({ rotate: 10, rotateX: 20, rotateY: 30, rotateZ: 40 });
    expect(out).toBe('rotate(10deg) rotateX(20deg) rotateY(30deg) rotateZ(40deg)');
  });

  it('handles skew axes as degree-valued', () => {
    expect(composeTransformAxesWeb({ skewX: 5, skewY: -5 })).toBe('skewX(5deg) skewY(-5deg)');
    expect(composeTransformAxesWeb({ skew: 15 })).toBe('skew(15deg)');
  });

  it('preserves a token-resolved var() reference (CSS-vars path output)', () => {
    const out = composeTransformAxesWeb({ x: 'var(--motif-space-4)' });
    expect(out).toBe('translateX(var(--motif-space-4))');
  });
});

describe('composeTransformAxesNative', () => {
  it('returns undefined for an empty bag', () => {
    expect(composeTransformAxesNative({})).toBeUndefined();
  });

  it('emits RN array entries in canonical order, with units only on angles', () => {
    const out = composeTransformAxesNative({ x: 10, y: 20, rotate: 45, scale: 0.9 });
    expect(out).toEqual([
      { translateX: 10 },
      { translateY: 20 },
      { rotate: '45deg' },
      { scale: 0.9 },
    ]);
  });

  it('expands the `skew` shorthand to skewX + skewY (RN has no shorthand)', () => {
    const out = composeTransformAxesNative({ skew: 15 });
    expect(out).toEqual([{ skewX: '15deg' }, { skewY: '15deg' }]);
  });

  it('preserves consumer-supplied angle strings', () => {
    const out = composeTransformAxesNative({ rotate: '0.25turn' });
    expect(out).toEqual([{ rotate: '0.25turn' }]);
  });

  it('parses numeric strings into numbers for length / scale slots', () => {
    const out = composeTransformAxesNative({ x: '10', scale: '1.2' });
    expect(out).toEqual([{ translateX: 10 }, { scale: 1.2 }]);
  });

  it('keeps the same canonical order regardless of input order', () => {
    const out = composeTransformAxesNative({ scaleY: 0.5, x: 5, rotate: 10 });
    expect(out).toEqual([{ translateX: 5 }, { rotate: '10deg' }, { scaleY: 0.5 }]);
  });
});
