---
'@motif-js/core': minor
'@motif-js/react': minor
'@motif-js/react-web': minor
'@motif-js/react-native': minor
'@motif-js/primitives': minor
'@motif-js/forms': minor
'@motif-js/headless': minor
'@motif-js/icons': minor
'@motif-js/compiler-core': minor
'@motif-js/compiler-babel': minor
'@motif-js/compiler-swc': minor
'@motif-js/compiler-metro': minor
'@motif-js/tokens': minor
'@motif-js/color': minor
'@motif-js/reset': minor
'@motif-js/test-utils': minor
---

**Phase D — Compiler.**

motif-js's progressive compiler ships. The runtime keeps working as
before; opt-in compile-time extraction folds static motif call sites
into baked `style` + `className` + at-rule CSS, and the runtime
fast-paths the result. Compiled output is **byte-identical** to what
the runtime would render, so half-compiled half-runtime apps dedupe
to one set of `m-<hash>` classes rather than two.

What's in:

- **`@motif-js/compiler-core`** — the renderer-agnostic analysis
  layer. Babel-AST classifier (`classifyJsxAttributes`) splits each
  motif JSX call site into static / partial-static / dynamic;
  `evaluateLiteral` pulls compile-time values out of strings,
  numbers, negative numerics, no-substitution template literals,
  object/array expressions, and `const`-bound identifiers with
  literal initialisers. `extractWeb` produces the inline style +
  class name + at-rule CSS by reusing `@motif-js/core`'s
  `resolveResponsiveStylesToVars`, so compiler and runtime always
  agree. `extractNative` extracts literal-only base values; tokens
  and responsive overrides stay at runtime since theming + viewport
  are dynamic on native. Differential parity is proven against 15
  of the 18 cross-renderer standard cases (3 Pressable pseudo-state
  cases skipped — they need a separate extractor and land in a
  later release).

- **`@motif-js/compiler-babel`** — the canonical Babel plugin (164
  code-only LOC). Walks JSX, drops consumed style props, merges
  baked `style` / `className` into any user-supplied attribute
  (user values win, mirroring the runtime's
  `{ ...baseStyle, ...inlineStyle }` merge). Aggregates per-file
  CSS through an `onCss` callback so host build tools can route
  it to a stylesheet output.

- **`@motif-js/compiler-swc`** — universal bundler shim (107 LOC)
  via `unplugin@3`. Despite the package name it's not an SWC plugin
  (those have to be WASM); it exposes `vite` / `rollup` / `webpack`
  / `rspack` / `esbuild` / `farm` builders from one source, all
  routing to the canonical Babel pass. Layers BEFORE the host's
  SWC pass when used with Next or `@vitejs/plugin-react-swc`.

- **`@motif-js/compiler-metro`** — Metro/Expo wrapper (41 LOC).
  Default-exports a function returning a `[plugin, options]`
  Babel-tuple ready to drop into `babel.config.js`'s `plugins`
  array. `target` defaults to `'native'`. Future StyleSheet
  hoisting will land here.

- **Box fast-path** in `@motif-js/react-web`. After the babel plugin
  strips static style props, `rest` carries no style props, so
  `<Box>` early-returns a plain `createElement(as, ...)` instead
  of routing through the resolver + class-injection round-trip.
  Cascades to Stack / HStack / VStack / Text / Pressable since they
  all delegate to Box. The slow path is unchanged for
  runtime-only callers.

- **Shared CSS-emission helpers** moved into `@motif-js/core`
  (`hashAtRules`, `buildAtRulesCss`, `stringifyDeclarations`, etc.).
  Both runtime and compiler consume the same source — the parity
  guarantee is structural, not aspirational.

Performance, measured on a 200-Box render-heavy bench
(`benchmarks/render`):

- runtime: 1,096 hz (mean 0.91 ms / render). 1.00× baseline.
- compiled: 1,895 hz (mean 0.53 ms / render). **1.73× faster**.
- vanilla `<div>`: 2,303 hz (mean 0.43 ms / render). 2.10× faster
  (theoretical floor). Compiled closes 80% of that gap.

What's not in:

- Wrapper-stripping (replacing `<Box>` with `<div>` in compiled
  output) — would push compiled speedup higher. Open lever for a
  future release.
- Pseudo-state extraction (`_hover` / `_focus` / `_active`) on
  Pressable — bring the 3 skipped differential cases into the
  passing set in a later patch.
- Native StyleSheet hoisting in `compiler-metro` — currently the
  native target is a Babel-side no-op while the runtime keeps
  resolving styles. Future minor will hoist a single
  `StyleSheet.create({...})` per file.
- Cross-library bench rows (Tamagui, NativeWind, Stitches) —
  legitimacy data, not a release gate.
