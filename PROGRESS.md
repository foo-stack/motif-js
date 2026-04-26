# motif-js — Progress

Living progress log across sessions. Append to the session log on every working
session; update the snapshot at the top to reflect current state.

---

## Snapshot

- **Current phase:** A — Foundation
- **Sub-stage:** Scaffold + tooling complete; ready to start `@motif-js/core` engine work
- **Latest commit:** `9853539` docs: add PLAN, ROADMAP, and PROGRESS _(scaffold + tooling work from session 2 still uncommitted)_
- **Latest published version:** none (pre-v0.1)
- **Health:** 🟢 typecheck / lint / format / build / test all green on empty stubs
- **Blockers:** none

### Phase progress at a glance

| Phase                   | Status         | Notes                           |
| ----------------------- | -------------- | ------------------------------- |
| A — Foundation          | 🟦 in progress | Scaffold done; engine work next |
| B — Web-complete        | ⬜             |                                 |
| C — Native parity       | ⬜             |                                 |
| D — Compiler            | ⬜             |                                 |
| E — Primitives buildout | ⬜             |                                 |
| F — Headless components | ⬜             |                                 |
| G — v1.0                | ⬜             |                                 |

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
