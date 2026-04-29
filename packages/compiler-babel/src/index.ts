import type { ConfigAPI, NodePath, PluginObj, PluginPass } from '@babel/core';
import * as t from '@babel/types';
import {
  analyzeStripSafety,
  bindingForJsxName,
  classifyJsxAttributes,
  extractNative,
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
 * `HStack`, `VStack`).
 *
 * **Web target:** static style props are baked into a `style={...}` /
 * `className=` pair plus accumulated CSS; fully-static call sites have
 * the wrapper stripped (`<Box p={4}>` → `<div style={...}>`).
 *
 * **Native target:** literal-only style entries are accumulated into a
 * single `StyleSheet.create({ id1: {...}, ... })` hoisted at file
 * top, and each call site's `style={}` is rewritten to reference the
 * hoisted id (`style={_motifStyles.id3}` or
 * `style={[_motifStyles.id3, userStyle]}` if the user supplied an inline
 * style of their own).
 *
 * Dynamic prop bags are left alone — the runtime still resolves them.
 *
 * The compiler shares its resolver with the runtime (`@motif-js/core`),
 * so the emitted `m-<hash>` class names (web) and StyleSheet entries
 * (native) are byte-identical to what the runtime would produce. Mid-
 * migration codebases (some compiled, some not) dedupe correctly.
 */
export interface MotifBabelOptions {
  /** `'web'` (default) extracts CSS. `'native'` hoists StyleSheet entries. */
  readonly target?: 'web' | 'native';
  /**
   * Web only. Called once per source file at Program-exit with the
   * concatenated CSS the plugin accumulated for that file. The host build
   * tool is responsible for writing it to a `.css` artifact (Vite virtual
   * module, webpack child compilation, etc.).
   */
  readonly onCss?: (css: string, filename?: string) => void;
}

interface NativeStyleEntry {
  /** Property name on the hoisted styles object (`id0`, `id1`, …). */
  readonly id: string;
  /** Resolved style object to register. */
  readonly style: ResolvedStyle;
}

interface State extends PluginPass {
  bindings: Map<string, PrimitiveBinding>;
  cssChunks: string[];
  nativeStyles: NativeStyleEntry[];
  nativeIdCounter: number;
}

const PACKAGE_NAME = '@motif-js/compiler-babel';

/**
 * Local name used for the hoisted `StyleSheet.create({...})` object. The
 * leading underscore + `motif` namespace keeps it from colliding with
 * anything in user code; if a user happens to declare `_motifStyles`
 * themselves they'll get a normal scope shadowing error (preferable to
 * silent merge).
 */
const NATIVE_STYLES_LOCAL = '_motifStyles';
/** Local name for the imported `StyleSheet` from `react-native`. */
const NATIVE_STYLESHEET_LOCAL = '_motifStyleSheet';

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
          state.nativeStyles = [];
          state.nativeIdCounter = 0;
        },
        exit(path, state) {
          const opts = state.opts as MotifBabelOptions;
          const target = opts.target ?? 'web';

          if (target === 'web') {
            if (state.cssChunks.length === 0) return;
            if (typeof opts.onCss === 'function') {
              opts.onCss(state.cssChunks.join('\n'), state.filename);
            }
            return;
          }

          if (target === 'native' && state.nativeStyles.length > 0) {
            hoistNativeStyleSheet(path, state.nativeStyles);
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

        if (target === 'web') {
          rewriteJsxForWeb(path, analysis, state, primitive);
        } else if (target === 'native') {
          rewriteJsxForNative(path, analysis, state);
        }
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
    mergeStyleAttribute(remaining, resolvedStyleToObjectExpression(result.inlineStyle));
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
  // component call entirely. The safety analysis is centralised in
  // `analyzeStripSafety` (compiler-core) — see the BailReason docstring
  // for the full bail-out list.
  if (primitive !== undefined) {
    const parent = path.parent;
    const parentEl = t.isJSXElement(parent) ? parent : null;
    const safety = analyzeStripSafety(path.node, parentEl, primitive, analysis);
    if (safety.safe) {
      stripWrapper(path, primitive);
    }
  }
}

/**
 * Native-target rewrite: extract literal-only styles into a per-file
 * accumulator, drop the consumed style props from the JSX, and splice in
 * a `style={_motifStyles.idN}` reference. The hoisted
 * `StyleSheet.create({...})` is generated in `Program.exit`.
 */
function rewriteJsxForNative(
  path: NodePath<t.JSXOpeningElement>,
  analysis: CallSiteAnalysis,
  state: State,
): void {
  const result = extractNative(analysis);
  if (result.consumedProps.length === 0) return;

  const consumed = new Set(result.consumedProps);
  const remaining: (t.JSXAttribute | t.JSXSpreadAttribute)[] = [];
  for (const attr of path.node.attributes) {
    if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name) && consumed.has(attr.name.name)) {
      continue;
    }
    remaining.push(attr);
  }

  if (Object.keys(result.style).length === 0) {
    path.node.attributes = remaining;
    return;
  }

  const id = `id${state.nativeIdCounter++}`;
  state.nativeStyles.push({ id, style: result.style });

  // Build `_motifStyles.idN` as a member expression we can re-use.
  const styleRef = (): t.Expression =>
    t.memberExpression(t.identifier(NATIVE_STYLES_LOCAL), t.identifier(id));

  mergeNativeStyleAttribute(remaining, styleRef);
  path.node.attributes = remaining;
}

/**
 * Inject the hoisted `StyleSheet.create({...})` and an aliased
 * `react-native` import. Idempotent within a file — `nativeStyles` is
 * the per-file accumulator. Insertion point: after the last existing
 * `import` declaration so ESM ordering rules stay happy.
 */
function hoistNativeStyleSheet(
  programPath: NodePath<t.Program>,
  entries: readonly NativeStyleEntry[],
): void {
  const importDecl = t.importDeclaration(
    [t.importSpecifier(t.identifier(NATIVE_STYLESHEET_LOCAL), t.identifier('StyleSheet'))],
    t.stringLiteral('react-native'),
  );

  const props: t.ObjectProperty[] = entries.map((entry) =>
    t.objectProperty(t.identifier(entry.id), resolvedStyleToObjectExpression(entry.style)),
  );

  const stylesDecl = t.variableDeclaration('const', [
    t.variableDeclarator(
      t.identifier(NATIVE_STYLES_LOCAL),
      t.callExpression(
        t.memberExpression(t.identifier(NATIVE_STYLESHEET_LOCAL), t.identifier('create')),
        [t.objectExpression(props)],
      ),
    ),
  ]);

  // Insert after the last import; if there are no imports at all, prepend.
  const body = programPath.node.body;
  let insertIdx = -1;
  for (let i = 0; i < body.length; i++) {
    if (t.isImportDeclaration(body[i])) insertIdx = i;
  }
  if (insertIdx === -1) {
    programPath.unshiftContainer('body', [importDecl, stylesDecl]);
  } else {
    body.splice(insertIdx + 1, 0, importDecl, stylesDecl);
  }
}

/**
 * Merge a `_motifStyles.idN` reference into the JSX element's `style=`
 * attribute. RN's style prop accepts a single style or an array of
 * styles; later entries override earlier ones, so the hoisted entry
 * comes first and any user-supplied style is appended (user wins).
 */
function mergeNativeStyleAttribute(
  attributes: (t.JSXAttribute | t.JSXSpreadAttribute)[],
  styleRef: () => t.Expression,
): void {
  const existingIdx = attributes.findIndex(
    (a) => t.isJSXAttribute(a) && t.isJSXIdentifier(a.name) && a.name.name === 'style',
  );

  if (existingIdx === -1) {
    attributes.push(t.jsxAttribute(t.jsxIdentifier('style'), t.jsxExpressionContainer(styleRef())));
    return;
  }

  const existing = attributes[existingIdx] as t.JSXAttribute;
  const ev = existing.value;
  if (ev === null || !t.isJSXExpressionContainer(ev) || !t.isExpression(ev.expression)) {
    existing.value = t.jsxExpressionContainer(styleRef());
    return;
  }

  // If the existing value is already an array literal, prepend our ref
  // so user entries (which come later) keep their override priority.
  if (t.isArrayExpression(ev.expression)) {
    ev.expression.elements.unshift(styleRef());
    return;
  }

  // Generic case: wrap into a 2-element array `[motifRef, existing]`.
  existing.value = t.jsxExpressionContainer(t.arrayExpression([styleRef(), ev.expression]));
}

/**
 * Replace the JSX element name with the primitive's underlying HTML tag.
 * The caller is responsible for verifying safety via
 * `analyzeStripSafety` first; this helper performs the rewrite only.
 *
 * Mutates the opening element's name and the closing element to match.
 */
function stripWrapper(path: NodePath<t.JSXOpeningElement>, primitive: PrimitiveInfo): void {
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
  bakedObject: t.ObjectExpression,
): void {
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
