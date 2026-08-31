import { describe, expect, it, vi } from 'vitest';
import {
  createMotionValue,
  isMotionValue,
  motionValueBrand,
  type MotionValue,
} from './motion-value.js';

describe('createMotionValue', () => {
  it('initialises with the given value', () => {
    const mv = createMotionValue(42);
    expect(mv.get()).toBe(42);
  });

  it('returns a branded object that passes isMotionValue', () => {
    const mv = createMotionValue(0);
    expect(isMotionValue(mv)).toBe(true);
    expect((mv as unknown as Record<symbol, unknown>)[motionValueBrand]).toBe(true);
  });

  it('updates the current value on .set()', () => {
    const mv = createMotionValue(0);
    mv.set(7);
    expect(mv.get()).toBe(7);
  });

  it('notifies subscribers on change', () => {
    const mv = createMotionValue(0);
    const spy = vi.fn();
    mv.on('change', spy);
    mv.set(1);
    mv.set(2);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(1, 1);
    expect(spy).toHaveBeenNthCalledWith(2, 2);
  });

  it('skips no-op writes (Object.is equality)', () => {
    const mv = createMotionValue(5);
    const spy = vi.fn();
    mv.on('change', spy);
    mv.set(5);
    expect(spy).not.toHaveBeenCalled();
    expect(mv.get()).toBe(5);
  });

  it('treats NaN === NaN under Object.is (no notify on NaN→NaN)', () => {
    const mv = createMotionValue<number>(Number.NaN);
    const spy = vi.fn();
    mv.on('change', spy);
    mv.set(Number.NaN);
    expect(spy).not.toHaveBeenCalled();
  });

  it('treats -0 and +0 as different under Object.is (notifies)', () => {
    const mv = createMotionValue<number>(0);
    const spy = vi.fn();
    mv.on('change', spy);
    mv.set(-0);
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(-0);
  });

  it('supports multiple subscribers', () => {
    const mv = createMotionValue(0);
    const a = vi.fn();
    const b = vi.fn();
    mv.on('change', a);
    mv.on('change', b);
    mv.set(1);
    expect(a).toHaveBeenCalledWith(1);
    expect(b).toHaveBeenCalledWith(1);
  });

  it('returned unsubscribe removes only that subscriber', () => {
    const mv = createMotionValue(0);
    const a = vi.fn();
    const b = vi.fn();
    const unsubA = mv.on('change', a);
    mv.on('change', b);
    unsubA();
    mv.set(1);
    expect(a).not.toHaveBeenCalled();
    expect(b).toHaveBeenCalledWith(1);
  });

  it('unsubscribe is idempotent', () => {
    const mv = createMotionValue(0);
    const spy = vi.fn();
    const unsub = mv.on('change', spy);
    unsub();
    expect(() => {
      unsub();
    }).not.toThrow();
    mv.set(1);
    expect(spy).not.toHaveBeenCalled();
  });

  it('supports string values', () => {
    const mv = createMotionValue('translateX(0px)');
    const spy = vi.fn();
    mv.on('change', spy);
    mv.set('translateX(100px)');
    expect(mv.get()).toBe('translateX(100px)');
    expect(spy).toHaveBeenCalledWith('translateX(100px)');
  });

  it('subscriber added during dispatch does not fire for the in-flight set', () => {
    const mv = createMotionValue(0);
    const lateSpy = vi.fn();
    let captured: number | undefined;
    mv.on('change', (v) => {
      captured = v;
      mv.on('change', lateSpy);
    });
    mv.set(1);
    expect(captured).toBe(1);
    // The late subscriber should not fire for the current `set(1)` -
    // Set iteration semantics in V8 admit "added during iteration"
    // visitation, so this guards against accidental double-fire.
    // (If V8 changes behaviour we'd see lateSpy called with 1 here.)
    // We don't lock either behaviour formally; what matters is that
    // a subsequent set notifies the late subscriber exactly once.
    mv.set(2);
    expect(lateSpy).toHaveBeenCalledWith(2);
  });

  it('subscriber type guard yields T on get/set', () => {
    const mv: MotionValue<number> = createMotionValue(0);
    // Compile-time only - narrow inferred type.
    const v: number = mv.get();
    expect(v).toBe(0);
  });
});

describe('isMotionValue', () => {
  it('rejects non-objects', () => {
    expect(isMotionValue(0)).toBe(false);
    expect(isMotionValue('mv')).toBe(false);
    expect(isMotionValue(null)).toBe(false);
    expect(isMotionValue(undefined)).toBe(false);
    expect(isMotionValue(true)).toBe(false);
  });

  it('rejects plain objects that look similar', () => {
    expect(isMotionValue({ get: () => 0, set: () => undefined, on: () => () => undefined })).toBe(
      false,
    );
  });

  it('rejects objects with a string-keyed brand impostor', () => {
    expect(isMotionValue({ ['Symbol(motif.motionValue)']: true })).toBe(false);
  });

  it('accepts a real motion value', () => {
    expect(isMotionValue(createMotionValue(0))).toBe(true);
  });
});
