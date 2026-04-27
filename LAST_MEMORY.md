# LAST_MEMORY.md — handoff for the next session

A compact resume-from-cold document. If you're a fresh Claude session
landing in this repo, read this file first, then skim PROGRESS.md's most
recent session entry, then start work.

For deeper context: **PLAN.md** (architecture & scope, source of truth),
**ROADMAP.md** (phased milestones with checkboxes), **PROGRESS.md**
(append-only session log).

---

## Where things stand

- **Repo:** `~/Documents/GitHub/foo-stack/motif-js` (local only — no
  remote yet).
- **Latest commit:** session 5 — container queries shipped (see git log
  for the exact hash; commit message starts with `feat(phase-b):` and
  mentions container queries).
- **Working tree:** clean.
- **Current phase:** **B — Web-complete** (in progress). Phase A is
  feature-complete except for two user-side exit gates (see below).

### What's verified working right now

```sh
yarn typecheck                                 # 21/21 packages
yarn lint                                      # 0 errors, 11 perf warnings (inline-object props in playground)
yarn format:check                              # clean
yarn build                                     # 17/17 packages emit ESM + CJS + d.ts + d.cts + maps
yarn test                                      # 75 vitest tests passing in @motif-js/core
yarn workspace @motif-js/playground-web dev    # Vite serves http://localhost:5173, HTTP 200
```

The playground at `apps/playground-web` demonstrates Box, Stack /
HStack / VStack, Text, the styled() factory with variants and a
compoundVariant, light/dark theme switching by `data-theme` attribute,
nested sub-themes via `<Theme name="dark">`, responsive object props
(`p={{ base, sm, md, lg }}`), and **container queries** via
`<Container name="card">` with `flexDirection={{ base, '@card.md' }}`
and `p={{ base, '@card.sm', '@card.lg' }}`.

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
- **Responsive-object syntax** working for both axes:
  - `p={{ base: '$2', md: '$4' }}` → `@media (min-width: …)`
  - `p={{ '@md': '$4' }}` → `@container (min-width: …)` (anon)
  - `p={{ '@card.md': '$4' }}` → `@container card (min-width: …)`
  - Mixed in one object is fine; resolver buckets per kind.
- **At-rule cascade order:** media → anonymous container → named
  container (alphabetical), each mobile-first within a group.
  Container rules win over media rules at the same breakpoint —
  deliberate, matches "local container is more specific" mental model.
- **`<Container name="…" type?>`** sets `container-type: inline-size`
  (default) and `container-name` via inline style on a Box. Containment
  type is configurable (`'inline-size' | 'size' | 'normal'`).
- **styled() factory** with four config keys: `base`, `variants`,
  `compoundVariants`, `defaultVariants`. Boolean variants via
  `'true' / 'false'` keys. String tags wrap in `<Box as={tag}>`.

Read these files for current implementation:

- `packages/core/src/types.ts` — Theme / Token types
- `packages/core/src/token.ts` — resolveToken, isTokenRef
- `packages/core/src/style-props.ts` — the schema
- `packages/core/src/style.ts` — resolveStyles, resolveStylesToVars,
  resolveResponsiveStylesToVars (returns `atRules`, not `mediaRules`)
- `packages/core/src/css-vars.ts` — themeToCssBlock, tokenRefToCssVar
- `packages/core/src/breakpoints.ts` — breakpoints, `parseResponsiveKey`,
  media+container query helpers
- `packages/react-web/src/Theme.tsx` — ThemeProvider, Theme
- `packages/react-web/src/Box.tsx` — Box primitive
- `packages/react-web/src/Container.tsx` — Container primitive
- `packages/react-web/src/style-cache.ts` — module-level injection
  (`injectAtRules`)
- `packages/react-web/src/Stack.tsx`, `Text.tsx` — primitives
- `packages/react/src/styled.tsx` — styled() factory
- `apps/playground-web/src/App.tsx` — what to look at to see it work

---

## Open work — Phase B remaining

Roughly priority-ordered. Pick from the top.

1. **Array responsive syntax** — `p={[2, 4, 8]}` (positional: base, sm,
   md). Extend the resolver to accept arrays at the prop level and
   reuse the existing `atRules` pipeline. The hardest design call is
   whether arrays only express media queries (likely yes — container
   queries always need an explicit name slot anyway).
2. **String DSL responsive syntax** — `p="sm:4 md:8"`. Tokenise the
   string into per-breakpoint values; reuse the same downstream
   pipeline. Decide whether `@card.md:8` is supported in the DSL.
3. **SSR hardening** — server-side style-cache collector that runs
   alongside `renderToString`. The `flushPendingCss()` stub is in
   `packages/react-web/src/style-cache.ts`. Need to (a) make
   `appendToStyleEl` queue rules into a render-scoped collector
   when `document` is undefined, (b) expose a `getMotifStyleTags()` to
   pull the queued CSS out as a `<style>` string.
4. **Pressable + Image primitives** — `Pressable` handles hover /
   focus / active across web (and later native); `Image` cross-platform
   image with placeholder / fallback.
5. **Conformance harness skeleton** in `@motif-js/test-utils` —
   prepares the testing foundation for the two-tree renderer model.
6. **Default-token validation** against Primer / Atlassian / Material 3
   — re-express each in motif tokens to prove the model can carry
   real-world design systems. Phase B exit prerequisite.
7. **First public release flow** — push to GitHub remote, let CI run,
   first changeset, dry-run `yarn release`. (User action: create the
   GitHub repo and push.)
8. **Native container-query polyfill design** (Phase C) — same
   `@<bp>` / `@<name>.<bp>` key shape, runtime resolver via
   `onLayout` + a `Container` context.

---

## Open user-side gates (Phase A)

Cannot be ticked by the agent.

1. **API ergonomics review.** Spend ~30 minutes building a real
   component (card, form, layout) without consulting the source.
   If it grates, fix the API now — cost is bounded. Roadmap exit gate
   "I enjoy writing components in this API" hangs on this.
2. **Playground preview URL.** Hook up Vercel or Netlify so the demo
   has a public URL. Useful for build-in-public posts and external
   feedback.

---

## Watch-outs / gotchas learned across sessions

- **Yarn 4 + Metro:** `nodeLinker: node-modules` is required in
  `.yarnrc.yml` — Metro doesn't support Yarn PnP. Already configured.
- **Yarn 4 strict workspace isolation:** binaries from root deps are
  NOT exposed inside sub-workspaces. Every package that uses tsup /
  vitest / typescript declares them as devDependencies. If you add a
  new package, propagate.
- **Dev server has no root alias** — use
  `yarn workspace @motif-js/playground-web dev` (or `cd apps/playground-web && yarn dev`).
  Root `package.json` only has build / lint / format / typecheck / test.
- **TypeScript 6 + tsup:** tsup's dts pipeline trips the `baseUrl`
  deprecation. Each package's `tsup.config.ts` scopes
  `ignoreDeprecations: '6.0'` to dts via
  `dts: { compilerOptions: { ignoreDeprecations: '6.0' } }`.
  **The project tsconfig (`tooling/tsconfig/base.json`) does NOT have
  this flag — keep it that way.** The user explicitly removed it once
  to keep the IDE config strict.
- **oxfmt config:** uses Prettier-compatible keys (`singleQuote`,
  `printWidth`, etc.). Custom keys are silently ignored.
- **oxlint:** `react/react-in-jsx-scope` is disabled in
  `.oxlintrc.json` — modern JSX transform doesn't need React in scope.
- **Test orchestration:** Turbo runs `test` per-package; only packages
  with a `vitest.config.ts` AND a `test` script in package.json are
  picked up. Currently only `@motif-js/core`. Adding tests to a new
  package = drop a `vitest.config.ts` + add `"test": "vitest run"`.
- **`exactOptionalPropertyTypes: true`** is on. When extending a type
  with an optional prop, don't redeclare the prop unless you want
  collisions. See `packages/react-web/src/Text.tsx` — TextProps is
  literally `BoxProps`, not a redeclaration.
- **`noUncheckedIndexedAccess: true`** is on. Index access returns
  `T | undefined`. `for…of` on an array element is fine; direct
  `arr[i]` requires a guard.
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
  tolerated; current run has 11 perf warnings (inline objects in
  playground props).

---

## How to start the next session

1. Read this file.
2. Skim the most recent **Session 5** entry in PROGRESS.md.
3. Pick from "Open work — Phase B remaining" above. Array responsive
   syntax is the recommended next item — small, follows naturally from
   the at-rule pipeline now in place.
4. Run `yarn typecheck && yarn test` to confirm the workspace is
   healthy before starting.
5. Use TaskCreate to break the work into concrete tasks before coding.
