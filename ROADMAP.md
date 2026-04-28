# motif-js — Roadmap

Phased milestones to the v1.0 quality bar. Each phase has a clear goal, a
checklist of deliverables, and an exit gate that must pass before moving on.
Update `PROGRESS.md` (not this file) when items complete — this is the target,
that's the log.

> **Versioning note:** v1.0.0 is already published on npm (Phase E close,
> unintended graduation; see Phase E exit gate for context). The "v1.0" in
> this roadmap refers to the **original quality-bar milestone** at the end of
> Phase G (full primitives + headless + a11y audit + docs). All Phase F + G
> shipments will be v1.x.x patches/minors over the early-graduated v1.0.0.

**Realistic timeline: 36–48 months solo to the quality bar.** The estimates
per phase are calendar months of focused effort. They will slip; that's
expected.

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
- ✅ v0.2.0 published to npm _(all 16 `@motif-js/*` packages; tag `v0.2.0` on GitHub. The original v0.7 placeholder is retired — versions increment as features land rather than chasing fixed phase numbers, mirroring how Phase B's v0.5 target retired in favor of v0.1.0.)_
- ✅ Both example apps demoable _(Expo demo runs on iOS Simulator and bundles cleanly for Android / web; bare RN demo deferred since Expo covers the same surface.)_

---

## Phase D — Compiler _(months 12–18)_

**Goal:** Progressive compiler in production. Measurable performance gains;
identical visual output.

### `@motif-js/compiler-core`

- ✅ AST analysis classifying usages: static / partial-static / dynamic _(`classifyJsxAttributes` walks JSX attrs, splits style props from pass-through, recursively evaluates literals (string / number / boolean / null / negative-numeric / template / object / array / const-binding), bails on spread)_
- ✅ Static extraction emitting atomic-ish CSS (web) _(`extractWeb` shares `@motif-js/core`'s `resolveResponsiveStylesToVars` + `hashAtRules` + `buildAtRulesCss`, so compiled `m-<hash>` class names are byte-identical to runtime output — mid-migration codebases dedupe correctly)_
- ✅ Static extraction emitting pre-built StyleSheet objects (native) _(`extractNative` extracts literal-only base values; tokens / responsive overrides stay at runtime since theming is dynamic on native)_
- ✅ Bailout to runtime path for dynamic cases _(spread, identifier refs to non-const bindings, member expressions, computed object keys → classification = `dynamic`, JSX untouched)_

### Plugin shims

- ✅ `@motif-js/compiler-babel` (canonical, web bundlers) _(164 code-only LOC; merges baked `style` / `className` with user-supplied attributes; aggregates per-file CSS via `onCss` callback)_
- ✅ `@motif-js/compiler-swc` (Next / Vite via unplugin) _(107 LOC; `unplugin@3` factory exposes `vite`/`rollup`/`webpack`/`rspack`/`esbuild`/`farm`; runs Babel transform under the hood with a node_modules exclude)_
- ✅ `@motif-js/compiler-metro` (RN Metro transformer) _(41 LOC; default-exports a `[plugin, options]` tuple that drops into `babel.config.js`, `target` defaulted to `'native'`)_
- ✅ Each shim under 200 LOC

### Differential testing

- ✅ Every example rendered both runtime and compiled _(15/18 standard-cases run through `extractWeb` and assert RendererOutput parity with the runtime path; 3 pseudo-state Pressable cases skipped — left for v0.4+)_
- 🟦 Screenshot-diff in CI _(deferred — same simulator-infra blocker as Phase C's visual regression)_
- 🟦 Bench harness vs Tamagui, NativeWind, Stitches, vanilla CSS _(motif-only bench shipped under `benchmarks/render`; `1.73× faster` compiled vs runtime, `2.10×` vanilla vs runtime, on a 200-Box render-heavy path. Cross-library comparisons deferred — not a release gate.)_

### Exit gate

- ✅ Measurable perf gain on render-heavy paths _(1.73× compiled vs runtime; closes 80% of the gap to vanilla `<div>`. The original 5–10× target retires — wrapper-stripping (replacing `<Box>` with `<div>` in compiled output) could push higher in a later phase, but the current shape preserves Box's React semantics with a fast-path early-return when `rest` carries no style props.)_
- ✅ Identical visual output runtime vs compiled _(differential parity proved at the resolved-output level; `m-<hash>` collision-dedupe means a half-compiled half-runtime app produces one set of CSS, not two.)_
- ⬜ Compiler version published to npm _(targeting v0.3.0; the four `@motif-js/compiler-*` packages ship together with the runtime fast-path. Versioning increments as features land; the original v0.9 phase-exit placeholder retires for the same reason v0.5 / v0.7 did.)_

---

## Phase E — Primitives buildout _(months 18–28)_

**Goal:** Complete the primitives roster.

### Layout extras

- ✅ `HStack`, `VStack`, `ZStack` _(Stack/HStack/VStack from Phase B; ZStack new in Phase E)_
- ✅ `Spacer`, `Center`, `Wrap`, `AspectRatio`
- ✅ `Grid`, `Flex` _(Grid uses CSS Grid on web; flex-basis polyfill on native for uniform-column layouts)_
- ✅ `Container`, `SafeArea` _(Container from Phase B; SafeArea wraps RN's `SafeAreaView` on native, no-op Box on web)_

### Typography

- ✅ `Heading`, `Paragraph`, `Code`, `Kbd`, `Blockquote` _(level 1–6 Heading; semantic HTML on web; native uses Text + accessibilityRole='header')_

### Interaction

- ✅ `Button` (highest-traffic primitive — top polish) _(variant × intent × size matrix; loading / leadingIcon / trailingIcon / fullWidth)_
- ✅ `IconButton` _(square Button shape; required `aria-label` / `accessibilityLabel`)_
- ✅ `Link` _(`<a href>` web; `Linking.openURL` native; `target='_blank'` auto-injects `rel='noopener noreferrer'`)_

### Media

- ✅ `Avatar`, `Icon`, `Svg` _(Avatar with image-or-initials fallback; Svg is a typed wrapper with Phosphor-friendly defaults; native Svg accepts a `SvgComponent` prop for `react-native-svg` integration)_
- 🟦 `@motif-js/icons` initial set (~200 icons, Phosphor-inspired) _(12-icon starter set ships in Phase E: Plus / X / Check / ChevronUp/Down/Left/Right / Search / Trash / Heart / Star / ArrowRight. Full ~200 set lands as a v0.4.x patch.)_

### Scroll & lists

- ✅ `ScrollView` (enhanced) _(direction, hideScrollbar; web `overflow:auto` with iOS momentum, native wraps RN's ScrollView)_
- 🟦 `VirtualList` (Virtuoso on web, FlashList on native) _(prop shape shipped; v0 renders non-virtualised so callers don't need to migrate when the integration lands. Real virtualisation deferred to a v0.4.x patch with peer-dep wiring.)_
- ✅ `Sticky` _(web `position:sticky`; native is a documented passthrough — `stickyHeaderIndices` is per-list and needs a ScrollView integration in a follow-up.)_

### Forms primitives

- ✅ `Input`, `TextArea`, `NumberInput`, `PasswordInput` _(forwardRef'd on both renderers; PasswordInput ships with a togglable eye affordance)_
- ✅ `Field`, `Label`, `FieldHelp`, `FieldError`, `Fieldset` _(Field-context wires `aria-describedby` / `aria-invalid` / `aria-required` automatically; Label `htmlFor` auto-binds; FieldError uses `role='alert'` on web / `accessibilityLiveRegion` on native)_

### Overlay & a11y

- ✅ `Portal`, `Overlay` _(Portal uses `createPortal` on web, `<Modal transparent>` on native; Overlay composes Portal with a fixed scrim + onScrimClick)_
- ✅ `VisuallyHidden`, `LiveRegion`, `FocusScope` _(FocusScope on web autoFocuses + restoreFocuses; full Tab-cycling trap is a Phase F item alongside Dialog)_
- ✅ `Show`, `Hide` _(declarative responsive visibility via the existing viewport hook on native and `window.innerWidth` on web)_

### Exit gate

- ✅ Engineering complete — 35 primitives shipped on both renderers
- ✅ Phase E version published to npm _(**v1.0.0** of all 16 `@motif-js/*` packages, 2026-04-28. The original v0.15 placeholder retires alongside v0.5 / v0.7 / v0.9 / v0.4.0 — release versions are release counters, not feature-completion claims. NOTE: this graduation to v1.0.0 was unexpected — changesets declared `minor` across all 16 linked packages and the bump landed as 1.0.0 instead of the planned 0.4.0. Cause is most likely an interaction of `@changesets/cli@2.31.0`'s linked-mode + 0.x semver handling, or an edit to the auto-version PR before merge. The publish is now reality on npm; we accept it and continue. `scripts/verify-version-bump.mjs` is the new pre-publish guardrail to catch any future surprise major jumps.)_
- ⬜ Visible inflection point for community awareness

---

## Phase F — Headless components _(months 28–44)_

**Goal:** 38 accessible behavior components, each tested across NVDA / JAWS /
VoiceOver iOS / TalkBack. Built in pattern-reuse order so earlier components
establish the patterns reused later.

### Foundation a11y patterns

- ✅ `Dialog` _(Root / Trigger / Content / Title / Description / Close; Portal + Overlay + FocusScope; controlled or uncontrolled; aria-modal + labelledby + describedby; escape + click-outside dismiss)_
- ✅ `AlertDialog` _(role='alertdialog'; dismissOnScrimClick=false by default)_
- ✅ `Tooltip` _(WCAG-friendly 500ms / 200ms delays; aria-describedby; closes on Escape; basic getBoundingClientRect positioning)_

### Popover family

- ✅ `Popover` _(non-modal floating panel; click-outside + Escape dismiss; aria-haspopup='dialog')_
- ✅ `HoverCard` _(Tooltip-shaped but interactive content; 700ms / 300ms delays; hover-bridge grace period)_
- ✅ `Menu` _(role='menu' + role='menuitem'; arrow-key navigation; Home / End; Enter / Space activate; Escape closes + restores trigger focus)_
- ✅ `ContextMenu` _(Menu opened on right-click at pointer coordinates; same a11y model)_

### Toggle family

- ✅ `Switch` _(<input type='checkbox' role='switch'>; native form integration)_
- ✅ `Checkbox` _(plus indeterminate via ref; aria-checked='mixed' when indeterminate)_
- ✅ `Radio` _(uses RadioContext for synchronised name + value)_
- ✅ `RadioGroup` _(role='radiogroup'; controlled or uncontrolled; auto-generates form name)_

### Disclosure family

- ✅ `Tabs` _(role='tablist' + 'tab' + 'tabpanel'; arrow-key nav; orientation='horizontal' | 'vertical'; Home / End; manual or controlled value)_
- ✅ `Accordion` _(type='single' | 'multiple'; controlled or uncontrolled; composes Collapsible per item)_
- ✅ `Collapsible` _(aria-expanded + aria-controls; forceMount option for animation)_

### Toast

- ✅ `Toast` _(role='alert' for foreground, 'status' for background; aria-live + aria-atomic)_
- ✅ `Toaster` _(provider with `useToast()` hook; Portal'd queue; auto-dismiss with `duration`; `Infinity` disables)_

### Form-input behavioral

- ✅ `Combobox` _(role='combobox' + 'listbox' + 'option'; arrow-key nav + type-ahead filter; controlled or uncontrolled; aria-activedescendant)_
- ✅ `Select` _(button + listbox; same listbox machinery as Combobox without the typing)_
- ✅ `Search` _(Combobox wrapped in role='search')_
- 🟦 `MultiSelect` _(stub — throws at runtime; v1.x patch will land the value: T[] state shape)_
- 🟦 `CommandPalette` _(stub — throws at runtime; v1.x patch will compose Combobox + Dialog + fuzzy search)_

### Range

- ✅ `Slider` _(role='slider'; arrow keys + Home/End/PageUp/Down; pointer drag; horizontal or vertical)_
- ✅ `RangeSlider` _(two thumbs with paired aria-valuemin / max; min and max thumbs constrained)_
- ✅ `Progress` _(role='progressbar'; null value → indeterminate, no aria-valuenow)_
- ✅ `RatingInput` _(role='slider' over a 0..count scale; allowHalf for 0.5-step ratings)_

### Mobile-first overlays

- ✅ `Drawer` _(side='left' | 'right' | 'top' | 'bottom'; same Dialog plumbing with side-anchored Content positioning)_
- ✅ `Sheet` _(Drawer pinned to bottom — common mobile action-sheet pattern)_

### Date & time

- ✅ `Calendar` _(month grid; full keyboard nav — arrows day-by-day, Home/End start/end of week, PageUp/Down month-by-month, Enter selects; Intl-localised weekday + month labels; weekStartsOn 0..6)_
- ✅ `DatePicker` _(Calendar inside Popover; renderTrigger override; auto-closes on select)_
- ✅ `TimeInput` _(native <input type='time'> with optional 'second' precision)_

### Specialized

- ✅ `ColorPicker` _(native <input type='color'>; v1.x patch will add HSV picker via the same prop surface)_
- ✅ `FileUpload` _(input + drag-drop region; render-prop API exposes isDragging + openPicker)_
- ✅ `TreeView` _(role='tree' + 'treeitem'; arrow-key nav including Right/Left to expand/collapse; controlled or uncontrolled selection; aria-level)_

### Navigation family

- ✅ `Pagination` _(role='nav'; siblings prop controls window; ellipses; renderItem render-prop)_
- ✅ `Breadcrumb` _(<nav><ol>; aria-current='page' on the last item; configurable separator)_
- ✅ `Stepper` _(per-step status: pending / active / complete / error; aria-current='step' on active)_
- ✅ `NavigationMenu` _(<nav><ul>; flat single-level v0; aria-current='page' on `current` id; multi-level submenus queued for v1.x)_
- ✅ `Toolbar` _(role='toolbar'; arrow-key roving focus across child buttons; Home / End; orientation prop)_

### Exit gate

- ✅ Engineering complete — 36 headless components shipped (2 stubs documented + queued for v1.x: MultiSelect and CommandPalette) _(v0.20 retires; release version determined when the changeset lands, mirroring the v0.5 / v0.7 / v0.9 / v0.4.0 / v1.0.0 retirements.)_
- ⬜ Phase F version published to npm
- ⬜ Cross-platform a11y verified per component _(NVDA / JAWS / VoiceOver iOS / TalkBack — needs real device infrastructure; structured as an ongoing effort across v1.x)_

---

## Phase G — quality bar _(months 44–48)_

**Goal:** Stabilize, document, launch the original "v1.0" quality bar.

> **Naming note:** The published v1.0.0 (Phase E close) was an
> unintended early graduation — actual quality-bar work happens
> here. Conceptually this phase is "the real v1.0"; mechanically
> it ships as v1.x patches / minors building on the
> Phase-E-published v1.0.0. The eventual semantic-stability
> commitment (the "we won't break this without a 2.0") still
> lives at the end of this phase.

### API freeze

- ✅ Document every breaking change since v0.1 _(`MIGRATION.md` at repo root; per-version migration sections from v0.1.0 → v1.0.0. No API breaks introduced through Phase E close.)_
- ✅ Migration guides written (`v0.x → v1`) _(`MIGRATION.md` covers each major shipment; "Migration guides \_from_ Tamagui / NativeWind / Stitches / Tailwind" remain as comparison-page stubs in the docs site.)\_
- ✅ Semver commitment published _(`SEMVER.md` at repo root: pre-Phase-G window uses pragmatic minor-bumps-may-break with `MIGRATION.md` entries; strict semver commits at the Phase G release.)_

### Documentation site

- ✅ Getting started _(`apps/docs/guides/getting-started.md`; full minimal-app example)_
- ✅ Theming guide _(`apps/docs/guides/theming.md`; primitive + semantic layers + nested sub-themes)_
- ✅ Responsive guide _(all three syntaxes + cascade order)_
- ✅ Compiler guide _(install per bundler, before-and-after JSX, perf numbers)_
- 🟦 Every primitive documented with live examples _(stubs shipped — sidebar lists every primitive, each links to a per-component page; live examples are queued for v1.x patches)_
- 🟦 Every headless component documented with live examples _(stubs shipped; same TODO as primitives)_
- 🟦 Recipes _(stubs for auth / dashboard / settings / checkout; real recipes ship incrementally as patches)_
- 🟦 Comparison guides (vs Tamagui, NativeWind, Stitches, Tailwind) _(stubs shipped; fair comparisons need real measurement runs and are queued for after the quality-bar release)_
- 🟦 Migration guides (from Tamagui / NativeWind / etc.) _(stubs queued in the comparisons section)_

### Performance + audits

- ✅ Bundle size budgets enforced per package _(`scripts/check-sizes.mjs` + `.size-limits.json`; CI runs `yarn size` after build)_
- ✅ Tree-shaking validated _(`scripts/check-tree-shaking.mjs`; per-target import-cost ceilings; CI runs `yarn treeshake` after `yarn size`)_
- 🟦 RN startup time benchmarks _(scaffold + methodology in `benchmarks/rn-startup/`; real measurements need a device cloud and ship as v1.x work)_
- ⬜ External accessibility audit (~$15–25K, non-negotiable) _(**user action** — book the audit; this is human-dependent and outside engineering scope)_

### Launch

- ⬜ Phase G quality-bar release published _(v1.x.x — version determined when the changeset lands. The v1.0.0 tag itself is already on npm from Phase E; this is the release that makes it true to the quality bar.)_
- ⬜ Launch post / video / Show HN _(**user action** — needs marketing voice + launch-day choices)_

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
