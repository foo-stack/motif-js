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

  it('preserves percentage translate args as strings (centering idiom)', () => {
    // RN reads `'%'` translates relative to the element; converting to a
    // DIP number (-50) silently breaks `translate(-50%, -50%)` centering.
    expect(parseTransformString('translate(-50%, -50%)')).toEqual([
      { translateX: '-50%' },
      { translateY: '-50%' },
    ]);
  });

  it('keeps a single-axis percentage translate as a string', () => {
    expect(parseTransformString('translateY(100%)')).toEqual([{ translateY: '100%' }]);
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

  it('normalizes web display modes for RN (#294)', () => {
    // RN accepts only none/flex/contents. inline-flex → flex; strip whiteSpace
    // (a WEB_ONLY_KEY) - so the badge recipe is safe on native.
    const badge = sanitizeNativeStyle({ display: 'inline-flex', whiteSpace: 'nowrap', padding: 4 });
    expect(badge.display).toBe('flex');
    expect(badge.whiteSpace).toBeUndefined();
    expect(badge.padding).toBe(4);
    // A non-flex web display mode is dropped (RN falls back to its default).
    expect(sanitizeNativeStyle({ display: 'inline-block' }).display).toBeUndefined();
    expect(sanitizeNativeStyle({ display: 'grid' }).display).toBeUndefined();
    // Valid RN values pass through untouched.
    expect(sanitizeNativeStyle({ display: 'none' }).display).toBe('none');
    expect(sanitizeNativeStyle({ display: 'flex' }).display).toBe('flex');
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

  it('maps the textDecoration shorthand to RN textDecorationLine', () => {
    const out = sanitizeNativeStyle({ textDecoration: 'underline' });
    expect(out.textDecoration).toBeUndefined();
    expect(out.textDecorationLine).toBe('underline');
  });

  it('collapses a per-side border style onto borderStyle', () => {
    const out = sanitizeNativeStyle({ borderLeftStyle: 'solid', borderLeftWidth: 4 });
    expect(out.borderLeftStyle).toBeUndefined();
    expect(out.borderStyle).toBe('solid');
    expect(out.borderLeftWidth).toBe(4);
  });

  it('drops the non-color background family but keeps backgroundColor', () => {
    const out = sanitizeNativeStyle({
      backgroundImage: 'url(x.png)',
      backgroundRepeat: 'no-repeat',
      backgroundColor: '#fff',
    });
    expect(out.backgroundImage).toBeUndefined();
    expect(out.backgroundRepeat).toBeUndefined();
    expect(out.backgroundColor).toBe('#fff');
  });

  it('drops the grid family and word-break web keys', () => {
    const out = sanitizeNativeStyle({
      gridTemplateColumns: '1fr 1fr',
      gridGap: 8,
      wordBreak: 'break-word',
      overflowWrap: 'anywhere',
      hyphens: 'auto',
      color: 'red',
    });
    expect(out.gridTemplateColumns).toBeUndefined();
    expect(out.gridGap).toBeUndefined();
    expect(out.wordBreak).toBeUndefined();
    expect(out.overflowWrap).toBeUndefined();
    expect(out.hyphens).toBeUndefined();
    expect(out.color).toBe('red');
  });

  it('resolves vw/vh lengths against the window (mock 360×640)', () => {
    const out = sanitizeNativeStyle({ width: '100vw', height: '50vh' });
    expect(out.width).toBe(360);
    expect(out.height).toBe(320);
  });

  it('resolves leading-dot and signed decimal viewport values', () => {
    // `.5vw` and `-1.5vh` must still parse after the regex was rewritten
    // to a non-backtracking form.
    expect(sanitizeNativeStyle({ width: '.5vw' }).width).toBeCloseTo((0.5 / 100) * 360);
    expect(sanitizeNativeStyle({ height: '-1.5vh' }).height).toBeCloseTo((-1.5 / 100) * 640);
  });

  it('matches a viewport value in linear time on adversarial input (ReDoS guard)', () => {
    // The previous `\d*\.?\d+` form backtracked polynomially: a ~160 KB
    // run of digits with a near-miss suffix took ~14 s. The non-ambiguous
    // form matches it in well under a millisecond. A generous bound keeps
    // the test non-flaky while still catching a regression to quadratic
    // (which would take tens of seconds).
    const malicious = '1'.repeat(200_000) + 'vx';
    const start = Date.now();
    const out = sanitizeNativeStyle({ width: malicious });
    expect(Date.now() - start).toBeLessThan(1000);
    // Not a valid vw/vh value → passed through untouched, not converted.
    expect(out.width).toBe(malicious);
  });

  it('maps a monospace font stack to RN monospace and drops the sans stack', () => {
    const mono = sanitizeNativeStyle({
      fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
    });
    expect(mono.fontFamily).toBe('monospace');

    const sans = sanitizeNativeStyle({
      fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    });
    expect(sans.fontFamily).toBeUndefined();
  });

  it('keeps a concrete author-led font family (stripping the web fallback tail)', () => {
    expect(sanitizeNativeStyle({ fontFamily: 'Inter, sans-serif' }).fontFamily).toBe('Inter');
    expect(sanitizeNativeStyle({ fontFamily: 'Inter' }).fontFamily).toBe('Inter');
  });
});
