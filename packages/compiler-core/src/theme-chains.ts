import * as t from '@babel/types';

/**
 * JSX-tree walker that returns the set of `<Theme>` chain combinations
 * observed in a Babel AST. Each combination is the chain of nested
 * `<Theme name="...">` boundaries encountered along a single path from
 * the root, joined with `_` - the same key the runtime uses to look up
 * registered theme combos.
 *
 * Example:
 *
 *   <ThemeProvider active="dark">
 *     <Theme name="red">
 *       <Theme name="blue">...</Theme>
 *     </Theme>
 *   </ThemeProvider>
 *
 * yields `{ "red", "red_blue" }`. The provider's `active` is **not**
 * included because it's typically dynamic (driven by `useState` etc.);
 * the host build tool combines the observed inner chains with each
 * registered base theme to produce the cross-product to pre-generate.
 *
 * Dynamic `name` attributes are ignored - those land on the runtime
 * resolver as before, and pre-generation skips them.
 *
 * The walker is intentionally simple: it only recurses through
 * `JSXElement.children` (and the obvious wrappers - `JSXFragment`,
 * `JSXExpressionContainer`, conditional expressions, function bodies,
 * declarations). This catches every common app structure while
 * avoiding a full whole-AST traversal cost.
 */
export function findThemeChainCombos(programBody: readonly t.Statement[]): ReadonlySet<string> {
  const out = new Set<string>();
  for (const stmt of programBody) {
    walk(stmt, [], out);
  }
  return out;
}

function walk(node: t.Node | null | undefined, chain: readonly string[], acc: Set<string>): void {
  if (node === null || node === undefined) return;

  if (t.isJSXElement(node)) {
    const componentName = jsxElementName(node.openingElement.name);
    let nextChain = chain;
    if (componentName === 'Theme') {
      const name = readStringAttribute(node.openingElement, 'name');
      if (name !== null) {
        nextChain = [...chain, name];
        acc.add(nextChain.join('_'));
      }
    }
    // ThemeProvider's `active` is intentionally not folded into the
    // chain - it's dynamic in real apps. The walker keeps descending
    // through its children with the parent (usually empty) chain.
    for (const child of node.children) {
      walk(child, nextChain, acc);
    }
    return;
  }

  if (t.isJSXFragment(node)) {
    for (const child of node.children) walk(child, chain, acc);
    return;
  }

  if (t.isJSXExpressionContainer(node)) {
    walk(node.expression, chain, acc);
    return;
  }

  if (t.isConditionalExpression(node)) {
    walk(node.consequent, chain, acc);
    walk(node.alternate, chain, acc);
    return;
  }

  if (t.isLogicalExpression(node)) {
    walk(node.right, chain, acc);
    return;
  }

  if (t.isArrayExpression(node)) {
    for (const el of node.elements) {
      if (el !== null && !t.isSpreadElement(el)) walk(el, chain, acc);
    }
    return;
  }

  if (t.isReturnStatement(node)) {
    walk(node.argument, chain, acc);
    return;
  }

  if (t.isExpressionStatement(node)) {
    walk(node.expression, chain, acc);
    return;
  }

  if (t.isVariableDeclaration(node)) {
    for (const decl of node.declarations) walk(decl.init, chain, acc);
    return;
  }

  if (t.isExportDefaultDeclaration(node) || t.isExportNamedDeclaration(node)) {
    walk(node.declaration ?? null, chain, acc);
    return;
  }

  if (t.isBlockStatement(node)) {
    for (const stmt of node.body) walk(stmt, chain, acc);
    return;
  }

  if (t.isIfStatement(node)) {
    walk(node.consequent, chain, acc);
    walk(node.alternate, chain, acc);
    return;
  }

  if (t.isFunctionDeclaration(node) || t.isFunctionExpression(node)) {
    walk(node.body, chain, acc);
    return;
  }

  if (t.isArrowFunctionExpression(node)) {
    walk(node.body, chain, acc);
    return;
  }

  if (t.isCallExpression(node) || t.isNewExpression(node)) {
    for (const arg of node.arguments) {
      if (!t.isSpreadElement(arg) && !t.isArgumentPlaceholder(arg)) {
        walk(arg, chain, acc);
      }
    }
    return;
  }
}

function jsxElementName(name: t.JSXOpeningElement['name']): string | null {
  if (t.isJSXIdentifier(name)) return name.name;
  if (t.isJSXMemberExpression(name)) {
    // Allow `Motif.Theme` → return the trailing `Theme`.
    if (t.isJSXIdentifier(name.property)) return name.property.name;
    return null;
  }
  return null;
}

function readStringAttribute(opening: t.JSXOpeningElement, attrName: string): string | null {
  for (const attr of opening.attributes) {
    if (!t.isJSXAttribute(attr)) continue;
    if (!t.isJSXIdentifier(attr.name) || attr.name.name !== attrName) continue;
    const value = attr.value;
    if (value === null || value === undefined) return null;
    if (t.isStringLiteral(value)) return value.value;
    if (t.isJSXExpressionContainer(value) && t.isStringLiteral(value.expression)) {
      return value.expression.value;
    }
    return null;
  }
  return null;
}
