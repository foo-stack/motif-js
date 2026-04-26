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
- **Latest commit:** `52b1617 feat(phase-b): CSS variables, responsive
object syntax, Stack/Text` on `main`.
- **Working tree:** clean.
- **Current phase:** **B — Web-complete** (in progress). Phase A is
  feature-complete except for two user-side exit gates (see below).

### What's verified working right now

```sh
yarn typecheck   # 21/21 packages
yarn lint        # 0 errors, 6 perf warnings (inline-object props in playground)
yarn format:check # 114 files clean
yarn build       # 17/17 packages emit ESM + CJS + d.ts + d.cts + maps
yarn test        # 55 vitest tests passing in @motif-js/core
yarn dev         # Vite serves http://localhost:5173, HTTP 200
```

The playground at `apps/playground-web` demonstrates Box, Stack /
HStack / VStack, Text, the styled() factory with variants and a
compoundVariant, light/dark theme switching by `data-theme` attribute,
nested sub-themes via `<Theme name="dark">`, and a responsive object
prop (`p={{ base, sm, md, lg }}`).

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
- **Responsive object syntax** working: `p={{ base: '$2', md: '$4' }}`.
  Resolver returns baseStyle (inline) + mediaRules; renderer injects a
  `m-<hash>` class via the style-cache for media-query rules.
- **styled() factory** with four config keys: `base`, `variants`,
  `compoundVariants`, `defaultVariants`. Boolean variants via
  `'true' / 'false'` keys. String tags wrap in `<Box as={tag}>`.

Read these files for current implementation:

- `packages/core/src/types.ts` — Theme / Token types
- `packages/core/src/token.ts` — resolveToken, isTokenRef
- `packages/core/src/style-props.ts` — the schema
- `packages/core/src/style.ts` — resolveStyles, resolveStylesToVars,
  resolveResponsiveStylesToVars
- `packages/core/src/css-vars.ts` — themeToCssBlock, tokenRefToCssVar
- `packages/core/src/breakpoints.ts` — default breakpoints + helpers
- `packages/react-web/src/Theme.tsx` — ThemeProvider, Theme
- `packages/react-web/src/Box.tsx` — Box primitive
- `packages/react-web/src/style-cache.ts` — module-level injection
- `packages/react-web/src/Stack.tsx`, `Text.tsx` — primitives
- `packages/react/src/styled.tsx` — styled() factory
- `apps/playground-web/src/App.tsx` — what to look at to see it work

---

## Open work — Phase B remaining

Roughly priority-ordered. Pick from the top.

1. **Container queries** — the differentiator. Add a
   `<Container name="…">` boundary in `react-web` that sets
   `container-type: inline-size; container-name: …`. Extend the
   responsive resolver to recognise an alternate object shape like
   `p={{ container: 'card', sm: '$4' }}` or a parallel `cq` key.
   Native polyfill via `onLayout` + context comes in Phase C.
2. **Array responsive syntax** — `p={[2, 4, 8]}` (positional: base, sm,
   md). Cheap to add — extend `isResponsiveObject` / parse logic in
   `breakpoints.ts` + `style.ts`.
3. **String DSL responsive syntax** — `p="sm:4 md:8"`. Tokenise the
   string into per-breakpoint values; reuse the same downstream
   pipeline.
4. **SSR hardening** — server-side style-cache collector that runs
   alongside `renderToString`. The `flushPendingCss()` stub is in
   `packages/react-web/src/style-cache.ts`. Need to (a) make
   `injectMediaRules` queue rules into a render-scoped collector
   when `document` is undefined, (b) expose a `getMotifStyleTags()` to
   pull the queued CSS out as a `<style>` string.
5. **Pressable + Image primitives** — `Pressable` handles hover /
   focus / active across web (and later native); `Image` cross-platform
   image with placeholder / fallback.
6. **Conformance harness skeleton** in `@motif-js/test-utils` —
   prepares the testing foundation for the two-tree renderer model.
7. **Default-token validation** against Primer / Atlassian / Material 3
   — re-express each in motif tokens to prove the model can carry
   real-world design systems. Phase B exit prerequisite.
8. **First public release flow** — push to GitHub remote, let CI run,
   first changeset, dry-run `yarn release`. (User action: create the
   GitHub repo and push.)

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

## Watch-outs / gotchas learned this session

- **Yarn 4 + Metro:** `nodeLinker: node-modules` is required in
  `.yarnrc.yml` — Metro doesn't support Yarn PnP. Already configured.
- **Yarn 4 strict workspace isolation:** binaries from root deps are
  NOT exposed inside sub-workspaces. Every package that uses tsup /
  vitest / typescript declares them as devDependencies. If you add a
  new package, propagate.
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
- **The user picks ambitious options.** Across 6 architectural forks
  in the planning session, they chose the maximum ambition every
  time. When recommending, lead with the most-aspirational option.

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
  tolerated; current run has 6 perf warnings (inline objects in
  playground props).

---

## How to start the next session

1. Read this file.
2. Skim the most recent **Session 4** entry in PROGRESS.md.
3. Pick from "Open work — Phase B remaining" above. Container queries
   is the recommended next item.
4. Run `yarn typecheck && yarn test` to confirm the workspace is
   healthy before starting.
5. Use TaskCreate to break the work into concrete tasks before coding.
