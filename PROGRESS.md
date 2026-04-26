# motif-js — Progress

Living progress log across sessions. Append to the session log on every working
session; update the snapshot at the top to reflect current state.

---

## Snapshot

- **Current phase:** A — Foundation
- **Sub-stage:** Scaffold complete; about to start `@motif-js/core` engine work
- **Latest commit:** `bc6c5d9` chore: scaffold motif-js monorepo
- **Latest published version:** none (pre-v0.1)
- **Health:** 🟢 typecheck / lint / format all green on empty stubs
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
