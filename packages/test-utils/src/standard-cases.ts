import type { ConformanceCase } from './conformance.js';

/**
 * Cross-renderer conformance cases. Every motif renderer must pass all
 * of these. New rows go at the bottom of the appropriate section so
 * existing snapshots stay stable.
 *
 * The `expect*` fields describe the **resolved** style — token refs
 * already mapped to their concrete values via the test theme. Renderers
 * that emit `var(--…)` strings instead of literal values should
 * normalise to literals in their adapter (CSS-variable mode is a
 * delivery detail; conformance is about the resolved values).
 */
export const standardCases: readonly ConformanceCase[] = [
  // ─── Box: literal styles ────────────────────────────────────────────
  {
    name: 'Box / literal padding (number)',
    primitive: 'Box',
    props: { p: 16 },
    expectStyle: { padding: 16 },
  },
  {
    name: 'Box / literal background color',
    primitive: 'Box',
    props: { bg: '#3b82f6' },
    expectStyle: { backgroundColor: '#3b82f6' },
  },

  // ─── Box: token references ──────────────────────────────────────────
  {
    name: 'Box / $space.4 token ref',
    primitive: 'Box',
    props: { p: '$4' },
    expectStyle: { padding: 16 },
  },
  {
    name: 'Box / $colors.blue.500 token ref',
    primitive: 'Box',
    props: { bg: '$blue.500' },
    expectStyle: { backgroundColor: '#3b82f6' },
  },
  {
    name: 'Box / explicit-scale ref ($space.4)',
    primitive: 'Box',
    props: { p: '$space.4' },
    expectStyle: { padding: 16 },
  },

  // ─── Box: shorthand expansion ───────────────────────────────────────
  {
    name: 'Box / px shorthand expands to L+R',
    primitive: 'Box',
    props: { px: '$4' },
    expectStyle: { paddingLeft: 16, paddingRight: 16 },
  },
  {
    name: 'Box / my shorthand expands to T+B',
    primitive: 'Box',
    props: { my: '$2' },
    expectStyle: { marginTop: 8, marginBottom: 8 },
  },

  // ─── Box: responsive object syntax ──────────────────────────────────
  {
    name: 'Box / responsive object — base + md',
    primitive: 'Box',
    props: { p: { base: '$2', md: '$4' } },
    expectStyle: { padding: 8 },
    expectMediaRules: {
      '@media (min-width: 768px)': { padding: 16 },
    },
  },
  {
    name: 'Box / responsive object — full ladder',
    primitive: 'Box',
    props: { p: { base: '$1', sm: '$2', md: '$4', lg: '$6', xl: '$8' } },
    expectStyle: { padding: 4 },
    expectMediaRules: {
      '@media (min-width: 640px)': { padding: 8 },
      '@media (min-width: 768px)': { padding: 16 },
      '@media (min-width: 1024px)': { padding: 24 },
      '@media (min-width: 1280px)': { padding: 32 },
    },
  },

  // ─── Box: responsive array syntax ───────────────────────────────────
  {
    name: 'Box / responsive array',
    primitive: 'Box',
    props: { p: ['$2', '$4', '$6'] },
    expectStyle: { padding: 8 },
    expectMediaRules: {
      '@media (min-width: 640px)': { padding: 16 },
      '@media (min-width: 768px)': { padding: 24 },
    },
  },

  // ─── Box: responsive DSL ────────────────────────────────────────────
  {
    name: 'Box / responsive DSL — `base:$2 md:$4`',
    primitive: 'Box',
    props: { p: 'base:$2 md:$4' },
    expectStyle: { padding: 8 },
    expectMediaRules: {
      '@media (min-width: 768px)': { padding: 16 },
    },
  },

  // ─── Container queries ──────────────────────────────────────────────
  {
    name: 'Box / @container anonymous',
    primitive: 'Box',
    props: { p: { '@md': '$4' } },
    expectContainerRules: {
      '@container (min-width: 768px)': { padding: 16 },
    },
  },
  {
    name: 'Box / @container named',
    primitive: 'Box',
    props: { p: { '@card.lg': '$8' } },
    expectContainerRules: {
      '@container card (min-width: 1024px)': { padding: 32 },
    },
  },
  {
    name: 'Box / @container in DSL',
    primitive: 'Box',
    props: { p: '@card.md:$4' },
    expectContainerRules: {
      '@container card (min-width: 768px)': { padding: 16 },
    },
  },

  // ─── Pseudo-state styling (Pressable) ───────────────────────────────
  {
    name: 'Pressable / _hover',
    primitive: 'Pressable',
    props: { _hover: { opacity: 0.9 } },
    expectPseudoRules: {
      ':hover': { opacity: 0.9 },
    },
  },
  {
    name: 'Pressable / _focus → :focus-visible',
    primitive: 'Pressable',
    props: { _focus: { borderWidth: 2 } },
    expectPseudoRules: {
      ':focus-visible': { borderWidth: 2 },
    },
  },
  {
    name: 'Pressable / _active',
    primitive: 'Pressable',
    props: { _active: { opacity: 0.8 } },
    expectPseudoRules: {
      ':active': { opacity: 0.8 },
    },
  },

  // ─── Pass-through props ─────────────────────────────────────────────
  {
    name: 'Box / passes through non-style attrs',
    primitive: 'Box',
    props: { p: 4, id: 'demo' },
    expectStyle: { padding: 4 },
  },
];
