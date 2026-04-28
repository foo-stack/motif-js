import type { ConfigAPI, NodePath, PluginObj, PluginPass } from '@babel/core';
import * as t from '@babel/types';
import {
  bindingForJsxName,
  classifyJsxAttributes,
  extractWeb,
  findMotifBindings,
  getPrimitiveInfo,
  type CallSiteAnalysis,
  type PrimitiveBinding,
  type PrimitiveInfo,
} from '@motif-js/compiler-core';
import type { ResolvedStyle } from '@motif-js/core';

/**
 * Options for the motif-js Babel plugin.
 *
 * The plugin walks every JSX call site whose component is an imported
 * motif primitive (`Box`, `Stack`, `Text`, `Pressable`, `Image`,
 * `HStack`, `VStack`) and rewrites static style props into a baked
 * `style={...}` + `className=` pair plus accumulated CSS.
 *
 * Dynamic prop bags are left alone — the runtime still resolves them.
 *
 * The compiler shares its resolver with the runtime (`@motif-js/core`),
 * so the emitted `m-<hash>` class names are byte-identical to what the
 * runtime would produce. Mid-migration codebases (some compiled, some
 * not) dedupe correctly.
 */
export interface MotifBabelOptions {
  /** `'web'` (default) extracts CSS. `'native'` is a no-op for now. */
  readonly target?: 'web' | 'native';
  /**
   * Called once per source file at Program-exit with the concatenated
   * CSS the plugin accumulated for that file. The host build tool is
   * responsible for writing it to a `.css` artifact (Vite virtual
   * module, webpack child compilation, etc.).
   */
  readonly onCss?: (css: string, filename?: string) => void;
}

interface State extends PluginPass {
  bindings: Map<string, PrimitiveBinding>;
  cssChunks: string[];
}

const PACKAGE_NAME = '@motif-js/compiler-babel';

/**
 * Babel plugin entry point. Default-exports a function compatible with
 * Babel's plugin contract; returns a `PluginObj` whose visitor performs
 * the JSX rewrite.
 */
export default function motifBabelPlugin(_api: ConfigAPI): PluginObj<State> {
  return {
    name: 'motif-extract',
    visitor: {
      Program: {
        enter(path, state) {
          state.bindings = findMotifBindings(path.node.body);
          state.cssChunks = [];
        },
        exit(_path, state) {
          if (state.cssChunks.length === 0) return;
          const opts = state.opts as MotifBabelOptions;
          if (typeof opts.onCss === 'function') {
            opts.onCss(state.cssChunks.join('\n'), state.filename);
          }
        },
      },
      JSXOpeningElement(path, state) {
        const binding = bindingForJsxName(path.node.name, state.bindings);
        if (binding === undefined) return;

        const primitive = getPrimitiveInfo(binding.importedName);
        const analysis = classifyJsxAttributes(path.node.attributes, path.scope, primitive);
        if (analysis.classification === 'dynamic') return;
        if (analysis.staticProps.length === 0 && analysis.pseudoStateProps.length === 0) return;

        const opts = state.opts as MotifBabelOptions;
        const target = opts.target ?? 'web';
        if (target !== 'web') return;

        rewriteJsxForWeb(path, analysis, state, primitive);
      },
    },
  };
}

/**
 * Apply the web extraction result back onto the JSX element:
 *  - drop consumed style-prop attributes
 *  - merge the baked inline-style into any existing `style=` attribute
 *  - merge the generated class name into any existing `className=`
 *  - accumulate the at-rule CSS for the host build tool
 *  - when fully static, swap the wrapper for its underlying HTML tag
 */
function rewriteJsxForWeb(
  path: NodePath<t.JSXOpeningElement>,
  analysis: CallSiteAnalysis,
  state: State,
  primitive: PrimitiveInfo | undefined,
): void {
  const result = extractWeb(analysis);
  const consumed = new Set(result.consumedProps);
  const remaining: (t.JSXAttribute | t.JSXSpreadAttribute)[] = [];
  for (const attr of path.node.attributes) {
    if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name) && consumed.has(attr.name.name)) {
      continue;
    }
    remaining.push(attr);
  }

  if (Object.keys(result.inlineStyle).length > 0) {
    mergeStyleAttribute(remaining, result.inlineStyle);
  }
  if (result.className !== undefined) {
    mergeClassNameAttribute(remaining, result.className);
  }

  path.node.attributes = remaining;

  if (result.css.length > 0) {
    state.cssChunks.push(result.css);
  }

  // Wrapper-stripping: when every style prop is static and the call site
  // can be rendered directly as the underlying HTML element, replace the
  // primitive's JSX name with its lowercase tag. Saves the React function
  // component call entirely.
  if (analysis.classification === 'static' && primitive !== undefined) {
    maybeStripWrapper(path, remaining, primitive);
  }
}

/**
 * Replace the JSX element name with the primitive's underlying HTML tag
 * when safe:
 *  - the primitive is `strippable`,
 *  - no `as` attribute,
 *  - no attribute name in `nonStrippableProps`.
 *
 * Mutates the opening element's name and the closing element to match.
 */
function maybeStripWrapper(
  path: NodePath<t.JSXOpeningElement>,
  attrs: readonly (t.JSXAttribute | t.JSXSpreadAttribute)[],
  primitive: PrimitiveInfo,
): void {
  if (!primitive.strippable) return;

  for (const attr of attrs) {
    if (!t.isJSXAttribute(attr)) continue;
    if (!t.isJSXIdentifier(attr.name)) continue;
    const name = attr.name.name;
    if (name === 'as') return;
    if (primitive.nonStrippableProps.has(name)) return;
  }

  const newName = t.jsxIdentifier(primitive.defaultTag);
  path.node.name = newName;

  const parent = path.parent;
  if (t.isJSXElement(parent)) {
    const closing = parent.closingElement;
    if (closing !== null && closing !== undefined) {
      closing.name = t.jsxIdentifier(primitive.defaultTag);
    }
  }
}

/**
 * Build a `style={{ ...baked, ...existing }}` literal merge: existing
 * (user-supplied) values override the baked values, mirroring the
 * runtime's `{ ...baseStyle, ...inlineStyle }` semantics in `<Box>`.
 */
function mergeStyleAttribute(
  attributes: (t.JSXAttribute | t.JSXSpreadAttribute)[],
  baked: ResolvedStyle,
): void {
  const bakedObject = resolvedStyleToObjectExpression(baked);
  const existingIdx = attributes.findIndex(
    (a) => t.isJSXAttribute(a) && t.isJSXIdentifier(a.name) && a.name.name === 'style',
  );
  if (existingIdx === -1) {
    attributes.push(
      t.jsxAttribute(t.jsxIdentifier('style'), t.jsxExpressionContainer(bakedObject)),
    );
    return;
  }
  const existing = attributes[existingIdx] as t.JSXAttribute;
  const ev = existing.value;
  if (ev !== null && t.isJSXExpressionContainer(ev) && t.isObjectExpression(ev.expression)) {
    // Literal-on-literal merge: append the user's properties so they
    // win. Avoids creating a runtime spread.
    bakedObject.properties.push(...ev.expression.properties);
    existing.value = t.jsxExpressionContainer(bakedObject);
    return;
  }
  // Fallback: emit a spread merge `{ ...baked, ...existing }`.
  const merged = t.objectExpression([
    t.spreadElement(bakedObject),
    ...(ev !== null && t.isJSXExpressionContainer(ev) && t.isExpression(ev.expression)
      ? [t.spreadElement(ev.expression)]
      : []),
  ]);
  existing.value = t.jsxExpressionContainer(merged);
}

function mergeClassNameAttribute(
  attributes: (t.JSXAttribute | t.JSXSpreadAttribute)[],
  generated: string,
): void {
  const existingIdx = attributes.findIndex(
    (a) => t.isJSXAttribute(a) && t.isJSXIdentifier(a.name) && a.name.name === 'className',
  );
  if (existingIdx === -1) {
    attributes.push(t.jsxAttribute(t.jsxIdentifier('className'), t.stringLiteral(generated)));
    return;
  }
  const existing = attributes[existingIdx] as t.JSXAttribute;
  const ev = existing.value;
  if (ev === null) {
    existing.value = t.stringLiteral(generated);
    return;
  }
  if (t.isStringLiteral(ev)) {
    existing.value = t.stringLiteral(`${generated} ${ev.value}`);
    return;
  }
  if (t.isJSXExpressionContainer(ev) && t.isStringLiteral(ev.expression)) {
    existing.value = t.stringLiteral(`${generated} ${ev.expression.value}`);
    return;
  }
  if (t.isJSXExpressionContainer(ev) && t.isExpression(ev.expression)) {
    // `className={dynamic}` → `className={"m-x " + (dynamic)}`.
    existing.value = t.jsxExpressionContainer(
      t.binaryExpression('+', t.stringLiteral(`${generated} `), ev.expression),
    );
    return;
  }
}

function resolvedStyleToObjectExpression(style: ResolvedStyle): t.ObjectExpression {
  const props: t.ObjectProperty[] = [];
  for (const key in style) {
    const value = style[key];
    let valueNode: t.Expression;
    if (typeof value === 'number') {
      valueNode = t.numericLiteral(value);
    } else if (typeof value === 'string') {
      valueNode = t.stringLiteral(value);
    } else {
      continue;
    }
    props.push(t.objectProperty(t.identifier(key), valueNode));
  }
  return t.objectExpression(props);
}

export { PACKAGE_NAME };
