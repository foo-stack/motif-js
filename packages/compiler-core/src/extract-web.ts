import {
  buildAtRulesCss,
  buildPseudoCss,
  hashAtRules,
  hashPseudoRules,
  resolveResponsiveStylesToVars,
  resolveStylesToVars,
  type PseudoRule,
} from '@motif-js/core';
import type { CallSiteAnalysis, WebExtractionResult } from './types.js';

/**
 * Compile-time equivalent of the runtime path in `<Box>` and `<Pressable>`:
 * `resolveResponsiveStylesToVars` → split into base style + at-rules,
 * `resolveStylesToVars` → pseudo-state declarations, `hashAtRules` /
 * `hashPseudoRules` → deterministic class names, `buildAtRulesCss` /
 * `buildPseudoCss` → CSS bodies.
 *
 * Because both the runtime and this function go through the exact same
 * `@motif-js/core` resolver, the compiled and runtime-rendered output
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
  if (analysis.staticProps.length === 0 && analysis.pseudoStateProps.length === 0) {
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
    inlineStyle: baseStyle,
    className: classNames.length > 0 ? classNames.join(' ') : undefined,
    css: cssChunks.join('\n'),
    consumedProps: consumed,
  };
}
