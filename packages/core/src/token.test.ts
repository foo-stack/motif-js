import { describe, expect, it } from 'vitest';
import { isTokenRef, resolveToken, resolveValue } from './token.js';
import type { Theme } from './types.js';

const theme: Theme = {
  name: 'test',
  tokens: {
    colors: {
      blue: { 50: '#eff6ff', 500: '#3b82f6', 900: '#1e3a8a' },
      gray: { 50: '#f9fafb', 900: '#111827' },
      // Semantic — value is a $ref to a primitive
      surface: { default: '$colors.gray.50', raised: '$colors.gray.900' },
      action: { primary: { bg: '$colors.blue.500', fg: '#ffffff' } },
    },
    space: { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16 },
    radii: { sm: 4, md: 8, lg: 12 },
    // Cycle to test cycle protection
    cycle: { a: '$cycle.b', b: '$cycle.a' },
  },
};

describe('isTokenRef', () => {
  it('recognizes $-prefixed strings', () => {
    expect(isTokenRef('$primary')).toBe(true);
    expect(isTokenRef('$colors.blue.500')).toBe(true);
  });

  it('rejects non-references', () => {
    expect(isTokenRef('primary')).toBe(false);
    expect(isTokenRef('')).toBe(false);
    expect(isTokenRef('$')).toBe(false);
    expect(isTokenRef(16)).toBe(false);
    expect(isTokenRef(null)).toBe(false);
    expect(isTokenRef(undefined)).toBe(false);
  });
});

describe('resolveToken — explicit scale paths', () => {
  it('resolves a primitive scalar', () => {
    expect(resolveToken('$colors.blue.500', theme)).toBe('#3b82f6');
  });

  it('resolves numeric scales', () => {
    expect(resolveToken('$space.4', theme)).toBe(16);
    expect(resolveToken('$radii.md', theme)).toBe(8);
  });

  it('returns undefined for unknown paths', () => {
    expect(resolveToken('$colors.purple.500', theme)).toBeUndefined();
    expect(resolveToken('$space.99', theme)).toBeUndefined();
  });

  it('returns undefined when path stops at an interior node', () => {
    expect(resolveToken('$colors.blue', theme)).toBeUndefined();
  });
});

describe('resolveToken — semantic indirection', () => {
  it('follows a single level of $ref indirection', () => {
    expect(resolveToken('$colors.surface.default', theme)).toBe('#f9fafb');
    expect(resolveToken('$colors.surface.raised', theme)).toBe('#111827');
  });

  it('follows nested semantic structures', () => {
    expect(resolveToken('$colors.action.primary.bg', theme)).toBe('#3b82f6');
    expect(resolveToken('$colors.action.primary.fg', theme)).toBe('#ffffff');
  });

  it('short-circuits on cycles', () => {
    expect(resolveToken('$cycle.a', theme)).toBeUndefined();
  });
});

describe('resolveToken — defaultScale fallback', () => {
  it('uses defaultScale when the head segment is unknown', () => {
    expect(resolveToken('$blue.500', theme, { defaultScale: 'colors' })).toBe('#3b82f6');
    expect(resolveToken('$4', theme, { defaultScale: 'space' })).toBe(16);
  });

  it('prefers explicit scale over defaultScale', () => {
    // $colors.blue.500 has 'colors' as known scale — defaultScale ignored.
    expect(resolveToken('$colors.blue.500', theme, { defaultScale: 'space' })).toBe('#3b82f6');
  });

  it('returns undefined when neither path resolves', () => {
    expect(resolveToken('$nope', theme, { defaultScale: 'colors' })).toBeUndefined();
  });
});

describe('resolveValue', () => {
  it('passes literal values through unchanged', () => {
    expect(resolveValue(16, theme)).toBe(16);
    expect(resolveValue('20px', theme)).toBe('20px');
  });

  it('resolves token refs via the theme', () => {
    expect(resolveValue('$space.4', theme)).toBe(16);
    expect(resolveValue('$colors.blue.500', theme)).toBe('#3b82f6');
  });

  it('returns undefined for refs without a theme', () => {
    expect(resolveValue('$space.4', undefined)).toBeUndefined();
  });

  it('returns undefined for unresolved refs', () => {
    expect(resolveValue('$nope', theme)).toBeUndefined();
  });

  it('passes undefined through', () => {
    expect(resolveValue(undefined, theme)).toBeUndefined();
  });
});

describe('resolveToken — prototype-chain safety (#271)', () => {
  it('does not resolve inherited Object.prototype members as token values', () => {
    expect(resolveToken('$colors.valueOf', theme)).toBeUndefined();
    expect(resolveToken('$colors.constructor', theme)).toBeUndefined();
    expect(resolveToken('$colors.hasOwnProperty', theme)).toBeUndefined();
    expect(resolveToken('$colors.toString', theme)).toBeUndefined();
    // eslint-disable-next-line no-proto
    expect(resolveToken('$colors.__proto__', theme)).toBeUndefined();
  });
});
