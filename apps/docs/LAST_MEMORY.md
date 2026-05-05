# motif-js docs site — LAST_MEMORY

> Single-paragraph summary of the most recent session, plus a precise pickup-point for the next one. Replace this file's body wholesale at the end of every session — it is not a log; the log lives in [PROGRESS.md](./PROGRESS.md). Always pair with [PLAN.md](./PLAN.md).

---

## Session: 2026-05-05 — Phase 1 + docforge#4

### What was done

Phase 1 landed end-to-end. Filed [docforge#4](https://github.com/foo-stack/docforge/issues/4) requesting `defineConfig({ theme })` so the local theme could be wired without yarn-resolution gymnastics; upstream shipped `1.1.2` same-session resolving it. Bumped `apps/docs` and dropped the temporary `@vorge/theme-default` dep + the `portal:./apps/docs/theme` resolution. Built `apps/docs/theme/` with: `tokens.ts` (motif-js `createTheme` calls — full warm/editorial palette: paper/ink/stone/terracotta + earthy semantics + space/radii/sizes/fontSizes/fontWeights/fontFamilies/lineHeights/letterSpacings/shadows/durations/easings); `theme.css` (verbatim port of `~/Downloads/Motif Design System/colors_and_type.css` — design's bare-name vars + base element styles); `layouts.tsx` (eight stubs — doc, blank, marketing, blog-post, changelog, api, guide, 404 — each wrapped in a shared `ThemeShell` that emits the motif CSS-vars `<style>` block via `themesToCssBlock([lightTheme, darkTheme])`); `index.tsx` (assembles `ThemeLayouts`-shaped exports, default `{ layouts }`). Wrote `plugins/fonts.ts` using vorge's `transformHtml` lifecycle to inject Google Fonts preconnect + stylesheet for Fraunces / Inter / JetBrains Mono. Added `theme: './theme'` + `plugins: [fonts()]` to `vorge.config.ts`. Updated `content/index.mdx` to dogfood `<Box bg="$bg.base" borderRadius="$radii.md" p="$space.6">` from `@motif-js/react` — SSR'd as `<div style="background-color:var(--colors-bg-base);…">`, both theme variants emitted, both flip with `data-theme` attr. Updated `apps/docs/tsconfig.json` `types` to include `vite/client` so the `import './theme.css'` side-effect import typechecks. Hoisted the `dangerouslySetInnerHTML` object literal in `ThemeShell` to silence `react-perf/jsx-no-new-object-as-prop`. Added `eslint-disable-next-line import/no-unassigned-import` for the CSS side-effect import. All gates: `lint` 0 errors / `format:check` clean / `typecheck` exit 0 / `build` exit 0. Shiki theme generation deferred to Phase 7 polish per PLAN risk #3 (ships with `github-light`/`github-dark` defaults).

### Files touched this session

- `apps/docs/theme/package.json` — created (private `@motif-js/docs-theme`, ~/Documents/GitHub/foo-stack/motif-js/apps/docs/theme/ is a directory, not a workspace; deps listed for documentation but resolved through `apps/docs`)
- `apps/docs/theme/tsconfig.json` — created (extends `@motif-js/tsconfig/app.json`, types `vite/client` + `react`)
- `apps/docs/theme/tokens.ts` — created (~280 lines, two `createTheme` calls)
- `apps/docs/theme/theme.css` — created (~360 lines, verbatim port of design CSS minus the @import)
- `apps/docs/theme/layouts.tsx` — created
- `apps/docs/theme/index.tsx` — created
- `apps/docs/plugins/fonts.ts` — created
- `apps/docs/vorge.config.ts` — added `theme: './theme'`, `plugins: [fonts()]`
- `apps/docs/package.json` — bumped to `^1.1.2`, dropped `@vorge/theme-default`, added `@motif-js/{core,react,tokens}` workspace deps
- `apps/docs/tsconfig.json` — added `vite/client` to `types`
- `apps/docs/content/index.mdx` — added `<Box>` dogfood
- `apps/docs/PROGRESS.md` — Phase 1 marked done; decisions log extended with 1.1.2 bump, two-layer CSS strategy, deferred Shiki, dev-mode `transformHtml` gap
- `apps/docs/LAST_MEMORY.md` — replaced (this file)
- `package.json` (root) — removed `portal:./apps/docs/theme` resolution (no longer needed)
- `yarn.lock` — regenerated

### Open questions / known gaps carried forward

1. **Plan asked to "extend `@motif-js/tokens`'s `lightTheme`/`darkTheme`"** — I redefined instead because the docs palette (paper/ink/terracotta) shares no values with motif's default gray/blue palette. Future refactor could rebind `surface.base` etc. on top of the existing shape; for now the docs theme is its own tree. Not blocking.
2. **`vorge.transformHtml` runs only at SSG (build) time, not in dev.** Confirmed in `@vorge/core/src/ssg/run.ts:127`. Dev fonts fall back to system. Worth a future docforge#5 ("transformHtml in dev shell") but not blocking.
3. **`"use client"` directive warnings** during SSR build of `@motif-js/react` and `@motif-js/react-web`. Cosmetic — Vite ignores the directive when bundling for non-RSC. Could be silenced upstream by stripping the directive from the dist output, or fixed at the consumer with a Vite `onwarn` filter. Not blocking.
4. **Shiki themes deferred** to Phase 7 polish. Code blocks currently use `github-light`/`github-dark`.

### What to do next session

**Start Phase 2** — site chrome. Open [PLAN.md](./PLAN.md) "Phase 2" section. Build, in roughly this order:

1. **Read** `~/Downloads/Motif Documentation/index.html` + `~/Downloads/Motif Documentation/site.css` to capture the production-fidelity chrome (TopNav with version pill, Sidebar with active-state pill + badges, OnThisPage with scrollspy + edit-this-page link, PageNav prev/next cards, Footer 3-col grid).
2. **TopNav** first — sticky, opaque-on-scroll (border-bottom appears once `scrollY > 4`), `saturate(140%) blur(10px)` backdrop, 3-col grid (lockup+version | search | nav links + theme + GitHub), 1440px max-width. Pulls in motif-js's `styled()` and primitives.
3. **VersionPill** as a sub-component (dropdown menu, click-outside dismissal — use motif's `Overlay`/`FocusScope`/`Hide` primitives if shape fits, otherwise hand-roll).
4. **SearchTrigger** as a button styled like a search input — opens `SearchModal` island in Phase 7; for now wires only the kbd handler.
5. **Sidebar / OnThisPage / PageNav** — wrap `@vorge/core/primitives`'s `Sidebar` / `TOC` / `Pager` with our visual style.
6. **Footer + ThemeToggle** — `ThemeToggle` reads `document.documentElement.dataset.theme` (no flash, since vorge core handles the pre-paint script in 1.1.2).
7. **DocLayout** — composes the above into a 3-col grid (Sidebar | Article | TOC), 1440px max-width, 56px gaps, 32px outer padding. Replace the stub `DocLayout` in `theme/layouts.tsx`.
8. **Verification** — empty page renders fully-shaped chrome; nav border appears on scroll past 4px; theme toggle persists; sidebar active state tracks the route.

End with a green build + lint/format/typecheck clean and a commit covering Phase 2.

### Watch-outs for Phase 2

- The motif-js `styled()` factory is the right primitive for chrome components. Verify SSR-safety as you go (Phase 1 proved `Box` SSRs cleanly; `styled` should follow). Keep an eye on the `"use client"` warnings — if any motif primitive _does_ need to be client-only, gate it behind `<Island>` (vorge primitive) rather than fighting it.
- Vorge's `@vorge/core/primitives` exports headless `Sidebar`, `TOC`, `Pager`, `Breadcrumbs`, `SearchTrigger`, `Link` — plan to wrap these, not reimplement. Look at `@vorge/theme-default/src/components/` for shape references but DO NOT import from theme-default — it's gone from our deps.
- The version-pill dropdown is decorative for v1 (per PLAN locked decision) — three example entries that navigate nowhere. Add a small comment.
- `data-theme` on `<html>` is the source of truth (vorge pre-paint script writes it). The `ThemeShell` wrapper emits motif's CSS-var blocks scoped to `[data-theme="<name>"]` — chrome CSS should also use the design's bare-name vars (`--bg`, `--fg`, `--accent`) which are scoped at `[data-theme="light"]` / `[data-theme="dark"]` in `theme.css`. Both naming schemes work; pick the bare names for chrome (they're shorter and match the reference HTML's CSS).
