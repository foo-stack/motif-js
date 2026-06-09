import { describe, expect, it } from 'vitest';
import { parseBoxShadow, parseTransformString, sanitizeNativeStyle } from './_native-style.js';

describe('parseBoxShadow', () => {
  it('maps a token box-shadow string to RN shadow props', () => {
    const shadow = parseBoxShadow('0 1px 2px 0 rgb(0 0 0 / 0.05)');
    expect(shadow).toEqual({
      shadowColor: 'rgb(0, 0, 0)',
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: 2,
      shadowOpacity: 0.05,
      elevation: 2,
    });
  });

  it('uses only the first layer of a multi-layer shadow', () => {
    const shadow = parseBoxShadow(
      '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    );
    expect(shadow?.shadowOffset).toEqual({ width: 0, height: 4 });
    expect(shadow?.shadowRadius).toBe(6);
    expect(shadow?.shadowOpacity).toBe(0.1);
  });

  it('returns null for none / empty', () => {
    expect(parseBoxShadow('none')).toBeNull();
    expect(parseBoxShadow('')).toBeNull();
  });
});

describe('parseTransformString', () => {
  it('array-izes a literal CSS transform string', () => {
    expect(parseTransformString('rotate(45deg)')).toEqual([{ rotate: '45deg' }]);
  });

  it('keeps lengths as numbers and angles as strings', () => {
    expect(parseTransformString('translateX(10px) scale(1.2) rotate(90deg)')).toEqual([
      { translateX: 10 },
      { scale: 1.2 },
      { rotate: '90deg' },
    ]);
  });

  it('expands two-arg translate/scale shorthands into axes', () => {
    expect(parseTransformString('translate(10px, 20px)')).toEqual([
      { translateX: 10 },
      { translateY: 20 },
    ]);
  });

  it('returns null when nothing parses', () => {
    expect(parseTransformString('garbage')).toBeNull();
  });
});

describe('sanitizeNativeStyle', () => {
  it('replaces boxShadow with native shadow props', () => {
    const out = sanitizeNativeStyle({ boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)', padding: 8 });
    expect(out.boxShadow).toBeUndefined();
    expect(out.shadowRadius).toBe(2);
    expect(out.elevation).toBe(2);
    expect(out.padding).toBe(8);
  });

  it('array-izes a literal transform string', () => {
    const out = sanitizeNativeStyle({ transform: 'rotate(45deg)' });
    expect(out.transform).toEqual([{ rotate: '45deg' }]);
  });

  it('leaves an already-array transform untouched', () => {
    const arr = [{ translateX: 5 }];
    const out = sanitizeNativeStyle({ transform: arr });
    expect(out.transform).toBe(arr);
  });

  it('drops web-only keys', () => {
    const out = sanitizeNativeStyle({
      cursor: 'pointer',
      overflowX: 'hidden',
      objectFit: 'cover',
      outlineWidth: 2,
      clipPath: 'circle(50%)',
      color: 'red',
    });
    expect(out.cursor).toBeUndefined();
    expect(out.overflowX).toBeUndefined();
    expect(out.objectFit).toBeUndefined();
    expect(out.outlineWidth).toBeUndefined();
    expect(out.clipPath).toBeUndefined();
    expect(out.color).toBe('red');
  });

  it('returns the same object reference when no translation is needed', () => {
    const input = { padding: 8, color: 'red' };
    expect(sanitizeNativeStyle(input)).toBe(input);
  });
});
