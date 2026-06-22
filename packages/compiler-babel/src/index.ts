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
} from '@usemotif/compiler-core';
import { type ResolvedStyle, resolveStylesToVars } from '@usemotif/core';

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
 * The compiler shares its resolver with the runtime (`@usemotif/core`),
 * so the emitted `m-<hash>` class names (web) and StyleSheet entries
 * (native) are byte-identical to what the runtime would produce. Mid-
 * migration codebases (some compiled, some not) dedupe correctly.
 */
/**
 * What the optimizing extractor surfaces about its aggressive-mode work for
 * one source file — emitted via {@link MotifBabelOptions.onAggressiveReport}
 * so the extra extraction is never silent.
 */
export interface AggressiveReport {
  readonly filename?: string | undefined;
  /** Fully-static object spreads inlined into explicit props this file. */
  readonly spreadsInlined: number;
  /** Spreads left in place on a motif element (not provably static). */
  readonly spreadsBailed: number;
  /** `prop={cond ? A : B}` ternaries baked to a conditional inline value. */
  readonly ternariesInlined: number;
}

export interface MotifBabelOptions {
  /** `'web'` (default) extracts CSS. `'native'` hoists StyleSheet entries. */
  readonly target?: 'web' | 'native';
  /**
   * Extraction aggressiveness.
   *
   * - `'safe'` (default) — the conservative analyzer: a construct is extracted
   *   only when it's provably static, and anything uncertain falls through to
   *   the runtime. Output is byte-identical to a build with the option unset.
   * - `'aggressive'` — opt into extra extraction that the safe tier leaves to
   *   the runtime. Currently: fully-static object spreads (`{...{ p: 8 }}` or
   *   `{...CONST}`) are inlined into explicit props so they bake like any other
   *   static prop. Still obeys byte-for-byte runtime parity; it only ever
   *   extracts *more*, never differently. Pair with `onAggressiveReport` to see
   *   what it did.
   */
  readonly optimizationLevel?: 'safe' | 'aggressive';
  /**
   * Called once per source file at Program-exit (aggressive mode only) with a
   * summary of the extra extraction performed, so a build can log or audit it.
   * Skipped in safe mode and when nothing aggressive happened.
   */
  readonly onAggressiveReport?: (report: AggressiveReport) => void;
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
  aggressiveSpreadsInlined: number;
  aggressiveSpreadsBailed: number;
  aggressiveTernariesInlined: number;
}

/**
 * Module specifiers that export the `styled()` factory. `styled` ships from
 * the umbrella `usemotif` package (and is re-exported from the renderer
 * entry points); omitting `usemotif` made the whole variant-expansion
 * pipeline a no-op for real consumers.
 */
const STYLED_SOURCES: ReadonlySet<string> = new Set([
  'usemotif',
  '@usemotif/react',
  '@usemotif/react-native',
]);

const PACKAGE_NAME = '@usemotif/compiler-babel';

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
          state.aggressiveSpreadsInlined = 0;
          state.aggressiveSpreadsBailed = 0;
          state.aggressiveTernariesInlined = 0;
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

          // Surface aggressive-mode work before the target-specific early
          // returns below, so the report fires even for a file that produced
          // no CSS / StyleSheet output.
          if (
            typeof opts.onAggressiveReport === 'function' &&
            (state.aggressiveSpreadsInlined > 0 ||
              state.aggressiveSpreadsBailed > 0 ||
              state.aggressiveTernariesInlined > 0)
          ) {
            opts.onAggressiveReport({
              filename: state.filename,
              spreadsInlined: state.aggressiveSpreadsInlined,
              spreadsBailed: state.aggressiveSpreadsBailed,
              ternariesInlined: state.aggressiveTernariesInlined,
            });
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
          const name = path.node.name.name;
          const styledBinding = state.styledBindings.get(name);
          if (styledBinding !== undefined && resolvesToModuleBinding(path, name)) {
            const expanded = applyStyledExpansion(path, styledBinding);
            if (!expanded) return; // call-site has dynamic variant args
          }
        }

        const binding = bindingForJsxName(path.node.name, state.bindings);
        if (binding === undefined) return;
        // Match by binding identity, not just name: a local shadow of the
        // imported name (`const Box = props.Box`, a destructured prop, etc.)
        // must not be rewritten into the motif primitive.
        if (
          t.isJSXIdentifier(path.node.name) &&
          !resolvesToModuleBinding(path, path.node.name.name)
        ) {
          return;
        }

        const primitive = getPrimitiveInfo(binding.importedName);
        const opts = state.opts as MotifBabelOptions;
        const aggressive = opts.optimizationLevel === 'aggressive';
        const target = opts.target ?? 'web';

        // Aggressive-mode pre-pass: turn fully-static object spreads into the
        // equivalent explicit attributes *before* classification, so the
        // normal extract pipeline bakes them. Scoped to confirmed motif
        // primitives (this point is past the binding-identity guard), so
        // unrelated JSX is never touched.
        if (aggressive) {
          const report = inlineStaticSpreads(path, path.scope);
          state.aggressiveSpreadsInlined += report.inlined;
          state.aggressiveSpreadsBailed += report.bailed;
        }

        const analysis = classifyJsxAttributes(path.node.attributes, path.scope, primitive);

        // A `prop={cond ? A : B}` with both branches static is a dynamic prop
        // today, but (web, aggressive) it can be baked to a conditional inline
        // value. Detecting a candidate keeps the early-returns below from
        // skipping an element whose only non-static content is such a ternary.
        const ternaryEligible =
          aggressive && target === 'web' && hasStaticTernaryCandidate(analysis, path.scope);

        if (analysis.classification === 'dynamic' && !ternaryEligible) return;
        if (
          analysis.staticProps.length === 0 &&
          analysis.pseudoStateProps.length === 0 &&
          analysis.motionProps.length === 0 &&
          !ternaryEligible
        ) {
          return;
        }

        if (target === 'web') {
          rewriteJsxForWeb(path, analysis, state, primitive, aggressive);
        } else if (target === 'native') {
          rewriteJsxForNative(path, analysis, state);
        }
      },
    },
  };
}

/**
 * Confirm a JSX identifier still resolves, at its call site, to the
 * module-scope binding the plugin recorded (a motif import or a `styled()`
 * const) — i.e. it hasn't been shadowed by a local binding (a destructured
 * prop, an inner `const`, a function param). Matching by name alone would
 * rewrite an unrelated component that happens to share the name.
 *
 * Uses binding identity: the nearest binding for the name at this site must
 * be the very same binding object as the program-scope binding. A shadow
 * yields a different (inner) binding; a name whose only binding is local
 * (the module binding having been erased, e.g. a type-only import) has no
 * program binding and so fails too.
 */
function resolvesToModuleBinding(path: NodePath<t.JSXOpeningElement>, name: string): boolean {
  const local = path.scope.getBinding(name);
  if (local === undefined) return false;
  const program = path.scope.getProgramParent().getBinding(name);
  return program !== undefined && local === program;
}

/** Scope shape `evaluateLiteral` accepts — derived so we don't import it. */
type LiteralScope = Parameters<typeof evaluateLiteral>[1];

/** Valid JSX attribute name: identifier-ish, allowing the `-` in aria-/data-. */
const JSX_ATTR_NAME_RE = /^[A-Za-z_$][A-Za-z0-9_$-]*$/;

/**
 * Convert a literal JS value (from `evaluateLiteral`) into a JSX attribute
 * value node. Strings become a plain string-literal attribute
 * (`p="$space.4"`); everything else (number, boolean, null, or a nested
 * object/array for a responsive value) becomes an expression container.
 * Returns null for anything `valueToNode` can't represent, so the caller can
 * bail the whole spread rather than emit something lossy.
 */
function literalToJsxAttrValue(value: unknown): t.StringLiteral | t.JSXExpressionContainer | null {
  if (typeof value === 'string') return t.stringLiteral(value);
  if (value === undefined) return null;
  try {
    const node = t.valueToNode(value);
    if (!t.isExpression(node)) return null;
    return t.jsxExpressionContainer(node);
  } catch {
    return null;
  }
}

/**
 * Expand a spread argument into explicit JSX attributes when it is a
 * fully-static object literal (directly, or a const that resolves to one).
 * Returns null to signal "leave the spread alone" — a dynamic argument, a
 * non-object, an attribute-unsafe key, or an unrepresentable value.
 */
function spreadArgToAttributes(arg: t.Expression, scope: LiteralScope): t.JSXAttribute[] | null {
  const lit = evaluateLiteral(arg, scope);
  if (!lit.ok) return null;
  const value = lit.value;
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
  const obj = value as Record<string, unknown>;
  const attrs: t.JSXAttribute[] = [];
  for (const key of Object.keys(obj)) {
    if (!JSX_ATTR_NAME_RE.test(key)) return null;
    const valueNode = literalToJsxAttrValue(obj[key]);
    if (valueNode === null) return null;
    attrs.push(t.jsxAttribute(t.jsxIdentifier(key), valueNode));
  }
  return attrs;
}

/**
 * Aggressive-mode pre-pass over one motif JSX element: replace every
 * fully-static object spread with the equivalent explicit attributes at the
 * spread's position. Precedence is preserved — the synthesized attributes sit
 * where the spread was, so a later attribute (or a later spread) still
 * overrides, exactly as the runtime spread would. Spreads that can't be proven
 * static are left untouched and counted as bailed.
 *
 * This is the entire footprint of static-spread extraction: by lowering the
 * spread to ordinary attributes here, the unchanged classify → extract →
 * rewrite → strip pipeline produces output byte-identical to what the runtime
 * resolves for the same element.
 */
function inlineStaticSpreads(
  path: NodePath<t.JSXOpeningElement>,
  scope: LiteralScope,
): { inlined: number; bailed: number } {
  let inlined = 0;
  let bailed = 0;
  let changed = false;
  const next: (t.JSXAttribute | t.JSXSpreadAttribute)[] = [];
  for (const attr of path.node.attributes) {
    if (!t.isJSXSpreadAttribute(attr)) {
      next.push(attr);
      continue;
    }
    const expanded = spreadArgToAttributes(attr.argument, scope);
    if (expanded === null) {
      bailed++;
      next.push(attr);
      continue;
    }
    inlined++;
    changed = true;
    next.push(...expanded);
  }
  if (changed) path.node.attributes = next;
  return { inlined, bailed };
}

/** A style-prop ternary lowered to a conditional CSS value. */
interface StaticTernary {
  /** Source attribute name to drop from the JSX. */
  readonly sourceName: string;
  /** Resolved CSS property the prop maps to (`padding`, `backgroundColor`). */
  readonly cssProp: string;
  /** The runtime condition (cloned), kept dynamic. */
  readonly test: t.Expression;
  /** Resolved value node for the truthy branch. */
  readonly whenTrue: t.Expression;
  /** Resolved value node for the falsy branch. */
  readonly whenFalse: t.Expression;
}

function scalarToNode(value: string | number): t.Expression {
  return typeof value === 'number' ? t.numericLiteral(value) : t.stringLiteral(value);
}

/**
 * Resolve a single style-prop value the way the runtime would (token → CSS
 * var, alias → CSS property), but only accept a result that is exactly one
 * scalar CSS property. Returns null for responsive objects, multi-property
 * shorthands, transform compositions that don't collapse to one key, or any
 * non-scalar — those stay at runtime.
 */
function resolveScalarStyle(
  styleName: string,
  value: unknown,
): { prop: string; value: string | number } | null {
  if (value === null || typeof value === 'object' || typeof value === 'boolean') return null;
  if (typeof value !== 'string' && typeof value !== 'number') return null;
  const { style } = resolveStylesToVars({ [styleName]: value });
  const keys = Object.keys(style);
  if (keys.length !== 1) return null;
  const prop = keys[0]!;
  const resolved = (style as Record<string, unknown>)[prop];
  if (typeof resolved !== 'string' && typeof resolved !== 'number') return null;
  return { prop, value: resolved };
}

/**
 * Recognise a dynamic style prop whose value is `test ? A : B` with both
 * branches statically resolvable to the same single scalar CSS property.
 * Returns the lowered form, or null when it isn't such a ternary.
 */
function asStaticTernary(
  dp: CallSiteAnalysis['dynamicProps'][number],
  scope: LiteralScope,
): StaticTernary | null {
  const attr = dp.handle;
  if (!t.isJSXAttribute(attr as t.Node)) return null;
  const value = (attr as t.JSXAttribute).value;
  if (value === null || !t.isJSXExpressionContainer(value)) return null;
  const expr = value.expression;
  if (!t.isConditionalExpression(expr)) return null;
  const a = evaluateLiteral(expr.consequent, scope);
  const b = evaluateLiteral(expr.alternate, scope);
  if (!a.ok || !b.ok) return null;
  const ra = resolveScalarStyle(dp.name, a.value);
  const rb = resolveScalarStyle(dp.name, b.value);
  if (ra === null || rb === null || ra.prop !== rb.prop) return null;
  return {
    sourceName: dp.sourceName ?? dp.name,
    cssProp: ra.prop,
    test: t.cloneNode(expr.test),
    whenTrue: scalarToNode(ra.value),
    whenFalse: scalarToNode(rb.value),
  };
}

/** Cheap pre-check: does the element have at least one extractable ternary? */
function hasStaticTernaryCandidate(analysis: CallSiteAnalysis, scope: LiteralScope): boolean {
  return analysis.dynamicProps.some((dp) => asStaticTernary(dp, scope) !== null);
}

/**
 * Collect every static-branch ternary on the element. Returns null (extract
 * none) unless **every** dynamic prop is such a ternary and no two — nor a
 * ternary and an already-baked static prop (`staticCssProps`) — target the
 * same CSS property. That all-or-nothing rule keeps every value on the inline
 * layer, so there is no inline-vs-runtime cascade to invert: the baked
 * `style` object holds exactly what the runtime would compute per branch.
 */
function collectStaticTernaries(
  analysis: CallSiteAnalysis,
  scope: LiteralScope,
  staticCssProps: ReadonlySet<string>,
): StaticTernary[] | null {
  if (analysis.dynamicProps.length === 0) return null;
  const used = new Set(staticCssProps);
  const out: StaticTernary[] = [];
  for (const dp of analysis.dynamicProps) {
    const ternary = asStaticTernary(dp, scope);
    if (ternary === null) return null; // a truly-dynamic prop → leave all at runtime
    if (used.has(ternary.cssProp)) return null; // collision → leave all at runtime
    used.add(ternary.cssProp);
    out.push(ternary);
  }
  return out;
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
  aggressive: boolean,
): void {
  const result = extractWeb(analysis);

  // Aggressive: lower `prop={cond ? A : B}` (both branches static) to a
  // conditional entry in the same inline-style object the static props bake
  // into. Only when every dynamic prop qualifies and nothing collides — so
  // the whole element resolves on the inline layer with no cascade inversion.
  //
  // The ternary value lands in `style` (applied after the wrapper's base), so
  // bail if anything could need a different layer/order: a pseudo or motion
  // bag (their specificity lift would be bypassed), or a static prop the
  // extractor kept on the JSX because it shares a shorthand family with a
  // ternary (baking the ternary post-base could then invert source order).
  const consumedStatic = new Set(result.consumedProps);
  const staticKeptOnJsx = analysis.staticProps.some(
    (p) => typeof p.sourceName === 'string' && !consumedStatic.has(p.sourceName),
  );
  const ternaries =
    aggressive &&
    analysis.pseudoStateProps.length === 0 &&
    analysis.motionProps.length === 0 &&
    !staticKeptOnJsx
      ? collectStaticTernaries(analysis, path.scope, new Set(Object.keys(result.inlineStyle)))
      : null;

  const consumed = new Set(result.consumedProps);
  if (ternaries !== null) {
    for (const ternary of ternaries) consumed.add(ternary.sourceName);
  }
  const remaining: (t.JSXAttribute | t.JSXSpreadAttribute)[] = [];
  for (const attr of path.node.attributes) {
    if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name) && consumed.has(attr.name.name)) {
      continue;
    }
    remaining.push(attr);
  }

  const bakedStyle = resolvedStyleToObjectExpression(result.inlineStyle);
  if (ternaries !== null && ternaries.length > 0) {
    for (const ternary of ternaries) {
      bakedStyle.properties.push(
        t.objectProperty(
          t.identifier(ternary.cssProp),
          t.conditionalExpression(ternary.test, ternary.whenTrue, ternary.whenFalse),
        ),
      );
    }
    state.aggressiveTernariesInlined += ternaries.length;
  }
  if (bakedStyle.properties.length > 0) {
    mergeStyleAttribute(remaining, bakedStyle);
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
    // `className={dynamic}` → `className={["m-x", dynamic].filter(Boolean).join(" ")}`.
    // Raw `"m-x " + dynamic` concatenation would stringify a falsy dynamic
    // value into the class list (`"m-x undefined"`, `"m-x false"`, or a
    // trailing space for `""`). The runtime builds the class with
    // `[...].filter(Boolean).join(' ')`, so mirror that to stay identical.
    existing.value = t.jsxExpressionContainer(
      t.callExpression(
        t.memberExpression(
          t.callExpression(
            t.memberExpression(
              t.arrayExpression([t.stringLiteral(generated), ev.expression]),
              t.identifier('filter'),
            ),
            [t.identifier('Boolean')],
          ),
          t.identifier('join'),
        ),
        [t.stringLiteral(' ')],
      ),
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
 * Scan the program body for `import { styled } from '@usemotif/react'`
 * declarations and resulting `const X = styled(Y, { ... })` definitions.
 * The result is a map keyed on the local name introduced by the
 * declaration (`X`), with the underlying primitive binding and the
 * literal-evaluated config attached.
 *
 * Cross-file styled definitions are intentionally not tracked — the
 * Babel pass works on one file at a time, so the consuming file can't
 * see the producing file's config. Those call sites stay at runtime.
 *
 * Aliased imports (`import { styled as s } from '@usemotif/react'`) are
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
    if (stmt.importKind === 'type') continue;
    for (const spec of stmt.specifiers) {
      if (!t.isImportSpecifier(spec)) continue;
      if (spec.importKind === 'type') continue;
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
/**
 * Whether a JSX attribute's value is guaranteed to be defined at runtime —
 * i.e. it can soundly override a merged-config entry. A boolean shorthand
 * (`<X foo />`), a string literal, or an expression that statically evaluates
 * to a non-`undefined` literal qualifies. A dynamic expression (which might
 * be `undefined`) does not.
 */
function isDefinitelyDefinedAttrValue(
  attr: t.JSXAttribute,
  path: NodePath<t.JSXOpeningElement>,
): boolean {
  const value = attr.value;
  if (value === null) return true; // boolean shorthand → true
  if (t.isStringLiteral(value)) return true;
  if (t.isJSXExpressionContainer(value)) {
    const expr = value.expression;
    if (t.isJSXEmptyExpression(expr)) return false;
    const lit = evaluateLiteral(expr, path.scope);
    return lit.ok && lit.value !== undefined;
  }
  return false;
}

function applyStyledExpansion(path: NodePath<t.JSXOpeningElement>, styled: StyledBinding): boolean {
  const callValues: Record<string, unknown> = {};
  const consumedVariantAttrs = new Set<t.JSXAttribute>();
  const callerAttrNames = new Set<string>();
  const callerAttrs = new Map<string, t.JSXAttribute>();

  for (const attr of path.node.attributes) {
    if (t.isJSXSpreadAttribute(attr)) {
      // Spread invalidates static resolution.
      return false;
    }
    if (!t.isJSXIdentifier(attr.name)) continue;
    const name = attr.name.name;
    callerAttrNames.add(name);
    callerAttrs.set(name, attr);
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

  // Soundness guard: when the caller sets the same style key the merged config
  // also sets, but the caller's value may be `undefined` at runtime
  // (`padding={cond ? 4 : undefined}`), we can't expand. The runtime styled()
  // drops an explicit `undefined` and falls back to the config value; a
  // compiled `<Box padding={cond ? 4 : undefined} />` has no fallback and
  // would render with no padding. Bail so the runtime resolves it correctly.
  for (const k of Object.keys(merged)) {
    if (!callerAttrNames.has(k)) continue;
    const attr = callerAttrs.get(k);
    if (attr !== undefined && !isDefinitelyDefinedAttrValue(attr, path)) return false;
  }

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
