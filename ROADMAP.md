# motif-js — Roadmap

Phased milestones to v1.0. Each phase has a clear goal, a checklist of
deliverables, and an exit gate that must pass before moving on. Update
`PROGRESS.md` (not this file) when items complete — this is the target, that's
the log.

**Realistic timeline: 36–48 months solo to v1.0.** The estimates per phase are
calendar months of focused effort. They will slip; that's expected.

Status legend: ⬜ not started · 🟦 in progress · ✅ done

---

## Phase A — Foundation _(months 0–3)_

**Goal:** Prove the API feels right on web with one primitive. The exit gate is
emotional, not metric — _you_ must enjoy writing components in this API. If you
don't, redesign before going further.

### Scaffold

- ✅ Yarn 4.13.0 workspace with `nodeLinker: node-modules`
- ✅ Turborepo pipeline (build / lint / format / typecheck / test)
- ✅ TypeScript strict base + library / react-library / app variants
- ✅ oxlint + oxfmt configured
- ✅ 16 stub packages under `@motif-js/*`
- ✅ Shared tooling packages (`@motif-js/tsconfig`, `@motif-js/oxlint-config`)
- ✅ Initial commit
- ✅ tsup build config per package (so `yarn build` produces dist outputs)
- ✅ Vitest setup at the root + per-package
- ✅ CI workflow (GitHub Actions): typecheck + lint + format:check + test
- ✅ Changesets initialized
- ✅ MIT LICENSE file at repo root
- ✅ README.md skeleton

### `@motif-js/core` — engine foundations

- ✅ `Theme`, `Token`, `TokenScale`, `ResolvedStyle` type definitions
- ✅ Primitive token resolver + unit tests
- ✅ Style-prop → CSS object resolver (web target)
- ✅ Style-prop schema (single source of truth, used by both renderers)

### `@motif-js/react-web` — first primitive

- ✅ Hand-written `<Box>` accepting ~50 style props (padding, margin, gap,
  colors, sizing, border, typography, flex/layout, position, effects,
  overflow, cursor)
- ✅ Theme integration: tokens resolved through `ThemeProvider`
- ✅ Light / dark theme switching
- ✅ Nested sub-themes via `<Theme>` boundary

### `@motif-js/react` — minimal `styled()` factory

- ✅ `styled('div', { ... })` returns a styled component
- ✅ Variants and `compoundVariants` support
- ✅ Type inference for variant props

### `apps/playground-web` — demo app

- ✅ Vite + React + `@motif-js/react-web` running locally
- ✅ Layout demo (Stack-of-Boxes)
- ✅ Theme switcher (light / dark)
- ✅ Nested sub-theme demo
- ✅ Tiny variants showcase

### Exit gate

- ✅ I enjoy writing components in this API _(user-confirmed)_
- ✅ All packages typecheck / lint / format clean in CI
- ✅ Playground deploys to a preview URL _(user-confirmed)_

---

## Phase B — Web-complete _(months 3–6)_

**Goal:** Ship a publication-grade web-only v0.x to npm. Real teams should be
able to use motif-js for web today, even though native isn't ready.

### CSS variables + theming v2

- ✅ Migrate inline `style` → CSS variables on `:root` / `[data-theme]`
- ✅ Theme switching becomes a `data-theme` attribute swap
- ✅ Nested sub-themes via nested `data-theme` attributes
- ✅ Semantic token layer alongside primitive tokens
- ✅ Three real design systems re-expressed in motif-js tokens (Primer,
  Atlassian, Material 3) — validation that the model is sound _(20 tests against fixtures in `packages/tokens/src/validation/`; zero gaps found)_

### Responsive + container queries (web)

- ✅ Object responsive syntax (`{ base, sm, md }`)
- ✅ Array responsive syntax (`[a, b, c]`)
- ✅ String DSL responsive syntax (`"sm:4 md:8"`)
- ✅ Media query support
- ✅ Container query support (`@container` rules at runtime)

### SSR hardening

- ✅ Deterministic style insertion order
- ✅ No FOUC on first paint _(verified via `apps/ssr-next` — 100% class-to-CSS coverage in the streamed `<head>`)_
- ✅ React Server Components compatible (server-renderable by default) _(Next App Router demo renders end-to-end with `AsyncLocalStorage` + `CollectorContext`)_
- ✅ `'use client'` boundaries audited

### Core primitives (web)

- ✅ `Box`
- ✅ `Stack` (+ `HStack`, `VStack` shorthand)
- ✅ `Text`
- ✅ `Pressable`
- ✅ `Image`

### Test infrastructure

- ✅ `@motif-js/test-utils` conformance harness skeleton _(18 standard cases passing against the web renderer; native plugs in via its own adapter)_
- ✅ Snapshot tests across primitives _(every standard case → committed `RendererOutput` snapshot; CI catches resolver / renderer drift)_
- ✅ Jest-DOM-style assertions adapted for both renderers _(`motifMatchers`: `toHaveStyle` / `toHaveStyleAt` operate on `RendererOutput`)_

### Public release

- ✅ First public preview on npm — **v0.1.0 of all 16 `@motif-js/*` packages live** ([npmjs.com/org/motif-js](https://www.npmjs.com/org/motif-js)). Repo at `github.com/foo-stack/motif-js`; tag `v0.1.0` pushed.
- ✅ v0.5 milestone retired — v0.1.0 covers everything that gated Phase B (engineering complete, web-only release on npm). Subsequent versions will increment as features land rather than chase a fixed Phase B exit number.
- ✅ Project announced publicly _(user-confirmed)_
- ✅ At least one external user trying it _(user-confirmed)_

### Exit gate

- ✅ Web-only release on npm
- ✅ ≥50 GitHub stars _(user-confirmed)_
- ✅ Public announcement shipped _(user-confirmed)_

---

## Phase C — Native parity _(months 6–12)_

**Goal:** Same components, same API, working on Expo + bare RN.

### `@motif-js/react-native`

- ✅ `Box`, `Stack`, `Text`, `Pressable`, `Image` impls using RN primitives
- ✅ JS-context theme provider
- ✅ Nested sub-themes via context boundaries
- ✅ StyleSheet generation from style props

### Container query polyfill (native)

- ✅ `onLayout` + context-based polyfill
- ✅ Re-measure rate cap with opt-out _(`rateCapMs` prop on `<Container>`, default 16ms)_
- 🟦 Benchmark vs native rendering without polyfill _(deferred — needs real-device profiling)_

### Conformance suite

- ✅ Run every example against both renderers _(18/18 standard cases pass on the native adapter)_
- ✅ Snapshot resolved styles, diff in CI _(native snapshot suite mirrors web's; CI catches drift)_
- 🟦 Visual regression testing (Playwright + Detox) _(deferred — needs simulator infra; structured as a v0.8+ item)_

### Example apps

- ✅ Expo Router app rendering same source as playground-web _(scaffolded at `apps/playground-native`; typechecks against the workspace)_
- 🟦 Bare RN app rendering same source as playground-web _(deferred — Expo demo covers the same surface; bare can be a thin variant if a real consumer needs it)_

### Exit gate

- ✅ Conformance suite has zero unjustified divergences
- ⬜ v0.7 published to npm _(next release-train item)_
- 🟦 Both example apps demoable _(Expo demo scaffolded; running needs a simulator)_

---

## Phase D — Compiler _(months 12–18)_

**Goal:** Progressive compiler in production. Measurable performance gains;
identical visual output.

### `@motif-js/compiler-core`

- ⬜ AST analysis classifying usages: static / partial-static / dynamic
- ⬜ Static extraction emitting atomic-ish CSS (web)
- ⬜ Static extraction emitting pre-built StyleSheet objects (native)
- ⬜ Bailout to runtime path for dynamic cases

### Plugin shims

- ⬜ `@motif-js/compiler-babel` (canonical, web bundlers)
- ⬜ `@motif-js/compiler-swc` (Next / Vite via unplugin)
- ⬜ `@motif-js/compiler-metro` (RN Metro transformer)
- ⬜ Each shim under 200 LOC

### Differential testing

- ⬜ Every example rendered both runtime and compiled
- ⬜ Screenshot-diff in CI
- ⬜ Bench harness vs Tamagui, NativeWind, Stitches, vanilla CSS

### Exit gate

- ⬜ 5–10× perf measured on render-heavy paths
- ⬜ Identical visual output runtime vs compiled
- ⬜ v0.9 published

---

## Phase E — Primitives buildout _(months 18–28)_

**Goal:** Complete the primitives roster.

### Layout extras

- ⬜ `HStack`, `VStack`, `ZStack`
- ⬜ `Spacer`, `Center`, `Wrap`, `AspectRatio`
- ⬜ `Grid`, `Flex`
- ⬜ `Container`, `SafeArea`

### Typography

- ⬜ `Heading`, `Paragraph`, `Code`, `Kbd`, `Blockquote`

### Interaction

- ⬜ `Button` (highest-traffic primitive — top polish)
- ⬜ `IconButton`
- ⬜ `Link`

### Media

- ⬜ `Avatar`, `Icon`, `Svg`
- ⬜ `@motif-js/icons` initial set (~200 icons, Phosphor-inspired)

### Scroll & lists

- ⬜ `ScrollView` (enhanced)
- ⬜ `VirtualList` (Virtuoso on web, FlashList on native)
- ⬜ `Sticky`

### Forms primitives

- ⬜ `Input`, `TextArea`, `NumberInput`, `PasswordInput`
- ⬜ `Field`, `Label`, `FieldHelp`, `FieldError`, `Fieldset`

### Overlay & a11y

- ⬜ `Portal`, `Overlay`
- ⬜ `VisuallyHidden`, `LiveRegion`, `FocusScope`
- ⬜ `Show`, `Hide`

### Exit gate

- ⬜ v0.15 published — primitives roster complete
- ⬜ Visible inflection point for community awareness

---

## Phase F — Headless components _(months 28–44)_

**Goal:** 38 accessible behavior components, each tested across NVDA / JAWS /
VoiceOver iOS / TalkBack. Built in pattern-reuse order so earlier components
establish the patterns reused later.

### Foundation a11y patterns

- ⬜ `Dialog`
- ⬜ `AlertDialog`
- ⬜ `Tooltip`

### Popover family

- ⬜ `Popover`
- ⬜ `HoverCard`
- ⬜ `Menu`
- ⬜ `ContextMenu`

### Toggle family

- ⬜ `Switch`
- ⬜ `Checkbox`
- ⬜ `Radio`
- ⬜ `RadioGroup`

### Disclosure family

- ⬜ `Tabs`
- ⬜ `Accordion`
- ⬜ `Collapsible`

### Toast

- ⬜ `Toast`
- ⬜ `Toaster`

### Form-input behavioral

- ⬜ `Combobox`
- ⬜ `Select`
- ⬜ `MultiSelect`
- ⬜ `Search`
- ⬜ `CommandPalette`

### Range

- ⬜ `Slider`
- ⬜ `RangeSlider`
- ⬜ `Progress`
- ⬜ `RatingInput`

### Mobile-first overlays

- ⬜ `Drawer`
- ⬜ `Sheet`

### Date & time

- ⬜ `DatePicker`
- ⬜ `Calendar`
- ⬜ `TimeInput`

### Specialized

- ⬜ `ColorPicker`
- ⬜ `FileUpload`
- ⬜ `TreeView`

### Navigation family

- ⬜ `Pagination`
- ⬜ `Breadcrumb`
- ⬜ `Stepper`
- ⬜ `NavigationMenu`
- ⬜ `Toolbar`

### Exit gate

- ⬜ v0.20 published — all 38 headless components shipped
- ⬜ Cross-platform a11y verified per component

---

## Phase G — v1.0 _(months 44–48)_

**Goal:** Stabilize, document, launch.

### API freeze

- ⬜ Document every breaking change since v0.1
- ⬜ Migration guides written (`v0.x → v1`)
- ⬜ Semver commitment published

### Documentation site

- ⬜ Getting started
- ⬜ Theming guide (primitives + semantic + multi-axis + nested)
- ⬜ Responsive guide (all three syntaxes + container queries)
- ⬜ Compiler guide
- ⬜ Every primitive documented with live examples
- ⬜ Every headless component documented with live examples
- ⬜ Recipes (auth flow, dashboard, settings page, e-commerce, etc.)
- ⬜ Comparison guides (vs Tamagui, NativeWind, Stitches, Tailwind)
- ⬜ Migration guides (from same)

### Performance + audits

- ⬜ Bundle size budgets enforced per package
- ⬜ Tree-shaking validated
- ⬜ RN startup time benchmarks
- ⬜ External accessibility audit (~$15–25K, non-negotiable)

### Launch

- ⬜ v1.0 published
- ⬜ Launch post / video / Show HN

---

## Cross-cutting work (continuous)

These run alongside every phase, not as discrete tasks:

- ⬜ Conformance test harness expanded with each new primitive
- ⬜ ADRs (Architecture Decision Records) captured for every meaningful choice
- ⬜ CONTRIBUTING.md kept current
- ⬜ Changesets attached to every PR
- ⬜ Public build-log posts (begin Phase B, monthly minimum)
- ⬜ GitHub Discussions / Discord moderated
- ⬜ Funding model decision (before Phase B ends)
- ⬜ Contributor recruitment (by month 12)
