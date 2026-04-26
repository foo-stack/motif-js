import { describe, expect, it } from 'vitest';
import { resolveStyles } from './style.js';
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

  it('handles a kitchen-sink prop bag', () => {
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
