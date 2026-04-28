import * as t from '@babel/types';
import { isStyleProp } from '@motif-js/core';
import { evaluateLiteral, type ScopeLike } from './literal.js';
import type { PrimitiveInfo } from './primitives.js';
import type { CallSiteAnalysis, PropAnalysis, PseudoStateAnalysis } from './types.js';

/**
 * Pressable pseudo-state prop names → CSS pseudo selectors. Mirrors the
 * runtime mapping in `packages/react-web/src/Pressable.tsx`. The
 * `_disabled` selector includes `&[aria-disabled="true"]` so non-button
 * `as` overrides still pick up the styling — `&` is replaced with the
 * generated class selector inside `buildPseudoCss`.
 */
const PSEUDO_STATE_PROPS: Readonly<Record<string, string>> = {
  _hover: ':hover',
  _focus: ':focus-visible',
  _active: ':active',
  _disabled: ':disabled, &[aria-disabled="true"]',
};

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
 *
 * When `primitive` is supplied, the analyzer also:
 *  - rewrites alias attributes (Stack's `direction` → `flexDirection`),
 *  - synthesizes the primitive's default style props (`display: 'flex'`,
 *    Stack's default `flexDirection: 'column'`), unless the user passed
 *    them already.
 *
 * Synthesized props carry `sourceName: null` so callers know there's no
 * source attribute to drop.
 */
export function classifyJsxAttributes(
  attributes: readonly (t.JSXAttribute | t.JSXSpreadAttribute)[],
  scope?: ScopeLike,
  primitive?: PrimitiveInfo,
): CallSiteAnalysis {
  const staticProps: Array<PropAnalysis & { isStatic: true }> = [];
  const dynamicProps: Array<PropAnalysis & { isStatic: false }> = [];
  const passThrough: PropAnalysis[] = [];
  const pseudoStateProps: PseudoStateAnalysis[] = [];
  const seenStyleNames = new Set<string>();
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

    // Pressable pseudo-state bag: `_hover={{ opacity: 0.8 }}`. Extracted
    // when the value resolves to a literal object; otherwise the prop
    // joins `dynamicProps` so the classifier flips to partial-static /
    // dynamic and the wrapper stays in place.
    const pseudo = PSEUDO_STATE_PROPS[name];
    if (pseudo !== undefined) {
      const value = attr.value;
      let extracted: Record<string, unknown> | null = null;
      if (value !== null && t.isJSXExpressionContainer(value)) {
        const expr = value.expression;
        if (!t.isJSXEmptyExpression(expr)) {
          const lit = evaluateLiteral(expr, scope);
          if (
            lit.ok &&
            typeof lit.value === 'object' &&
            lit.value !== null &&
            !Array.isArray(lit.value)
          ) {
            extracted = lit.value as Record<string, unknown>;
          }
        }
      }
      if (extracted !== null) {
        pseudoStateProps.push({ name, pseudo, style: extracted });
      } else {
        dynamicProps.push({ name, isStatic: false, handle: attr, sourceName: name });
      }
      continue;
    }

    // Alias resolution: Stack's `direction` → `flexDirection`. The
    // aliased attribute is still classified as a style prop, but its
    // canonical name is the alias target.
    const alias = primitive?.aliasedStyleProps[name];
    const canonicalName = alias?.mapsTo ?? name;
    const isAliased = alias !== undefined;

    if (!isAliased && !isStyleProp(canonicalName)) {
      passThrough.push({ name, isStatic: true });
      continue;
    }

    const value = attr.value;
    if (value === null || value === undefined) {
      // Boolean attribute — `<Box prop />`. Style props don't have a
      // boolean form; treat as dynamic for safety.
      dynamicProps.push({ name: canonicalName, isStatic: false, handle: attr, sourceName: name });
      seenStyleNames.add(canonicalName);
      continue;
    }
    if (t.isStringLiteral(value)) {
      staticProps.push({
        name: canonicalName,
        isStatic: true,
        value: value.value,
        sourceName: name,
      });
      seenStyleNames.add(canonicalName);
      continue;
    }
    if (t.isJSXExpressionContainer(value)) {
      const expr = value.expression;
      if (t.isJSXEmptyExpression(expr)) continue;
      const lit = evaluateLiteral(expr, scope);
      if (lit.ok) {
        staticProps.push({
          name: canonicalName,
          isStatic: true,
          value: lit.value,
          sourceName: name,
        });
      } else {
        dynamicProps.push({ name: canonicalName, isStatic: false, handle: attr, sourceName: name });
      }
      seenStyleNames.add(canonicalName);
      continue;
    }

    // JSXElement / JSXFragment values aren't valid for style props.
    dynamicProps.push({ name: canonicalName, isStatic: false, handle: attr, sourceName: name });
    seenStyleNames.add(canonicalName);
  }

  // Primitive-driven synthesis: fill in defaults the wrapper would have
  // applied at runtime. Skipped for any name the user explicitly set.
  if (primitive !== undefined) {
    for (const aliasName in primitive.aliasedStyleProps) {
      const info = primitive.aliasedStyleProps[aliasName]!;
      if (seenStyleNames.has(info.mapsTo)) continue;
      if (info.defaultValue !== undefined) {
        staticProps.push({
          name: info.mapsTo,
          isStatic: true,
          value: info.defaultValue,
          sourceName: null,
        });
        seenStyleNames.add(info.mapsTo);
      }
    }
    for (const synthName in primitive.synthesizedStyleProps) {
      if (seenStyleNames.has(synthName)) continue;
      staticProps.push({
        name: synthName,
        isStatic: true,
        value: primitive.synthesizedStyleProps[synthName]!,
        sourceName: null,
      });
      seenStyleNames.add(synthName);
    }
  }

  let classification: CallSiteAnalysis['classification'];
  const hasAnyStatic = staticProps.length > 0 || pseudoStateProps.length > 0;
  if (hasSpread) {
    classification = 'dynamic';
  } else if (!hasAnyStatic) {
    classification = dynamicProps.length === 0 ? 'static' : 'dynamic';
  } else {
    classification = dynamicProps.length === 0 ? 'static' : 'partial-static';
  }

  return { classification, staticProps, dynamicProps, passThrough, pseudoStateProps, hasSpread };
}
