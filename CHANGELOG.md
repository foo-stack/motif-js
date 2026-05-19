# Changelog

All notable changes to motif are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
Every package in the workspace ships at a uniform version — a release bumps all
of them together.

## [Unreleased]

## [1.0.2] - 2026-05-19

A patch release: the cross-platform `Button` fixes from
[#22](https://github.com/foo-stack/usemotif/issues/22). Every package ships at
`1.0.2`.

### Fixed

- **Native `Button` crashed on text labels.** A string or number label rendered
  bare inside `<Pressable>` threw React Native's "Text strings must be rendered
  within a `<Text>` component". String / number labels are now wrapped in
  `<Text>`; element children pass through unchanged.
- **Native `Button` label styles were unwired.** The label's text styles
  (`color`, `fontSize`, `fontWeight`) were spread onto the `<Pressable>`, where
  React Native silently drops text-style props on a `View`. They now land on
  the label `<Text>`.
- **`Button intent="neutral"` assumed a `gray` token scale.** Both renderers
  referenced `$colors.gray.*`, which only `@usemotif/tokens` guarantees — a
  hand-authored `createTheme` theme need not define one. `Button` now falls
  back to literal greys when the active theme defines no `gray` scale.

## [1.0.1] - 2026-05-18

A patch release: eight fixes across the renderers, the token presets, the
headless layer, and the docs. Every package ships at `1.0.1`.

### Added

- **RTL / bidirectional layout.** A `<Direction>` provider and `useDirection()`
  hook on both renderers. New logical style props — `ps` / `pe` / `ms` / `me`,
  the `start` / `end` insets, and the `paddingInline*` / `marginInline*` /
  `insetInline*` long forms. `px` / `mx` resolve to the logical `paddingInline`
  / `marginInline`, so they adapt to writing direction.
- **`useReducedMotion()`.** A cross-platform hook in `@usemotif/headless` —
  `matchMedia` on web, `AccessibilityInfo` on native. Headless components skip
  their enter/exit animation when the user prefers reduced motion.
- **Default `borderWidths` and `letterSpacings` token scales.** The default
  light and dark themes ship both scales, so `$borderWidths.*` /
  `$letterSpacings.*` references resolve out of the box.
- **`@usemotif/react/svg` entry.** A dedicated, tree-shakeable export for the
  `Icon` and `Svg` primitives.

### Changed

- **Smaller icon imports.** `@usemotif/icons` glyphs import through
  `@usemotif/react/svg` — a single-icon import drops from ~6.2 KB to ~0.6 KB
  gzip. No API change.
- **`@usemotif/compiler-swc` package description.** Corrected to describe the
  package as it is — a universal `unplugin` running the Babel-based transform,
  not an SWC plugin.

### Fixed

- **Invisible native `<Heading>` / `<Paragraph>` text.** A unitless
  `lineHeight` was read as absolute pixels by React Native and clipped glyphs to
  nothing; it is now resolved against the font size.
- **Next.js setup docs.** The bundler guide now documents the
  `transpilePackages` configuration the official example app relies on.

## [1.0.0] - 2026-05-15

The graduation release. motif spent its pre-1.0 life under the `@motif-js/*`
scope — `v0.1.0` through an unintended early `1.0.0`, then two namespace
renames the migration guides call v2 and v3. `1.0.0` is the deliberate v1: the
full library, consolidated under a single `@usemotif/*` scope, with the meta
package as the unscoped `usemotif`. The legacy `@motif-js/*` packages stay on
npm, frozen, carrying deprecation notices that point at the migration guides.

The runtime, the token model, and the component API are unchanged from the
final `@motif-js/*` releases — `1.0.0` is a packaging and stability milestone,
not a behaviour change.

### Added

- **Styling core.** Style-prop API and `styled()` factory; two-layer token
  system (primitive palette plus semantic intent); nestable `<Theme>`
  sub-themes with name chaining.
- **Responsive system.** Container and media queries through three syntaxes —
  object, positional array, and string DSL — with a native container-query
  polyfill.
- **~50 primitives.** Layout (`Box`, `Stack`, `Grid`, `Center`, `AspectRatio`,
  …), typography (`Heading`, `Paragraph`, `Code`, `Kbd`, `Blockquote`), media
  (`Avatar`, `Icon`, `Svg`), forms (`Field`, `Label`, `Input`, `TextArea`, …),
  scroll (`ScrollView`, `Sticky`, `VirtualList`), and a11y (`Portal`, `Overlay`,
  `FocusScope`, `VisuallyHidden`, `LiveRegion`, `Show`, `Hide`).
- **~38 headless behaviour components.** Dialog, Popover, Menu, Combobox, Tabs,
  Tooltip, ColorPicker, CommandPalette, MultiSelect, TreeView, and the rest —
  unstyled, WAI-ARIA correct, keyboard and screen-reader complete on both
  platforms.
- **Animation.** Mount and unmount transitions through `enterStyle`,
  `exitStyle`, and `transition` props; a native timing driver and an optional
  Reanimated spring driver; named animation presets resolved against the
  theme.
- **Progressive compiler.** `@usemotif/compiler-core`, `-babel`, `-swc`, and
  `-metro` — static style extraction, wrapper stripping, pseudo-state
  extraction, and native `StyleSheet` hoisting. The runtime path works
  unchanged with no plugin installed.
- **`@usemotif/icons`.** Generator-driven, lucide-backed icon set that
  tree-shakes per import.
- **`@usemotif/reset`.** Opt-in CSS reset that does not fight the runtime.
- **`@usemotif/test-utils`.** Cross-renderer conformance suite and Vitest
  matchers.
- **SSR.** `SSRStyleCollector` and a streaming style registry for the Next.js
  App Router.

### Changed

- **Namespace consolidated to `@usemotif/*`.** All thirteen scoped packages
  moved from `@motif-js/*` to `@usemotif/*`; the meta package stays unscoped as
  `usemotif`. Every package reset to a fresh `1.0.0` on the new scope.

### Deprecated

- **The `@motif-js/*` scope.** Existing installs keep working; new installs see
  npm deprecation notices pointing at the [v2 → v3 migration
  guide](https://usemotif.dev/migrating/v2-to-v3). Run `npx @usemotif/migrate
rename-v3` for the mechanical rewrite.

### Fixed

- **SWC compiler CSS delivery.** The SWC plugin emits its aggregated CSS through
  a virtual module — apps no longer wire the extracted stylesheet by hand.
- **Workspace dependency publishing.** `workspace:*` ranges rewrite correctly on
  publish, so installed tarballs resolve cleanly.

## [0.3.0] - 2026-04-28

### Added

- **`@motif-js/compiler-core`** — AST analysis and extraction for static style
  props.
- **`@motif-js/compiler-babel`** — the JSX-rewrite plugin.
- **Bundler shims** — Vite, webpack, and Metro entry points.
- **Box compile fast-path** — a build-time rewrite measured at 1.73× over the
  runtime path on the render bench.

## [0.2.0] - 2026-04-28

### Added

- **`@motif-js/react-native` foundation** — `Theme` and `Box` on React Native.
- **Native primitives** — `Stack`, `HStack`, `VStack`, `Text`, `Pressable`,
  `Image`.
- **Viewport-driven responsive resolution on native**, reading `Dimensions`.
- **Native container-query polyfill** — `@<bp>` keys parse and apply as on web.
- **Conformance adapter** — one snapshot suite run against both renderers.

## [0.1.0] - 2026-04-27

First publish. Phase A and Phase B closed.

### Added

- **`@motif-js/core`** — token model, theme types, style-prop schema, runtime
  resolvers.
- **`@motif-js/react-web`** — `Box`, `Theme`, `ThemeProvider`, the style-prop
  runtime.
- **`@motif-js/tokens`** — default light and dark token presets.
- **`useTheme` and `useThemeName` hooks.**
- **CSS-variable emission** and **`SSRStyleCollector`** for server rendering.

[Unreleased]: https://github.com/foo-stack/usemotif/compare/v1.0.2...HEAD
[1.0.2]: https://github.com/foo-stack/usemotif/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/foo-stack/usemotif/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/foo-stack/usemotif/compare/v0.3.0...v1.0.0
[0.3.0]: https://github.com/foo-stack/usemotif/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/foo-stack/usemotif/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/foo-stack/usemotif/releases/tag/v0.1.0
