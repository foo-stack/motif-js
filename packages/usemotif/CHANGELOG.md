# usemotif

> Name history: `@motif-js/react` (v1, cross-platform aggregator) →
> `usemotif` (v2.0.0 onward; original v2 plan was unscoped `motif-js`,
> blocked by npm). v3 kept the unscoped `usemotif` name while
> consolidating the sibling packages from `@motif-js/*` to `@usemotif/*`
> and resetting the workspace to a fresh `1.0.0`. Entries dated **2.0.0
> and below** reference the historical `@motif-js/*` scope; the **1.0.0**
> entry below is the v3 cut.

## 1.0.1

### Patch Changes

- **Version bump only.** Re-exports the linked `@usemotif/*` packages at v1.0.1 — RTL / logical layout, `prefers-reduced-motion` support, default border-width / letter-spacing token scales, the native `lineHeight` fix, and smaller icon imports. See the component packages for details.

## 1.0.0

### Major Changes

- **Fresh v1.0.0 on the `@usemotif/*` scope.** The unscoped `usemotif` meta package keeps its name; the 13 sibling packages move from `@motif-js/*` to `@usemotif/*`, anchoring a fresh v1 line on the new scope. v2 (`@motif-js/*@2.0.0`) and v1 (`@motif-js/*@1.7.0`) versions stay on npm with deprecation notices pointing at the v3 names. The runtime is unchanged; cross-platform routing via the `react-native` exports condition still picks `@usemotif/react` for Vite/Next/etc. and `@usemotif/react-native` for Metro. See the [v2 → v3 migration guide](https://usemotif.dev/migrating/v2-to-v3) or run `npx @usemotif/migrate rename-v3` for the mechanical rewrite.

## 2.0.0

### Major Changes

- **Renamed from `@motif-js/react` to `usemotif`.** This package was previously the platform-aware aggregator under the `@motif-js/react` npm name; v2 promotes it to an unscoped, top-level package. The original v2 plan was to ship as `motif-js`, but npm blocked that name at publish time as too similar to an existing `motif.js` package; the meta package landed on `usemotif`, matching the docs domain at usemotif.dev. The platform-routing logic (`react-native` exports condition picking the right renderer for the bundler) is unchanged. See the [v1 → v2 migration guide](https://usemotif.dev/migrating/v1-to-v2) or run `npx @motif-js/migrate rename-v2` for the mechanical rewrite.

## 1.7.0

### Minor Changes

- **Re-exports the M-6 grid + transform props.** `<Box>` and every other primitive accept the new grid-layout and transform style props from [@motif-js/react-web@1.7.0](../react-web/CHANGELOG.md#170). Native entry accepts the props and emits nothing (RN has no grid surface and treats `transform` via its own RN-specific `[{ translateY: -1 }, { scale: 0.985 }]` array form, not the CSS string).

## 1.6.0

### Minor Changes

- **Responsive prop overrides now win the cascade.** Cross-platform surface for the [@motif-js/react-web@1.6.0](../react-web/CHANGELOG.md#160) fix: when a responsive prop has at least one non-`base` key, the `base` value emits as a class-scoped declaration so the breakpoint overrides (already class-scoped) actually apply. Native entry is unaffected — the at-rule machinery is web-only.

## 1.5.0

### Minor Changes

- **Re-exports the M-4 container props.** `<Box>` and every other web primitive accepts `containerType` and `containerName` from [@motif-js/react-web@1.5.0](../react-web/CHANGELOG.md#150). Native renderer accepts the props and emits nothing (RN has no equivalent CSS containment surface).

## 1.4.0

### Minor Changes

- **Re-exports the M-3 display props.** `<Box>` (and every other primitive on web) accepts the new `fontVariationSettings`, `maskImage`, `WebkitMaskImage`, and `clipPath` style props from [@motif-js/react-web@1.4.0](../react-web/CHANGELOG.md#140). New type re-export: `FontVariationAxisSettings`. The native entry mirrors the type re-export so cross-platform code stays compileable, but the renderer emits nothing for the props (RN has no equivalent CSS surfaces).

## 1.3.0

### Minor Changes

- **Re-exports the M-2 chrome surface.** `keyframes(...)` is available directly from `@motif-js/react` (web entry routes to `@motif-js/react-web`'s implementation; native entry routes to `@motif-js/core`'s `makeKeyframe`, which produces the same branded shape but doesn't inject anything because RN has no `@keyframes`). New types: `AnimationObject`, `AnimationValue`, `Keyframe`, `KeyframeDef`, `PseudoElementStyleBag`, `PseudoElementStyleProps`. Cross-platform code can call `keyframes(...)` once and pass the result through `<Box animation={{ name: keyframe, duration, easing }} />` — animation runs on web; the `duration` / `easing` slots are still picked up by the native entry driver.

## 1.2.0

### Minor Changes

- **Re-exports the new createTheme fields.** `FontFace`, `FontSource`, `ReducedMotionMode`, `ThemeRootStyles`, and `TokenMap` types are now available directly from `@motif-js/react`. The runtime emission itself ships with [@motif-js/react-web@1.2.0](../react-web/CHANGELOG.md#120) (web only — native has no global stylesheet to emit into).

## 1.1.2

### Patch Changes

- Version sync with [@motif-js/compiler-swc@1.1.2](../compiler-swc/CHANGELOG.md#112). No behavioral changes in this package; released alongside the compiler fix for version uniformity across all `@motif-js/*` packages.

## 1.1.1

### Patch Changes

- **Publish-pipeline fix.** v1.0.0 and v1.1.0 shipped with `workspace:*` strings unrewritten in their published `dependencies` because `scripts/publish.mjs` invoked raw `npm publish` instead of `yarn npm publish` (Yarn 4 only rewrites workspace deps when going through its own publish command). Both broke installs with `EUNSUPPORTEDPROTOCOL`. v1.1.1 ships with the script fixed; published manifests now resolve `workspace:*` to concrete versions.

## 1.1.0

### Minor Changes

- **Cross-platform via package-exports routing.** Previously the `react-native` exports condition pointed at the web-targeted dist, which would silently produce a non-working module under Metro. The package now ships parallel `dist/index.js` (web → `@motif-js/react-web`) and `dist/index.native.js` (native → `@motif-js/react-native`) builds. A single `npm install @motif-js/react` works for both web and React Native; the bundler picks the right renderer via the exports condition.

- **`createTheme` re-export.** The factory from `@motif-js/core` is now available directly from `@motif-js/react` so docs and consumers have a single import surface for theme construction.

## 1.0.0

### Minor Changes

- 8ac4dd5: **Primitives buildout.**

  35 new primitives ship on both renderers. Same prop schema, same
  behaviour where the platform supports it, deliberate divergence
  (with comments) where it doesn't. Every primitive composes the
  existing Box / Pressable / Text foundation, so theme + responsive
  - pseudo-state plumbing all flow through automatically.

  Layout: `ZStack`, `Spacer`, `Center`, `Wrap`, `AspectRatio`,
  `Grid`, `Flex`, `SafeArea`.

  Typography: `Heading` (level 1–6), `Paragraph`, `Code`, `Kbd`,
  `Blockquote` (with optional `cite`).

  Interaction: `Button` (full variant × intent × size matrix +
  loading / icon slots / fullWidth), `IconButton` (square Button +
  required a11y label), `Link` (`<a href>` web; `Linking.openURL`
  native; auto-injects `rel='noopener noreferrer'` on
  `target='_blank'`).

  Media: `Avatar` (image-with-initials fallback), `Icon` (token-
  sized SVG wrapper), `Svg` (typed primitive with Phosphor-friendly
  defaults). Plus a 12-icon starter set in `@motif-js/icons`: Plus,
  X, Check, ChevronUp / Down / Left / Right, Search, Trash, Heart,
  Star, ArrowRight. The full ~200-icon Phosphor-inspired set lands
  as a v0.4.x patch.

  Scroll & lists: `ScrollView` (direction / hideScrollbar),
  `Sticky` (web only — RN's `stickyHeaderIndices` integration is a
  follow-up), `VirtualList` (prop shape shipped; v0 renders non-
  virtualised so the eventual Virtuoso / FlashList integration is
  a drop-in).

  Forms: `Input`, `TextArea`, `NumberInput`, `PasswordInput` (all
  forwardRef'd; PasswordInput ships with a togglable eye), and the
  Field family — `Field` / `Label` / `FieldHelp` / `FieldError` /
  `Fieldset` — that auto-wires `aria-describedby` / `aria-invalid`
  / `aria-required` so callers get a11y right by default.

  Overlay & a11y: `Portal` (web `createPortal`, native `<Modal
transparent>`), `Overlay` (full-viewport scrim + tap-outside
  hook), `VisuallyHidden` (sr-only span web; zero-size accessible
  Box native), `LiveRegion` (`aria-live` / `accessibilityLiveRegion`),
  `FocusScope` (autoFocus + restoreFocus on mount/unmount; full
  Tab-cycling trap arrives with Dialog), and `Show` /
  `Hide` for declarative responsive visibility.

  Style-prop schema gains 17 new entries: `outline*` (5: outline,
  outlineStyle / Width / Color / Offset) for focus rings, and
  `border{Top,Right,Bottom,Left}{Width,Style,Color}` (12) for
  per-side border control needed by Blockquote and other
  typography accents.

  `@motif-js/react` re-exports the full primitive surface so
  cross-renderer apps import from a single package; package-field
  routing picks the right implementation per platform.

  What's not in this release:
  - **Real virtualisation** (Virtuoso / FlashList) for
    `VirtualList`. v0 renders every item; the prop shape is final
    so callers don't migrate when the integration ships.
  - **Native sticky headers via `stickyHeaderIndices`**. Native
    `Sticky` is a documented passthrough today.
  - **Real `react-native-svg` integration** for native `Svg` /
    `Icon`. v0 accepts a `SvgComponent` prop where callers can
    pass `Svg` from `react-native-svg`; the default is a sized
    Box that's useful for testing / emoji fallback.
  - **Tab-cycling focus trap** in `FocusScope`. v0 only
    autoFocuses + restoreFocuses; full Tab cycling lands with
    `Dialog` / `AlertDialog`.
  - **Full ~200-icon Phosphor-inspired set**. 12-icon starter
    ships now; the rest lands as a v0.4.x patch.

  Workspace test count: 469 → 491 passing + 3 skipped. New tests
  focus on Button (web 17 / native 8), layout extras (web 9 /
  native 8), typography (web 8 / native 7), IconButton + Link
  (web 10 / native 4), media (web 10), forms (web 10).

### Patch Changes

- Updated dependencies [8ac4dd5]
  - @motif-js/core@1.0.0
  - @motif-js/react-web@1.0.0

## 0.3.0

### Minor Changes

- a63a59b: **Compiler.**

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

### Patch Changes

- Updated dependencies [a63a59b]
  - @motif-js/core@0.3.0
  - @motif-js/react-web@0.3.0

## 0.2.0

### Minor Changes

- fc38fd6: **Native parity.**

  `@motif-js/react-native` reaches feature parity with the web renderer.
  The same prop schema, the same theming model, the same responsive
  shapes, the same container-query semantics — running on RN's
  `StyleSheet`, with theming via JS context, and container queries
  polyfilled via `View.onLayout`.

  The cross-renderer conformance suite (`@motif-js/test-utils`'
  `standardCases`) passes 18/18 against **both** renderers' adapters.
  "Same input → same resolved values" holds across the two trees.

  What's in:
  - **`@motif-js/react-native`** — `Box`, `Stack` / `HStack` / `VStack`,
    `Text`, `Pressable`, `Image`, `Container`, `ThemeProvider`,
    `<Theme name>`, `useTheme` / `useThemeName` / `useViewportWidth` /
    `useContainerInfo`. Same prop schema as `@motif-js/react-web`;
    literal-mode style resolution (no CSS variables — RN doesn't have
    a CSS cascade equivalent).
  - **Viewport-driven responsive resolution** — every responsive shape
    (object / array / DSL) resolves against the current viewport width
    via `Dimensions.addEventListener('change', …)`. Same mobile-first
    cascade as web. Re-renders on rotation / split-screen / window
    resize.
  - **Container-query polyfill** — `<Container name?>` measures itself
    via `View.onLayout`, exposes width via React context.
    `@<bp>` / `@<name>.<bp>` keys resolve against the matching
    container's width. `rateCapMs` prop tunes re-measure throttle
    (default 16ms = 1 frame; opt out with `0`).
  - **`@motif-js/test-utils`** — `RendererAdapter` contract is unchanged
    from v0.1; the native renderer ships its own adapter with the
    package's tests.

  What's not in:
  - Native renderer is published as JS source + types only — no
    pre-built dist for the native target (Metro transforms motif's
    source directly via the `react-native` field in `exports`).
  - Visual regression (Detox + Playwright) — deferred to v0.8+.
  - Bare RN demo app — Expo Router demo at `apps/playground-native`
    covers the same surface.
  - Compiler — still placeholder stubs.

### Patch Changes

- Updated dependencies [fc38fd6]
  - @motif-js/core@0.2.0
  - @motif-js/react-web@0.2.0

## 0.1.0

### Minor Changes

- 8321b3e: **v0.1.0 — first public preview** (web-only).

  The initial npm publish. The web renderer is feature-complete;
  native and the compiler are placeholders. Treat as **pre-alpha** — APIs may
  shift before v1.

  What's in:
  - **`@motif-js/core`** — token resolver, style-prop schema, theme types,
    responsive (object / array / DSL), media + container queries.
  - **`@motif-js/react-web`** — Box, Stack, Text, Container, Pressable,
    Image. ThemeProvider with CSS-variable theming and nestable
    sub-themes. SSR collector with Sync + AsyncLocalStorage backends.
    Conformance + snapshot test infrastructure.
  - **`@motif-js/react`** — re-exports the web primitives + `styled()`
    factory (variants + compoundVariants).
  - **`@motif-js/tokens`** — opinionated default light / dark themes plus
    validation fixtures for Primer, Atlassian, and Material 3.
  - **`@motif-js/test-utils`** — `ConformanceCase` / `RendererAdapter`,
    `standardCases`, `assertConformance`, `motifMatchers`.
  - Stub packages (`react-native`, `compiler-*`, `primitives`, `forms`,
    `headless`, `icons`, `color`, `reset`) ship with package metadata but
    no runtime yet — placeholders for upcoming releases.

  What's not in:
  - Native renderer
  - Static compiler
  - Headless components and full primitives roster

### Patch Changes

- Updated dependencies [8321b3e]
  - @motif-js/core@0.1.0
  - @motif-js/react-web@0.1.0
