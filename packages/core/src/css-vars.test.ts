import { describe, expect, it } from 'vitest';
import {
  themeToCssBlock,
  themeToCssVars,
  themesToCssBlock,
  tokenPathToCssVarName,
  tokenRefToCssVar,
} from './css-vars.js';
import type { Theme } from './types.js';

describe('tokenPathToCssVarName', () => {
  it('builds a flat hyphenated name from scale + path', () => {
    expect(tokenPathToCssVarName('colors', ['blue', '500'])).toBe('--colors-blue-500');
    expect(tokenPathToCssVarName('space', ['4'])).toBe('--space-4');
  });

  it('encodes dots in segments to underscores so the result is valid CSS', () => {
    expect(tokenPathToCssVarName('space', ['0.5'])).toBe('--space-0_5');
    expect(tokenPathToCssVarName('space', ['2.5'])).toBe('--space-2_5');
  });

  it('handles deeply nested paths', () => {
    expect(tokenPathToCssVarName('colors', ['action', 'primary', 'bg'])).toBe(
      '--colors-action-primary-bg',
    );
  });
});

describe('tokenRefToCssVar', () => {
  it('rewrites explicit-scale refs to var()', () => {
    expect(tokenRefToCssVar('$colors.blue.500')).toBe('var(--colors-blue-500)');
    expect(tokenRefToCssVar('$space.4')).toBe('var(--space-4)');
  });

  it('uses defaultScale for bare refs', () => {
    expect(tokenRefToCssVar('$primary', 'colors')).toBe('var(--colors-primary)');
    expect(tokenRefToCssVar('$4', 'space')).toBe('var(--space-4)');
  });

  it('returns undefined for bare refs with no defaultScale', () => {
    expect(tokenRefToCssVar('$primary')).toBeUndefined();
  });
});

const lightLike: Theme = {
  name: 'light',
  tokens: {
    colors: {
      white: '#ffffff',
      gray: { 50: '#fafafa', 900: '#18181b' },
      surface: { base: '$colors.white', muted: '$colors.gray.50' },
    },
    space: { 0: 0, 4: 16, '0.5': 2 },
    radii: { md: 8 },
    opacities: { 50: 0.5 },
  },
};

describe('themeToCssVars', () => {
  it('flattens the token tree into name → value entries', () => {
    const map = themeToCssVars(lightLike);
    expect(map.get('--colors-white')).toBe('#ffffff');
    expect(map.get('--colors-gray-50')).toBe('#fafafa');
    expect(map.get('--space-4')).toBe('16px');
    expect(map.get('--space-0_5')).toBe('2px');
    expect(map.get('--radii-md')).toBe('8px');
  });

  it('non-length scales emit bare numbers (no px)', () => {
    const map = themeToCssVars(lightLike);
    expect(map.get('--opacities-50')).toBe('0.5');
  });

  it('semantic refs become var() chains', () => {
    const map = themeToCssVars(lightLike);
    expect(map.get('--colors-surface-base')).toBe('var(--colors-white)');
    expect(map.get('--colors-surface-muted')).toBe('var(--colors-gray-50)');
  });
});

describe('themeToCssBlock', () => {
  it('produces a valid CSS rule scoped to the theme name', () => {
    const block = themeToCssBlock(lightLike);
    expect(block).toContain('[data-theme="light"] {');
    expect(block).toContain('--colors-white: #ffffff;');
    expect(block).toContain('--space-4: 16px;');
    expect(block).toContain('--colors-surface-base: var(--colors-white);');
    expect(block.trim().endsWith('}')).toBe(true);
  });
});

describe('themesToCssBlock', () => {
  it('concatenates blocks with double-newline separators', () => {
    const dark: Theme = { name: 'dark', tokens: { colors: { white: '#000000' } } };
    const block = themesToCssBlock([lightLike, dark]);
    expect(block).toContain('[data-theme="light"]');
    expect(block).toContain('[data-theme="dark"]');
    // Each theme has its own block.
    const lightIdx = block.indexOf('[data-theme="light"]');
    const darkIdx = block.indexOf('[data-theme="dark"]');
    expect(lightIdx).toBeLessThan(darkIdx);
  });
});
