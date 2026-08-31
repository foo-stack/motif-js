import * as t from '@babel/types';
import type { PrimitiveInfo } from './primitives.js';
import type { CallSiteAnalysis } from './types.js';

/**
 * Result of {@link analyzeStripSafety}. When `safe` is `false`, the
 * `bailReason` field carries a stable identifier the caller can use for
 * diagnostics or compile-time logging.
 */
export interface StripSafetyResult {
  readonly safe: boolean;
  readonly bailReason?: BailReason;
}

/**
 * Stable identifiers for every bail-out condition. Exported so host
 * tooling (Babel plugin, downstream lints) can match on a known surface.
 *
 * - `not-strippable`: the primitive owns runtime logic the compiler
 *   hasn't replicated yet (Pressable's pseudo-state handling, Image's
 *   load/error overlay tree).
 * - `non-static-classification`: at least one style prop is dynamic.
 *   The wrapper has to stay so the runtime resolver can pick it up.
 * - `has-spread`: a `{...spread}` attribute was seen. The shape of the
 *   spread is unknowable at compile time - it may carry a `ref`, an
 *   event handler that needs the wrapper's behaviour, or anything else
 *   that would break stripping.
 * - `as-attribute`: an `as` prop was set. The user explicitly asked the
 *   primitive to render a different element; we can't second-guess that.
 * - `ref-attribute`: a `ref` was attached. Function components don't
 *   forward refs unless they use `forwardRef`; stripping would change
 *   the ref target's identity. Conservative bail.
 * - `function-as-child`: a child is a function expression. Lowercase
 *   HTML elements can't render functions; React would error.
 * - `blocked-prop:<name>`: a prop in the primitive's `nonStrippableProps`
 *   set was present (e.g. Pressable's `_hover`, `onPress`).
 */
export type BailReason =
  | 'not-strippable'
  | 'non-static-classification'
  | 'has-spread'
  | 'as-attribute'
  | 'ref-attribute'
  | 'function-as-child'
  | `blocked-prop:${string}`;

const SAFE: StripSafetyResult = { safe: true };

/**
 * Decide whether a motif primitive call site can be safely rewritten to
 * its underlying lowercase HTML element. The full bail-out list is
 * documented on {@link BailReason}; runtime semantics must be preserved
 * through every code path, so checks are intentionally conservative
 * (false-negatives are fine - false-positives are not).
 *
 * Inputs:
 * - `openingElement`: the JSX opening element being considered.
 * - `parent`: the enclosing `JSXElement` (carries `children`), or `null`
 *   if the opening element is part of a self-closing tag with no parent
 *   element (typical for `<Box />`-style call sites).
 * - `primitive`: the resolved {@link PrimitiveInfo} for the binding.
 * - `analysis`: the per-call-site classification produced by
 *   `classifyJsxAttributes`.
 *
 * Returns `{ safe: true }` when the rewrite is allowed, otherwise
 * `{ safe: false, bailReason }` with one of the stable reasons above.
 */
export function analyzeStripSafety(
  openingElement: t.JSXOpeningElement,
  parent: t.JSXElement | null,
  primitive: PrimitiveInfo,
  analysis: CallSiteAnalysis,
): StripSafetyResult {
  if (!primitive.strippable) {
    return { safe: false, bailReason: 'not-strippable' };
  }
  // hasSpread is checked before classification because spread always
  // forces classification → 'dynamic'; reporting 'has-spread' is the more
  // specific / actionable diagnostic.
  if (analysis.hasSpread) {
    return { safe: false, bailReason: 'has-spread' };
  }
  if (analysis.classification !== 'static') {
    return { safe: false, bailReason: 'non-static-classification' };
  }

  for (const attr of openingElement.attributes) {
    if (!t.isJSXAttribute(attr)) continue;
    if (!t.isJSXIdentifier(attr.name)) continue;
    const name = attr.name.name;
    if (name === 'as') {
      return { safe: false, bailReason: 'as-attribute' };
    }
    if (name === 'ref') {
      return { safe: false, bailReason: 'ref-attribute' };
    }
    if (primitive.nonStrippableProps.has(name)) {
      return { safe: false, bailReason: `blocked-prop:${name}` };
    }
  }

  if (parent !== null) {
    for (const child of parent.children) {
      if (!t.isJSXExpressionContainer(child)) continue;
      const expr = child.expression;
      if (t.isArrowFunctionExpression(expr) || t.isFunctionExpression(expr)) {
        return { safe: false, bailReason: 'function-as-child' };
      }
    }
  }

  return SAFE;
}
