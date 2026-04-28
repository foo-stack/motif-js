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
  All 16 `@motif-js/*` packages live on npm at **v0.2.0**.
- **Latest commit:** v0.2.0 release shipped at `9170300` (docs
  closing Phase C). Phase D engineering landed afterwards as
  **uncommitted working-tree changes** — see "What's pending
  commit" below.
- **Working tree:** dirty. Phase D engineering complete but not
  yet committed. User has been collecting commits along the way
  in past phases; for Phase D the work is in one batch awaiting
  the v0.3.0 changeset.
- **Current phase:** **D — Compiler** — engineering complete,
  awaiting v0.3.0 publish to close the exit gate. The four
  `@motif-js/compiler-*` packages have working implementations +
  tests (90 tests across the four packages). Differential parity
  with the runtime resolver is proven at the resolved-output
  level. A render-heavy bench (`benchmarks/render`) measures
  compiled at **1.73× faster** than runtime, closing 80% of the
  gap to vanilla `<div>`. The original 5–10× target retired with
  the same reasoning as v0.5 / v0.7 / v0.9 — actual numbers tell
  the real story.

### What's verified working right now

```sh
yarn typecheck                                 # 28/28 packages (compiler-* test workspaces + benchmarks/render)
yarn build                                     # all packages emit ESM + CJS + d.ts + d.cts + maps
yarn test                                      # 400 passing + 3 skipped vitest tests
                                               # 103 core + 99 react-web + 20 tokens + 88 react-native
                                               # + 70 compiler-core + 14 compiler-babel + 3 compiler-swc + 3 compiler-metro
yarn workspace @motif-js/playground-web dev    # Vite serves http://localhost:5173
yarn workspace @motif-js-bench/render bench    # vitest bench: 1.73× compiled vs runtime, 2.10× vanilla vs runtime
```

### What's pending commit (Phase D batch)

Inspect with `git status` / `git diff`. Roughly:

- `packages/core/src/css-emit.ts` — new file (CSS-emission helpers
  hoisted from `react-web/style-cache.ts`).
- `packages/core/src/index.ts` — re-exports of the new helpers.
- `packages/react-web/src/style-cache.ts` — shed ~80 LOC; imports
  hashing + CSS-building from `@motif-js/core`. Re-exports
  `AtRule` / `PseudoRule` for back-compat.
- `packages/react-web/src/Box.tsx` — fast-path early-return when
  `rest` carries no style props.
- `packages/compiler-core/src/{types,literal,analyze,extract-web,extract-native,imports,index}.ts`
  — new analysis layer.
- `packages/compiler-core/src/{literal,analyze,extract-web,extract-native,imports,differential}.test.ts`
  — 70 + 3 skipped tests including differential parity vs runtime.
- `packages/compiler-core/{vitest.config.ts,package.json}` —
  added Babel deps + workspace `test` script.
- `packages/compiler-babel/src/{index,index.test}.ts` — Babel
  plugin (164 code-only LOC) + 14 tests.
- `packages/compiler-babel/{vitest.config.ts,package.json}` —
  Babel devDeps, peerDependency on `@babel/core`.
- `packages/compiler-swc/src/{index,index.test}.ts` — `unplugin@3`
  factory (107 LOC) + 3 tests.
- `packages/compiler-swc/{vitest.config.ts,package.json}` — adds
  `unplugin`, `@babel/core`, `@motif-js/compiler-babel`.
- `packages/compiler-metro/src/{index,index.test}.ts` —
  Babel-tuple wrapper (41 LOC) + 3 tests.
- `packages/compiler-metro/{vitest.config.ts,package.json}` —
  adds `@babel/core`, `@motif-js/compiler-babel`.
- `benchmarks/render/{package.json,tsconfig.json,vitest.config.ts,src/list-of-boxes.bench.tsx}`
  — new bench workspace.
- `ROADMAP.md`, `PROGRESS.md` — Phase D items ticked, session 16
  appended, snapshot updated.
- `LAST_MEMORY.md` — this file.

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
2. Skim **Session 16** in PROGRESS.md for full Phase D detail.
3. The immediate next step is **publishing v0.3.0**. The
   compiler engineering is done; CI / releases is the remaining
   gate. Order of operations:
   1. `git status` to confirm the dirty tree matches "What's
      pending commit" above.
   2. Commit (suggested split into 3–4 logical commits — see
      Conventions below).
   3. `yarn changeset` (minor bump for the four `@motif-js/compiler-*`
      packages and the `react-web` fast-path; patch bumps for the
      others as the changesets tooling decides).
   4. Push, merge the auto-opened "Version Packages" PR.
   5. Locally publish via `node scripts/publish.mjs --otp=NNNNNN
--tag --push-tag` (CI auto-publish still blocked on the
      Automation token + 2FA-mode work — same as v0.1.0 / v0.2.0).
   6. Draft GitHub release notes (Phase D summary).
4. After publish, update this file to reflect the new published
   version and clean working tree.

### Open follow-ups (post-v0.3.0, no specific timeline)

- **Wrapper-stripping** for fully-static cases. Replace `<Box>`
  with `<div>` in compiled output to push compiled speedup
  toward the original 5–10× target. Risk: need to thread `as`
  prop semantics carefully; Pressable / Stack defaults differ.
- **Pseudo-state extraction** in `compiler-core` — `_hover` /
  `_focus` / `_active` props on Pressable. Brings the 3 skipped
  differential cases into the passing set. Use `injectPseudoRules`
  as the runtime parity reference (same hashing / CSS-building
  pattern as `injectAtRules`).
- **Native StyleSheet hoisting** in `compiler-metro`. Today the
  native target is a Babel-side no-op; `extractNative` produces
  the entries but nothing splices them into a hoisted
  `StyleSheet.create({...})`. Needs a per-file accumulator + a
  `Program.exit` hook that injects the import + the create call.
- **Cross-library bench rows** (Tamagui, NativeWind, Stitches).
  Legitimacy data, not a release gate.

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
