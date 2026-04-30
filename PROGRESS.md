# Motif docs site — progress

> Cross-session progress tracker for the docs site at `apps/docs/`. The plan lives in [`DOC_PLAN.md`](./DOC_PLAN.md) — this file is the running log of what's been done, what's next, and what's blocked.
>
> **For agents picking this up cold:** read `DOC_PLAN.md` first, then this file. The plan is the spec; this file is the state.

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

## Next up — Phase 0: scaffold

Single sitting target: ~1–2 days.

- [ ] Create `apps/docs/` directory in the workspace
- [ ] Write `apps/docs/package.json` with pinned `@motif-js/*@1.1.1` deps
- [ ] Write `apps/docs/vite.config.ts` with `motifExtract.vite()`, `react()`, MDX, SSG plugins
- [ ] Write `apps/docs/tsconfig.json`
- [ ] Add `apps/docs/` to root workspace if `packages/*`/`apps/*` glob doesn't already include it (it does — verified)
- [ ] Port `~/Downloads/Motif Design System/colors_and_type.css` to `apps/docs/theme/motif.ts` as a real `createTheme()` declaration. Light + dark sub-themes.
- [ ] Load Fraunces, Inter, JetBrains Mono via Google Fonts (`@import` in a head-injected stylesheet, or via the reset)
- [ ] Wire React Router v7 with one route: `/docs/introduction.mdx`
- [ ] Wire MDX provider mapping `p` → `Paragraph`, `h1`-`h4` → `Heading`, `code` → `Code`, etc.
- [ ] Mount `<MotifReset />` at the root
- [ ] Verify `npm run build` produces a static SSG build with no errors
- [ ] Verify the introduction page loads with correct fonts, colors, spacing in `npm run preview`

**Phase 0 done when:** the intro page loads with the brand theme applied, no inline `style=`, no `className=` other than what Motif emits.

---

## Open issues / blockers

- **#5 — compiler-swc: no extracted CSS file in Vite build output.** Doesn't block; investigate during scaffold or chrome phase.

---

## Session log

Each working session adds an entry below. Format: date + scope + outcome.

### 2026-04-30 — Phase −1 + planning

Phase −1 stabilization cut delivered (see Done section). Plan locked, this file initialized. Ready for Phase 0 in a fresh session.

---

## How to pick this up cold

If you're starting a session with no prior context:

1. Read `DOC_PLAN.md` end-to-end. That's the spec.
2. Read this file's "Current state" + "Next up" sections.
3. Check open issues — esp. #5 — to know what's flagged.
4. Verify versions on npm match `apps/docs/package.json` pins:
   ```sh
   for pkg in core react react-web react-native compiler-swc tokens headless icons reset; do
     echo -n "@motif-js/$pkg: "; npm view @motif-js/$pkg version
   done
   ```
   Expect `1.1.1` across the board (or whatever the docs app pins). If not, a publish has happened and `apps/docs/package.json` may need a bump.
5. Check the gitignored `~/Downloads/Motif Design System/` and `~/Downloads/Motif Documentation/` are still in place — they're the brand inputs, not in the repo.
6. Pick the next unchecked task in the current phase. If a phase has no unchecked tasks, you're between phases — start the next one.
