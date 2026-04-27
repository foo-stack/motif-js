# motif-js — Progress

Living progress log across sessions. Append to the session log on every working
session; update the snapshot at the top to reflect current state.

---

## Snapshot

- **Current phase:** B — Web-complete (test infrastructure complete)
- **Sub-stage:** All three "Test infrastructure" boxes ticked. Conformance harness, snapshot suite, and `motifMatchers` (jest-DOM-style assertions) shipped. Phase B engineering is done; remaining items are public release + community.
- **Latest commit:** `b568ad1` feat(phase-b): snapshot suite + jest-DOM-style matchers
- **Latest published version:** none (pre-v0.1)
- **Health:** 🟢 typecheck (22/22) / lint (0 errors, 94 perf warnings) / format / build / test (222 passing — 103 core + 99 react-web + 20 tokens) all green
- **Blockers:** none

### Phase progress at a glance

| Phase                   | Status         | Notes                                                              |
| ----------------------- | -------------- | ------------------------------------------------------------------ |
| A — Foundation          | 🟦 in progress | Engineering done; user-side review + preview-URL deploy still open |
| B — Web-complete        | 🟦 in progress | CSS vars + responsive object syntax + Stack/Text done; more to do  |
| C — Native parity       | ⬜             |                                                                    |
| D — Compiler            | ⬜             |                                                                    |
| E — Primitives buildout | ⬜             |                                                                    |
| F — Headless components | ⬜             |                                                                    |
| G — v1.0                | ⬜             |                                                                    |

---

## Session log

### Session 1 — 2026-04-25 / 26 — Planning + Phase A scaffold

**Outcome:** Architecture finalized end-to-end (28 decisions). Repo scaffolded
to the point where it typechecks, lints, and format-checks clean.

**Planning decisions reached** (full details in PLAN.md §3):

- Path A (React-centric, ship components + style API)
- Two-tree renderer (`@motif-js/react-web` + `@motif-js/react-native`, shared
  API via package-field routing)
- Both style-prop and `styled()` factory APIs
- Progressive compiler from day one (runtime always works; compiler is opt-in
  perf)
- CSS variables on web + JS context on native for theming
- Nested sub-themes first-class
- Two-layer tokens (primitive + semantic), `$` reference syntax
- All three responsive syntaxes (object, array, string DSL)
- Both media queries and container queries (with native polyfill)
- Full v1.0 scope: ~50 primitives + ~38 headless components
- RSC, RTL, reduced-motion baked in as non-negotiables
- MIT license; npm scope `@motif-js/*`
- Animation out of scope (integration hooks for Motion + Reanimated only)
- Tooling: Yarn 4.13.0 (`nodeLinker: node-modules`), Turborepo, oxlint, oxfmt,
  TypeScript strict, tsup, Vitest

**Scaffolding shipped:**

- `git init` + `.gitignore` + `.yarnrc.yml`
- Root `package.json` with workspaces
- `tooling/tsconfig` (base, library, react-library, app)
- `tooling/oxlint-config` (base, react, library)
- `turbo.json` (build, lint, format, format:check, typecheck, test, clean, dev)
- `.oxlintrc.json` + `.oxfmtrc.json` + `.oxfmtignore`
- 16 stub packages: core, react, react-web, react-native, primitives, forms,
  headless, icons, compiler-core, compiler-babel, compiler-swc, compiler-metro,
  tokens, color, reset, test-utils
- Root dev deps installed: typescript 6.0.3, turbo 2.9.6, tsup 8.5.1,
  oxlint 1.61.0, oxfmt 0.46.0, vitest 4.1.5, `@types/node` 25.6.0,
  `@types/react` 19.2.14, `@types/react-dom` 19.2.3
- Initial commit `bc6c5d9` on branch `main`

**Verification at end of session:**

- `yarn turbo run typecheck` — 16/16 packages pass
- `yarn lint` — 0 errors, 0 warnings
- `yarn format:check` — all 64 files clean

**Next session should start with:**

1. tsup build configuration per package (so `yarn build` actually emits dist).
2. Vitest setup (root config + per-package).
3. Begin `@motif-js/core` engine work: `Theme`, `Token`, `TokenScale`,
   `ResolvedStyle` types and the primitive token resolver with unit tests.
4. Create LICENSE (MIT) and README.md skeleton.
5. GitHub Actions workflow for CI.

**Open follow-ups:**

- Funding model decision (target: before Phase B ends)
- GitHub repo + remote setup (currently local only)
- Validate default tokens against Primer / Atlassian / Material — Phase B work
  but worth noting now

---

### Session 2 — 2026-04-26 — Phase A tooling round

**Outcome:** All Phase A "Scaffold" checkboxes in ROADMAP.md are now ticked.
The repo can be built, tested, linted, formatted, and typechecked end to end;
CI is wired; Changesets is ready for releases; LICENSE and README are in place.

**Shipped:**

- LICENSE (MIT)
- README.md (status, what / why, install placeholder, quick example, doc links)
- Vitest 4 setup using the `projects` pattern: root `vitest.config.ts`
  globs `packages/*/vitest.config.ts`; per-package configs opt in by adding
  one. `@motif-js/core` has the first sample test (validates package-name
  export).
- tsup `tsup.config.ts` in all 16 packages — produces ESM, CJS, d.ts, d.cts,
  and sourcemaps. `yarn build` succeeds across the workspace.
- Tightened tsconfig: removed `composite` from `library.json` (we don't run
  `tsc -b` and it conflicted with tsup's dts generation), removed
  `incremental` from `base.json` (caused single-file-emit error during dts
  build), added `ignoreDeprecations: "6.0"` for `baseUrl` deprecation in TS 6
  (tsup uses it internally).
- Switched `.oxfmtrc.json` from custom keys to Prettier-compatible keys
  (`singleQuote`, `printWidth`, etc.) — oxfmt understands the Prettier schema
  and was silently ignoring my custom names.
- Per-package devDependencies (typescript, tsup, vitest) propagated from the
  root so binaries resolve inside workspaces. (Yarn 4 strict isolation does not
  expose root binaries via PATH inside sub-workspaces.)
- Changesets initialized: all 16 public packages linked so they version
  together; `@motif-js/tsconfig` and `@motif-js/oxlint-config` excluded.
  Root scripts: `yarn changeset`, `yarn version`, `yarn release`.
- GitHub Actions `.github/workflows/ci.yml` — runs typecheck, lint, format:check,
  build, and test on push to main and on PRs, against Node 20 and 22, with Yarn
  4 + corepack.
- `turbo.json` — `test` task `outputs` set to `[]` (silences stale-coverage
  warning).

**Verification at end of session:**

- `yarn typecheck` — 16/16 pass
- `yarn lint` — 0 errors / 0 warnings (35 files)
- `yarn format:check` — clean (87 files)
- `yarn build` — 16/16 pass; dist outputs verified
- `yarn test` — 1 test passes (`@motif-js/core`)

**Versions added in this session:** `@changesets/cli` ^2.31.0.

**Decisions made along the way:**

- **Test orchestration:** Turbo runs `test` per-package; only packages with a
  `vitest.config.ts` and a `test` script are picked up. New packages opt in.
- **Versioning:** linked across all 16 public packages (one bump moves them
  all together). Compiler packages currently in the same group; can split if
  decoupling proves useful.
- **CI matrix:** Node 20 + 22 only for now. RN matrix added in Phase C.

**Next session should start with:**

1. Begin `@motif-js/core` engine work in earnest:
   - `Theme`, `Token`, `TokenScale`, `ResolvedStyle` type definitions
   - The primitive token resolver + unit tests
   - The style-prop schema (single source of truth)
2. After core has a token resolver: write the first `<Box>` in
   `@motif-js/react-web` with ~15 inline-styled props (no theme yet — prove
   the prop pipeline first).
3. Spin up `apps/playground-web` (Vite + React) to render a real demo grid.
4. Commit the session 2 scaffold + tooling work.

**Open follow-ups carried forward:**

- Funding model decision
- GitHub remote + push
- Default tokens validation against Primer / Atlassian / Material

---

### Session 3 — 2026-04-26 — Phase A engine + first primitive + styled + playground

**Outcome:** Phase A is feature-complete. The engine resolves tokens, the
style-prop schema runs end to end, `<Box>` renders with theme-aware styles,
nested sub-themes work, `styled()` produces variant-driven components, and a
Vite playground demonstrates all of it. The two remaining items in Phase A
are user-side: a subjective "does the API feel right?" review and a preview
URL hookup.

**Shipped:**

- `@motif-js/core`:
  - `types.ts` — `Token`, `TokenRef`, `TokenNode`, `TokenScale`, `TokenMap`,
    `Theme`, `ScaleName`, `ResolvedStyle`, `StyleValue`, `CSSValue`
  - `token.ts` — `isTokenRef`, `resolveToken`, `resolveValue` with cycle
    protection and explicit-vs-default-scale resolution
  - `style-props.ts` — schema for ~50 style props (spacing, color, sizing,
    border, typography, flex/layout, position, effects, overflow, cursor)
    with `StylePropName` literal union and `isStyleProp` guard
  - `style.ts` — `resolveStyles(props, theme)` separating style props from
    pass-through, expanding shorthand (px → L+R), bailing on unresolved refs
  - 31 passing vitest unit tests across token + style modules
- `@motif-js/tokens`:
  - `primitives.ts` — Tailwind-style 4px space scale, Radix-Colors-inspired
    palettes (gray/blue/green/red/amber × 11 steps), radii, fontSizes,
    fontWeights, lineHeights, fontFamilies, shadows, zIndices, opacities
  - `themes.ts` — `lightTheme` and `darkTheme` with semantic layer
    (`surface`, `text`, `border`, `action.{primary,danger,success}.{bg,fg,hover}`)
- `@motif-js/react-web`:
  - `theme-context.ts` — React context + `useTheme()` hook
  - `Theme.tsx` — `ThemeProvider` (root) and `Theme` (nested boundary)
  - `Box.tsx` — primitive accepting style props + `as`, resolving against
    closest theme, passing HTML attributes through
- `@motif-js/react`:
  - `styled.tsx` — `styled(Component, config)` with `base`, `variants`,
    `compoundVariants`, `defaultVariants`. Boolean variants supported via
    `'true'/'false'` keys. Strings are wrapped via `<Box as={tag}>` so the
    standard style-prop pipeline applies.
  - Re-exports `Box`, `Theme`, `ThemeProvider`, `useTheme` from `react-web`
    so users only need one import.
- `apps/playground-web`:
  - Vite 7 + React 19 + StrictMode entry
  - `App.tsx` demo: header with light/dark switcher, semantic-color swatches,
    spacing/layout grid, Button via `styled()` showcasing intent + size +
    block variants and a compoundVariant, and a nested-`<Theme>` "always
    dark" island.
  - Builds to ~207 KB JS / 65 KB gzipped.

**Tooling tweaks during the session:**

- Disabled `react/react-in-jsx-scope` in `.oxlintrc.json` (modern JSX
  transform doesn't need React in scope).
- Tightened `style-props.ts`: kept literal-typed object internal for
  `StylePropName` autocomplete; exposed widened `Record<StylePropName,
StylePropDefinition>` for runtime. Avoids per-entry narrowing issues.
- `@motif-js/react-web`, `@motif-js/react`, `@motif-js/tokens`,
  `@motif-js/playground-web` got their `dependencies` /
  `peerDependencies` filled in (`@motif-js/core` workspace ref + react /
  react-dom peers / vite + plugin-react devDeps).

**Verification at end of session:**

- `yarn typecheck` — 21/21 packages pass
- `yarn lint` — 0 errors, 2 perf warnings (inline-object props in playground)
- `yarn format:check` — clean (108 files)
- `yarn build` — 17/17 builds succeed; playground bundles in 285 ms
- `yarn test` — 31 vitest tests pass
- `yarn dev` (playground) — Vite serves HTTP 200 with React Refresh

**Phase A exit gate — what's left:**

- _User-side, subjective:_ "I enjoy writing components in this API."
  Suggested action: spend 30 minutes building a real component (a card,
  a form field, anything) without consulting the docs. If it feels right,
  ship Phase B. If it grates, redesign now.
- _User-side, infra:_ deploy the playground to a preview URL (Vercel /
  Netlify) so build-in-public posts can link to a live demo.

**Next session should start with:**

1. Either Phase A redesign (if the API doesn't feel right) OR Phase B
   kickoff: migrate inline `style` → CSS variables on `[data-theme]`,
   add semantic token layer formally to the resolver if needed, add the
   responsive prop syntaxes and container queries.
2. Push to GitHub remote and run CI for the first time.
3. First build-in-public post on the architecture (the renderer model
   alone is a strong technical post).

**Open follow-ups carried forward:**

- Funding model decision (target: before Phase B ends)
- Default tokens validation against Primer / Atlassian / Material

---

### Session 4 — 2026-04-26 — Phase B kickoff: CSS vars, responsive, Stack/Text

**Outcome:** Theming migrated from per-render JS resolution to CSS variables
on `[data-theme]`. Theme switching is now an attribute swap on a wrapper
element, not a React re-render. Responsive object syntax works end-to-end:
`<Box p={{ base: '$2', md: '$4', lg: '$6' }}>` injects a deduplicated
`@media`-scoped class. Stack / HStack / VStack / Text primitives ship.

**Shipped:**

- `@motif-js/core`:
  - `css-vars.ts` — `tokenPathToCssVarName`, `tokenRefToCssVar`,
    `themeToCssVars`, `themeToCssBlock`, `themesToCssBlock`. Walks a token
    tree, emits flat `--scale-segment-segment` vars; semantic refs become
    chained `var(--target)` declarations; numbers in length scales get a
    `px` suffix; segments with dots (`0.5`) become `0_5`.
  - `breakpoints.ts` — default mobile-first breakpoints (sm 640,
    md 768, lg 1024, xl 1280, 2xl 1536) + `isResponsiveObject` guard +
    `mediaQueryForBreakpoint` helper.
  - `style.ts` — added `resolveStylesToVars` (CSS-var path, no theme
    needed) and `resolveResponsiveStylesToVars` (handles
    `{ base, sm, md, … }` objects and emits separate baseStyle +
    mediaRules + rest).
  - 24 new vitest tests; 55 total now passing.
- `@motif-js/react-web`:
  - ThemeProvider: now takes `themes={[…]} active="…"`. Renders a
    `<style>` element with all theme blocks, wraps children in a div
    carrying `data-theme="<active>"`. Theme switches re-render only
    that one attribute.
  - Theme: now `<Theme name="dark">` (string-based, no theme prop).
    Switches the data-theme attribute on a wrapper; relies on the parent
    provider having registered the theme.
  - useTheme / useThemeName: reflection helpers. Most components do not
    need them — render path is theme-agnostic, all token refs become
    `var(--…)` strings resolved by CSS cascade.
  - Box: switched to `resolveResponsiveStylesToVars`. Responsive props
    produce `mediaRules` injected by `injectMediaRules` and applied via
    a generated `m-<hash>` class.
  - `style-cache.ts` — module-level cache + lazy-created `<style data-motif-style-cache>`
    appended to `<head>`. Class names are stable hashes of serialised
    rules so identical responsive props produce a single CSS rule.
    Stub `flushPendingCss()` for future SSR work.
  - Stack / HStack / VStack: thin wrappers over Box with sensible flex
    defaults and a `direction` prop.
  - Text: thin wrapper that defaults `as="span"`.
- `@motif-js/react`: re-exports the new primitives + hooks.
- `@motif-js/playground-web` updated:
  - New ThemeProvider API
  - `<Theme name="dark">` for the nested island
  - Stack / HStack / VStack / Text used throughout
  - Responsive padding demo (`px={{ base, md, lg }}` on the layout
    container; `p={{ base, sm, md, lg }}` on a demo block)
  - Inline grid template moved to a module-level const
- `tsup.config.ts` (all 16 packages): scoped `ignoreDeprecations: '6.0'`
  to the `dts` step only via `dts: { compilerOptions: { ignoreDeprecations: '6.0' } }`.
  Project tsconfig stays strict; the escape hatch is local to tsup's
  type-emission rather than polluting IDE settings.

**Decisions made along the way:**

- ThemeProvider does the CSS injection **synchronously during render**
  (via dangerouslySetInnerHTML on a `<style>` element). Phase B SSR
  hardening will swap to a server-side collector that runs alongside
  React's renderToString.
- Style-cache injection during render (not in useLayoutEffect). Cache
  dedupes by hash, so StrictMode's double-render is harmless.
- `<Theme name="…">` does NOT update React context. The visual effect is
  pure CSS cascade. `useTheme()` / `useThemeName()` continue to report
  the top-level provider's active theme. If reflection of nested themes
  becomes useful, that's an additive change.

**Verification at end of session:**

- `yarn typecheck` — 21/21 pass
- `yarn lint` — 0 errors, 6 perf warnings (inline-object props in playground)
- `yarn format:check` — 114 files clean
- `yarn build` — 17/17 pass
- `yarn test` — 55 vitest tests pass (24 new this session)
- `yarn dev` (playground) — Vite serves HTTP 200

**Next session should start with:**

1. Container query support (`@container` rules at runtime); requires
   a small extension to the responsive resolver — accept named container
   contexts from a `<Container>`-style boundary.
2. Array responsive syntax `[base, sm, md, lg]` — straightforward
   addition to the responsive parser.
3. SSR hardening — server-side style-cache collector + first-paint
   ordering tests.
4. Pressable + Image primitives.
5. Push to GitHub remote and let CI run for the first time.

**Open follow-ups carried forward:**

- Funding model decision
- Default tokens validation against Primer / Atlassian / Material
- Phase A user-side exit gates (API ergonomics review, preview URL deploy)

---

### Session 5 — 2026-04-27 — Container queries

**Outcome:** The differentiator feature lands. Container queries work
end-to-end via the same responsive-prop object as media queries — the
discriminator is an `@` prefix on the key. A `<Container>` primitive
establishes the containment context. The resolver / style-cache
abstraction was generalized from "media rules" to "at-rules" so future
at-rule shapes (e.g. `@supports`) can ride the same path.

**API shape decided this session:**

```tsx
<Container name="card">
  <Box
    p={{ base: '$2', md: '$4', '@card.lg': '$8' }}
    flexDirection={{ base: 'column', '@card.md': 'row' }}
  />
</Container>
```

- `base` / `<bp>` keys are unchanged — `@media (min-width: …)`.
- `@<bp>` keys → `@container (min-width: …)` against the nearest container.
- `@<name>.<bp>` keys → `@container <name> (min-width: …)`.
- Mixed bag in one object is fine — the resolver buckets each kind and
  emits in cascade order: media → anonymous container → named container
  (alphabetical), each in mobile-first breakpoint order. Container rules
  override media rules at the same breakpoint, which matches the mental
  model that the local container is "more specific" than the viewport.

**Shipped:**

- `@motif-js/core`:
  - `breakpoints.ts` — added `containerQueryForBreakpoint(name, containerName?)`,
    a discriminated `ResponsiveKey` type, and `parseResponsiveKey()` that
    handles `base`, plain breakpoint names, `@<bp>` (anon container), and
    `@<name>.<bp>` (named container). Malformed keys (empty name, unknown
    breakpoint) silently return `null`.
  - `style.ts` — generalized `ResolveResponsiveResult` from `mediaRules`
    (with `media` field) to `atRules` (with `atRule` field). Single
    `AtRule` interface exported. Resolver buckets per `(kind, name?, bp)`
    and emits the deterministic order described above.
  - 20 new vitest tests (13 in `breakpoints.test.ts` for the parser/helpers,
    7 in `style.test.ts` for the container-query resolver path). 75 total
    passing now.
- `@motif-js/react-web`:
  - `style-cache.ts` — renamed `MediaRule` → `AtRule`, `injectMediaRules`
    → `injectAtRules`, internal `media` field → `atRule`. Builder reads
    the at-rule prefix as-is, so `@container` rules round-trip without
    any case-by-case logic.
  - `Container.tsx` — new primitive. Wraps Box; sets
    `container-type: inline-size` (configurable via `type`) and
    `container-name` (when `name` given) on inline style. Inherits all
    Box style props for the container surface itself.
  - `Box.tsx` — switched the import to `injectAtRules` and the field name.
  - `index.ts` — added `Container` / `ContainerProps` exports; renamed
    style-cache exports.
- `@motif-js/react`: re-exports `Container` / `ContainerProps`.
- `@motif-js/playground-web`: new "Container queries — reflow on
  container width" demo section. A horizontally-resizable wrapper (CSS
  `resize: horizontal; overflow: auto`) holds a `<Container name="card">`
  whose child Box flips `flexDirection` between column and row at
  `@card.md` and bumps padding at `@card.sm` / `@card.lg`. Reflow is
  visible while dragging the corner; viewport size is irrelevant.

**Decisions made along the way:**

- **`@`-prefix syntax** picked over the brainstormed `cq`-parallel-key /
  `{ container: 'card', sm: '$4' }` shapes. One prop, one object, no
  shape-shift. Reads close to CSS `@container` itself, extends cleanly
  to the native polyfill (same key shape, different runtime resolver),
  and avoids special-cased prop names.
- **Named-container keys are open-ended** — `RESPONSIVE_KEYS` is no
  longer enumerable beyond the fixed media-query set. `isResponsiveObject`
  detects `@`-prefixed keys structurally instead of by membership.
- **At-rule generalization** done preemptively. `@supports` /
  `@layer` at-rules can ride `injectAtRules` unchanged in future work.
- **Container-type / container-name expressed as inline style on Box**,
  not as new style-prop schema entries. The schema stays focused on the
  ~50 design-token-aware props; containment is a single primitive's job.
- **Cascade order:** media → anon container → named container
  (alphabetical), each mobile-first within a group. Container queries
  win at the same breakpoint, deliberately.

**Watch-outs / gotchas learned this session:**

- React's typing for `containerType` / `containerName` lives in csstype
  and is keyed in camelCase on the inline-style object. Passing them
  through `<Box style={…}>` works without schema changes.
- The dev script (`vite`) is workspace-local — there's no root `dev`
  alias. Use `yarn workspace @motif-js/playground-web dev`.

**Verification at end of session:**

- `yarn typecheck` — 21/21 pass
- `yarn lint` — 0 errors, 11 perf warnings (5 new from inline objects in
  the new Container demo; existing tolerance applies)
- `yarn format:check` — clean (4 files reformatted by `yarn format`
  before commit; `breakpoints.ts`, `breakpoints.test.ts`, `style.ts`,
  `Container.tsx`)
- `yarn build` — 17/17 pass
- `yarn test` — 75 vitest tests pass (20 new this session)
- `yarn workspace @motif-js/playground-web dev` — Vite HTTP 200; App.tsx
  transforms cleanly; Container demo renders.

**Next session should start with:**

1. Array responsive syntax `[base, sm, md, lg]`. Extend
   `parseResponsiveKey` (or its caller) to accept positional values;
   reuse the same `atRules` pipeline downstream.
2. String DSL responsive syntax `"sm:4 md:8"`. Tokenize at the prop
   level into per-breakpoint pairs, hand to the same resolver.
3. SSR hardening — render-scoped collector for the style-cache, plus
   `getMotifStyleTags()` to flush queued CSS for `renderToString`.
4. Pressable + Image primitives.
5. First public release flow — push to GitHub remote, let CI run.

**Open follow-ups carried forward:**

- Funding model decision
- Default tokens validation against Primer / Atlassian / Material
- Phase A user-side exit gates (API ergonomics review, preview URL deploy)
- Native polyfill design for container queries (Phase C — `onLayout` +
  context, same key syntax)

---

### Session 6 — 2026-04-27 — Responsive trio, SSR, Pressable

**Outcome:** Phase B's top-of-list backlog — array syntax, string DSL,
SSR hardening, Pressable — landed in one session, in that order. All
four shipped as separate commits so the history reads as a clean phase
walkthrough. Test count grew from 75 → 127, and a second test package
(`@motif-js/react-web`) joined the orchestrator.

**Shipped, in commit order:**

- `e898d9c` **feat(phase-b): array responsive syntax** —
  `responsiveArrayToObject` + `RESPONSIVE_ARRAY_SLOTS` in
  `@motif-js/core/breakpoints`. Resolver branches on `Array.isArray`
  before the object check; arrays normalise into the object form and
  flow through the existing per-bp bucketing. `Responsive<V>` in Box
  extended with `readonly (V | undefined)[]`. Arrays only express
  media queries — container queries always need a name slot, so the
  array form deliberately doesn't address them. 11 new vitest cases.
- `bac8b3c` **chore: gitignore .claude/** — corrective commit;
  `.claude/scheduled_tasks.lock` got captured by `git add -A` in the
  array commit. Untracked + added to `.gitignore`. (Keep in mind for
  future `add -A` runs.)
- `7fdf03f` **feat(phase-b): string DSL responsive syntax** —
  `parseResponsiveDSL` in `@motif-js/core/breakpoints`. Tokenises on
  whitespace, splits at first `:`, parses keys via
  `parseResponsiveKey` (so DSL gets media + container support for
  free). Numeric values (`/^-?\d+(\.\d+)?$/`) coerce to numbers;
  everything else stays as string. Returns `null` on any
  unknown-key / no-colon / empty-value token, so literal CSS values
  (`#fff`, `$colors.…`, `rgb(...)`, `url(...)`, `1fr 2fr`,
  `translateX(...) rotate(...)`) pass through unchanged. Resolver
  detects strings as potentially-DSL after the array and object
  branches. 17 new vitest cases.
- `58afc7e` **feat(phase-b): SSR style-cache hardening** — new
  `SSRStyleCollector` class in `@motif-js/react-web`. Per-request:
  `collector.collect(() => renderToString(<App />))` captures CSS
  emitted during render, then `getStyleTag()` returns
  `<style data-motif-ssr>...</style>` ready to embed in HTML. Active
  collector pointer is module-level (sync `renderToString` only;
  streaming SSR with `AsyncLocalStorage` is documented as a future
  add). Hydration: on first client-side `injectAtRules`, scan the DOM
  for `<style data-motif-ssr>` blocks and seed `cache.injected` with
  their `m-<hash>` class names so client renders don't double-inject.
  Stood up vitest in `@motif-js/react-web` (jsdom env, +`jsdom`
  devDep). 13 new tests covering browser path, collector capture /
  nesting / restoration, getStyleTag output, hydration seeding,
  fall-through.
- `7f38570` **feat(phase-b): Pressable primitive** — first interactive
  primitive. Renders as `<button>` by default; `as` override accepted.
  Accepts `_hover` / `_focus` / `_active` / `_disabled` flat style
  bags; resolves each via `resolveStylesToVars` and emits selector-
  suffixed rules through a new `injectPseudoRules` helper. `_focus`
  uses `:focus-visible` so focus rings only appear on keyboard focus.
  `_disabled` uses `:disabled, &[aria-disabled="true"]` (selector list
  via `&` interpolation) so the disabled visuals work whether the
  element is a `<button>` or a non-button surface. `onPress` is the
  cross-platform alias for `onClick`; both work, both are suppressed
  when `disabled`. Default cursor is `pointer` (`not-allowed` when
  disabled). Playground gains a "Pressable — hover / focus / active /
  disabled" demo plus an updated "Responsive prop syntax" section
  showing all three responsive shapes side-by-side. 11 new vitest
  cases.

**Decisions made along the way:**

- **Array is media-query only.** Positional addressing for container
  queries would require a separate naming convention; users who want
  container queries can use the object or DSL form.
- **DSL fall-through over throw on unknown key.** A user passing
  `bg="rgb(0, 0, 0)"` shouldn't get a runtime error; non-DSL strings
  must pass through unchanged. The heuristic ("every token must have
  form `<knownKey>:<rest>`") is strict enough that no realistic
  literal CSS value misfires.
- **SSR collector uses module-level state, not AsyncLocalStorage.**
  AsyncLocalStorage requires `node:async_hooks`, which complicates
  browser bundles. Sync `renderToString` is correct under module-level
  state. Streaming SSR will need AsyncLocalStorage, called out
  explicitly in the JSDoc.
- **Hydration seeds cache.injected at first inject call.** Lazy
  scan-on-demand keeps the import side-effect-free; only pages that
  actually render motif components pay the cost (and only once).
- **Pseudo-rules use `&`-interpolation in the selector suffix.**
  `:disabled, &[aria-disabled="true"]` becomes
  `.m-xxx:disabled, .m-xxx[aria-disabled="true"]`. More general than
  hardcoding the disabled case; future state combinations (e.g.
  `:hover:not(:disabled)`) drop in without code changes.
- **Pseudo-state bags are flat in v1.** Nesting responsive +
  pseudo-state composition would require nested at-rules under the
  pseudo selector; that's CSS-supported but adds resolver complexity.
  Deferred until there's a real demand.

**Watch-outs / gotchas learned this session:**

- **`exactOptionalPropertyTypes`** bites when passing `undefined` to a
  prop typed `string` (without `| undefined`). Use conditional
  spreads — `{...(value !== undefined ? { prop: value } : {})}`. See
  `Pressable.tsx` for the pattern.
- **oxfmt mangles markdown identifiers with underscores.** Writing
  `LAST_MEMORY.md` in plain text gets re-emitted with stray `*` /
  `\_`. Backtick-escape filenames (`` `LAST_MEMORY.md` ``) to keep
  oxfmt's markdown formatter from interpreting `_` as italics.
- **oxfmt's TS parser** rejects template-literal types in index
  signature form (`[K: \`@${string}\`]`) but accepts them in mapped
  type form (`[K in \`@${string}\`]`). Use the mapped-type form.
- **`yarn add -A` captures `.claude/`** — Claude Code's per-session
  runtime state. Now in `.gitignore`; new packages added in future
  sessions don't need to worry.
- **react-web tests** require `react` + `react-dom` for `createRoot`,
  but those live as peerDependencies; the workspace's hoisted deps
  resolve them. No need to declare them as devDeps in react-web.

**Verification at end of session:**

- `yarn typecheck` — 21/21 pass
- `yarn lint` — 0 errors, 30 perf warnings (inline-object props in
  the playground; tolerated per existing convention)
- `yarn format:check` — clean
- `yarn build` — 17/17 pass
- `yarn test` — 127 vitest tests pass (103 core + 24 react-web; up
  from 75 last session)
- `yarn workspace @motif-js/playground-web dev` — Vite HTTP 200; the
  Pressable demo and all three responsive syntaxes transform cleanly

**Next session should start with:**

1. **Image primitive** — last unchecked Box-of-five from the Phase B
   "Core primitives" list. Cross-platform image with placeholder /
   fallback. Web side is straightforward; native side punted to
   Phase C.
2. **Conformance harness skeleton** in `@motif-js/test-utils` —
   prepares the testing foundation for the two-tree renderer model.
3. **Default-token validation** against Primer / Atlassian / Material
   3 — re-express each in motif tokens. Phase B exit prerequisite.
4. **First public release flow** — push to GitHub remote, let CI run,
   first changeset, dry-run `yarn release`. (User action: create the
   GitHub repo and push.)
5. **'use client' boundaries audit** — confirm motif components work
   under React Server Components.
6. **End-to-end SSR test** — verify FOUC-free first paint in a real
   Next.js or Remix app. The collector is in place; need integration
   coverage.

**Open follow-ups carried forward:**

- Funding model decision
- Default tokens validation against Primer / Atlassian / Material
- Phase A user-side exit gates (API ergonomics review, preview URL deploy)
- Native polyfill design for container queries (Phase C)
- AsyncLocalStorage variant of SSRStyleCollector for streaming SSR
- Responsive nesting inside pseudo-state bags (`_hover={{ md: {...} }}`)

---

### Session 11 — 2026-04-27 — Snapshot suite + jest-DOM-style matchers

**Outcome:** Closed the two remaining "Test infrastructure" boxes in
ROADMAP. Phase B engineering is now fully done — everything left is
public release + community.

**Shipped:**

- `b568ad1` **feat(phase-b): snapshot suite + jest-DOM-style
  matchers** — three pieces:
  - **Snapshot tests** in `react-web/src/snapshot.test.tsx` — every
    `standardCases` row through the web adapter, full `RendererOutput`
    snapshotted under `__snapshots__/`. CI catches drift in either
    the resolver (token resolution path) or the renderer (HTML
    parsing, var-back-resolution, px-stripping).
  - **`motifMatchers`** in `@motif-js/test-utils/src/matchers.ts` —
    `toHaveStyle(decls)` (subset match against inline style) and
    `toHaveStyleAt(scope, decls)` (single matcher routes to the
    right rule bucket via the scope prefix). Vitest `Assertion<T>`
    - `AsymmetricMatchersContaining` augmentations so consumers get
      autocomplete on `expect(out).toHaveStyle(...)`.
  - **Web adapter extraction** — moved `createWebAdapter` from
    `conformance.test.tsx` into `web-adapter.ts` so the snapshot
    suite + matchers tests + future test files share one adapter.
    Conformance test is now a 9-line loop over the standard cases.
- New tests: 18 snapshot cases + 8 matcher cases. Total workspace
  tests: 196 → 222 (+26 this session).

**Decisions made along the way:**

- **One `toHaveStyleAt` matcher, not three.** Routing via the scope
  prefix (`@media …` / `@container …` / `:state …`) keeps the API
  surface tight. Three near-identical methods (`toApplyAtMedia` /
  `toApplyAtContainer` / `toApplyOnPseudo`) would be more typing
  for marginal clarity.
- **Subset-match by default.** Matchers tolerate extra style keys
  the renderer may add for delivery (e.g. cursor on Pressable).
  Cases assert what _must_ be there. Strict-equality is intentionally
  not exposed — there's no clean cross-renderer story for "no other
  styles applied" since web adds class hashes, native uses StyleSheet
  IDs, etc.
- **Adapter in `web-adapter.ts`, not `index.ts`.** Test infrastructure
  doesn't go in the public bundle — keeps motif's runtime exports
  clean. If a future consumer wants the adapter, they import the
  source path directly.
- **Snapshots committed, not generated.** Standard practice — the
  diff between snapshot files in PRs is a load-bearing review signal.

**Watch-outs / gotchas learned this session:**

- **vitest's `Assertion` interface is single-param `<T>`, not
  `<T = unknown>`.** Module augmentation must match exactly or the
  TS dts build errors with TS2428. Worth pinning if vitest changes
  its signature.
- **Adding `vitest` to the package's `tsconfig.types`** lets the
  `declare module 'vitest'` augmentation resolve during dts build.
  Without it, tsup's dts step errors with "Invalid module name in
  augmentation, module 'vitest' cannot be found."

**Verification at end of session:**

- `yarn typecheck` — 22/22 pass
- `yarn lint` — 0 errors, 94 perf warnings (unchanged)
- `yarn format:check` — clean
- `yarn build` — 17/17 pass
- `yarn test` — 222 vitest tests pass (103 core + 99 react-web + 20
  tokens; +26 this session — 18 snapshots + 8 matchers)

**Phase B engineering checklist** (final state):

- ✅ All five "Core primitives (web)" boxes
- ✅ All four "SSR hardening" boxes
- ✅ All five "Responsive + container queries" boxes
- ✅ All five "CSS variables + theming v2" boxes
- ✅ All three "Test infrastructure" boxes
- ⬜ v0.5 published to npm (Public release section — needs GitHub remote)
- ⬜ ≥50 GitHub stars (Phase B exit gate — community)
- ⬜ Public announcement shipped (Phase B exit gate)

**Next session should start with:**

1. **First public release flow** — push to GitHub remote, let CI
   run, first changeset, dry-run `yarn release`. **(User action:
   create the GitHub repo and push.)** This is the next ROADMAP
   exit-gate item.
2. **Per-entry tsup splitting** — relax the bundle-level `'use client'`
   so Box / Stack / Text / Container can be true server components in
   App Router. Optional optimisation.
3. **`@motif-js/next` package** — could lift the App Router registry
   pattern (currently in `apps/ssr-next`) into a real exported
   component once it stabilises across users.

**Open follow-ups carried forward:**

- Funding model decision
- Phase A user-side exit gates (API ergonomics review, preview URL deploy)
- Native polyfill design for container queries (Phase C)
- Responsive nesting inside pseudo-state bags (`_hover={{ md: {...} }}`)
- Per-entry tsup splitting (optional RSC-purity for hookless primitives)
- `@motif-js/next` first-class registry export

---

### Session 10 — 2026-04-27 — Default-token validation (Primer / Atlassian / M3)

**Outcome:** Last Phase B exit prerequisite is closed. Re-expressed
the three canonical real-world design systems in motif's two-layer
token format and ran the resolver across representative tokens. Zero
gaps — no resolver changes, no schema additions. The shape covers:
10-step (Primer), 100–1000-step (Atlassian), and tonal 0–100-step
(M3) palettes; functional / semantic role layers with one or two
levels of nesting; leading-zero string keys; and parallel-scale
compound typography slots (M3's `displayLarge`, `bodyMedium` etc.
expressed across `fontSizes` / `lineHeights` / `fontWeights` /
`letterSpacings` keyed by slot name).

**Shipped:**

- `6383f98` **feat(phase-b): default-token validation** — three
  fixture files in `packages/tokens/src/validation/` (`primer.ts`,
  `atlassian.ts`, `m3.ts`), each a complete `Theme` object exercising
  the source system's distinctive shape. `validation.test.ts`
  exercises 20 representative resolutions per the test plan; per-
  system suites cover bare/explicit ref forms, multi-hop semantic
  chains, deeply-nested groups, NNN-string keys, and compound
  typography. A cross-system block asserts every theme has a colors /
  space / radii scale and that no semantic chain leaks a `$` literal.
  Stand up vitest in `@motif-js/tokens` (Node env, +`test` script,
  no jsdom needed). Total workspace tests: 176 → 196 (+20 token
  validation cases).

**Decisions made along the way:**

- **Fixtures live in `packages/tokens/src/validation/` but are NOT
  exported from index.** They're both reference material (a user can
  copy a theme to bootstrap their app) and test fixtures, but
  shipping them as canonical npm exports would creep on each upstream
  system's evolution. Path forward if demand emerges: split into
  `@motif-js/tokens/primer` etc. subpath exports.
- **One representative-resolution test per system per shape.** Goal
  isn't 100% coverage of every token; goal is to prove every
  _distinctive shape_ of the source system works. 20 cases is enough
  to land that signal.
- **M3 typography handled via parallel scales, not compound tokens.**
  Components read `$fontSizes.titleMedium` / `$lineHeights.titleMedium`
  / `$fontWeights.titleMedium` / `$letterSpacings.titleMedium` as
  separate values — same key, four lookups. Avoids introducing a
  separate compound-token primitive in the schema.
- **`letterSpacings` already in `TokenMap` schema** (just not in the
  default tokens). Discovery: motif's schema is forward-compatible
  for design systems that need it without breaking changes; M3 is
  the proof.

**Watch-outs / gotchas learned this session:**

- **Numeric-vs-string keys** are interchangeable for token resolution
  because JS object indexing coerces numbers → strings. So
  `space: { 100: 8 }` (number key) and `space: { '100': 8 }` (string
  key) both resolve `$space.100`. Atlassian uses string keys to
  preserve leading zeros (`'050'`); Primer uses numbers. Both work.

**Verification at end of session:**

- `yarn typecheck` — 22/22 pass
- `yarn lint` — 0 errors, 94 perf warnings (unchanged)
- `yarn format:check` — clean
- `yarn build` — 17/17 pass
- `yarn test` — 196 vitest tests pass (103 core + 73 react-web + 20
  tokens; +20 validation cases this session)

**Phase B exit checklist** (per ROADMAP):

- ✅ All five "Core primitives (web)" boxes
- ✅ All four "SSR hardening" boxes
- ✅ All five "Responsive + container queries" boxes
- ✅ All five "CSS variables + theming v2" boxes (incl. design-system validation)
- ✅ Conformance harness skeleton (one of three "Test infrastructure" boxes)
- ⬜ v0.5 published to npm (Public release section — needs GitHub remote)
- ⬜ ≥50 GitHub stars (Phase B exit gate — community)
- ⬜ Public announcement shipped (Phase B exit gate)

The engineering work for Phase B is essentially done. Remaining
items (snapshot tests, public release, announcement) are the
"marketing-and-stabilise" lap.

**Next session should start with:**

1. **First public release flow** — push to GitHub remote, let CI
   run, first changeset, dry-run `yarn release`. (User action: create
   the GitHub repo and push.)
2. **Snapshot tests across primitives** — second box under "Test
   infrastructure". Hash the rendered output of each `standardCases`
   row + each fixture-based composite, diff in CI to catch unintended
   resolver / renderer drift.
3. **Per-entry tsup splitting** — relax the bundle-level `'use client'`
   so Box / Stack / Text / Container can be true server components in
   App Router. Optional optimisation.
4. **`@motif-js/next` package** — could lift the App Router registry
   pattern (currently in `apps/ssr-next`) into a real exported
   component once it stabilises across users.

**Open follow-ups carried forward:**

- Funding model decision
- Phase A user-side exit gates (API ergonomics review, preview URL deploy)
- Native polyfill design for container queries (Phase C)
- Responsive nesting inside pseudo-state bags (`_hover={{ md: {...} }}`)
- Per-entry tsup splitting (optional RSC-purity for hookless primitives)
- `@motif-js/next` first-class registry export

---

### Session 9 — 2026-04-27 — Conformance harness skeleton

**Outcome:** `@motif-js/test-utils` ships its first real surface — a
renderer-agnostic conformance suite. The web renderer passes all 18
standard cases. When `@motif-js/react-native` lands in Phase C it
plugs in by writing its own adapter and running the same suite; any
prop→style divergence between the two renderer trees becomes a failing
test row.

**Shipped:**

- `c88e7bd` **feat(phase-b): cross-renderer conformance harness
  skeleton** — `@motif-js/test-utils` gains `ConformanceCase`,
  `RendererAdapter`, `RendererOutput`, `assertConformance(adapter, c)`,
  `defaultTestTheme`, and `standardCases` (18 rows: literal styles,
  `$`-token refs bare + explicit-scale, shorthand expansion (px/my),
  responsive object/array/DSL, container queries (anon/named/DSL),
  Pressable pseudo-states `:hover` / `:focus-visible` / `:active`,
  pass-through props). Web adapter lives in
  `packages/react-web/src/conformance.test.tsx` — renders via
  `react-dom/server.renderToString` inside `SSRStyleCollector`,
  parses HTML for the root primitive's inline `style` and `m-<hash>`
  class, parses captured CSS into media/container/pseudo buckets
  filtered by class, back-resolves `var(--…)` against the theme and
  strips `px` so cross-renderer expectations compare against raw
  numbers. Test count went from 158 → 176 (+18 conformance cases).

**Decisions made along the way:**

- **Cases compare resolved literal values, not CSS-var refs.** The
  web renderer emits `var(--…)` for delivery; the adapter's job is to
  back-resolve those against the theme so the cross-renderer
  contract is renderer-agnostic. Native won't have CSS vars at all —
  same expectation, different normalisation path.
- **Primitive lookup via name string, not React element.** Cases
  carry `primitive: 'Box' | 'Pressable' | …`; each adapter maps the
  string to its own implementation. Avoids cases-as-JSX coupling and
  lets a future native suite reuse the same case rows verbatim.
- **`assertConformance` throws, doesn't return a result object.** The
  caller's test framework wraps each case in its own `it(...)` block
  so failures pinpoint to the right row. No magic test framework
  dependency in `@motif-js/test-utils`.
- **`expectStyle` is subset-match by default.** Renderers may emit
  extra style keys for delivery reasons (cursor on Pressable, etc.).
  Cases assert what _must_ be there; opt into strict equality via
  `expectExactStyle`.
- **Reset cache between cases.** The web adapter calls
  `_resetStyleCacheForTesting()` per render so global state (mostly
  the dedup set) doesn't shadow rules across cases.

**Watch-outs / gotchas learned this session:**

- **`@motif-js/test-utils` was missing the `@motif-js/core` dep.**
  Caught by the first import; added to `dependencies` (not devDeps,
  since the export uses the `Theme` type at runtime).
- **`yarn workspace add 'pkg@workspace:*'`** needs the spec quoted
  (single quotes) — zsh tries to glob the bareword otherwise.
- **`ComponentType<Record<string, unknown>>` cast needs `unknown`
  bridge.** Going directly from `ComponentType<BoxProps>` to
  `ComponentType<Record<string, unknown>>` errors because the prop
  shapes don't structurally overlap; cast through `unknown` first.

**Verification at end of session:**

- `yarn typecheck` — 22/22 pass
- `yarn lint` — 0 errors, 94 perf warnings (unchanged)
- `yarn format:check` — clean
- `yarn build` — 17/17 pass
- `yarn test` — 176 vitest tests pass (103 core + 73 react-web; +18
  conformance cases)

**Next session should start with:**

1. **Default-token validation** against Primer / Atlassian / Material
   3 — re-express each design system in motif tokens. Phase B exit
   prerequisite.
2. **First public release flow** — push to GitHub remote, let CI
   run, first changeset, dry-run `yarn release`.
3. **Snapshot tests across primitives** (next bullet under
   "Test infrastructure" in ROADMAP). Hashes shouldn't drift between
   commits without intent; snapshot the rendered outputs of
   `standardCases` and diff in CI.
4. **Per-entry tsup splitting** — relax the bundle-level
   `'use client'` so Box / Stack / Text / Container can be true
   server components in App Router.

**Open follow-ups carried forward:**

- Funding model decision
- Default tokens validation against Primer / Atlassian / Material
- Phase A user-side exit gates (API ergonomics review, preview URL deploy)
- Native polyfill design for container queries (Phase C)
- Responsive nesting inside pseudo-state bags (`_hover={{ md: {...} }}`)
- Per-entry tsup splitting (optional RSC-purity for hookless primitives)
- `@motif-js/next` first-class registry export

---

### Session 8 — 2026-04-27 — SSR end-to-end with Next.js App Router

**Outcome:** SSR is now production-grade against a real meta-framework.
Built the Next 16 App Router integration end-to-end: the
AsyncLocalStorage-backed collector lives in a server-only entry, a
React `CollectorContext` plumbs the active collector through the tree,
and a 30-line registry component (in user code) wires
`useServerInsertedHTML` to flush captured CSS into the streamed
`<head>`. Verified zero FOUC: every `m-<hash>` class on a rendered
element has a matching CSS rule emitted before the body chunk ships.

**Shipped in commit order:**

- `1f7c73b` **feat(phase-b): per-collector SSR dedup + integration
  test** — fixed a latent bug where the global `cache.injected` set
  shadowed the collector path: a second SSR request that produced the
  same hash would receive empty CSS because the first had already
  "claimed" it. Now `injectAtRules` / `injectPseudoRules` skip the
  global gate when a collector is active and rely on the collector's
  `localInjected` set. New `ssr-integration.test.tsx` exercises the
  full `react-dom/server` `renderToString` loop with all primitives
  (12 cases covering responsive trio, container queries, pseudo-state
  rules, `getStyleTag()` shape, two-collector independence,
  no-leakage of `data-motif-style-cache`, class-name match between
  CSS and rendered HTML).
- `ffa6e41` **feat(phase-b): 'use client' on theming + interactive
  primitives** — source-level directives on `theme-context.ts`,
  `Theme.tsx`, `Pressable.tsx`, `Image.tsx`. Bundle-level banner
  injected via tsup `onSuccess` (esbuild's treeshake drops free
  string expressions, so we post-process the dist files). Box / Stack
  / Text / Container lose pure-RSC status — they still SSR (client
  components render server-side as part of the SSR pass), just no
  longer count as server-only. Practical norm for runtime CSS-in-JS.
- `824399c` **feat(phase-b): AsyncLocalStorage SSRStyleCollector** —
  refactored `style-cache.ts` to a pluggable `CollectorStorage`
  interface. Default `syncCollectorStorage` keeps the module-level
  pointer; new `@motif-js/react-web/server` entry registers an
  `AsyncLocalStorage`-backed backend. Importing the server entry as
  a side effect activates async-safe collection — concurrent renders
  no longer interleave. 6 new vitest cases (sync + async paths,
  Promise interleaving, nested collect()).
- `bf4807e` **feat(phase-b): Next.js App Router demo + context
  override** — `apps/ssr-next` (Next 16, port 4000). New
  `CollectorContext` + `useActiveCollector()` in
  `@motif-js/react-web` plumbs an active collector through React's
  tree. `injectAtRules` / `injectPseudoRules` now accept an optional
  `override` argument that wins over storage. Box and Pressable read
  from context and forward. `SSRStyleCollector._drain()` clears
  rules without resetting dedup so streaming flushes don't double-
  emit. The 30-line `MotifStyleRegistry` lives in the demo app
  (not the library) — keeps motif-js Next-agnostic. `instrumentation.ts`
  registers the AsyncLocalStorage backend at server startup.

**Decisions made along the way:**

- **Bundle banner > per-entry split.** tsup config gets a post-build
  `onSuccess` that prepends `'use client'` to `dist/index.{js,cjs}`
  but NOT `dist/server.{js,cjs}`. The whole library bundle is
  client-bound (Tamagui / Mantine / Chakra norm); per-entry splitting
  to recover RSC-purity for hookless primitives is deferred.
- **Registry lives in user code, not library.** `MotifStyleRegistry`
  is ~30 lines of Next-specific glue that's far too small to justify
  taking a `next` dependency in motif-js. The library exports the
  primitives (`SSRStyleCollector`, `CollectorContext`,
  `_drain()`); the App Router pattern is an example users copy.
  Mirrors styled-components' integration story.
- **Storage is pluggable, not opinionated.** Sync default works for
  `renderToString` callers (Pages Router, Remix, Express). The
  AsyncLocalStorage backend is opt-in via the `/server` entry —
  imported as a side effect. Avoids forcing `node:async_hooks` on
  consumers who don't need it.
- **Per-collector dedup is the contract.** The global `cache.injected`
  set is browser-only now. Each `SSRStyleCollector` carries its own
  `localInjected` set so two requests producing the same hash both
  get the CSS. Catching this required the integration test.
- **`useServerInsertedHTML` drains.** Each Next stream flush calls the
  callback; we emit accumulated rules and drain. Keeps duplicate
  emission out of subsequent chunks. Pattern lifted from
  styled-components.

**Watch-outs / gotchas learned this session:**

- **tsup banner gets dropped by esbuild's treeshake.** Free string
  expressions at the top of a bundle look like dead code to esbuild.
  Workaround: tsup's `onSuccess` reads + rewrites the dist files
  with a directive prefix.
- **`node:async_hooks` types** don't resolve under strict
  `compilerOptions.types: ["react"]`. Add `node` to the array
  package-locally — global types config stays minimal.
- **App Router doesn't expose render wrapping.** Can't wrap Next's
  render with `collector.collect()`; instead, plumb the collector
  via React context (which IS allowed to cross the server/client
  boundary inside the SSR tree). Required adding the `override`
  argument to the inject helpers — call-site setups still work via
  the storage-based path.
- **Next 16 / Turbopack doesn't resolve `.js` extensions for local
  imports.** Demo app's local files use `'./module-name'` (no
  extension), unlike workspace package source which uses `.js`.
- **`useServerInsertedHTML` must not mutate state during the
  callback.** The drain happens INSIDE the callback because the
  return JSX is the source of truth — Next inserts it into the
  stream immediately, so subsequent flushes need to start fresh.
- **`'use client'` files must have the directive before any
  imports.** Source-level directives in `Theme.tsx` etc. survive
  through esbuild for individual files when bundling, but the bundle
  banner is what matters for the consumer's bundler.

**Verification at end of session:**

- `yarn typecheck` — 22/22 pass (added `@motif-js/ssr-next`)
- `yarn lint` — 0 errors, 94 perf warnings (inline-object props)
- `yarn format:check` — clean
- `yarn build` — 17/17 pass (workspace lib packages)
- `yarn test` — 158 vitest tests pass (103 core + 55 react-web; +6
  async-storage tests + 12 integration tests)
- `next build` (in `apps/ssr-next`) — static prerender succeeds
- `next start` + `curl /` — HTTP 200, single
  `<style data-motif-ssr>` block in head, 14 rules covering all
  responsive / container / pseudo-state CSS, **100% class-to-CSS
  coverage** (no FOUC), no `data-motif-style-cache` element leaks
  into SSR output

**Next session should start with:**

1. **Conformance harness skeleton** in `@motif-js/test-utils` —
   prepares the testing foundation for the two-tree renderer model.
2. **Default-token validation** against Primer / Atlassian / Material
   3 — re-express each design system in motif tokens. Phase B exit
   prerequisite.
3. **First public release flow** — push to GitHub remote, let CI
   run, first changeset, dry-run `yarn release`. (User action:
   create the GitHub repo and push.)
4. **Per-entry tsup splitting** — relax the bundle-level
   `'use client'` so Box / Stack / Text / Container can be true
   server components in App Router. Future optimization.
5. **`@motif-js/next` package** — could lift the registry pattern
   into a real exported component once it stabilises across users.

**Open follow-ups carried forward:**

- Funding model decision
- Default tokens validation against Primer / Atlassian / Material
- Phase A user-side exit gates (API ergonomics review, preview URL deploy)
- Native polyfill design for container queries (Phase C)
- Responsive nesting inside pseudo-state bags (`_hover={{ md: {...} }}`)
- Per-entry tsup splitting (optional RSC-purity for hookless primitives)
- `@motif-js/next` first-class registry export

---

### Session 7 — 2026-04-27 — Image primitive

**Outcome:** Last Phase-B core primitive lands. `<Image>` wraps `<img>`
on web with optional placeholder + fallback overlays, completing the
five-primitive Box / Stack / Text / Pressable / Image set.

**Shipped:**

- `e34f34b` **feat(phase-b): Image primitive** — two render paths.
  Simple case (no placeholder/fallback) emits an `<img>` directly with
  all Box style props applied to the image. Wrapped case
  (`position: relative; overflow: hidden` Box) sits an opacity-0 `<img>`
  inside an absolute-positioned overlay slot; placeholder shows during
  `loading`, fallback (or placeholder if no fallback) shows on `error`.
  `onLoad` / `onError` are forwarded after the internal state
  transition. Added `objectFit`, `objectPosition`, `aspectRatio` to the
  style-prop schema in `@motif-js/core`.
- 13 new vitest cases (140 total): simple-case rendering, attribute
  forwarding (`loading` / `decoding` / `srcSet` / `sizes`), Box style
  props on `<img>`, wrapped-case rendering, placeholder during
  loading, reveal on load, fallback on error vs placeholder fallback,
  callback forwarding for both paths.
- Playground gains a "Image — simple, placeholder, and fallback" demo
  with three side-by-side cases (plain, with placeholder, broken-URL
  fallback).

**Decisions made along the way:**

- **Two render paths instead of one.** A single wrapper-always design
  would force an extra `<div>` for every image. Most images don't need
  state overlays, so the simple case is worth the small branch cost.
- **objectFit / objectPosition / aspectRatio added to schema.** They're
  layout primitives, not image-only — common for video / iframe too.
  Live in the schema alongside `overflow` etc.
- **Fallback falls back to placeholder.** A user who provides only a
  placeholder usually wants it to handle errors too; making them opt
  into a separate fallback for that case is friction without payoff.
- **`<img>` attributes pass through Box's rest spread.** Casting via
  `as Record<string, unknown>` because Box's typed props don't expose
  img-specific attrs. Acceptable cost; cleaner than a polymorphic Box.

**Watch-outs / gotchas learned this session:**

- **Direct workspace tests run against built dist, not source.** Running
  `yarn workspace @motif-js/react-web test` after a schema change in
  `@motif-js/core` requires `yarn workspace @motif-js/core build`
  first. Going through `yarn test` (root) handles deps via Turbo.

**Verification at end of session:**

- `yarn typecheck` — 21/21 pass
- `yarn lint` — 0 errors, 44 perf warnings (more inline-object props in
  the new Image demo; tolerated)
- `yarn format:check` — clean
- `yarn build` — 17/17 pass
- `yarn test` — 140 vitest tests pass (103 core + 37 react-web; up from
  127 last session, +13 Image)
- `yarn workspace @motif-js/playground-web dev` — Vite HTTP 200; the
  Image demo transforms cleanly with the placeholder + fallback
  variants visible

**Next session should start with:**

1. **Conformance harness skeleton** in `@motif-js/test-utils` —
   prepares the testing foundation for the two-tree renderer model.
2. **Default-token validation** against Primer / Atlassian / Material
   3 — re-express each design system in motif tokens. Phase B exit
   prerequisite.
3. **End-to-end SSR test** — verify FOUC-free first paint in a real
   Next.js or Remix integration.
4. **'use client' boundaries audit** for RSC compat.
5. **First public release flow** — push to GitHub remote, let CI run.

**Open follow-ups carried forward:**

- Funding model decision
- Default tokens validation against Primer / Atlassian / Material
- Phase A user-side exit gates (API ergonomics review, preview URL deploy)
- Native polyfill design for container queries (Phase C)
- AsyncLocalStorage variant of SSRStyleCollector for streaming SSR
- Responsive nesting inside pseudo-state bags (`_hover={{ md: {...} }}`)

---

## How to use this file

When starting a new session:

1. Read the **Snapshot** to know where things stand.
2. Read the latest entry in the **Session log** for "next session should start
   with" notes.
3. Check ROADMAP.md to see which checkboxes are open in the current phase.

When ending a session:

1. Append a new entry to the **Session log** (date, what was attempted, what
   shipped, what's blocked).
2. Update the **Snapshot** (current sub-stage, latest commit, health,
   blockers).
3. Tick checkboxes in ROADMAP.md for anything completed.
4. If a planning decision changed, also update PLAN.md and the architecture
   memory file.
