# LAST_MEMORY.md — handoff for the next session

A compact resume-from-cold document. If you're a fresh Claude session
landing in this repo, read this file first, then skim PROGRESS.md's most
recent session entry, then start work.

For deeper context: **PLAN.md** (architecture & scope, source of truth),
**ROADMAP.md** (phased milestones with checkboxes), **PROGRESS.md**
(append-only session log).

---

## Where things stand

- **Repo:** `~/Documents/GitHub/foo-stack/motif-js` — public on
  GitHub at [github.com/foo-stack/motif-js](https://github.com/foo-stack/motif-js).
  All 16 `@motif-js/*` packages live on npm at **v0.1.0**.
- **Latest commit:** v0.2.0 release shipped. Tag `v0.2.0` pushed,
  CHANGELOG.md entries committed by `changeset version`, all 16
  packages live on npm at v0.2.0. Expo demo verified running on
  iOS Simulator. Phase C is fully ✅ closed.
- **Working tree:** clean.
- **Current phase:** **D — Compiler** (Phases A / B / C all closed).
  Three phases out of seven done. Phase D goal: static extraction
  of motif call sites with the runtime path as fallback. Plugin
  shims for Babel / SWC / Metro under 200 LOC each. Differential
  testing (compiled output vs runtime renders the same) is the
  proof.

### What's verified working right now

```sh
yarn typecheck                                 # 22/22 packages (now includes @motif-js/ssr-next)
yarn lint                                      # 0 errors, 94 perf warnings (inline-object props in demos)
yarn format:check                              # clean
yarn build                                     # 17/17 packages emit ESM + CJS + d.ts + d.cts + maps
yarn test                                      # 341 vitest tests passing (103 core + 99 react-web + 20 tokens + 88 react-native + 31 docs/utils)
yarn workspace @motif-js/playground-web dev    # Vite serves http://localhost:5173, HTTP 200
yarn workspace @motif-js/ssr-next build        # Next 16 static prerender succeeds
yarn workspace @motif-js/ssr-next start        # serves http://localhost:4000 with SSR styles in <head>
```

The playground at `apps/playground-web` demonstrates Box, Stack /
HStack / VStack, Text, the styled() factory with variants and a
compoundVariant, light/dark theme switching by `data-theme` attribute,
nested sub-themes via `<Theme name="dark">`, all three responsive
syntaxes (object / array / DSL) side-by-side, container queries via
`<Container name="card">`, the `<Pressable>` primitive with hover /
focus-visible / active / disabled states, and the new `<Image>`
primitive in three states (plain / placeholder / fallback).

---

## Architectural state — what's load-bearing

These are settled. Don't change without revisiting PLAN.md.

- **Two-tree renderer** — `@motif-js/react-web` and (eventually)
  `@motif-js/react-native` implement the same prop schema separately.
  Routed via package fields. **Web is fully implemented; native is empty
  stubs.**
- **Theming via CSS variables on web.** `<ThemeProvider themes={[…]}
active="…">` emits one `<style>` block scoped to
  `[data-theme="<name>"]`. Theme switches are attribute swaps, not
  re-renders. `<Theme name="…">` nests by setting another
  `data-theme` attribute on a wrapper div. Render path emits
  `var(--…)` strings unconditionally — no theme lookup at render time.
- **Two-layer tokens** — primitive (`$colors.blue.500`) and semantic
  (`$colors.surface.base` → `$colors.gray.50`). Resolver chains
  `var(--…)` references so semantic tokens become CSS-var indirection.
- **Style-prop schema** — single source of truth in
  `packages/core/src/style-props.ts`. ~50 props covering spacing,
  color, sizing, border, typography, flex/layout, position, effects,
  overflow, cursor.
- **Three responsive shapes**, all routed through one resolver
  (`resolveResponsiveStylesToVars`):
  - **Object:** `p={{ base: '$2', md: '$4', '@card.lg': '$8' }}` — the
    canonical form. Keys: `base`, `<bp>` (media), `@<bp>` (anon
    container), `@<name>.<bp>` (named container).
  - **Array:** `p={['$2', '$4', '$6']}` — positional `[base, sm, md,
lg, xl, '2xl']`. Sparse OK. Trailing slots dropped. Media-query
    only.
  - **String DSL:** `p="base:$2 md:$4 @card.lg:$8"` — space-separated
    `<key>:<value>` pairs. Reuses `parseResponsiveKey`, so DSL
    inherits container-query support automatically. Numeric values
    coerce to numbers (`md:8` → `{ md: 8 }`).
- **At-rule cascade order:** media → anonymous container → named
  container (alphabetical), each mobile-first within a group.
  Container rules win over media rules at the same breakpoint —
  deliberate, matches "local container is more specific" mental model.
- **`<Container name="…" type?>`** sets `container-type: inline-size`
  (default) and `container-name` via inline style on a Box.
- **`<Pressable>`** — first interactive primitive. Defaults to
  `<button>`; `as` override accepted. Pseudo-state bags
  (`_hover` / `_focus` / `_active` / `_disabled`) emit
  `:hover` / `:focus-visible` / `:active` / `:disabled +
[aria-disabled]` rules. `_focus` uses `:focus-visible` so focus rings
  only show on keyboard focus. `onPress` is a cross-platform alias for
  `onClick`. State-style bags are flat (no responsive nesting in v1).
- **`<Image>`** — wraps `<img>` with optional `placeholder` and
  `fallback` ReactNodes. Two render paths: simple (no overlay, just a
  styled `<img>`) when neither is set; wrapped (`position: relative;
overflow: hidden` Box, opacity-0 img inside) when either is set.
  `objectFit` / `objectPosition` / `aspectRatio` are now style-prop
  schema entries.
- **SSR — three composable mechanisms.** Pick what fits:
  1. **Sync `renderToString`**: `collector.collect(() => renderToString(<App />))`
     captures CSS via the default module-level pointer. Works in any
     environment; no `node:` deps required.
  2. **Concurrent / streaming SSR**: `import '@motif-js/react-web/server'`
     once at server startup. Switches storage to an
     `AsyncLocalStorage`-backed backend so `collect()` propagates
     across async boundaries. Required for `renderToReadableStream`
     and any setup with multiple in-flight renders.
  3. **Next.js App Router**: a `<MotifStyleRegistry>` client
     component (lives in user code — see `apps/ssr-next` for the
     canonical 30-line implementation) creates a per-request
     collector, provides it via `CollectorContext`, and uses
     `useServerInsertedHTML` to flush captured CSS as
     `<style data-motif-ssr>` into the streamed `<head>`. Box /
     Pressable read the active collector via `useActiveCollector()`
     and pass it as `override` to the inject helpers — wins over
     module-level storage.
  - On the client, first `inject*Rules` call seeds `cache.injected`
    from any `<style data-motif-ssr>` blocks in the DOM so
    client-side renders don't double-inject.
- **styled() factory** with four config keys: `base`, `variants`,
  `compoundVariants`, `defaultVariants`. Boolean variants via
  `'true' / 'false'` keys. String tags wrap in `<Box as={tag}>`.

Read these files for current implementation:

- `packages/core/src/types.ts` — Theme / Token types
- `packages/core/src/token.ts` — resolveToken, isTokenRef
- `packages/core/src/style-props.ts` — the schema
- `packages/core/src/style.ts` — `resolveStyles`, `resolveStylesToVars`,
  `resolveResponsiveStylesToVars` (returns `{ baseStyle, atRules,
rest }`)
- `packages/core/src/css-vars.ts` — themeToCssBlock, tokenRefToCssVar
- `packages/core/src/breakpoints.ts` — breakpoints,
  `parseResponsiveKey`, `parseResponsiveDSL`,
  `responsiveArrayToObject`, media+container query helpers
- `packages/react-web/src/Theme.tsx` — ThemeProvider, Theme
- `packages/react-web/src/Box.tsx` — Box primitive
- `packages/react-web/src/Container.tsx` — Container primitive
- `packages/react-web/src/Pressable.tsx` — Pressable primitive
- `packages/react-web/src/Image.tsx` — Image primitive
- `packages/react-web/src/style-cache.ts` — `injectAtRules`,
  `injectPseudoRules`, `SSRStyleCollector`, hydration, pluggable
  `CollectorStorage`
- `packages/react-web/src/server.ts` — `AsyncLocalStorage` storage
  backend (server-only entry, `@motif-js/react-web/server`)
- `packages/react-web/src/collector-context.tsx` —
  `CollectorContext`, `useActiveCollector` (App Router context plumb)
- `apps/ssr-next/app/motif-style-registry.tsx` — canonical
  user-code registry pattern for App Router
- `packages/test-utils/src/conformance.ts` — `ConformanceCase`,
  `RendererAdapter`, `assertConformance`, `defaultTestTheme`
- `packages/test-utils/src/standard-cases.ts` — the 18-row
  cross-renderer case set
- `packages/react-web/src/web-adapter.ts` — shared `createWebAdapter`
  used by conformance / snapshot / matcher tests
- `packages/react-web/src/conformance.test.tsx` — per-case `it()`
  runner (model for the future native adapter)
- `packages/react-web/src/snapshot.test.tsx` —
  `RendererOutput` snapshots; CI catches drift
- `packages/test-utils/src/matchers.ts` — `motifMatchers`
  (`toHaveStyle` / `toHaveStyleAt`) + vitest type augmentation
- `packages/tokens/src/validation/{primer,atlassian,m3}.ts` —
  reference fixtures expressing each design system in motif tokens
- `packages/tokens/src/validation.test.ts` — 20 resolution tests
  proving zero gaps in the two-layer model
- `packages/react-native/src/Theme.tsx` /
  `theme-context.ts` — JS-context theming for native (no CSS vars)
- `packages/react-native/src/Box.tsx` / `Stack.tsx` / `Text.tsx` /
  `Pressable.tsx` / `Image.tsx` / `Container.tsx` — native primitives
- `packages/react-native/src/responsive.ts` —
  `useViewportWidth` + `resolveResponsiveAtViewportAndContainer`
  (full media + container cascade)
- `packages/react-native/src/container-context.ts` —
  `ContainerContext` + `useContainerInfo` (named-container
  registry up the ancestor chain)
- `packages/react-native/src/native-adapter.tsx` — conformance
  adapter; renders cases under multiple conditions to synthesise
  the cross-renderer `RendererOutput` shape
- `packages/react-native/src/__test-setup__/react-native-mock.tsx`
  — minimal RN shim for jsdom-backed vitest tests, with
  `__setDimensions(w)` and `__setLayoutWidth(testID, w)` helpers
- `apps/playground-native/App.tsx` — Expo demo of every Phase C
  primitive + theming + container queries + Pressable states
- `packages/react-web/src/Stack.tsx`, `Text.tsx` — primitives
- `packages/react/src/styled.tsx` — styled() factory
- `apps/playground-web/src/App.tsx` — what to look at to see it work

---

## Open work — Phase B remaining

All engineering checkboxes are ticked. Remaining items are
release / community / optional optimisations.

1. **First public release flow** — push to GitHub remote, let CI run,
   first changeset, dry-run `yarn release`. **(User action: create
   the GitHub repo and push.)** Next ROADMAP exit gate.
2. **Per-entry tsup splitting** — the bundle banner currently marks
   ALL of `@motif-js/react-web` `'use client'`. Splitting source
   into per-entry chunks could let Box / Stack / Text / Container
   stay RSC-pure. Optional optimisation.
3. **`@motif-js/next` package** — could lift the App Router registry
   pattern (currently in `apps/ssr-next`) into a real exported
   component once it stabilises across users.
4. **Native container-query polyfill design** (Phase C) — same
   `@<bp>` / `@<name>.<bp>` key shape, runtime resolver via
   `onLayout` + a `Container` context.
5. **Responsive nesting inside pseudo-state bags** —
   `_hover={{ md: { bg: '...' } }}`. Requires nested at-rules under
   the pseudo selector; CSS-supported but adds resolver complexity.

---

## Phase A user-side gates — closed

The two user-judgement gates ("I enjoy writing components in this
API", "Playground deploys to a preview URL") were both confirmed
done by the user. Phase A is fully ✅.

---

## Watch-outs / gotchas learned across sessions

- **Yarn 4 + Metro:** `nodeLinker: node-modules` is required in
  `.yarnrc.yml` — Metro doesn't support Yarn PnP. Already configured.
- **Yarn 4 strict workspace isolation:** binaries from root deps are
  NOT exposed inside sub-workspaces. Every package that uses tsup /
  vitest / typescript declares them as devDependencies.
- **Dev server has no root alias** — use
  `yarn workspace @motif-js/playground-web dev`. Root `package.json`
  only has build / lint / format / typecheck / test.
- **TypeScript 6 + tsup:** tsup's dts pipeline trips the `baseUrl`
  deprecation. Each package's `tsup.config.ts` scopes
  `ignoreDeprecations: '6.0'` to dts via
  `dts: { compilerOptions: { ignoreDeprecations: '6.0' } }`.
  **The project tsconfig (`tooling/tsconfig/base.json`) does NOT have
  this flag — keep it that way.**
- **`exactOptionalPropertyTypes: true`** is on. Passing `undefined` to
  a prop typed `string` (without `| undefined`) is a type error. Use
  conditional spreads — `{...(v !== undefined ? { prop: v } : {})}`.
  See `Pressable.tsx` for the pattern.
- **`noUncheckedIndexedAccess: true`** is on. Index access returns
  `T | undefined`. Direct `arr[i]` requires a guard or `!`.
- **oxfmt config:** uses Prettier-compatible keys (`singleQuote`,
  `printWidth`, etc.). Custom keys silently ignored.
- **oxfmt mangles markdown identifiers with underscores.** Writing
  `LAST_MEMORY.md` in plain text gets re-emitted with stray `*` /
  `\_`. Backtick-escape filenames (`` `LAST_MEMORY.md` ``) so oxfmt's
  markdown formatter doesn't interpret `_` as italics.
- **oxfmt's TS parser** rejects template-literal types in index
  signature form (`[K: \`@${string}\`]`); accepts them in mapped type
  form (`[K in \`@${string}\`]`). Use the mapped-type form.
- **oxlint:** `react/react-in-jsx-scope` is disabled in
  `.oxlintrc.json`. `typescript-eslint/no-this-alias` is enabled —
  prefer named helper functions over `const self = this`.
- **`yarn add -A` captures `.claude/`.** Now gitignored, but watch for
  it in future bulk adds.
- **Test orchestration:** Turbo runs `test` per-package; only packages
  with a `vitest.config.ts` AND a `test` script in package.json are
  picked up. As of session 6: `@motif-js/core` and
  `@motif-js/react-web`. Adding tests to a new package = drop a
  `vitest.config.ts` (jsdom env if DOM-aware) + add
  `"test": "vitest run"`.
- **Container-type / container-name** are valid camelCase keys on
  React's CSSProperties (via csstype). Passing through inline `style`
  works without schema changes.
- **The user picks ambitious options.** Across architectural forks
  in planning, they chose the maximum ambition every time. When
  recommending, lead with the most-aspirational option.

---

## Conventions worth preserving

- Commits use Conventional Commits (`feat:`, `chore:`, `docs:`).
  Bodies have a brief overview + bulleted detail. No "🤖 Co-Authored-By"
  line because the user's git config handles attribution.
- Memory files at `~/.claude/projects/-Users-nate-Documents-GitHub-foo-stack-motif-js/memory/`
  capture project / architecture / user-style facts. Update when a
  decision changes.
- PROGRESS.md is append-only — every session adds a new "Session N"
  entry, updates the snapshot, and (only when something tangible
  ships) ticks ROADMAP boxes.
- Tasks via TaskCreate when work is ≥3 steps. Mark `in_progress`
  before starting, `completed` immediately on finish, never batched.
- Format ≠ commit-blocker, but lint with errors IS. Warnings are
  tolerated; current run has 94 perf warnings (inline objects in
  demo apps; expected).
- Each meaningful piece of work goes in its own commit so the history
  reads cleanly and reverts are surgical. The session-6 walkthrough
  (array → DSL → SSR → Pressable, four commits) is the model.

---

## How to start the next session

1. Read this file.
2. Skim the most recent **Session 15** entry in PROGRESS.md (and the
   v0.2.0 GitHub release notes for what shipped).
3. **Phase D — compiler** is next. Goals: AST analysis classifying
   usages (static / partial-static / dynamic), static extraction
   emitting atomic-ish CSS on web and pre-built StyleSheet objects
   on native, plugin shims for Babel / SWC / Metro under ~200 LOC
   each, differential testing (compiled output renders the same
   DOM/element tree as the runtime path).
4. Run `yarn typecheck && yarn test` to confirm the workspace is
   healthy before starting.
5. Use TaskCreate to break the work into concrete tasks before coding.

## How to publish a new version

1. `yarn changeset` to record what changed (interactive — pick
   bumps + write a summary).
2. Commit + push. CI opens / refreshes the "Version Packages" PR.
3. Merge that PR. CI tries to auto-publish — works only if a true
   Automation `NPM_TOKEN` is in repo secrets AND the npm account's
   2FA mode lets it through. If CI fails:
4. Locally: `node scripts/publish.mjs --otp=NNNNNN --yes`. The
   script is idempotent — already-published packages get skipped
   on retry.
5. `git tag v<X.Y.Z> -m "v<X.Y.Z> — <summary>" && git push origin v<X.Y.Z>`
   (or pass `--tag --push-tag` to the script).
