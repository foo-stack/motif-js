import * as t from '@babel/types';
import { isStyleProp } from '@motif-js/core';
import { evaluateLiteral, type ScopeLike } from './literal.js';
import type { CallSiteAnalysis, PropAnalysis } from './types.js';

/**
 * Classify a JSX opening element's attributes for static extraction.
 *
 * Walks the attribute list, separates style props from pass-through, and
 * runs each style-prop value through {@link evaluateLiteral} to decide if
 * it's compile-time resolvable.
 *
 * The classification rule is simple:
 * - any spread → `dynamic` (unknown shape, runtime keeps everything).
 * - any dynamic style prop alongside any static style prop → `partial-static`.
 * - all style props static → `static`.
 * - no style props at all → `static` (a no-op extraction; caller skips).
 */
export function classifyJsxAttributes(
  attributes: readonly (t.JSXAttribute | t.JSXSpreadAttribute)[],
  scope?: ScopeLike,
): CallSiteAnalysis {
  const staticProps: Array<PropAnalysis & { isStatic: true }> = [];
  const dynamicProps: Array<PropAnalysis & { isStatic: false }> = [];
  const passThrough: PropAnalysis[] = [];
  let hasSpread = false;

  for (const attr of attributes) {
    if (t.isJSXSpreadAttribute(attr)) {
      hasSpread = true;
      continue;
    }

    const nameNode = attr.name;
    let name: string;
    if (t.isJSXIdentifier(nameNode)) {
      name = nameNode.name;
    } else if (t.isJSXNamespacedName(nameNode)) {
      // `xml:lang` etc. — never a style prop. Skip.
      passThrough.push({
        name: `${nameNode.namespace.name}:${nameNode.name.name}`,
        isStatic: true,
      });
      continue;
    } else {
      continue;
    }

    if (!isStyleProp(name)) {
      passThrough.push({ name, isStatic: true });
      continue;
    }

    // Style prop. The value is either a JSXExpressionContainer with an
    // inner expression, a string literal (e.g. `bg="red"`), or absent
    // (boolean attribute — e.g. `<Box hidden />`; boolean style props
    // aren't a thing in the schema, so treat as dynamic for safety).
    const value = attr.value;
    if (value === null || value === undefined) {
      // <Box prop /> with no value — treat as dynamic.
      dynamicProps.push({ name, isStatic: false, handle: attr });
      continue;
    }
    if (t.isStringLiteral(value)) {
      staticProps.push({ name, isStatic: true, value: value.value });
      continue;
    }
    if (t.isJSXExpressionContainer(value)) {
      const expr = value.expression;
      if (t.isJSXEmptyExpression(expr)) {
        // {} — no value.
        continue;
      }
      const lit = evaluateLiteral(expr, scope);
      if (lit.ok) {
        staticProps.push({ name, isStatic: true, value: lit.value });
      } else {
        dynamicProps.push({ name, isStatic: false, handle: attr });
      }
      continue;
    }

    // Other JSXAttribute value forms (JSXElement, JSXFragment) aren't
    // valid for style props — leave them alone.
    dynamicProps.push({ name, isStatic: false, handle: attr });
  }

  let classification: CallSiteAnalysis['classification'];
  if (hasSpread) {
    classification = 'dynamic';
  } else if (staticProps.length === 0) {
    classification = dynamicProps.length === 0 ? 'static' : 'dynamic';
  } else {
    classification = dynamicProps.length === 0 ? 'static' : 'partial-static';
  }

  return { classification, staticProps, dynamicProps, passThrough, hasSpread };
}
