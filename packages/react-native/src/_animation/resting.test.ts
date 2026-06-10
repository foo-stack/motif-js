import { describe, expect, it } from 'vitest';
import { resolveEnterTargets, restingTransformArray, restingValueFor } from './resting.js';

describe('restingValueFor', () => {
  it('rests opacity and scale at 1, rotation at 0deg, other numerics at 0', () => {
    expect(restingValueFor('opacity')).toBe(1);
    expect(restingValueFor('scale')).toBe(1);
    expect(restingValueFor('rotate')).toBe('0deg');
    expect(restingValueFor('translateX')).toBe(0);
  });
});

describe('restingTransformArray (#218)', () => {
  it('maps each axis entry to its identity value, preserving array shape', () => {
    expect(
      restingTransformArray([{ translateX: -20 }, { scale: 0.5 }, { rotate: '45deg' }]),
    ).toEqual([{ translateX: 0 }, { scale: 1 }, { rotate: '0deg' }]);
  });

  it('falls back to the scalar resting for a non-array (never an invalid transform: 0… array)', () => {
    expect(restingTransformArray(undefined)).toBe(0);
  });
});

describe('resolveEnterTargets (#218, #246)', () => {
  it('targets the natural resting value for an enter-only key', () => {
    // opacity is in the enter bag but not the base → target its resting 1.
    expect(resolveEnterTargets({}, { opacity: 0 })).toEqual({ opacity: 1 });
  });

  it('targets a structurally-valid identity transform array, not a scalar 0', () => {
    const to = resolveEnterTargets({}, { transform: [{ translateX: -20 }] as never });
    expect(to.transform).toEqual([{ translateX: 0 }]);
  });

  it('targets the base value when the base pins the key', () => {
    expect(resolveEnterTargets({ opacity: 0.3 }, { opacity: 0 })).toEqual({ opacity: 0.3 });
  });
});
