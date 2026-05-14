import {
  buildAnimationCss,
  buildAtRulesCss,
  buildPseudoCss,
  hashAtRules,
  hashPseudoRules,
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

  const pseudoRules: PseudoRule[] = [];
  for (const ps of analysis.pseudoStateProps) {
    const { style } = resolveStylesToVars(ps.style);
    pseudoRules.push({ pseudo: ps.pseudo, style });
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
      pseudoRules.push({ pseudo: EXIT_SELECTOR, style });
      consumed.push('exitStyle');
    }
    // `enterStyle` deliberately not listed: it has no compile-time CSS
    // representation — the runtime owns the overlay-then-flip lifecycle.
  }
  if (transitionValue === undefined && animationName !== undefined) {
    transitionValue = buildAnimationCss(animationName, animateOnly);
  }
  const inlineStyle =
    transitionValue === undefined ? baseStyle : { ...baseStyle, transition: transitionValue };

  const classNames: string[] = [];
  const cssChunks: string[] = [];
  if (atRules.length > 0) {
    const cn = hashAtRules(atRules);
    classNames.push(cn);
    cssChunks.push(buildAtRulesCss(cn, atRules));
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
