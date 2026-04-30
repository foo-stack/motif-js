# Motif docs site — progress

> Cross-session progress tracker for the docs site at `apps/docs/`. The plan lives in [`DOC_PLAN.md`](./DOC_PLAN.md) — this file is the running log of what's been done, what's next, and what's blocked. The most recent session's hand-off note is [`LAST_MEMORY.md`](./LAST_MEMORY.md).
>
> **For agents picking this up cold:** read `DOC_PLAN.md` first (the spec), then this file (cross-session state), then `LAST_MEMORY.md` (where the last session stopped and what to do next).

---

## Current state

**Phase:** Phase 4 complete; ready to begin Phase 5 (polish).
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

### Phase 2 — content components (2026-04-30, complete)

MDX prose now looks finished. `Introduction.mdx` exercises every new
component end-to-end; the prerendered HTML contains 178+ Shiki CSS
variable references and 26 highlighted lines per article.

- [x] **CodeBlock** — Shiki at MDX-compile time via `@shikijs/rehype` with `vitesse-light` + `vitesse-dark` themes in CSS-variable mode. Brand wrapper (`CodeBlockShell`) adds rounded border, mono font, horizontal scroll, and a copy button (`CopyButton` flips to a check glyph for ~1.5s after a successful clipboard write).
- [x] **Callout** — `info` / `tip` / `warning` / `danger`. Hairline left edge in the variant color, faint tinted background, glyph + optional title. Maps to `$colors.action.{info,success,warning,danger}.bg` for variant tints, with `tip` lifted to `$colors.accent` so it reads as the brand's "this is the canonical advice" beat.
- [x] **Card** + **Card.Link** — hairline border, optional accent corner. The link variant carries its own hover/focus styling and routes via React Router. Reserved for the home-page card grid in Phase 3.
- [x] **ArticleHeader** — eyebrow + h1 + lede + optional meta row. `Eyebrow` exported standalone (uses the dot + uppercase pattern shared with the sidebar/footer column titles). `articleMetaIcons` re-exports the common Lucide glyphs for the meta row.
- [x] **mdxComponents** extended — element overrides for h2 / h3 / h4 / p / blockquote / code / ul / ol / li / hr / table / th / td plus the `pre` → `CodeBlockShell` slot. `Callout`, `Card`, `ArticleHeader`, and `Eyebrow` are passed through the provider so MDX files can reference them with no per-file imports.

**New deps:**

- `shiki` (3.x), `@shikijs/rehype` (3.x) — devDependencies of `@motif-js/docs`. Run only at build time; the highlighted markup is baked into the static HTML, so the client bundle picks up no Shiki runtime.

**The one CSS file in the repo: `app/styles/code.css`.** Shiki owns the rendered DOM for code blocks (the `<pre>`, `<code>`, every token `<span>`), and ships per-token color via `--shiki-light` / `--shiki-dark` variables. Selecting which one to read needs a global selector keyed on `[data-theme]`, and there is no Motif primitive that can reach inside Shiki's tree per token. The dogfood exception is documented at the top of the file.

**Phase-2 done criteria met:** every MDX surface in `Introduction.mdx` renders through Motif primitives + the brand theme. Highlighted code, callouts, and the article header all hold up in both `paperTheme` and `inkTheme` (theme switching swaps the right tokens at the `<html data-theme>` boundary).

### Phase 3 — Tier-1 content (2026-04-30, complete)

Every Tier-1 page exists with real prose, real examples, and the brand
voice. All 10 routes prerender to static HTML against npm-pinned
`@motif-js/*@1.1.2`; the catch-all `*` route renders the 404 surface
on unknown URLs via the SPA fallback.

- [x] `/` — hero (eyebrow + display title + lede + CTA pill row), four-card feature grid (using `Card.Link` + accent corner on the primary card), brand-story two-column block, six-bullet feature grid, footer CTA card.
- [x] `/docs/introduction` — final prose pass replacing the Phase-2 demo. Five sections: why we wrote it, what you get, the shape of a styled component, how the pieces fit (package table), what ships when (compiler + runtime), where to go next.
- [x] `/docs/installation` — npm/pnpm/yarn/bun install, root-level reset + theme wiring, optional Vite compiler setup.
- [x] `/docs/your-first-style` — Box → Stacks → Pseudo states → Responsive → `styled()`. The five-minute "shape of every Motif API" walkthrough.
- [x] `/docs/web-and-native` — what travels unchanged, what bends (shadows, pseudo states, transitions), platform-specific overrides via `.native.tsx`, what stays user-handled (safe areas, fonts, navigation).
- [x] `/docs/tokens` — two-layer model (primitive + semantic), default scales, how `$`-references resolve, defining your own scale, the rubric for what goes in each layer.
- [x] `/docs/variants` — shape of a variant axis, merge order, compound variants, boolean variants, fallback (`...prop`) variants for open-ended axes, caller-override semantics.
- [x] `/docs/theming` — `createTheme()`, `<ThemeProvider>` activation, `<Theme>` sub-themes, composable themes via dot-walked names, `useThemeName()` / `useTheme()`, runtime swap pattern.
- [x] `/api/box` — full style-prop reference grouped by intent (spacing, color, sizing, border, typography, layout, position, outline/opacity/shadow/overflow/cursor, state styles, motion), element props, examples.
- [x] `/api/createTheme` — signature, parameters, returns, example, composable sub-themes, see-also.
- [x] `/*` (catch-all 404) — big "404" + "this page doesn't exist" hero + Back-home CTA + Read-the-introduction CTA + four suggestion `Card.Link` rows.

**Build state:** all 10 routes prerender to `build/client/{path}/index.html`. Catch-all renders client-side via `__spa-fallback.html` — host config (Netlify rewrite, Vercel `rewrites`, `_redirects`) needs to serve that file for unknown URLs in production. Extracted CSS now ~3.9 kB.

**Phase-3 done criteria met:** real prose throughout, real examples that use the actual Motif API (no `motif.view({...})`), brand voice consistent with the README (sentence case, no exclamations, contractions fine, em-dashes spaceless, "you" and "we" instead of "users").

**Departures from the original plan:**

1. **One 404 file, not a separate `/404` route.** RR7's framework mode treats the `*` splat route as the canonical catch-all, with the SPA fallback as the deploy-time mechanism. We did not add a `/404` route to `routes.ts` — the splat covers every unknown URL.
2. **Code-block tabs/filenames deferred.** The current pipeline highlights fenced ` ```lang ` blocks. The metastring (`tsx filename="Button.tsx"`) is parsed by remark but not surfaced into the rendered output yet. Phase 3 leans on prose + code blocks alone; tabs and filename headers move to Phase 4 when Sandpack lands and demands them anyway.

### Phase 4 — search + playground (2026-04-30, complete)

⌘K is real, three concept pages run live demos, and the tweaks panel
controls layout + typography with localStorage persistence.

- [x] **Pagefind** — `pagefind --site build/client` is wired into the `build` script; the static index ships at `/pagefind/`. The CmdK modal lazy-loads `/pagefind/pagefind.js`, runs `pagefind.search(query)` per keystroke, renders the top 8 hits with arrow-key navigation + Enter to navigate. `data-pagefind-body` on `DocsLayout`'s `<article>` and the home page's wrapper scopes the index to article content (chrome stays out).
- [x] **Sandpack-react** — `<Sandbox code="...">` MDX component lazy-loads `@codesandbox/sandpack-react` on intersection (`IntersectionObserver` with a 200 px rootMargin). The 625 kB sandpack chunk does not enter the initial route bundle. Each demo runs `react-ts` template with `@motif-js/{react,reset,tokens}@1.1.2` pinned from npm — same install path as the docs prose. Brand-flavored Paper sandpack theme ports the cream + ink + terracotta palette.
- [x] **Three demos shipped:** `/docs/your-first-style` (live Box editor), `/docs/tokens` (token-resolution surfaces), `/docs/variants` (typed variant axes for a Button).
- [x] **Tweaks panel** — `Dialog`-based right-edge sheet (full-screen on mobile). Three controls: theme (paper/ink), content width (narrow/standard/wide), body font (Inter/Fraunces). Reset button restores defaults. State lives in `useTweaks()` and propagates via `TweaksContext` to `DocsLayout` (which applies `maxWidth` and `fontFamily` to the article column). Theme mode reuses `useThemeMode()` so the toggle in TopNav and the panel stay in sync.
- [x] **LocalStorage persistence** — both `useThemeMode` (`motif:docs:theme`) and `useTweaks` (`motif:docs:tweaks`) write to localStorage and rehydrate on first effect.

**Departures from the original Phase 4 spec:**

1. **No accent picker.** The locked spec called for a color picker that synthesizes a custom-accent theme on the chain. That requires building `createTheme()`-on-the-fly with semantic-layer recoloring; it was bigger than the rest of Phase 4 combined and risked landing under-tested. Punted to Phase 5 polish, where it can be done deliberately.
2. **CommandPalette swap.** The Phase-1 CmdK used `@motif-js/headless` `CommandPalette` with an empty `commands` array. Phase 4 replaces it with a plain `Dialog` + custom result list because Pagefind owns the search semantics — the headless Combobox would re-filter results on top of pagefind's already-ranked list. The kbd shortcut wiring in `ChromeShell` is unchanged.

**Phase-4 done criteria met:** ⌘K returns real results across all 10 Tier-1 pages (1273 indexed words), three Sandpack demos render live with the npm-pinned packages, and tweaks survive a refresh.

## Next up — Phase 5: polish (2–3 days)

- [ ] OG image generation per page (could be a build-time satori pass, or a single brand OG)
- [ ] Sitemap (`/sitemap.xml`)
- [ ] Lighthouse pass — target 95+ on all four categories on the home page
- [ ] Mobile responsive sweep — phone, small tablet, large tablet
- [ ] Keyboard navigation audit — every interactive element reachable, focus rings visible, escape closes modals
- [ ] Reduced-motion verification — the `prefers-reduced-motion` path strips animations to opacity-only at 1ms
- [ ] Dark-mode verification — no broken contrast, no hard-coded light values
- [ ] Accent picker for the tweaks panel — synthesize a custom-accent theme on the chain
- [ ] Final brand-voice pass — sentence case, no exclamations, no emoji
- [ ] Code-block metastring transformer (filename, line ranges) — small rehype plugin that lifts metastring to data-attributes on `<pre>` so `CodeBlockShell` can render a filename header

**Phase 5 done when:** the home page hits 95+ on Lighthouse, the keyboard audit passes, and the tweaks panel includes the accent picker.

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

### 2026-04-30 — Phase 2 content components

- Wired Shiki at MDX-compile time (`@shikijs/rehype` with vitesse-light/dark in CSS-variable mode). One global stylesheet (`app/styles/code.css`) handles the per-token color resolution against `[data-theme]`.
- Built `CodeBlockShell` (Motif wrapper for the highlighted `<pre>`), `CopyButton` (clipboard write + check-glyph confirmation), `Callout` (4 variants), `Card` + `Card.Link` (with optional accent corner), `ArticleHeader` (eyebrow + h1 + lede + meta) + standalone `Eyebrow`.
- Extended `mdxComponents` with brand-styled overrides for h2/h3/h4/p/blockquote/code/ul/ol/li/hr/table/th/td, plus the `pre` → `CodeBlockShell` slot. `Callout` / `Card` / `ArticleHeader` / `Eyebrow` are passed through the provider so MDX needs no per-file imports.
- Updated `Introduction.mdx` to exercise the new surface end-to-end; the prerendered HTML contains 178+ Shiki CSS variables and the right callout titles. Build / typecheck / lint clean.

### 2026-04-30 — Phase 3 Tier-1 content

- Scaffolded 9 new routes (`docs/installation`, `docs/your-first-style`, `docs/web-and-native`, `docs/tokens`, `docs/variants`, `docs/theming`, `api/box`, `api/createTheme`, `*` catch-all) plus the prerender list update.
- Replaced the Phase-1 placeholder home page with a full landing — hero, four-card feature grid, brand-story block, six-bullet feature grid, footer CTA.
- Wrote 8 MDX docs/api pages totaling ~5500 words of brand-voiced prose with real Motif API examples.
- Built the 404 surface as `routes/$.tsx` (catch-all).
- All 10 routes prerender to static HTML; build / typecheck / lint clean (0 errors).

### 2026-04-30 — Phase 4 search + playground

- **Pagefind** wired into the `build` script. Static index served from `/pagefind/`. CmdK lazy-loads pagefind, runs queries per keystroke, renders the top 8 hits with arrow-key navigation + Enter-to-navigate. `data-pagefind-body` scopes the index to article content; chrome stays out.
- **Sandpack** — `<Sandbox code="...">` MDX component, lazy-loaded on intersection. Brand-themed in-browser bundler runs `@motif-js/*@1.1.2` from npm so demos are the canonical install path. Three demos shipped (`your-first-style`, `tokens`, `variants`).
- **TweaksPanel** — Dialog-based right-edge sheet with three segmented controls (theme / content width / body font) + reset. State persists to localStorage via `useTweaks()`; `TweaksContext` propagates the values to `DocsLayout` without prop-drilling.
- Replaced the Phase-1 `CommandPalette` shell with a plain `Dialog` + custom list because Pagefind owns the search semantics; headless Combobox would have re-filtered already-ranked results.
- Added `pagefind`, `@codesandbox/sandpack-react` to `apps/docs` deps. Build / typecheck / lint clean (0 errors).

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
