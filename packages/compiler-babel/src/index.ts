import type { ConfigAPI, NodePath, PluginObj, PluginPass } from '@babel/core';
import * as t from '@babel/types';
import {
  analyzeStripSafety,
  bindingForJsxName,
  classifyJsxAttributes,
  evaluateLiteral,
  evaluateStyledConfig,
  extractNative,
  extractWeb,
  findMotifBindings,
  findThemeChainCombos,
  getPrimitiveInfo,
  resolveStyledMergedProps,
  type CallSiteAnalysis,
  type PrimitiveBinding,
  type PrimitiveInfo,
  type ResolvedStyledConfig,
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
  /**
   * Called once per source file at Program-exit with the set of observed
   * `<Theme>` chain combinations (e.g. `{ "red", "red_blue" }`). The host
   * build tool combines these with the registered base themes to
   * pre-generate just the cross-product CSS that's actually used,
   * avoiding the manual `themes={[...]}` registration step on the
   * provider. Skipped when no `<Theme>` boundaries are observed.
   */
  readonly onThemeChains?: (combos: ReadonlySet<string>, filename?: string) => void;
}

interface NativeStyleEntry {
  /** Property name on the hoisted styles object (`id0`, `id1`, …). */
  readonly id: string;
  /** Resolved style object to register. */
  readonly style: ResolvedStyle;
}

/**
 * One same-file `const X = styled(Y, { ... literal config ... })`
 * declaration the compiler can statically resolve. The Babel visitor
 * uses these to rewrite `<X size="sm" />` into `<Y p={2} />` (with the
 * variant prop dropped, the merged styles inlined, and the wrapper
 * collapsed to the underlying primitive). Cross-file styled() lookups
 * stay at runtime — the Babel pass processes one file at a time.
 */
interface StyledBinding {
  /** Local name introduced by `const X = styled(...)`. */
  readonly localName: string;
  /** The motif primitive being styled (resolved against state.bindings). */
  readonly underlying: PrimitiveBinding;
  /** The literal-evaluated config object. */
  readonly config: ResolvedStyledConfig;
}

interface State extends PluginPass {
  bindings: Map<string, PrimitiveBinding>;
  styledBindings: Map<string, StyledBinding>;
  cssChunks: string[];
  nativeStyles: NativeStyleEntry[];
  nativeIdCounter: number;
}

/** Module specifiers that export the `styled()` factory. */
const STYLED_SOURCES: ReadonlySet<string> = new Set(['@motif-js/react']);

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
          state.styledBindings = collectStyledBindings(path.node.body, state.bindings);
          state.cssChunks = [];
          state.nativeStyles = [];
          state.nativeIdCounter = 0;
        },
        exit(path, state) {
          const opts = state.opts as MotifBabelOptions;
          const target = opts.target ?? 'web';

          // Theme-chain pre-generation runs on both targets — observed
          // chains feed into the host build tool's CSS-emit pipeline
          // regardless of whether the file is being compiled for web
          // or native (the chains describe the JSX structure, not the
          // emitted output).
          if (typeof opts.onThemeChains === 'function') {
            const combos = findThemeChainCombos(path.node.body);
            if (combos.size > 0) opts.onThemeChains(combos, state.filename);
          }

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
        // Same-file `styled()` expansion: `<MyButton size="sm" />` →
        // `<Box p={2} />` with the variant prop dropped and the merged
        // styles inlined. After the rewrite, the regular extract
        // pipeline treats it as a plain primitive call site.
        if (t.isJSXIdentifier(path.node.name)) {
          const styledBinding = state.styledBindings.get(path.node.name.name);
          if (styledBinding !== undefined) {
            const expanded = applyStyledExpansion(path, styledBinding);
            if (!expanded) return; // call-site has dynamic variant args
          }
        }

        const binding = bindingForJsxName(path.node.name, state.bindings);
        if (binding === undefined) return;

        const primitive = getPrimitiveInfo(binding.importedName);
        const analysis = classifyJsxAttributes(path.node.attributes, path.scope, primitive);
        if (analysis.classification === 'dynamic') return;
        if (
          analysis.staticProps.length === 0 &&
          analysis.pseudoStateProps.length === 0 &&
          analysis.motionProps.length === 0
        ) {
          return;
        }

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

/**
 * Scan the program body for `import { styled } from '@motif-js/react'`
 * declarations and resulting `const X = styled(Y, { ... })` definitions.
 * The result is a map keyed on the local name introduced by the
 * declaration (`X`), with the underlying primitive binding and the
 * literal-evaluated config attached.
 *
 * Cross-file styled definitions are intentionally not tracked — the
 * Babel pass works on one file at a time, so the consuming file can't
 * see the producing file's config. Those call sites stay at runtime.
 *
 * Aliased imports (`import { styled as s } from '@motif-js/react'`) are
 * supported.
 */
function collectStyledBindings(
  programBody: readonly t.Statement[],
  primitiveBindings: ReadonlyMap<string, PrimitiveBinding>,
): Map<string, StyledBinding> {
  const styledLocals = new Set<string>();
  for (const stmt of programBody) {
    if (!t.isImportDeclaration(stmt)) continue;
    if (!STYLED_SOURCES.has(stmt.source.value)) continue;
    for (const spec of stmt.specifiers) {
      if (!t.isImportSpecifier(spec)) continue;
      const importedName = t.isIdentifier(spec.imported) ? spec.imported.name : spec.imported.value;
      if (importedName !== 'styled') continue;
      styledLocals.add(spec.local.name);
    }
  }
  if (styledLocals.size === 0) return new Map();

  const out = new Map<string, StyledBinding>();
  for (const stmt of programBody) {
    let decls: t.VariableDeclarator[] | null = null;
    if (t.isVariableDeclaration(stmt)) {
      decls = stmt.declarations;
    } else if (
      (t.isExportNamedDeclaration(stmt) || t.isExportDefaultDeclaration(stmt)) &&
      stmt.declaration !== null &&
      stmt.declaration !== undefined &&
      t.isVariableDeclaration(stmt.declaration)
    ) {
      decls = stmt.declaration.declarations;
    }
    if (decls === null) continue;

    for (const decl of decls) {
      if (!t.isIdentifier(decl.id)) continue;
      const init = decl.init;
      if (init === null || init === undefined || !t.isCallExpression(init)) continue;
      const callee = init.callee;
      if (!t.isIdentifier(callee) || !styledLocals.has(callee.name)) continue;

      const [componentArg, configArg] = init.arguments;
      if (componentArg === undefined || !t.isIdentifier(componentArg)) continue;
      const underlying = primitiveBindings.get(componentArg.name);
      if (underlying === undefined) continue;
      if (configArg === undefined || !t.isExpression(configArg)) continue;
      const config = evaluateStyledConfig(configArg);
      if (config === null) continue;

      out.set(decl.id.name, { localName: decl.id.name, underlying, config });
    }
  }
  return out;
}

/**
 * Rewrite a `<MyStyled foo="bar" size="sm" />` call site into the
 * underlying primitive (`<Box />`) with the variant prop consumed and
 * the merged style props spliced in. Returns `false` when the call
 * site has dynamic variant values (resolver can't run); the caller
 * leaves the JSX alone in that case.
 *
 * Caller-supplied non-variant attributes stay on the JSX (they take
 * precedence over the merged config — same semantics as runtime).
 * When the caller has already set a style prop the config would also
 * set, the caller's value wins (the merged entry is dropped to avoid
 * duplicate JSX attributes).
 */
function applyStyledExpansion(path: NodePath<t.JSXOpeningElement>, styled: StyledBinding): boolean {
  const callValues: Record<string, unknown> = {};
  const consumedVariantAttrs = new Set<t.JSXAttribute>();
  const callerAttrNames = new Set<string>();

  for (const attr of path.node.attributes) {
    if (t.isJSXSpreadAttribute(attr)) {
      // Spread invalidates static resolution.
      return false;
    }
    if (!t.isJSXIdentifier(attr.name)) continue;
    const name = attr.name.name;
    callerAttrNames.add(name);
    if (!styled.config.variantNames.has(name)) continue;

    // Variant prop: must be a literal value to fold at compile time.
    const value = attr.value;
    let lit: { ok: true; value: unknown } | { ok: false } = { ok: false };
    if (value === null) {
      // `<X enabled />` → boolean true (matches React's JSX semantics).
      lit = { ok: true, value: true };
    } else if (t.isStringLiteral(value)) {
      lit = { ok: true, value: value.value };
    } else if (t.isJSXExpressionContainer(value)) {
      const expr = value.expression;
      if (!t.isJSXEmptyExpression(expr)) {
        lit = evaluateLiteral(expr, path.scope);
      }
    }
    if (!lit.ok) return false;
    callValues[name] = lit.value;
    consumedVariantAttrs.add(attr);
  }

  const merged = resolveStyledMergedProps(styled.config, callValues);
  if (merged === null) return false;

  // Build new attribute list: caller's non-variant attrs first (so
  // they appear in source order), with merged-config entries spliced
  // in for any name the caller didn't set. Caller wins on conflict.
  const remaining = path.node.attributes.filter(
    (attr) => !(t.isJSXAttribute(attr) && consumedVariantAttrs.has(attr)),
  );
  const mergedAttrs: t.JSXAttribute[] = [];
  for (const [k, v] of Object.entries(merged)) {
    if (callerAttrNames.has(k)) continue;
    mergedAttrs.push(buildJsxAttrFromValue(k, v));
  }
  // Place merged-config attrs first so caller's later entries override
  // at runtime — mirrors the runtime's `{ ...merged, ...passThrough }`
  // (caller wins).
  path.node.attributes = [...mergedAttrs, ...remaining];

  // Rewrite the JSX name to the underlying primitive. Closing tag
  // mirrors. Subsequent visitor logic (extractWeb, wrapper-stripping)
  // sees a regular primitive call site.
  const newName = t.jsxIdentifier(styled.underlying.localName);
  path.node.name = newName;
  const parent = path.parent;
  if (
    t.isJSXElement(parent) &&
    parent.closingElement !== null &&
    parent.closingElement !== undefined
  ) {
    parent.closingElement.name = t.jsxIdentifier(styled.underlying.localName);
  }
  return true;
}

/**
 * Build a `JSXAttribute` from a literal value. Strings → string-literal
 * attribute (no braces); numbers / booleans / objects / arrays →
 * expression container with the corresponding literal node. Falls back
 * to expression container with `null` for unsupported values, but the
 * resolver only emits primitives + plain objects so that branch is
 * dead in practice.
 */
function buildJsxAttrFromValue(name: string, value: unknown): t.JSXAttribute {
  if (typeof value === 'string') {
    return t.jsxAttribute(t.jsxIdentifier(name), t.stringLiteral(value));
  }
  return t.jsxAttribute(t.jsxIdentifier(name), t.jsxExpressionContainer(literalToNode(value)));
}

function literalToNode(value: unknown): t.Expression {
  if (typeof value === 'string') return t.stringLiteral(value);
  if (typeof value === 'number') return t.numericLiteral(value);
  if (typeof value === 'boolean') return t.booleanLiteral(value);
  if (value === null) return t.nullLiteral();
  if (Array.isArray(value)) {
    return t.arrayExpression(value.map((v) => literalToNode(v)));
  }
  if (typeof value === 'object') {
    const props: t.ObjectProperty[] = [];
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      props.push(t.objectProperty(t.identifier(k), literalToNode(v)));
    }
    return t.objectExpression(props);
  }
  return t.identifier('undefined');
}

export { PACKAGE_NAME };
