# motif-js — Plan

The single source of truth for the architecture and scope of motif-js. ROADMAP.md
breaks this into phased milestones; PROGRESS.md tracks what has actually been built.

---

## 1. Mission

Build a cross-platform React styling library that just works on **web**, **React
Native** (Expo and bare), and **desktop** (Electron / Tauri web-shell), treating
all three platforms as **first-class equals**. The goal is the only library a
team needs to ship a modern, accessible, themeable, performant UI everywhere.

There is currently no library that combines (a) Tamagui-grade styling
ergonomics, (b) Radix-grade accessible headless components, and (c) modern CSS
features (container queries, `:has()`, etc.) on web with native-idiomatic
equivalents on RN. motif-js's bet is that **co-designing all three together
produces a better result** than stitching existing libraries.

---

## 2. North-star principles

1. **Cross-platform parity is non-negotiable.** A feature that only works on web
   is a partial feature. Every primitive, every prop, every behavior must work
   the same way on web and native.
2. **Idiomatic on every platform.** Web renders real DOM with real CSS. Native
   renders real RN with real StyleSheet. We do not paper one platform over with
   the other.
3. **Zero-config first, optimization second.** The runtime path always works
   without a build plugin. The compiler is an opt-in performance upgrade, never
   a prerequisite.
4. **Accessibility is a first-class feature, not a TODO.** Every headless
   component is WAI-ARIA compliant, keyboard-correct, and screen-reader-tested.
5. **Strong defaults, escape hatches everywhere.** Ship a complete default token
   set so users can adopt with zero config; expose primitives so power users can
   build anything.

---

## 3. Architectural decisions

These are committed unless explicitly revisited. Each was reached deliberately
during the initial planning session (see PROGRESS.md session log for context).

### Architecture

1. **Path A — React-centric.** Ship React components and a style API. Not
   framework-agnostic.
2. **Renderer architecture: two trees, shared API.** `@motif-js/react-web` and
   `@motif-js/react-native` separately implement the same prop schema. The
   public `@motif-js/primitives` package routes via the `react-native` /
   `browser` package fields and `.native.ts` extensions. Web renders DOM + CSS;
   native renders RN + StyleSheet.
3. **Desktop = web-shell** (Electron / Tauri) for v1. RN-macOS / RN-Windows is a
   stretch goal that the architecture leaves open.
4. **Native targets:** Both Expo and bare React Native are supported.

### API surface

5. **Style-prop API** — `<Box p="$4" bg="$primary" />` — first-class.
6. **styled() factory** — `styled('Box', { ... })` — first-class.
7. **Variants:** Stitches-style `variants` + `compoundVariants` + boolean
   variants.

### Execution model

8. **Progressive compiler from day one.** Library works at full functionality
   without a build plugin (runtime path); installing the optional Babel / SWC /
   Metro plugin extracts what it can statically. Both paths must produce
   identical output, validated by a differential test harness.

### Theming

9. **Theme switching:** CSS variables + `data-theme` attribute on web, JS
   context + re-render on native. Two mechanisms, idiomatic per platform.
10. **Nested sub-themes:** First-class. `<Theme name="dark">` boundaries are
    arbitrarily nestable; components pick up the nearest theme automatically.
11. **Two-layer tokens:**
    - **Primitive tokens** — palette, theme-independent, e.g. `$colors.blue.500`,
      `$space.4`.
    - **Semantic tokens** — named by intent, reference primitives, swap per
      theme, e.g. `$action.primary.bg`, `$surface.raised`.
    - Same `$` prefix; namespace position disambiguates layer.
12. **Multi-axis themes** (e.g. light × brand) supported at the type level;
    composition handled by a small merge util, not a Cartesian product baked
    into core.
13. **Default tokens:** `@motif-js/tokens` ships a complete, opinionated default
    system — Radix-Colors-inspired 12-step scales, Tailwind-style spacing,
    modular typography scale, sensible radii / shadows / z-index. Toolkit, not
    tool.

### Responsive

14. **Three syntaxes supported:** object (`{ base, sm, md }`), array
    (`[a, b, c]`), and string DSL (`"sm:4 md:8"`). All compiler-extractable.
15. **Both media queries and container queries.** Container queries are the
    recommended modern default. Native gets a container-query polyfill via
    `onLayout` + context.

### Scope

16. **Full v1.0.** Style engine + ~50 layout / typography / media / form / a11y
    primitives + ~38 fully accessible headless behavior components +
    bundled icon set + complete default tokens. Realistic timeline:
    **36–48 months solo to v1.0.**

### Cross-cutting (non-negotiable)

17. **React Server Components support.** Runtime style emission must produce
    server-renderable output by default; client-only paths gated behind
    `'use client'` boundaries.
18. **RTL / bidirectional layout.** Directional primitives (Stack / HStack /
    etc.) are RTL-aware; `<Direction>` provider for per-subtree override.
19. **Reduced motion.** All animated headless components respect
    `prefers-reduced-motion` (web) and `AccessibilityInfo.isReduceMotionEnabled`
    (native).
20. **Conformance test harness.** Single source-of-truth prop schema in
    `@motif-js/core`; both renderers consume the same TS types; CI fails on
    schema mismatch and on visual divergence between renderers.

### Out of scope for v1

- First-party animation API. Provide _integration hooks_ for Motion (web) and
  Reanimated 3 (native); no first-party animation primitives. (Tamagui's regret
  cited as precedent.)
- Form state management. Form _primitives_ (Input, Field, Label) ship; choice
  of state library (RHF, Formik, etc.) is the user's.
- RN-macOS / RN-Windows.
- Server-side native rendering (e.g., RN-on-server).

### Tooling

21. **Package manager:** Yarn 4.13.0 with workspaces. **Required:**
    `nodeLinker: node-modules` in `.yarnrc.yml` (Metro does not support PnP).
22. **Monorepo runner:** Turborepo.
23. **Linter:** oxlint (Rust-based, oxc-project).
24. **Formatter:** oxfmt (Rust-based, oxc-project).
25. **Build tool for libs:** tsup (esbuild). May migrate to oxc-transform once
    it stabilizes.
26. **Compiler authoring:** Babel plugin canonical; SWC wrapper (Next / Vite
    via unplugin); Metro transformer for RN. All call into a shared
    `@motif-js/compiler-core`.
27. **Testing:** Vitest (unit), Playwright (web E2E), Detox (native E2E),
    `@testing-library/react-native` (component), plus the conformance suite.
28. **Releases:** Changesets.
29. **CI:** GitHub Actions matrix (Node 20/22, RN latest + previous, Expo SDK
    latest + previous).
30. **Docs:** Fumadocs (Next.js).

### Distribution

31. **Public name & npm scope:** Library `motif-js`, packages `@motif-js/*`.
32. **License:** MIT.

---

## 4. Package layout

```
@motif-js/core           — engine: tokens, theme, runtime, types
@motif-js/react          — React bindings (style-prop runtime, styled() factory)
@motif-js/react-web      — DOM impls of base primitives (internal, re-exported)
@motif-js/react-native   — RN impls of base primitives (internal, re-exported)
@motif-js/primitives     — PUBLIC: layout / typography / media / a11y / overlay
@motif-js/forms          — PUBLIC: form input primitives
@motif-js/icons          — PUBLIC: bundled icon set + Icon primitive
@motif-js/headless       — PUBLIC: accessible behavior components
@motif-js/compiler-core  — shared compiler analysis
@motif-js/compiler-babel — Babel plugin (web bundlers)
@motif-js/compiler-swc   — SWC plugin (Next / Vite via unplugin)
@motif-js/compiler-metro — Metro transformer (RN)
@motif-js/tokens         — default token presets
@motif-js/color          — small color manipulation util (~2KB)
@motif-js/reset          — opt-in CSS reset (web only)
@motif-js/test-utils     — render helpers, conformance suite, snapshot tooling

# Tooling (not published)
tooling/tsconfig         — shared TypeScript configs
tooling/oxlint-config    — shared lint configs
tooling/conformance-suite — the API-parity test harness
```

---

## 5. Primitives roster

### Layout & containers (`@motif-js/primitives`)

`Box`, `Stack`, `HStack`, `VStack`, `ZStack`, `Grid`, `Flex`, `Spacer`, `Wrap`,
`Center`, `AspectRatio`, `Container`, `SafeArea`.

### Typography (`@motif-js/primitives`)

`Text`, `Heading`, `Paragraph`, `Code`, `Kbd`, `Blockquote`.

### Interaction (`@motif-js/primitives`)

`Pressable`, `Button`, `IconButton`, `Link`.

### Media (`@motif-js/primitives` + `@motif-js/icons`)

`Image`, `Avatar`, `Icon`, `Svg`, plus a bundled icon set in `@motif-js/icons`.

### Scroll & lists (`@motif-js/primitives`)

`ScrollView`, `VirtualList`, `Sticky`.

### Forms (`@motif-js/forms`)

`Input`, `TextArea`, `NumberInput`, `PasswordInput`, `Field`, `Label`,
`FieldHelp`, `FieldError`, `Fieldset`.

### Overlay & a11y (`@motif-js/primitives`)

`Portal`, `Overlay`, `VisuallyHidden`, `LiveRegion`, `FocusScope`, `Show`, `Hide`.

### Headless components (`@motif-js/headless`)

`Dialog`, `AlertDialog`, `Drawer`, `Sheet`, `Popover`, `HoverCard`, `Tooltip`,
`Menu`, `ContextMenu`, `Combobox`, `Select`, `MultiSelect`, `Tabs`, `Accordion`,
`Collapsible`, `Toast`, `Toaster`, `Progress`, `Slider`, `RangeSlider`,
`Switch`, `Checkbox`, `Radio`, `RadioGroup`, `RatingInput`, `DatePicker`,
`Calendar`, `TimeInput`, `ColorPicker`, `FileUpload`, `Pagination`,
`Breadcrumb`, `Stepper`, `TreeView`, `CommandPalette`, `Search`, `Toolbar`,
`NavigationMenu`.

---

## 6. Risk register

| Risk                                                       | Likelihood | Mitigation                                                                                                                 |
| ---------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------- |
| API drift between web and native                           | High       | Conformance suite from day one; single source-of-truth prop schema in `@motif-js/core`.                                    |
| Compiler / runtime output divergence                       | High       | Differential testing — runtime + compiled output of every example, screenshot-diffed in CI.                                |
| Metro / RN upstream breakage                               | High       | Pin RN versions in CI matrix; vendor critical RN-internal APIs; last-known-good branch policy.                             |
| Container query polyfill on native is slow                 | Medium     | Benchmark early; cap re-measure rate; provide opt-out per subtree.                                                         |
| Bundler matrix explosion                                   | High       | Compiler-core bundler-agnostic; plugin shims thin (< 200 LOC each); CI tests each shim with a minimal example.             |
| Accessibility regressions on the headless layer            | High       | Required external a11y audit in Phase G; reference @react-aria patterns but reimplement to keep zero RN-incompatible deps. |
| Theme system can't represent some real-world design system | Medium     | Validate default tokens against three real systems (Primer, Atlassian, Material) early — Phase B, not Phase E.             |
| Container queries differ across Safari iOS WebView (Tauri) | Low-medium | Test in Tauri webview + Safari + iOS Safari WebView in CI.                                                                 |
| Burnout from scope (solo)                                  | Very High  | Phasing with public exit gates; ship usable v0.5 by month 6; build community before headless phase.                        |

---

## 7. Sustainability

A 36–48 month solo project producing nothing visible for 18 months is dangerous.
Three things to plan **before Phase B ends** (not at v1 launch):

1. **Funding model.** Day job + nights, VC, GitHub Sponsors + Open Collective +
   pro tier (Sentry / Astro model), or commercial license (BSL-style dual). The
   adoption strategy depends on this; don't defer.
2. **Public build-in-public presence.** Ship Phase B (web-only) to npm by month 6. Begin a public log: blog posts on the architecture decisions, build
   threads, demos. Each architectural decision in §3 is a strong technical post.
3. **Contributor onboarding by month 12.** Even at slow velocity, 1–2 outside
   contributors validate the project and parallelize the headless component
   buildout (Phase F). Write CONTRIBUTING.md early; capture decisions as ADRs.

Budget for Phase G: external accessibility audit, ~$15,000–25,000.

---

## 8. References

- ROADMAP.md — phased milestones
- PROGRESS.md — running progress log
- Memory: `~/.claude/projects/-Users-nate-Documents-GitHub-foo-stack-motif-js/memory/`
