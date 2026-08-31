import { describe, expect, it } from 'vitest';
import { extractNative } from './extract-native.js';
import type { CallSiteAnalysis } from './types.js';

function fakeStaticAnalysis(props: Record<string, unknown>): CallSiteAnalysis {
  return {
    classification: 'static',
    staticProps: Object.entries(props).map(([name, value]) => ({
      name,
      isStatic: true as const,
      value,
    })),
    dynamicProps: [],
    passThrough: [],
    pseudoStateProps: [],
    motionProps: [],
    hasSpread: false,
  };
}

describe('extractNative', () => {
  it('extracts plain literal numeric / string props', () => {
    const result = extractNative(fakeStaticAnalysis({ p: 4, bg: '#fff' }));
    expect(result.style).toEqual({ padding: 4, backgroundColor: '#fff' });
    expect(result.consumedProps).toEqual(['p', 'bg']);
  });

  it('skips token-ref values (theme is dynamic on native)', () => {
    const result = extractNative(fakeStaticAnalysis({ bg: '$colors.brand.500' }));
    expect(result.consumedProps).toEqual([]);
    expect(result.style).toEqual({});
  });

  // #175 - responsive values resolve against the live viewport at runtime.
  // Extracting only `base` and consuming the prop would pin the element to
  // `base` at every breakpoint and drop the overrides, so the whole prop is
  // left on the JSX (nothing extracted, nothing consumed).
  it('leaves responsive objects on the JSX (does not extract base)', () => {
    const result = extractNative(fakeStaticAnalysis({ p: { base: 4, md: 8 } }));
    expect(result.style).toEqual({});
    expect(result.consumedProps).toEqual([]);
  });

  it('leaves responsive objects with no base slot on the JSX', () => {
    const result = extractNative(fakeStaticAnalysis({ p: { md: 8 } }));
    expect(result.style).toEqual({});
    expect(result.consumedProps).toEqual([]);
  });

  it('leaves responsive objects whose base is a token ref on the JSX', () => {
    const result = extractNative(fakeStaticAnalysis({ p: { base: '$2', md: '$4' } }));
    expect(result.style).toEqual({});
    expect(result.consumedProps).toEqual([]);
  });

  it('leaves responsive array form on the JSX', () => {
    const result = extractNative(fakeStaticAnalysis({ p: [4, 8, 12] }));
    expect(result.style).toEqual({});
    expect(result.consumedProps).toEqual([]);
  });

  it('leaves responsive DSL form on the JSX', () => {
    const result = extractNative(fakeStaticAnalysis({ p: 'base:4 md:8' }));
    expect(result.style).toEqual({});
    expect(result.consumedProps).toEqual([]);
  });

  it('still extracts a mix of literals while leaving the responsive prop', () => {
    const result = extractNative(fakeStaticAnalysis({ p: 4, m: { base: 2, md: 6 } }));
    expect(result.style).toEqual({ padding: 4 });
    expect(result.consumedProps).toEqual(['p']);
  });

  it('maps the logical shorthand px → paddingInline', () => {
    const result = extractNative(fakeStaticAnalysis({ px: 12 }));
    expect(result.style).toEqual({ paddingInline: 12 });
  });

  it('returns empty result for dynamic classification', () => {
    const result = extractNative({
      classification: 'dynamic',
      staticProps: [],
      dynamicProps: [],
      passThrough: [],
      pseudoStateProps: [],
      motionProps: [],
      hasSpread: false,
    });
    expect(result.style).toEqual({});
    expect(result.consumedProps).toEqual([]);
  });

  it('leaves motion props on the JSX (no native StyleSheet equivalent)', () => {
    // Motion props aren't reduced to a StyleSheet entry on native - the
    // runtime driver owns the entry/exit lifecycle, not the static
    // sheet. extractNative should ignore them entirely (consumedProps
    // stays clean so the rewriter leaves the attributes in place).
    const result = extractNative({
      classification: 'static',
      staticProps: [{ name: 'opacity', isStatic: true as const, value: 1 }],
      dynamicProps: [],
      passThrough: [],
      pseudoStateProps: [],
      motionProps: [
        { name: 'enterStyle', value: { opacity: 0 } },
        { name: 'animation', value: 'normal' },
      ],
      hasSpread: false,
    });
    expect(result.style).toEqual({ opacity: 1 });
    expect(result.consumedProps).toEqual(['opacity']);
  });
});
