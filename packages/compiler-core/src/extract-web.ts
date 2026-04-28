import { buildAtRulesCss, hashAtRules, resolveResponsiveStylesToVars } from '@motif-js/core';
import type { CallSiteAnalysis, WebExtractionResult } from './types.js';

/**
 * Compile-time equivalent of the runtime path in `<Box>`:
 * `resolveResponsiveStylesToVars` → split into base style + at-rules,
 * `hashAtRules` → deterministic class name, `buildAtRulesCss` → CSS body.
 *
 * Because both the runtime and this function go through the exact same
 * `@motif-js/core` resolver, the compiled and runtime-rendered output
 * collide on the same `m-<hash>` class. Concretely: a page using motif
 * mid-migration where some files are compiled and others aren't still
 * dedupes correctly — the compiler can't disagree with the runtime
 * because they're sharing every byte of the formatting pipeline.
 *
 * Only the static subset of props is fed in; dynamic props stay on the
 * JSX element for the runtime to pick up.
 */
export function extractWeb(analysis: CallSiteAnalysis): WebExtractionResult {
  if (analysis.classification === 'dynamic' || analysis.staticProps.length === 0) {
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

  if (atRules.length === 0) {
    return { inlineStyle: baseStyle, className: undefined, css: '', consumedProps: consumed };
  }

  const className = hashAtRules(atRules);
  const css = buildAtRulesCss(className, atRules);
  return { inlineStyle: baseStyle, className, css, consumedProps: consumed };
}
