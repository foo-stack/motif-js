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

**Phase C — Native parity.**

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
- Compiler (Phase D) — still placeholder stubs.
