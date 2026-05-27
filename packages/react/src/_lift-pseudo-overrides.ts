import type { AtRule } from '@usemotif/core';
import type { PseudoRule } from './style-cache.js';

/**
 * Restore the cascade for pseudo-state overrides. Without this lift,
 * any base style prop is emitted as inline style (specificity
 * `1,0,0,0`) while pseudo-state rules emit as `.<class>:state`
 * (`0,1,1`) — inline wins, so `_disabled.boxShadow: 'none'` never
 * overrides a base `boxShadow="..."` even though the `:disabled`
 * selector matches.
 *
 * The fix: for any CSS property a state-pseudo bag overrides
 * (`_hover` / `_focus` / `_active` / `_disabled` / `exitStyle`),
 * move the corresponding base value out of inline and into a
 * **base class block** (`.<class> { … }`, specificity `0,1,0`).
 * The pseudo rule at `0,1,1` then wins the cascade per the spec.
 *
 * Pseudo-element rules (`::before` / `::after`) are NOT lifted — they
 * target a different element from the parent, so even when they
 * declare the same CSS property name (`color`, `background`) they
 * don't compete with the parent's inline style.
 */
export function liftPseudoOverriddenBaseProps(
  baseStyle: Record<string, string | number>,
  selectorRules: readonly PseudoRule[],
  atRules: ReadonlyArray<AtRule>,
): {
  inlineBase: Record<string, string | number>;
  atRules: ReadonlyArray<AtRule>;
} {
  // Collect the union of CSS property keys that any STATE-pseudo bag
  // overrides. Pseudo-element selectors start with `::`; skip them.
  let overrideKeys: Set<string> | null = null;
  for (const rule of selectorRules) {
    if (rule.pseudo.startsWith('::')) continue;
    for (const k in rule.style) {
      (overrideKeys ??= new Set<string>()).add(k);
    }
  }
  if (overrideKeys === null) return { inlineBase: baseStyle, atRules };

  // Split baseStyle into the props that stay inline and the props
  // that must be lifted to a class block.
  let inlineBase: Record<string, string | number> | null = null;
  let liftedBase: Record<string, string | number> | null = null;
  for (const k in baseStyle) {
    if (overrideKeys.has(k)) {
      (liftedBase ??= {})[k] = baseStyle[k]!;
    } else {
      (inlineBase ??= {})[k] = baseStyle[k]!;
    }
  }
  if (liftedBase === null) return { inlineBase: baseStyle, atRules };

  // Merge the lifted props into the existing base class block (the
  // empty-atRule entry from the responsive resolver) if present;
  // otherwise prepend a new one so it sits before media / container
  // overrides in source order — matching the existing convention.
  const baseIdx = atRules.findIndex((r) => r.atRule === '');
  let nextAtRules: AtRule[];
  if (baseIdx >= 0) {
    nextAtRules = atRules.slice();
    nextAtRules[baseIdx] = {
      atRule: '',
      style: { ...atRules[baseIdx]!.style, ...liftedBase },
    };
  } else {
    nextAtRules = [{ atRule: '', style: liftedBase }, ...atRules];
  }

  return {
    inlineBase: inlineBase ?? {},
    atRules: nextAtRules,
  };
}
