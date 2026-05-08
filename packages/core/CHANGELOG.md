# @motif-js/core

## 1.4.0

### Minor Changes

- **`fontVariationSettings` style prop with a typed object form.** Accepts the CSS string passthrough you'd write by hand (`"'opsz' 36, 'wght' 600"`), or a typed object keyed by OpenType axis tag — common axes (`opsz`, `wght`, `wdth`, `ital`, `slnt`, `GRAD`, `SOFT`) are typed for autocomplete; foundry-specific axes flow through the index signature. The resolver serializes the object to the CSS shorthand. Responsive object syntax works as well: `{ base: { wght: 380 }, md: { wght: 720, slnt: -6 } }` emits a base inline value plus a media-query override.

  ```tsx
  <Box fontVariationSettings={{ opsz: 36, wght: 600 }}>display heading</Box>
  // → font-variation-settings: 'opsz' 36, 'wght' 600;
  ```

  New exports: `FontVariationAxisSettings`, `serializeFontVariationSettings`. The `StylePropDefinition` schema gains an optional `serialize: (value: object) => string` hook so future shorthand-shaped props can plug into the same machinery without changing the resolvers.

- **`maskImage` / `WebkitMaskImage` / `clipPath` style props.** Plain string-passthrough props for visual masking and clipping. Pair `maskImage` with `WebkitMaskImage` at the call site for older-Safari coverage — the schema does not auto-emit the prefixed property to keep the resolver predictable. Web-only on the type level; the native renderer accepts the props and emits nothing (RN does not support either CSS property).

  ```tsx
  <Box
    maskImage="linear-gradient(to right, black 60%, transparent)"
    WebkitMaskImage="linear-gradient(to right, black 60%, transparent)"
    clipPath="polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%)"
  />
  ```

## 1.3.0

### Minor Changes

- **`_before` / `_after` pseudo-element style props.** Same shape as `_hover` / `_focus` (any style prop accepted, plus `content`). Browsers require `content` for `::before` / `::after` to render — the runtime defaults it to `'""'` when omitted. Quote literal text in the value: `_before={{ content: '">"' }}` produces `content: ">"` in CSS. Selector emission piggybacks on the existing `buildPseudoCss` machinery, so identical bags hash to identical class names just like state pseudo rules.

  ```tsx
  <Box
    _before={{ content: '"▸ "', color: '$colors.accent.base', fontWeight: '$bold' }}
    _after={{ content: '" ↗"', display: 'inline-block' }}
  >
    nav item
  </Box>
  ```

  New exports: `PSEUDO_ELEMENT_PROP_NAMES`, `PSEUDO_ELEMENT_PROPS`, `PSEUDO_ELEMENT_SELECTOR`, `isPseudoElementProp`, `PseudoElementPropName`, `PseudoElementStyleBag`, `PseudoElementStyleProps`.

- **`keyframes(...)` helper** for `@keyframes`-driven animation. The pure `keyframesToCss(def)` returns `{ name, css }` with a stable hash-based name (`m-anim-<hash>`), so identical definitions across files dedupe to a single emitted rule. Token references inside step values (`$colors.fg.base`) resolve to `var(--…)`, so animation colors flip with the active theme.

  ```ts
  const spin = keyframes({
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  });
  ```

  New exports: `keyframesToCss`, `makeKeyframe`, `KeyframeDef`, `Keyframe`, `keyframeBrand`, `isKeyframe`. Use `keyframes(...)` from `@motif-js/react` (or `@motif-js/react-web`) to also handle the runtime-side `@keyframes` injection through the style cache.

- **`animation` prop accepts an object form.** The existing `animation: 'quick'` (theme `animations` token reference, expands to a CSS `transition`) is preserved unchanged. New object form `animation: { name, duration, easing, iterationCount, direction, fillMode, delay, playState }` assembles a CSS `animation` shorthand. Pass a `Keyframe` as `name` to drive the animation from a `@keyframes` rule (the renderer injects the rule once via the style cache, deduped by name).

  ```tsx
  <Box animation={{ name: spin, duration: '1s', easing: 'linear', iterationCount: 'infinite' }} />
  ```

  New exports: `AnimationObject`, `AnimationValue`, `buildAnimationShorthand`, `extractKeyframeFromAnimation`. The native renderer accepts the object form and reads `duration` / `easing` for its entry-driver timing; the keyframes themselves don't run on native (RN has no `@keyframes`).

## 1.2.0

### Minor Changes

- **`createTheme` accepts `fonts`, `root`, and `reducedMotion`.** Three new optional fields drive web-side runtime emission from `<ThemeProvider>` (no-ops on native):
  - `fonts: FontFace[]` — `@font-face` declarations registered with the theme. Emitted once at the document root by `<ThemeProvider>`, deduped across themes by `(family, weight, style, src)`. Light + dark almost always reference the same assets, so registering on one theme is enough.
  - `root: ThemeRootStyles` — `body` and `::selection` resets (background, color, font-family, etc.). Token references like `'$colors.bg.base'` resolve via the CSS-variable cascade so a single declaration tracks the active theme automatically.
  - `reducedMotion: 'guard' | 'off'` — when any theme requests `'guard'`, motif emits a `@media (prefers-reduced-motion: reduce)` block that forces all animations and transitions to ~0ms. Default is no emission.

  ```ts
  import { createTheme } from '@motif-js/react';

  export const light = createTheme({
    name: 'light',
    tokens: { colors: { bg: { base: '#fafafa' }, text: { primary: '#111' } } },
    fonts: [
      {
        family: 'Inter',
        src: [{ url: '/fonts/inter.woff2', format: 'woff2' }],
        weight: '400 700',
        display: 'swap',
      },
    ],
    root: {
      background: '$colors.bg.base',
      color: '$colors.text.primary',
      fontFamily: 'Inter, system-ui, sans-serif',
      selectionBackground: '$colors.accent.base',
    },
    reducedMotion: 'guard',
  });
  ```

  New helpers `fontFacesToCss`, `rootResetsToCss`, `reducedMotionGuardCss`, and `themesRuntimeCss` are exported for users assembling stylesheets outside the React provider path.

## 1.1.2

### Patch Changes

- Version sync with [@motif-js/compiler-swc@1.1.2](../compiler-swc/CHANGELOG.md#112). No behavioral changes in this package; released alongside the compiler fix for version uniformity across all `@motif-js/*` packages.

## 1.1.1

### Patch Changes

- **Publish-pipeline fix.** v1.0.0 and v1.1.0 shipped with `workspace:*` strings unrewritten in their published `dependencies` because `scripts/publish.mjs` invoked raw `npm publish` instead of `yarn npm publish` (Yarn 4 only rewrites workspace deps when going through its own publish command). Both broke installs with `EUNSUPPORTEDPROTOCOL`. v1.1.1 ships with the script fixed; published manifests now resolve `workspace:*` to concrete versions.

## 1.1.0

### Minor Changes

- **`createTheme` factory.** A pass-through factory that narrows the `tokens` type so `$`-references against specific scales are typed in callers. Pairs with the existing `Theme` interface — themes are still plain objects, the factory just gives docs a single canonical construction path and gives users token-shape inference. Re-exported from `@motif-js/react`, `@motif-js/react-web`, and `@motif-js/react-native`.

  ```ts
  import { createTheme } from '@motif-js/react';

  export const light = createTheme({
    name: 'light',
    tokens: {
      colors: { brand: { 500: '#C2410C' } },
      space: { 1: 4, 2: 8, 4: 16 },
    },
  });
  ```

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
