import {
  buildAnimationCss,
  buildAtRulesCss,
  buildPseudoCss,
  hashAtRules,
  hashPseudoRules,
  liftPseudoOverriddenBaseProps,
  resolveResponsiveStylesToVars,
  resolveStylesToVars,
  resolveTransitionToVars,
  type PseudoRule,
  type TransitionValue,
} from '@usemotif/core';
import type { CallSiteAnalysis, WebExtractionResult } from './types.js';

/**
 * Selector suffix used by `<Box>` / `<Pressable>` to expose `exitStyle`
 * to a parent presence-boundary (e.g. `Dialog.Content` toggling
 * `data-motif-state="exiting"`). Mirrors `EXIT_SELECTOR` in
 * `packages/react-web/src/Box.tsx` — kept here as the compiler's
 * single source of truth for the same mapping. No `&` placeholder
 * needed: `buildPseudoCss` prepends the class selector so the emitted
 * rule reads `.<cn>[data-motif-state="exiting"]`.
 */
const EXIT_SELECTOR = '[data-motif-state="exiting"]';

/**
 * Canonical emit order for pseudo rules, keyed by source prop name. The
 * runtime's `buildSelectorRules` always emits in this fixed order
 * (hover → focus → active → disabled → before → after → exit) regardless
 * of attribute order. `hashPseudoRules` and `buildPseudoCss` are
 * order-sensitive, so the compiler must sort into the same order or it
 * produces a different class hash (and a different cascade) than the
 * runtime for the same element — breaking compiled/runtime dedupe.
 */
const PSEUDO_ORDER: Readonly<Record<string, number>> = {
  _hover: 0,
  _focus: 1,
  _active: 2,
  _disabled: 3,
  _before: 4,
  _after: 5,
  exitStyle: 6,
};

/**
 * Compile-time equivalent of the runtime path in `<Box>` and `<Pressable>`:
 * `resolveResponsiveStylesToVars` → split into base style + at-rules,
 * `resolveStylesToVars` → pseudo-state declarations, `hashAtRules` /
 * `hashPseudoRules` → deterministic class names, `buildAtRulesCss` /
 * `buildPseudoCss` → CSS bodies.
 *
 * Because both the runtime and this function go through the exact same
 * `@usemotif/core` resolver, the compiled and runtime-rendered output
 * collide on the same `m-<hash>` classes. Concretely: a page using motif
 * mid-migration where some files are compiled and others aren't still
 * dedupes correctly — the compiler can't disagree with the runtime
 * because they're sharing every byte of the formatting pipeline.
 *
 * Only the static subset of props is fed in; dynamic props stay on the
 * JSX element for the runtime to pick up.
 */
export function extractWeb(analysis: CallSiteAnalysis): WebExtractionResult {
  if (analysis.classification === 'dynamic') {
    return { inlineStyle: {}, className: undefined, css: '', consumedProps: [] };
  }
  if (
    analysis.staticProps.length === 0 &&
    analysis.pseudoStateProps.length === 0 &&
    analysis.motionProps.length === 0
  ) {
    return { inlineStyle: {}, className: undefined, css: '', consumedProps: [] };
  }

  const propsBag: Record<string, unknown> = {};
  const consumed: string[] = [];
  for (const p of analysis.staticProps) {
    propsBag[p.name] = p.value;
    // Skip synthesized props (sourceName === null) — they have no source
    // attribute to drop. For aliased props we record the original source
    // name so the babel rewriter strips `direction` rather than the
    // canonical `flexDirection`.
    if (p.sourceName === null) continue;
    consumed.push(p.sourceName ?? p.name);
  }

  const { baseStyle, atRules } = resolveResponsiveStylesToVars(propsBag);

  // Collect pseudo rules with their canonical rank, then sort — the
  // compiler sees props in attribute order but the runtime emits in a
  // fixed order, and the hash/CSS are order-sensitive (see PSEUDO_ORDER).
  const rankedPseudo: { rank: number; rule: PseudoRule }[] = [];
  for (const ps of analysis.pseudoStateProps) {
    const { style } = resolveStylesToVars(ps.style);
    rankedPseudo.push({ rank: PSEUDO_ORDER[ps.name] ?? 50, rule: { pseudo: ps.pseudo, style } });
    consumed.push(ps.name);
  }

  // Motion props share the same byte-identical pipeline the runtime uses
  // (`resolveTransitionToVars` for `transition`, `buildAnimationCss` for
  // `animation`). `transition` wins over `animation` when both literal —
  // mirrors the runtime precedence in `Box.tsx`. `enterStyle` is left at
  // runtime: it's a first-paint overlay that needs React state to flip.
  let transitionValue: string | undefined;
  let animationName: string | undefined;
  let animateOnly: readonly string[] | undefined;
  for (const m of analysis.motionProps) {
    if (m.name === 'transition') {
      transitionValue = resolveTransitionToVars(m.value as TransitionValue);
      consumed.push('transition');
    } else if (m.name === 'animation') {
      animationName = m.value as string;
      consumed.push('animation');
    } else if (m.name === 'animateOnly') {
      animateOnly = m.value as readonly string[];
      consumed.push('animateOnly');
    } else if (m.name === 'exitStyle') {
      const { style } = resolveStylesToVars(m.value as Record<string, unknown>);
      rankedPseudo.push({ rank: PSEUDO_ORDER.exitStyle!, rule: { pseudo: EXIT_SELECTOR, style } });
      consumed.push('exitStyle');
    }
    // `enterStyle` deliberately not listed: it has no compile-time CSS
    // representation — the runtime owns the overlay-then-flip lifecycle.
  }
  if (transitionValue === undefined && animationName !== undefined) {
    transitionValue = buildAnimationCss(animationName, animateOnly);
  }

  // Materialise the pseudo rules in the runtime's canonical order. Array
  // sort is stable, so any equal-rank entries keep their source order.
  const pseudoRules: PseudoRule[] = rankedPseudo
    .sort((a, b) => a.rank - b.rank)
    .map((r) => r.rule);

  // Lift any base prop that a state-pseudo bag also overrides out of the
  // inline style and into the base class block — the same step the runtime
  // (`Box.tsx`) performs. Without it, inline style (specificity 1,0,0,0)
  // would clobber the pseudo class rule (0,1,1), so e.g.
  // `_disabled={{ boxShadow: 'none' }}` over a base `boxShadow` would never
  // win, AND the emitted at-rule hash would differ from the runtime's
  // (which includes the lifted prop), breaking compiled/runtime dedupe.
  // Guard on pseudoRules to mirror the runtime's `selectorRules !== undefined`.
  let effectiveBase = baseStyle;
  let effectiveAtRules = atRules;
  if (pseudoRules.length > 0) {
    const lifted = liftPseudoOverriddenBaseProps(baseStyle, pseudoRules, atRules);
    effectiveBase = lifted.inlineBase;
    effectiveAtRules = lifted.atRules;
  }

  const inlineStyle =
    transitionValue === undefined
      ? effectiveBase
      : { ...effectiveBase, transition: transitionValue };

  const classNames: string[] = [];
  const cssChunks: string[] = [];
  if (effectiveAtRules.length > 0) {
    const cn = hashAtRules(effectiveAtRules);
    classNames.push(cn);
    cssChunks.push(buildAtRulesCss(cn, effectiveAtRules));
  }
  if (pseudoRules.length > 0) {
    const cn = hashPseudoRules(pseudoRules);
    classNames.push(cn);
    cssChunks.push(buildPseudoCss(cn, pseudoRules));
  }

  return {
    inlineStyle,
    className: classNames.length > 0 ? classNames.join(' ') : undefined,
    css: cssChunks.join('\n'),
    consumedProps: consumed,
  };
}
