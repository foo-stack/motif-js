# Motif docs site — progress

> Cross-session progress tracker for the docs site at `apps/docs/`. The plan lives in [`DOC_PLAN.md`](./DOC_PLAN.md) — this file is the running log of what's been done, what's next, and what's blocked. The most recent session's hand-off note is [`LAST_MEMORY.md`](./LAST_MEMORY.md).
>
> **For agents picking this up cold:** read `DOC_PLAN.md` first (the spec), then this file (cross-session state), then `LAST_MEMORY.md` (where the last session stopped and what to do next).

---

## Current state

**Phase:** ready to begin Phase 0 (scaffold).
**Last updated:** 2026-04-30.

---

## Done

### Phase −1 — v1.1.1 stabilization cut (2026-04-30)

Phase −1 was a publish-pipeline pass to anchor the docs site against a deliberate, working npm release. All 13 linked packages now ship as `@motif-js/*@1.1.1` with concrete dependency versions.

- ✅ Audit pass across 8 packages (`@motif-js/core`, `react`, `react-web`, `react-native`, `compiler-swc`, `headless`, `forms`, `icons`, `reset`). Confirmed Tier-1 docs surface is implemented and not stubbed.
- ✅ Stub package removal — `@motif-js/color`, `@motif-js/forms`, `@motif-js/primitives` deleted from the workspace. They were 5-line `PACKAGE_NAME`-only stubs at v1.0.0 with descriptions that promised functionality living elsewhere.
- ✅ `createTheme` factory added to `@motif-js/core`, re-exported from `@motif-js/react`, `react-web`, `react-native`. Pass-through factory that narrows the `tokens` type for `$`-references.
- ✅ `@motif-js/react` properly cross-platform via package-exports routing. Single `npm install @motif-js/react` resolves to `react-web` on web bundlers and `react-native` on Metro. Both renderers ship as transitive deps.
- ✅ Per-package READMEs for all 13 packages. Top-level README banner rewritten for v1.1.0 (then superseded by v1.1.1).
- ✅ Stale `.changeset/*.md` entries deleted (21 files describing pre-v1.0.0 work that already shipped).
- ✅ `scripts/publish.mjs` now rewrites `workspace:*` deps to concrete versions in-place before each `npm publish` and restores the original file in a `finally` block. Replaces the broken raw `npm publish` that had shipped `workspace:*` strings unrewritten in v1.0.0 and v1.1.0.
- ✅ v1.1.1 published to npm with concrete deps. Smoke-tested via fresh Vite project: install + build + preview all succeed.
- ✅ Open issue: [#5 — compiler-swc: no extracted CSS file in Vite build output](https://github.com/foo-stack/motif-js/issues/5). Runtime path works; build-time extraction does not appear to fire. Doesn't block docs work.

### Decisions locked (2026-04-30)

See `DOC_PLAN.md` for the full table. Headlines:

- **Stack:** Vite + React Router v7 + `vite-react-ssg` + MDX + Shiki + Pagefind + full Sandpack + full tweaks panel
- **Dogfood:** pragmatic — Motif primitives for everything visibly styled
- **Deps:** strict pin to `@motif-js/*@1.1.1` from npm
- **Domain:** usemotif.dev (placeholder)
- **Location:** `apps/docs/`

---

### Phase 0 — scaffold (2026-04-30, complete)

`apps/docs/` is live. Both routes prerender to static HTML, with compile-time CSS extraction working end-to-end against npm-published `@motif-js/*@1.1.2`.

- [x] Create `apps/docs/` directory in the workspace
- [x] Write `apps/docs/package.json` with pinned `@motif-js/*@1.1.2` deps
- [x] Write `apps/docs/vite.config.ts` (MDX + RR7 + motifExtract pipeline)
- [x] Write `apps/docs/tsconfig.json`
- [x] `apps/docs/` is auto-included via the root workspaces `apps/*` glob
- [x] Port `~/Downloads/Motif Design System/colors_and_type.css` to `app/theme/motif.ts` as `paperTheme` + `inkTheme`
- [x] Load Fraunces, Inter, JetBrains Mono via the `links` export in `root.tsx`
- [x] Wire React Router v7 framework mode — two routes (`/`, `/docs/introduction`)
- [x] Wire MDX provider mapping `p` → `Paragraph`, `h1`-`h4` → `Heading`, etc.
- [x] Mount `<MotifReset />` at the root
- [x] `yarn build` produces static SSG build (`build/client/index.html` + `build/client/docs/introduction/index.html`)
- [x] Compile-time CSS extraction working (`build/client/assets/root-*.css` contains the extracted atomic classes; `<link>` tag auto-injected by RR7's `<Links />`)
- [x] Typecheck + format + lint clean

**Two pivots during execution:**

1. The DOC_PLAN had locked `vite-react-ssg` for SSG, but it only supports React Router v6. Switched to RR7's built-in framework-mode SSG (`@react-router/dev` + `react-router.config.ts` with `prerender: [...]`) — vite-react-ssg's own README recommends this for RR7 users. DOC_PLAN updated to reflect.
2. Issue #5 (compiler-swc no-op CSS emit) was confirmed and **fixed mid-phase** — `@motif-js/compiler-swc@1.1.2` adds virtual-module hooks (`resolveId` / `load` / `generateBundle`) so consumers `import 'virtual:motif-extract.css'` and the bundler chunks the extracted CSS into a real asset. All 13 packages synced to v1.1.2 per the uniform-version rule. Issue closed.

## Next up — Phase 1: chrome (3–5 days)

Goal: the structural layout matches the reference design.

- [ ] `TopNav` — lockup, version pill, Cmd-K search button (no search yet), nav links, theme toggle
- [ ] `Sidebar` — grouped sections, active link highlight, collapses to a sheet on `< $bp.md`
- [ ] `Article` shell — three-column layout at `≥ $bp.lg`
- [ ] `OnThisPage` — TOC with scrollspy
- [ ] `Footer` — minimal lockup + meta
- [ ] Cmd-K modal — uses `@motif-js/headless` Modal + Combobox (empty state)
- [ ] Theme toggle — flips light/dark via active theme

**Phase 1 done when:** the introduction page can be navigated to from the home page via the nav, sidebar shows on desktop and collapses on mobile, OnThisPage scrollspy works, Cmd-K opens an empty modal.

---

## Open issues / blockers

_None._ Issue #5 (compiler-swc CSS emit) closed in this session — see Phase 0 notes.

---

## Session log

Each working session adds an entry below. Format: date + scope + outcome.

### 2026-04-30 — Phase −1 + Phase 0 + issue #5 fix

One long sitting:

- **Phase −1 stabilization** — audited, deleted 3 stub packages, added `createTheme`, fixed `@motif-js/react` cross-platform routing, manually bumped versions (changesets-cli linked-mode bug), patched `scripts/publish.mjs` to rewrite `workspace:*`. Published v1.1.1.
- **Phase 0 scaffold** — `apps/docs/` is live. Pivoted from `vite-react-ssg` to RR7's framework-mode SSG mid-phase.
- **Issue #5 fix** — `@motif-js/compiler-swc@1.1.2` wires virtual-module hooks; all 13 packages synced and republished. `apps/docs` upgraded to 1.1.2 with `import 'virtual:motif-extract.css'`. Compile-time CSS extraction confirmed working end-to-end against npm.

---

## How to pick this up cold

If you're starting a session with no prior context:

1. Read `DOC_PLAN.md` end-to-end. That's the spec.
2. Read this file's "Current state" + "Next up" sections.
3. Read `LAST_MEMORY.md` for the previous session's hand-off — what was just done, what to verify before continuing, where to start.
4. Check open issues — esp. #5 — to know what's flagged.
5. Verify versions on npm match `apps/docs/package.json` pins:
   ```sh
   for pkg in core react react-web react-native compiler-swc tokens headless icons reset; do
     echo -n "@motif-js/$pkg: "; npm view @motif-js/$pkg version
   done
   ```
   Expect `1.1.1` across the board (or whatever the docs app pins). If not, a publish has happened and `apps/docs/package.json` may need a bump.
6. Check that `~/Downloads/Motif Design System/` and `~/Downloads/Motif Documentation/` are still in place — they're the brand inputs, not in the repo.
7. Pick the next unchecked task in the current phase. If a phase has no unchecked tasks, you're between phases — start the next one.
