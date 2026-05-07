import { describe, expect, it } from 'vitest';
import { keyframesToCss, makeKeyframe } from './keyframes.js';
import { isKeyframe, keyframeBrand } from './style-props.js';

describe('keyframesToCss', () => {
  it('emits a @keyframes block with stable hash-based name', () => {
    const { name, css } = keyframesToCss({
      '0%': { opacity: 0 },
      '100%': { opacity: 1 },
    });
    expect(name).toMatch(/^m-anim-[a-z0-9]+$/);
    expect(css).toContain('@keyframes m-anim-');
    expect(css).toContain('0% { opacity: 0;');
    expect(css).toContain('100% { opacity: 1;');
  });

  it('produces identical names for identical bodies', () => {
    const a = keyframesToCss({ '0%': { opacity: 0 }, '100%': { opacity: 1 } });
    const b = keyframesToCss({ '0%': { opacity: 0 }, '100%': { opacity: 1 } });
    expect(a.name).toBe(b.name);
    expect(a.css).toBe(b.css);
  });

  it('produces different names for different bodies', () => {
    const a = keyframesToCss({ '0%': { opacity: 0 }, '100%': { opacity: 1 } });
    const b = keyframesToCss({ '0%': { opacity: 0 }, '100%': { opacity: 0.5 } });
    expect(a.name).not.toBe(b.name);
  });

  it('resolves token references inside step values to var()', () => {
    const { css } = keyframesToCss({
      from: { backgroundColor: '$colors.bg.base' },
      to: { backgroundColor: '$colors.surface.raised' },
    });
    expect(css).toContain('background-color: var(--colors-bg-base)');
    expect(css).toContain('background-color: var(--colors-surface-raised)');
  });

  it('passes through raw CSS keys (transform, filter)', () => {
    const { css } = keyframesToCss({
      '0%': { transform: 'translateX(0)', filter: 'blur(0)' },
      '100%': { transform: 'translateX(-50%)', filter: 'blur(4px)' },
    });
    expect(css).toContain('transform: translateX(0)');
    expect(css).toContain('transform: translateX(-50%)');
    expect(css).toContain('filter: blur(0)');
    expect(css).toContain('filter: blur(4px)');
  });

  it('accepts `from` / `to` keywords', () => {
    const { css } = keyframesToCss({
      from: { opacity: 0 },
      to: { opacity: 1 },
    });
    expect(css).toContain('from { opacity: 0;');
    expect(css).toContain('to { opacity: 1;');
  });
});

describe('makeKeyframe (branded)', () => {
  it('returns a branded Keyframe object', () => {
    const k = makeKeyframe({ '0%': { opacity: 0 }, '100%': { opacity: 1 } });
    expect(isKeyframe(k)).toBe(true);
    expect(k[keyframeBrand]).toBe(true);
    expect(k.name).toMatch(/^m-anim-/);
    expect(k.css).toContain('@keyframes');
  });

  it('isKeyframe rejects unbranded shapes', () => {
    expect(isKeyframe({ name: 'spin', css: '@keyframes spin { ... }' })).toBe(false);
    expect(isKeyframe('spin')).toBe(false);
    expect(isKeyframe(undefined)).toBe(false);
    expect(isKeyframe(null)).toBe(false);
  });
});
