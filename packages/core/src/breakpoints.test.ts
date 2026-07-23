import { afterEach, describe, expect, it } from 'vitest';
import {
  activeBreakpoint,
  breakpointMatches,
  configureBreakpoints,
  containerQueryForBreakpoint,
  getBreakpoints,
  isResponsiveObject,
  isResponsiveObjectOfObjects,
  mediaQueryForBreakpoint,
  parseResponsiveDSL,
  parseResponsiveKey,
  responsiveArrayToObject,
} from './breakpoints.js';

describe('isResponsiveObjectOfObjects (#191)', () => {
  it('treats a scalar-valued breakpoint-keyed object as NON-responsive (serializes)', () => {
    // The disambiguator for object-form value props: `{ md: 400 }` is the
    // direct value, not a responsive map — its value is a scalar.
    expect(isResponsiveObjectOfObjects({ md: 400 })).toBe(false);
    expect(isResponsiveObjectOfObjects({ wght: 400, slnt: 0 })).toBe(false);
  });

  it('treats a breakpoint-keyed object with object values as responsive', () => {
    expect(isResponsiveObjectOfObjects({ base: { wght: 400 }, md: { wght: 700 } })).toBe(true);
  });

  it('still recognises a plain scalar responsive object via isResponsiveObject', () => {
    // The lenient guard (used by the responsive resolver) is unchanged.
    expect(isResponsiveObject({ base: '$2', md: '$4' })).toBe(true);
    expect(isResponsiveObject({ base: '$2', xxl: '$8' })).toBe(true); // typo'd key tolerated
  });
});

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

describe('responsiveArrayToObject', () => {
  it('maps array positions to base + breakpoint keys', () => {
    expect(responsiveArrayToObject([1, 2, 3, 4, 5, 6])).toEqual({
      base: 1,
      sm: 2,
      md: 3,
      lg: 4,
      xl: 5,
      '2xl': 6,
    });
  });

  it('handles short arrays', () => {
    expect(responsiveArrayToObject([1, 2, 3])).toEqual({ base: 1, sm: 2, md: 3 });
  });

  it('drops `undefined` slots so sparse arrays work', () => {
    // eslint-disable-next-line no-sparse-arrays
    expect(responsiveArrayToObject([1, undefined, 3])).toEqual({ base: 1, md: 3 });
  });

  it('ignores trailing slots beyond the last breakpoint', () => {
    expect(responsiveArrayToObject([1, 2, 3, 4, 5, 6, 'extra', 'ignored'])).toEqual({
      base: 1,
      sm: 2,
      md: 3,
      lg: 4,
      xl: 5,
      '2xl': 6,
    });
  });

  it('returns an empty object for an empty array', () => {
    expect(responsiveArrayToObject([])).toEqual({});
  });
});

describe('parseResponsiveDSL', () => {
  it('parses plain breakpoint pairs', () => {
    expect(parseResponsiveDSL('sm:4 md:8')).toEqual({ sm: 4, md: 8 });
  });

  it('parses base + breakpoint pairs', () => {
    expect(parseResponsiveDSL('base:2 md:6 lg:8')).toEqual({ base: 2, md: 6, lg: 8 });
  });

  it('coerces purely numeric values to numbers', () => {
    expect(parseResponsiveDSL('md:8')).toEqual({ md: 8 });
    expect(parseResponsiveDSL('md:0.5')).toEqual({ md: 0.5 });
    expect(parseResponsiveDSL('md:-4')).toEqual({ md: -4 });
  });

  it('keeps non-numeric values as strings', () => {
    expect(parseResponsiveDSL('md:8px')).toEqual({ md: '8px' });
    expect(parseResponsiveDSL('md:1.5rem')).toEqual({ md: '1.5rem' });
    expect(parseResponsiveDSL('md:$4')).toEqual({ md: '$4' });
    expect(parseResponsiveDSL('md:#fff')).toEqual({ md: '#fff' });
  });

  // #152 — only coerce when the round-trip is lossless, so string token-key
  // segments ('050', '075', '1.50') survive instead of becoming numbers
  // that no longer match the intended key.
  it('keeps numeric-looking strings that would not round-trip losslessly', () => {
    expect(parseResponsiveDSL('md:09')).toEqual({ md: '09' });
    expect(parseResponsiveDSL('md:050')).toEqual({ md: '050' });
    expect(parseResponsiveDSL('md:1.50')).toEqual({ md: '1.50' });
    // Genuinely lossless numbers still coerce.
    expect(parseResponsiveDSL('md:8')).toEqual({ md: 8 });
    expect(parseResponsiveDSL('md:0.5')).toEqual({ md: 0.5 });
  });

  it('parses container-query keys', () => {
    expect(parseResponsiveDSL('@md:4')).toEqual({ '@md': 4 });
    expect(parseResponsiveDSL('@card.lg:8')).toEqual({ '@card.lg': 8 });
  });

  it('mixes media + container in one DSL', () => {
    expect(parseResponsiveDSL('base:1 md:4 @card.lg:8')).toEqual({
      base: 1,
      md: 4,
      '@card.lg': 8,
    });
  });

  it('collapses extra whitespace between tokens', () => {
    expect(parseResponsiveDSL('  sm:2   md:4  ')).toEqual({ sm: 2, md: 4 });
  });

  it('returns null when any token has an unknown key', () => {
    expect(parseResponsiveDSL('hover:red')).toBeNull();
    expect(parseResponsiveDSL('sm:4 hover:red')).toBeNull();
  });

  it('returns null when a token has no colon', () => {
    expect(parseResponsiveDSL('sm:4 md')).toBeNull();
    expect(parseResponsiveDSL('justastring')).toBeNull();
  });

  it('returns null when a token has an empty value', () => {
    expect(parseResponsiveDSL('sm:')).toBeNull();
    expect(parseResponsiveDSL('sm: 4')).toBeNull(); // space after colon → empty value, then "4" with no colon
  });

  it('returns null for empty input', () => {
    expect(parseResponsiveDSL('')).toBeNull();
    expect(parseResponsiveDSL('   ')).toBeNull();
  });

  it('returns null for typical literal CSS values', () => {
    // Heuristic safety: literal CSS values should not parse as DSL.
    expect(parseResponsiveDSL('url(http://example.com/x.png)')).toBeNull();
    expect(parseResponsiveDSL('rgb(0, 0, 0)')).toBeNull();
    expect(parseResponsiveDSL('1fr 2fr')).toBeNull();
    expect(parseResponsiveDSL('translateX(8px) rotate(45deg)')).toBeNull();
  });

  // Regression (#108): values containing declaration/rule punctuation are
  // literal/serialized CSS, never a DSL — even if a fragment looks like
  // `<bp>:<value>`.
  it('returns null for values containing ; { or } (literal/serialized CSS)', () => {
    expect(parseResponsiveDSL('md:8px; color: red')).toBeNull();
    expect(parseResponsiveDSL('.x { md:8 }')).toBeNull();
    expect(parseResponsiveDSL('grid-template: "a" 1fr;')).toBeNull();
  });

  // Documents the intentional precedence: a `<bp>:<value>`-shaped string is
  // interpreted as responsive (no valid CSS literal has this shape).
  it('treats a breakpoint-shaped string as responsive (documented precedence)', () => {
    expect(parseResponsiveDSL('md:1fr')).toEqual({ md: '1fr' });
    // A space-free calc value is a single DSL token; a value with internal
    // spaces tokenizes apart and falls back to literal (null).
    expect(parseResponsiveDSL('md:calc(100%-8px)')).toEqual({ md: 'calc(100%-8px)' });
    expect(parseResponsiveDSL('md:calc(100% - 8px)')).toBeNull();
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

describe('parseResponsiveKey — prototype-chain safety (#273)', () => {
  it('does not treat inherited Object.prototype keys as breakpoints', () => {
    expect(parseResponsiveKey('hasOwnProperty')).toBeNull();
    expect(parseResponsiveKey('constructor')).toBeNull();
    expect(parseResponsiveKey('toString')).toBeNull();
    expect(parseResponsiveKey('valueOf')).toBeNull();
  });
});

describe('parseResponsiveKey — container-name CSS-ident guard (#284)', () => {
  it('accepts valid CSS-ident container names', () => {
    expect(parseResponsiveKey('@card.md')).toEqual({ kind: 'container', bp: 'md', name: 'card' });
    expect(parseResponsiveKey('@main-nav.lg')).toEqual({
      kind: 'container',
      bp: 'lg',
      name: 'main-nav',
    });
    expect(parseResponsiveKey('@_x.sm')).toEqual({ kind: 'container', bp: 'sm', name: '_x' });
  });

  it('rejects names that are not valid CSS idents (no at-rule/selector injection)', () => {
    // The payload from the issue: everything up to the first dot becomes the
    // raw container name, which used to be emitted unescaped into an
    // `@container <name> (...)` prelude.
    expect(parseResponsiveKey('@x){}html{display:none}.y.md')).toBeNull();
    expect(parseResponsiveKey('@a b.md')).toBeNull();
    expect(parseResponsiveKey('@a(min-width:0).md')).toBeNull();
    expect(parseResponsiveKey('@1card.md')).toBeNull();
  });
});

describe('configureBreakpoints', () => {
  // The active map is a module global; reset to defaults after each case so
  // tests don't bleed into one another (or the rest of the suite).
  afterEach(() => configureBreakpoints({}));

  it('defaults are byte-identical to the built-in widths (no behaviour change)', () => {
    expect(mediaQueryForBreakpoint('md')).toBe('@media (min-width: 768px)');
    expect(containerQueryForBreakpoint('lg')).toBe('@container (min-width: 1024px)');
    expect(getBreakpoints().md).toBe(768);
  });

  it('overrides a breakpoint width everywhere it feeds an @media / @container rule', () => {
    configureBreakpoints({ md: 800 });
    expect(mediaQueryForBreakpoint('md')).toBe('@media (min-width: 800px)');
    expect(containerQueryForBreakpoint('md', 'card')).toBe('@container card (min-width: 800px)');
  });

  it('merges over the defaults — unspecified names keep their default width', () => {
    configureBreakpoints({ md: 800 });
    expect(getBreakpoints().sm).toBe(640);
    expect(getBreakpoints().lg).toBe(1024);
    expect(mediaQueryForBreakpoint('sm')).toBe('@media (min-width: 640px)');
  });

  it('shifts the JS match computation in lockstep with the CSS threshold', () => {
    configureBreakpoints({ md: 800 });
    // 790px is below the custom md (800) but would have matched the default (768).
    expect(breakpointMatches(790).md).toBe(false);
    expect(breakpointMatches(800).md).toBe(true);
    expect(activeBreakpoint(790)).toBe('sm');
    expect(activeBreakpoint(800)).toBe('md');
  });

  it('a later configure call replaces an earlier one (set-once semantics)', () => {
    configureBreakpoints({ md: 800 });
    configureBreakpoints({ lg: 1100 });
    // md is back to its default (the second call merges over defaults, not the
    // first call's result); lg is the new value.
    expect(getBreakpoints().md).toBe(768);
    expect(getBreakpoints().lg).toBe(1100);
  });
});
