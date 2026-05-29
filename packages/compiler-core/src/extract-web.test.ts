import {
  buildAtRulesCss,
  hashAtRules,
  liftPseudoOverriddenBaseProps,
  resolveResponsiveStylesToVars,
} from '@usemotif/core';
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
    motionProps: [],
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
      motionProps: [],
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
      motionProps: [],
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
      motionProps: [],
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
      motionProps: [],
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
      motionProps: [],
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
      motionProps: [],
      hasSpread: false,
    });
    const cls = result.className!;
    expect(result.css).toContain(`.${cls}[aria-disabled="true"]`);
    expect(result.css).toContain(':disabled');
  });

  // Regression: a base prop that a state-pseudo bag overrides must be
  // lifted out of inline style into the base class block, or inline
  // (1,0,0,0) clobbers the pseudo rule (0,1,1) and the runtime — which
  // does lift — would emit a different at-rule hash, breaking dedupe.
  it('lifts a base prop overridden by a pseudo bag out of inline style', () => {
    const result = extractWeb({
      classification: 'static',
      staticProps: [{ name: 'boxShadow', isStatic: true, value: '0 0 4px' }],
      dynamicProps: [],
      passThrough: [],
      pseudoStateProps: [
        { name: '_disabled', pseudo: ':disabled, &[aria-disabled="true"]', style: { boxShadow: 'none' } },
      ],
      motionProps: [],
      hasSpread: false,
    });
    // boxShadow must NOT remain inline (it would win over :disabled otherwise).
    expect(result.inlineStyle).not.toHaveProperty('box-shadow');
    expect(result.inlineStyle).not.toHaveProperty('boxShadow');
    // It must appear in the emitted base class CSS instead.
    expect(result.css).toContain('box-shadow');
    // And the byte-identical runtime parity must hold: the lifted base
    // block hashes into the at-rules class. Recompute via the same core
    // helpers the runtime uses and confirm the class is present.
    const { baseStyle, atRules } = resolveResponsiveStylesToVars({ boxShadow: '0 0 4px' });
    const lifted = liftPseudoOverriddenBaseProps(
      baseStyle,
      [{ pseudo: ':disabled, &[aria-disabled="true"]', style: { boxShadow: 'none' } }],
      atRules,
    );
    expect(result.className).toContain(hashAtRules(lifted.atRules));
  });
});

describe('extractWeb — motion props', () => {
  function makeAnalysis(motion: CallSiteAnalysis['motionProps']): CallSiteAnalysis {
    return {
      classification: 'static',
      staticProps: [],
      dynamicProps: [],
      passThrough: [],
      pseudoStateProps: [],
      motionProps: motion,
      hasSpread: false,
    };
  }

  it('extracts a literal `transition` string into inline style', () => {
    const result = extractWeb(makeAnalysis([{ name: 'transition', value: 'opacity 200ms ease' }]));
    expect(result.inlineStyle).toEqual({ transition: 'opacity 200ms ease' });
    expect(result.consumedProps).toEqual(['transition']);
  });

  it('resolves a `transition` object literal with defaults', () => {
    const result = extractWeb(
      makeAnalysis([{ name: 'transition', value: { property: 'opacity' } }]),
    );
    expect(result.inlineStyle).toEqual({ transition: 'opacity 200ms ease' });
  });

  it('expands `animation="<name>"` into a var-based transition string', () => {
    const result = extractWeb(makeAnalysis([{ name: 'animation', value: 'normal' }]));
    expect(result.inlineStyle).toEqual({
      transition: 'all var(--motif-anim-normal-duration) var(--motif-anim-normal-easing)',
    });
    expect(result.consumedProps).toEqual(['animation']);
  });

  it('respects `animateOnly` to restrict the property list', () => {
    const result = extractWeb(
      makeAnalysis([
        { name: 'animation', value: 'normal' },
        { name: 'animateOnly', value: ['transform', 'opacity'] },
      ]),
    );
    expect(result.inlineStyle.transition).toBe(
      'transform var(--motif-anim-normal-duration) var(--motif-anim-normal-easing), opacity var(--motif-anim-normal-duration) var(--motif-anim-normal-easing)',
    );
    expect(result.consumedProps).toEqual(['animation', 'animateOnly']);
  });

  it('prefers `transition` over `animation` when both literal', () => {
    const result = extractWeb(
      makeAnalysis([
        { name: 'transition', value: 'opacity 100ms linear' },
        { name: 'animation', value: 'normal' },
      ]),
    );
    expect(result.inlineStyle.transition).toBe('opacity 100ms linear');
    expect(result.consumedProps).toEqual(['transition', 'animation']);
  });

  it('emits an [data-motif-state="exiting"] pseudo rule for `exitStyle`', () => {
    const result = extractWeb(makeAnalysis([{ name: 'exitStyle', value: { opacity: 0 } }]));
    expect(result.className).toMatch(/^m-[a-z0-9]+$/);
    expect(result.css).toContain('[data-motif-state="exiting"]');
    expect(result.css).toContain('opacity: 0');
    expect(result.consumedProps).toEqual(['exitStyle']);
  });

  it('leaves `enterStyle` at runtime (no compile-time CSS representation)', () => {
    // enterStyle is a first-paint overlay flipped by React state; the
    // compiler can't bake it out without losing the post-mount swap.
    const result = extractWeb(makeAnalysis([{ name: 'enterStyle', value: { opacity: 0 } }]));
    expect(result.inlineStyle).toEqual({});
    expect(result.css).toBe('');
    expect(result.consumedProps).toEqual([]);
  });
});
