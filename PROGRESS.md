# Motif docs site — progress

> Cross-session progress tracker for the docs site at `apps/docs/`. The plan lives in [`DOC_PLAN.md`](./DOC_PLAN.md) — this file is the running log of what's been done, what's next, and what's blocked. The most recent session's hand-off note is [`LAST_MEMORY.md`](./LAST_MEMORY.md).
>
> **For agents picking this up cold:** read `DOC_PLAN.md` first (the spec), then this file (cross-session state), then `LAST_MEMORY.md` (where the last session stopped and what to do next).

---

## Current state

**Phase:** Phase 1 complete; Phase 2 (content components) in progress.
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

### Phase 1 — chrome (2026-04-30, complete)

The structural layout is in. Both routes prerender with the chrome
attached and the dev server boots clean. Visual polish is owed to the
next session's eye.

- [x] `TopNav` — lockup, version pill, ⌘K search trigger (wide on desktop, icon on mobile), nav links, theme toggle, GitHub icon, mobile hamburger. Sticky with hairline-on-scroll via the Motif `transition` prop.
- [x] `Sidebar` — grouped sections (Getting started / Concepts / API / Recipes), active link highlight via `useLocation`. Mobile collapses to a `Dialog` sheet via `@motif-js/headless`.
- [x] `Article` shell — `DocsLayout` three-column flex (sidebar | article | OnThisPage) with breakpoint gates at `$bp.md` (sidebar) and `$bp.lg` (OnThisPage).
- [x] `OnThisPage` — h2/h3 scrollspy. Reads headings out of `<article>` post-mount; falls back to nothing on SSR (expected — the items hydrate on the client).
- [x] `Footer` — lockup + 3 link columns + bottom meta row, `Wrap` layout because Motif's Box style props don't include `gridTemplateColumns`.
- [x] Cmd-K modal — `@motif-js/headless` `CommandPalette.Root` + `Dialog.Content`, empty `CommandPalette.List` with placeholder copy. Opens via the search button or the `⌘K` / `Ctrl+K` shortcut registered at the `ChromeShell` level.
- [x] Theme toggle — flips `paperTheme` ↔ `inkTheme`, persists in `localStorage` (`motif:docs:theme`), syncs `document.documentElement.dataset.theme` so the bare-html background matches.
- [x] Minimal `/` home — hero + "Read the docs" + "View on GitHub" CTAs to validate the nav→intro flow.

**Phase-1 done criteria met:** intro page reachable from home via the nav, sidebar shows on desktop and collapses to a sheet on mobile, OnThisPage scrollspy wired, ⌘K opens an empty modal.

**Departures from the original plan:**

1. **MdxComponents wrapper stripped.** `DocsLayout` now owns the prose column; the MDX provider is just the element-to-primitive map.
2. **Style-prop gaps surfaced.** Motif's typed surface doesn't include `gridTemplateColumns`, `transitionProperty`, or HTML-element-specific attrs (`type` on buttons, `href` on `as="a"`). Worked around with `transition` (motion prop), flex layouts, and small `as any` HTML-attr passthroughs with comments. Worth revisiting whether to extend Motif's prop schema before Phase 2 instead of duplicating the pattern.
3. **`useThemeSetting` not used.** It's exported from `@motif-js/react-web` but not from the canonical `@motif-js/react` entry, and our themes are named `paper`/`ink` (not `light`/`dark`). Wrote a small local `useThemeMode()` instead. Follow-up: re-export `useThemeSetting` from `@motif-js/react` in a future v1.x.

## Next up — Phase 2: content components (3–5 days)

Goal: MDX prose looks finished.

- [ ] `CodeBlock` — Shiki at build time, brand-themed colors. Tabs (web/native), copy button, optional line highlighting, optional filename header.
- [ ] `Callout` — info / tip / warning / danger variants. Hairline left border in the variant color, faint tinted background.
- [ ] `Card` — hairline border, optional accent corner. Used on the home page card grid in Phase 3.
- [ ] Eyebrow / lede / meta patterns for article headers.
- [ ] Extend `mdxComponents` — `pre` → `CodeBlock`, lists/tables to brand-styled equivalents. Keep the MDX-element-to-primitive map flat.

**Phase 2 done when:** a fully MDX-authored article renders identically to a hand-coded equivalent built with Motif primitives.

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

### 2026-04-30 — Phase 1 chrome

- Built the chrome (TopNav + Sidebar + SidebarSheet + Footer + OnThisPage + DocsLayout + CmdK + ThemeToggle + Lockup), `useThemeMode` state, minimal `/` home page.
- Wired ⌘K kbd shortcut + sidebar sheet trigger at `ChromeShell` level in `root.tsx`.
- Stripped the MDX provider's prose-column wrapper; `DocsLayout` owns the column now.
- Surfaced gaps in Motif's typed style-prop surface (no `gridTemplateColumns`, no element-specific HTML attrs); worked around locally — see "Departures" above for the follow-ups.
- Build green, typecheck clean, lint 0 errors. Visual pass deferred to next session.

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
