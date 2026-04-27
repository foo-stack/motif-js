import { describe, expect, it } from 'vitest';
import {
  containerQueryForBreakpoint,
  isResponsiveObject,
  mediaQueryForBreakpoint,
  parseResponsiveKey,
} from './breakpoints.js';

describe('parseResponsiveKey', () => {
  it('parses the base key', () => {
    expect(parseResponsiveKey('base')).toEqual({ kind: 'base' });
  });

  it('parses bare breakpoint names as media queries', () => {
    expect(parseResponsiveKey('sm')).toEqual({ kind: 'media', bp: 'sm' });
    expect(parseResponsiveKey('2xl')).toEqual({ kind: 'media', bp: '2xl' });
  });

  it('parses `@<bp>` as an anonymous container query', () => {
    expect(parseResponsiveKey('@md')).toEqual({ kind: 'container', bp: 'md' });
    expect(parseResponsiveKey('@2xl')).toEqual({ kind: 'container', bp: '2xl' });
  });

  it('parses `@<name>.<bp>` as a named container query', () => {
    expect(parseResponsiveKey('@card.lg')).toEqual({
      kind: 'container',
      bp: 'lg',
      name: 'card',
    });
  });

  it('rejects unknown keys', () => {
    expect(parseResponsiveKey('xxl')).toBeNull();
    expect(parseResponsiveKey('hover')).toBeNull();
    expect(parseResponsiveKey('@foo')).toBeNull();
    expect(parseResponsiveKey('@.md')).toBeNull();
    expect(parseResponsiveKey('@card.xxl')).toBeNull();
    expect(parseResponsiveKey('')).toBeNull();
  });

  it('does not treat container names as breakpoint names', () => {
    // `@card` (no breakpoint) is invalid — must be `@card.<bp>`.
    expect(parseResponsiveKey('@card')).toBeNull();
  });
});

describe('mediaQueryForBreakpoint', () => {
  it('produces @media (min-width: ...) prefixes', () => {
    expect(mediaQueryForBreakpoint('md')).toBe('@media (min-width: 768px)');
    expect(mediaQueryForBreakpoint('2xl')).toBe('@media (min-width: 1536px)');
  });
});

describe('containerQueryForBreakpoint', () => {
  it('produces anonymous @container prefixes when no name is given', () => {
    expect(containerQueryForBreakpoint('md')).toBe('@container (min-width: 768px)');
  });

  it('produces named @container prefixes when a name is given', () => {
    expect(containerQueryForBreakpoint('lg', 'card')).toBe('@container card (min-width: 1024px)');
  });
});

describe('isResponsiveObject', () => {
  it('recognises objects with plain breakpoint keys', () => {
    expect(isResponsiveObject({ base: 1, md: 2 })).toBe(true);
  });

  it('recognises objects with only container-query keys', () => {
    expect(isResponsiveObject({ '@card.md': 4 })).toBe(true);
    expect(isResponsiveObject({ '@md': 4 })).toBe(true);
  });

  it('rejects plain objects with no recognised keys', () => {
    expect(isResponsiveObject({ foo: 1, bar: 2 })).toBe(false);
  });

  it('rejects arrays, null, primitives', () => {
    expect(isResponsiveObject([1, 2, 3])).toBe(false);
    expect(isResponsiveObject(null)).toBe(false);
    expect(isResponsiveObject('md')).toBe(false);
    expect(isResponsiveObject(42)).toBe(false);
  });
});
