import { buildAtRulesCss, hashAtRules, resolveResponsiveStylesToVars } from '@motif-js/core';
import { describe, expect, it } from 'vitest';
import { extractWeb } from './extract-web.js';
import type { CallSiteAnalysis } from './types.js';

/**
 * Build a synthetic `CallSiteAnalysis` from a flat props bag. Lets us
 * compare extract-web output against the runtime resolver path on
 * exactly the same input.
 */
function fakeStaticAnalysis(props: Record<string, unknown>): CallSiteAnalysis {
  const staticProps = Object.entries(props).map(([name, value]) => ({
    name,
    isStatic: true as const,
    value,
  }));
  return {
    classification: 'static',
    staticProps,
    dynamicProps: [],
    passThrough: [],
    pseudoStateProps: [],
    hasSpread: false,
  };
}

/**
 * Differential parity: the compiler must produce the exact same
 * `inlineStyle` and class name the runtime would for the same input.
 */
describe('extractWeb — runtime parity', () => {
  const cases: Record<string, Record<string, unknown>> = {
    'literal padding + bg': { p: 4, bg: '$colors.brand.500' },
    'responsive object — base + md': { p: { base: '$2', md: '$4' } },
    'full responsive ladder': {
      p: { base: '$1', sm: '$2', md: '$4', lg: '$6', xl: '$8' },
    },
    'array responsive': { p: ['$2', '$4', '$6'] },
    'DSL responsive': { p: 'base:$2 md:$4 lg:$8' },
    'anonymous container query': { p: { base: '$2', '@md': '$8' } },
    'named container query': { p: { base: '$2', '@card.lg': '$10' } },
    'mixed media + container': {
      p: { base: '$1', md: '$2', '@card.lg': '$8' },
    },
    'multi-prop': { p: 4, bg: '$colors.surface.base', borderRadius: '$2' },
  };

  for (const [name, props] of Object.entries(cases)) {
    it(`matches runtime for: ${name}`, () => {
      const expected = resolveResponsiveStylesToVars(props);
      const expectedClass = expected.atRules.length > 0 ? hashAtRules(expected.atRules) : undefined;
      const expectedCss =
        expectedClass === undefined ? '' : buildAtRulesCss(expectedClass, expected.atRules);

      const actual = extractWeb(fakeStaticAnalysis(props));

      expect(actual.inlineStyle).toEqual(expected.baseStyle);
      expect(actual.className).toEqual(expectedClass);
      expect(actual.css).toEqual(expectedCss);
      expect(actual.consumedProps).toEqual(Object.keys(props));
    });
  }
});

describe('extractWeb — bailouts', () => {
  it('returns empty result for dynamic classification', () => {
    const result = extractWeb({
      classification: 'dynamic',
      staticProps: [],
      dynamicProps: [],
      passThrough: [],
      pseudoStateProps: [],
      hasSpread: false,
    });
    expect(result).toEqual({
      inlineStyle: {},
      className: undefined,
      css: '',
      consumedProps: [],
    });
  });

  it('returns empty result when there are no static style props', () => {
    const result = extractWeb({
      classification: 'static',
      staticProps: [],
      dynamicProps: [],
      passThrough: [{ name: 'onClick', isStatic: true }],
      pseudoStateProps: [],
      hasSpread: false,
    });
    expect(result.consumedProps).toEqual([]);
    expect(result.inlineStyle).toEqual({});
  });

  it('extracts only the static subset for partial-static input', () => {
    const result = extractWeb({
      classification: 'partial-static',
      staticProps: [{ name: 'p', isStatic: true, value: 4 }],
      dynamicProps: [{ name: 'bg', isStatic: false }],
      passThrough: [],
      pseudoStateProps: [],
      hasSpread: false,
    });
    expect(result.consumedProps).toEqual(['p']);
    expect(result.inlineStyle).toEqual({ padding: 4 });
  });

  it('extracts pseudo-state bags into a className + CSS', () => {
    const result = extractWeb({
      classification: 'static',
      staticProps: [],
      dynamicProps: [],
      passThrough: [],
      pseudoStateProps: [{ name: '_hover', pseudo: ':hover', style: { opacity: 0.9 } }],
      hasSpread: false,
    });
    expect(result.consumedProps).toEqual(['_hover']);
    expect(result.className).toMatch(/^m-[a-z0-9]+$/);
    expect(result.css).toContain(':hover');
    expect(result.css).toContain('opacity: 0.9');
  });

  it('combines at-rule and pseudo class names with a space', () => {
    const result = extractWeb({
      classification: 'static',
      staticProps: [{ name: 'p', isStatic: true, value: { base: 4, md: 8 } }],
      dynamicProps: [],
      passThrough: [],
      pseudoStateProps: [{ name: '_hover', pseudo: ':hover', style: { opacity: 0.9 } }],
      hasSpread: false,
    });
    expect(result.className).toMatch(/^m-[a-z0-9]+ m-[a-z0-9]+$/);
  });

  it('rewrites & in pseudo selectors to the generated class', () => {
    const result = extractWeb({
      classification: 'static',
      staticProps: [],
      dynamicProps: [],
      passThrough: [],
      pseudoStateProps: [
        {
          name: '_disabled',
          pseudo: ':disabled, &[aria-disabled="true"]',
          style: { opacity: 0.5 },
        },
      ],
      hasSpread: false,
    });
    const cls = result.className!;
    expect(result.css).toContain(`.${cls}[aria-disabled="true"]`);
    expect(result.css).toContain(':disabled');
  });
});
