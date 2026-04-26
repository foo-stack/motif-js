import { describe, expect, it } from 'vitest';
import { resolveResponsiveStylesToVars, resolveStyles, resolveStylesToVars } from './style.js';
import type { Theme } from './types.js';

const theme: Theme = {
  name: 'test',
  tokens: {
    colors: {
      blue: { 500: '#3b82f6' },
      surface: { default: '$colors.blue.500' },
    },
    space: { 0: 0, 1: 4, 4: 16 },
    radii: { md: 8 },
    sizes: { full: '100%' },
  },
};

describe('resolveStyles — basic mapping', () => {
  it('maps a known style prop to its CSS property', () => {
    const { style, rest } = resolveStyles({ p: 16 }, theme);
    expect(style).toEqual({ padding: 16 });
    expect(rest).toEqual({});
  });

  it('passes literal values through unchanged', () => {
    const { style } = resolveStyles({ width: 200, color: '#ff0000' }, theme);
    expect(style).toEqual({ width: 200, color: '#ff0000' });
  });

  it('separates non-style props into rest', () => {
    const { style, rest } = resolveStyles(
      { p: 16, onClick: () => {}, id: 'demo', children: 'hello' },
      theme,
    );
    expect(style).toEqual({ padding: 16 });
    expect(Object.keys(rest)).toEqual(['onClick', 'id', 'children']);
  });
});

describe('resolveStyles — token resolution', () => {
  it('resolves bare token refs using the prop scale', () => {
    const { style } = resolveStyles({ p: '$4', bg: '$blue.500' }, theme);
    expect(style).toEqual({ padding: 16, backgroundColor: '#3b82f6' });
  });

  it('resolves explicit-scale refs', () => {
    const { style } = resolveStyles({ p: '$space.4' }, theme);
    expect(style).toEqual({ padding: 16 });
  });

  it('resolves semantic refs', () => {
    const { style } = resolveStyles({ bg: '$colors.surface.default' }, theme);
    expect(style).toEqual({ backgroundColor: '#3b82f6' });
  });
});

describe('resolveStyles — shorthand expansion', () => {
  it('expands px to paddingLeft + paddingRight', () => {
    const { style } = resolveStyles({ px: '$4' }, theme);
    expect(style).toEqual({ paddingLeft: 16, paddingRight: 16 });
  });

  it('expands my to marginTop + marginBottom', () => {
    const { style } = resolveStyles({ my: 8 }, theme);
    expect(style).toEqual({ marginTop: 8, marginBottom: 8 });
  });
});

describe('resolveStyles — bailouts', () => {
  it('drops null and undefined style props', () => {
    const { style } = resolveStyles({ p: undefined, m: null, bg: '#fff' }, theme);
    expect(style).toEqual({ backgroundColor: '#fff' });
  });

  it('drops unresolved token refs', () => {
    const { style } = resolveStyles({ p: '$nope', bg: '#fff' }, theme);
    expect(style).toEqual({ backgroundColor: '#fff' });
  });

  it('passes refs through as undefined when no theme is provided', () => {
    const { style } = resolveStyles({ p: '$4' }, undefined);
    // No theme → ref doesn't resolve → drop.
    expect(style).toEqual({});
  });
});

describe('resolveStyles — typography & layout', () => {
  it('handles non-tokenised props', () => {
    const { style } = resolveStyles(
      { display: 'flex', flexDirection: 'row', alignItems: 'center' },
      theme,
    );
    expect(style).toEqual({
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    });
  });

  it('handles a kitchen-sink prop bag (literal mode)', () => {
    const { style, rest } = resolveStyles(
      {
        p: '$4',
        bg: '$blue.500',
        color: '#ffffff',
        borderRadius: '$md',
        w: '$full',
        display: 'flex',
        flexDirection: 'column',
        gap: '$1',
        children: 'hi',
        onClick: () => {},
      },
      theme,
    );
    expect(style).toEqual({
      padding: 16,
      backgroundColor: '#3b82f6',
      color: '#ffffff',
      borderRadius: 8,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    });
    expect(Object.keys(rest)).toEqual(['children', 'onClick']);
  });
});

describe('resolveStylesToVars — CSS variable mode', () => {
  it('emits var() refs for token refs (explicit and bare)', () => {
    const { style } = resolveStylesToVars({ p: '$4', bg: '$blue.500' });
    expect(style).toEqual({
      padding: 'var(--space-4)',
      backgroundColor: 'var(--colors-blue-500)',
    });
  });

  it('passes literal values through unchanged', () => {
    const { style } = resolveStylesToVars({ p: 16, bg: '#ff0000', display: 'flex' });
    expect(style).toEqual({ padding: 16, backgroundColor: '#ff0000', display: 'flex' });
  });

  it('expands shorthand to multiple CSS properties', () => {
    const { style } = resolveStylesToVars({ px: '$4', my: '$2' });
    expect(style).toEqual({
      paddingLeft: 'var(--space-4)',
      paddingRight: 'var(--space-4)',
      marginTop: 'var(--space-2)',
      marginBottom: 'var(--space-2)',
    });
  });

  it('separates non-style props into rest', () => {
    const { style, rest } = resolveStylesToVars({
      p: '$4',
      onClick: () => {},
      children: 'hi',
    });
    expect(style).toEqual({ padding: 'var(--space-4)' });
    expect(Object.keys(rest)).toEqual(['onClick', 'children']);
  });

  it('drops null and undefined style props', () => {
    const { style } = resolveStylesToVars({ p: undefined, m: null, bg: '$blue.500' });
    expect(style).toEqual({ backgroundColor: 'var(--colors-blue-500)' });
  });

  it('drops refs that cannot be encoded (no scale info)', () => {
    // `display` has no scale, and a bare ref has no defaultScale either.
    const { style } = resolveStylesToVars({ display: '$something', p: '$4' });
    expect(style).toEqual({ padding: 'var(--space-4)' });
  });
});

describe('resolveResponsiveStylesToVars', () => {
  it('handles non-responsive props identically to resolveStylesToVars', () => {
    const { baseStyle, mediaRules } = resolveResponsiveStylesToVars({ p: '$4', bg: '#fff' });
    expect(baseStyle).toEqual({ padding: 'var(--space-4)', backgroundColor: '#fff' });
    expect(mediaRules).toEqual([]);
  });

  it('puts the `base` slot in baseStyle and breakpoints in mediaRules', () => {
    const { baseStyle, mediaRules } = resolveResponsiveStylesToVars({
      p: { base: '$2', md: '$4', lg: '$6' },
    });
    expect(baseStyle).toEqual({ padding: 'var(--space-2)' });
    expect(mediaRules).toEqual([
      { media: '@media (min-width: 768px)', style: { padding: 'var(--space-4)' } },
      { media: '@media (min-width: 1024px)', style: { padding: 'var(--space-6)' } },
    ]);
  });

  it('emits breakpoints in mobile-first order regardless of object key order', () => {
    const { mediaRules } = resolveResponsiveStylesToVars({
      p: { lg: '$8', sm: '$2', md: '$4' },
    });
    expect(mediaRules.map((r) => r.media)).toEqual([
      '@media (min-width: 640px)',
      '@media (min-width: 768px)',
      '@media (min-width: 1024px)',
    ]);
  });

  it('expands shorthand inside responsive values', () => {
    const { baseStyle, mediaRules } = resolveResponsiveStylesToVars({
      px: { base: '$2', md: '$4' },
    });
    expect(baseStyle).toEqual({
      paddingLeft: 'var(--space-2)',
      paddingRight: 'var(--space-2)',
    });
    expect(mediaRules[0]?.style).toEqual({
      paddingLeft: 'var(--space-4)',
      paddingRight: 'var(--space-4)',
    });
  });

  it('mixes responsive and non-responsive props in one bag', () => {
    const { baseStyle, mediaRules } = resolveResponsiveStylesToVars({
      p: { base: '$2', md: '$4' },
      bg: '$colors.surface.base',
      display: 'flex',
    });
    expect(baseStyle).toEqual({
      padding: 'var(--space-2)',
      backgroundColor: 'var(--colors-surface-base)',
      display: 'flex',
    });
    expect(mediaRules).toEqual([
      { media: '@media (min-width: 768px)', style: { padding: 'var(--space-4)' } },
    ]);
  });

  it('drops unknown breakpoint keys silently', () => {
    const { baseStyle, mediaRules } = resolveResponsiveStylesToVars({
      p: { base: '$2', xxl: '$8' },
    });
    expect(baseStyle).toEqual({ padding: 'var(--space-2)' });
    expect(mediaRules).toEqual([]);
  });

  it('separates non-style props into rest', () => {
    const { rest } = resolveResponsiveStylesToVars({
      p: { base: '$2', md: '$4' },
      onClick: () => {},
      id: 'demo',
    });
    expect(Object.keys(rest)).toEqual(['onClick', 'id']);
  });
});
