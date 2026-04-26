# motif-js — Progress

Living progress log across sessions. Append to the session log on every working
session; update the snapshot at the top to reflect current state.

---

## Snapshot

- **Current phase:** B — Web-complete (CSS-vars + responsive object syntax done)
- **Sub-stage:** Theming migrated to CSS-variable cascade. Object responsive syntax + media-query injection working. Stack / Text shipped.
- **Latest commit:** `1833786` feat: Phase A engine — tokens, Box, styled, playground _(session 4 work uncommitted at snapshot time)_
- **Latest published version:** none (pre-v0.1)
- **Health:** 🟢 typecheck (21/21) / lint (0 errors, 6 perf warnings) / format / build / test (55 passing) all green
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
