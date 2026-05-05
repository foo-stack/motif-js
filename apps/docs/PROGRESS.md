# motif-js docs site — PROGRESS

Living log of what's done, what's in flight, and what's blocked. Update at the end of every session. Read alongside [PLAN.md](./PLAN.md) and [LAST_MEMORY.md](./LAST_MEMORY.md).

Status legend: `[ ]` not started · `[~]` in progress · `[x]` done · `[!]` blocked · `[/]` skipped (with reason)

---

## Phase 0 — Scaffold + wiring

Status: **done** (2026-05-05)

- [x] `apps/docs/package.json` (private `@motif-js/docs`) with vorge `^1.0.0` from npm
- [x] `apps/docs/tsconfig.json` extending workspace base (`@motif-js/tsconfig/app.json`)
- [x] Minimal `vorge.config.ts` — title, description, `server.port: 4321`
- [x] `apps/docs/content/index.mdx` (hello world)
- [x] `yarn dev` serves on `http://localhost:4321`
- [x] `yarn build` emits `dist/index.html`
- [x] Turbo pipeline already satisfies plan constraints (existing `dev`/`build` config — no change needed)
- [x] `.vorge/` added to `.gitignore`, `.oxfmtignore`, `.oxlintrc.json` ignorePatterns

Verification: `yarn workspace @motif-js/docs build` exits 0; SSR + client bundles compile; `dist/index.html` renders the hello-world content under vorge's default theme. `yarn lint` reports 0 errors; `yarn format:check` clean; `yarn workspace @motif-js/docs typecheck` exits 0.

---

## Phase 1 — Tokens + theme + fonts

Status: **done** (2026-05-05)

- [x] `theme/tokens.ts` ported from `colors_and_type.css` — primitives (paper/ink/stone/terracotta/moss/ochre/brick/slate) + semantic (bg/surface/fg/line/accent/status/selection/focus) + space/radii/sizes/fontSizes/fontWeights/fontFamilies/lineHeights/letterSpacings/shadows/durations/easings; light + dark via `createTheme`
- [x] `theme/index.tsx` exports `ThemeLayouts`-shaped `layouts` (doc, blank, marketing, blog-post, changelog, api, guide, 404 — all stubbed via shared `ThemeShell` wrapper that emits the motif CSS-vars `<style>` block once)
- [x] vorge wired via `theme: './theme'` in `vorge.config.ts` (1.1.2 config option from [docforge#4](https://github.com/foo-stack/docforge/issues/4))
- [x] Google Fonts (Fraunces / Inter / JetBrains Mono) loaded via `apps/docs/plugins/fonts.ts` using vorge's `transformHtml` lifecycle (build-time only; see open question below)
- [/] Two Shiki themes generated + wired — **deferred per PLAN risk #3**; ships with `github-light` / `github-dark` defaults until Phase 7 polish
- [x] motif-js `createTheme` import is real — `theme/tokens.ts` imports `createTheme` from `@motif-js/react`; `theme/layouts.tsx` imports `themesToCssBlock` from `@motif-js/core`; `content/index.mdx` imports `Box` from `@motif-js/react` and renders `<Box bg="$bg.base" …>`, SSR'd as `<div style="background-color:var(--colors-bg-base);…">`

Verification: build emits `dist/index.html` with both `[data-theme="light"]` (cream `--colors-bg-base: #FBF7F2`) and `[data-theme="dark"]` (ink `--colors-bg-base: #13110E`) blocks; pre-paint script + theme toggle still flip correctly; `Box` SSR'd in body uses `var(--colors-bg-base)` resolving against the active `data-theme`. `lint` 0 errors / `format:check` clean / `typecheck` exit 0 / `build` exit 0.

---

## Phase 2 — Site chrome

Status: **done** (2026-05-05)

- [x] `chrome/TopNav.tsx` — sticky header, `.nav--scrolled` border once `window.scrollY > 4`, 3-col grid, lockup + version pill | search trigger | nav links + theme toggle + GitHub
- [x] `chrome/VersionPill.tsx` — three-version decorative dropdown, click-outside dismissal via `mousedown` listener, `aria-expanded` / `aria-haspopup`
- [x] `chrome/SearchTrigger.tsx` — input-shaped button, ⌘K kbd hint; opens nothing in Phase 2 (modal lands Phase 7)
- [x] `chrome/Sidebar.tsx` — consumes `useSidebar()`, renders sections (`.side-section` + `.side-title` + `.side-list`), wraps each item with `@vorge/core/primitives` `Link` so `activeClassName="side-link--active"` lights up the current page; supports nested groups + `badge` field
- [x] `chrome/OnThisPage.tsx` — consumes `useTOC()` (vorge filters to depth 2-3), renders `.toc` + `.toc-link`s with `data-depth` for indent styling; optional edit-this-page link in `.toc__foot`
- [x] `chrome/PageNav.tsx` — flattens sidebar links via `useSidebar()` + `useVorge().manifest`, finds prev/next neighbours of `usePage().url`, renders `.pagenav-link--prev` / `.pagenav-link--next` cards
- [x] `chrome/Footer.tsx` — `.footer__inner` 1.5fr/1fr/1fr/1fr grid (brand + 3 cols), `.footer__bottom` MIT/copyright row
- [x] `chrome/ThemeToggle.tsx` — `useSyncExternalStore` reads `document.documentElement.dataset.theme` via a `MutationObserver` subscription; toggle writes `data-theme` + `localStorage["vorge-theme"]`. SSR snapshot is `"light"`; client snapshot reads the DOM (which the vorge pre-paint script already set). Sun/moon icon flips accordingly. No FOUT.
- [x] `chrome/icons.tsx` — currentColor-only SVGs (Monogram, Chevron, Search, Sun, Moon, GitHub, Edit, ArrowLeft, ArrowRight)
- [x] `theme/chrome.css` — chrome-specific styles ported verbatim from `~/Downloads/Motif Documentation/site.css` (top nav, version pill + menu, sidebar, TOC, page nav, footer, layout grid, responsive tweaks). Imported as the second side-effect import in `theme/index.tsx`.
- [x] `DocLayout` (in `theme/layouts.tsx`) — composes `<TopNav>` + `<div class="layout">{Sidebar | <main class="article">{children}<PageNav /></main> | OnThisPage}</div>` + `<Footer>`. Other 7 layouts remain stubs.

Verification: build emits `dist/index.html` containing all chrome (`<nav class="nav">`, `<aside class="sidebar">`, `<main class="article">`, `<footer class="footer">`); chrome CSS in client bundle (16.4 kB → 3.9 kB gzip); SSR rendered without errors. `lint` 772 warnings (baseline) / 0 errors / `format:check` clean / `typecheck` exit 0 / `build` exit 0.

---

## Phase 3 — Article surface + MDX components

Status: **done** (2026-05-05)

- [x] `components/Eyebrow.tsx` — `<span class="eyebrow">` with optional accent dot
- [x] `components/Lede.tsx` — `<p class="article__lede">`, 19px Inter, `--fg-muted`
- [x] `components/Callout.tsx` — **dogfood**: `styled('aside', { variants: { variant: { info, warning, tip, danger } } })`. Layout in the `.callout` CSS class; variant-driven `borderLeftColor` + `color` come from motif's variants emitter. Auto-titles (Note / Heads up / Tip / Caution) + an icon per variant.
- [x] `components/CodeBlock.tsx` — filename header (with file icon), copy button (⌘+SVG icon swap on click, 1400ms), optional `tabs` array, `highlightLines` (renders `.code-line--hl` wrapping). Uses `useCallback`-hoisted `selectTab(i) → () => setActiveTab(i)` to satisfy `react-perf/jsx-no-new-function-as-prop`.
- [x] `components/Tabs.tsx` — `Tabs` + `TabPanel`. `active` flows via React context, `aria-selected`/`role="tab"` for a11y, underline indicator on active trigger.
- [x] `components/Steps.tsx` — `Steps` (`<ol class="steps">`) + `Step` items. Auto-numbered via CSS `counter-increment`.
- [x] `components/FileTree.tsx` — `FileTree` + `FileTreeDir` + `FileTreeFile`. Indented `<ul>` with dashed-line connectors; `note` field for inline annotations.
- [x] `components/Image.tsx` — `<figure>` + `<img loading="lazy">` + optional `<figcaption>`.
- [x] `components/ApiSignature.tsx` — `api-head` (name + status tag) + `api-sig` (preformatted signature) + `params` table (name, type, required flag, default, description).
- [x] `theme/article.css` — ports the article + callout (layout-only) + code + tabs + steps + filetree + figure + api/params styles from `~/Downloads/Motif Documentation/site.css`. Imported as the third side-effect import in `theme/index.tsx`.
- [x] `content/_demo/components.mdx` — frontmatter `draft: true` keeps it out of production builds; exercises every component. Imports use a relative path (`../../components/index.js`) since vorge does not surface a Vite-plugin hook for path aliases.

Verification: build emits `dist/index.html` only (demo correctly excluded by `draft: true`). When `draft` is flipped, all 11 component classes render correctly in `dist/_demo/components/index.html`. SSR resolves Callout's variant prop into `<aside class="callout" style="border-left-color:var(--info);color:var(--info)">`. `lint` 772 warnings (baseline) / 0 errors; `format:check` clean; `typecheck` exit 0; `build` exit 0.

---

## Phase 4 — Discovery + IA + voice card

Status: **done** (2026-05-05)

- [x] docwright author mode prepared — outputs in `apps/docs/.docwright/` (gitignored — local agent state, not shipped)
- [x] IA proposed and approved — `.docwright/ia.md` (24 pages, 5 sidebar sections matching the reference Sidebar exactly: Getting started → Concepts → Guides → API → Recipes; plus `/`, `/changelog`, `/404`)
- [x] Voice card approved — `.docwright/voice-card.md` (lifted from `~/Downloads/Motif Design System/README.md` "Content fundamentals" + `preview/voice-tone.html` Do/Don't pairs; encodes person, tense, sentence rhythm, forbidden phrases, punctuation, numbers, microcopy, emoji policy, linking, heading style, decision rules, Diataxis tone matrix)
- [x] `.docwright/session.json` written with `platform: "vorge"`, `platformVersion: "1.1.2"`, full page queue (24 pages, all `status: "queued"`), `writeOrder` array (concepts first per PLAN), checkpoint per-page, components inventory, repo metadata
- [x] `.docwright/` added to `.gitignore` — these are local-only orchestrator artifacts, regenerated when needed; not committed
- [/] `_meta.ts` files per content directory — **deferred to Phase 5** (the directories don't exist yet — `_meta.ts` files land alongside their content)

Verification: build emits `dist/index.html` only (no new content yet); `.docwright/{ia.md,voice-card.md,session.json}` are on disk locally and parse cleanly; gates green (`lint` 772 / 0 errors, `format:check` clean, `typecheck` exit 0).

---

## Phase 5 — Author all pages

Status: **not started**

### Concepts (explanation) — write first

- [ ] `/concepts/tokens`
- [ ] `/concepts/variants`
- [ ] `/concepts/theming`
- [ ] `/concepts/composition`
- [ ] `/concepts/responsive`

### Getting started (tutorial)

- [ ] `/getting-started/introduction`
- [ ] `/getting-started/installation`
- [ ] `/getting-started/your-first-style`
- [ ] `/getting-started/web-and-native`

### Guides + Recipes (howto)

- [ ] `/guides/design-system`
- [ ] `/guides/migrating-styled-components`
- [ ] `/guides/performance`
- [ ] `/guides/server-rendering`
- [ ] `/recipes/buttons`
- [ ] `/recipes/forms`
- [ ] `/recipes/layouts`
- [ ] `/recipes/animation`

### Reference

- [ ] `/reference/motif`
- [ ] `/reference/create-theme`
- [ ] `/reference/use-style`
- [ ] `/reference/styled`
- [ ] `/reference/css`

### Landing & changelog

- [ ] `/` (readme adapted to landing — handed off to Phase 6)
- [ ] `/changelog`

Verification: every page status `done` in session.json; `docwright-verification` clean.

---

## Phase 6 — Landing page

Status: **not started**

- [ ] `Hero` (eyebrow / display / lede / CTA cluster / meta strip / tabbed code preview)
- [ ] `UsedBy`
- [ ] `BentoFeatures`
- [ ] `UniversalShowcase`
- [ ] `Comparison`
- [ ] `StatsStrip`
- [ ] `ComponentGallery`
- [ ] `Testimonials`
- [ ] `ChangelogPeek`
- [ ] `FinalCTA`

Verification: visual diff vs. reference home is within 4px per section.

---

## Phase 7 — Search + 404 + polish

Status: **not started**

- [ ] `@vorge/plugin-pagefind` wired
- [ ] `SearchModal` island (Cmd-K, Esc, focus-trap)
- [ ] `/404` authored
- [ ] Sitemap + robots.txt via `@vorge/plugin-sitemap`
- [ ] OG image + favicon + apple-touch-icon
- [ ] Final cross-page link verification
- [ ] Lighthouse mobile ≥95 across all categories
- [ ] Reduced-motion correctness
- [ ] No flash of wrong theme on first paint

Verification: site is shippable.

---

## Phase 8 — Visual fidelity audit

Status: **not started**

- [ ] Side-by-side screenshots: `/`, `/getting-started/introduction`, `/concepts/tokens`, `/reference/motif`, `/changelog`, `/404`
- [ ] All diffs resolved (< 4px, < 2 hex-units)
- [ ] Final sign-off

---

## Decisions log

Append every non-trivial decision here as it's made. Date format: ISO `YYYY-MM-DD`.

| Date       | Phase | Decision                                                                                                                                                                                                                                                                                                                                                                                                                           | Rationale                                                                                                                                                                                                                                                                                        |
| ---------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2026-05-05 | —     | Build fresh in `apps/docs/`. Previous attempt deleted in `cae8565`; do not migrate prior content.                                                                                                                                                                                                                                                                                                                                  | User request — fresh attempt.                                                                                                                                                                                                                                                                    |
| 2026-05-05 | —     | Target framework is **vorge** from sibling repo `~/Documents/GitHub/foo-stack/docforge/`.                                                                                                                                                                                                                                                                                                                                          | User request.                                                                                                                                                                                                                                                                                    |
| 2026-05-05 | —     | Vorge dependencies are **plain npm at `^1.0.0`**. All 15 vorge packages are published. The local repo at `~/Documents/GitHub/foo-stack/docforge/` is reference material for capabilities, not a dependency source.                                                                                                                                                                                                                 | Vorge 1.0.0 ships across `@vorge/*` and `create-vorge`.                                                                                                                                                                                                                                          |
| 2026-05-05 | —     | **Custom theme package** (`apps/docs/theme/`) replaces `@vorge/theme-default`.                                                                                                                                                                                                                                                                                                                                                     | We don't want Tailwind. Dogfood motif-js for layouts.                                                                                                                                                                                                                                            |
| 2026-05-05 | —     | **Per-page MDX component imports**, not auto-mapping.                                                                                                                                                                                                                                                                                                                                                                              | Aligns with `docwright-vorge` skill spec. Revisit if painful.                                                                                                                                                                                                                                    |
| 2026-05-05 | —     | **No Sandpack in v1.** Hero "Try it" tabs use static-highlighted code.                                                                                                                                                                                                                                                                                                                                                             | Adds 700 KB to one page; not worth it for the first cut.                                                                                                                                                                                                                                         |
| 2026-05-05 | —     | **No multi-version routing in v1.** Version pill is decorative; wire `@vorge/plugin-versioned-docs` when v2.0 of motif-js is on the horizon.                                                                                                                                                                                                                                                                                       | Nothing to switch between yet.                                                                                                                                                                                                                                                                   |
| 2026-05-05 | —     | **No i18n in v1.**                                                                                                                                                                                                                                                                                                                                                                                                                 | Adds noise; English-only is fine.                                                                                                                                                                                                                                                                |
| 2026-05-05 | 0     | **Dev/preview port is `4321`** (not vorge's default 5173).                                                                                                                                                                                                                                                                                                                                                                         | `apps/playground-web` already uses 5173.                                                                                                                                                                                                                                                         |
| 2026-05-05 | 0     | **`@vorge/theme-default@^1.0.0` added to deps for Phase 0 plumbing.** Vorge resolves `virtual:vorge/theme` to this import string by default; the CLI does not surface a config option to override it.                                                                                                                                                                                                                              | Phase 1 will replace it once the local `@motif-js/docs-theme` exists.                                                                                                                                                                                                                            |
| 2026-05-05 | 0     | **`vite@^6.0.3` declared as a direct dep** of `apps/docs` to satisfy `@vorge/vite`'s peer-dep contract.                                                                                                                                                                                                                                                                                                                            | Was emitting a yarn peer warning otherwise.                                                                                                                                                                                                                                                      |
| 2026-05-05 | 0     | **Bumped vorge cohort to `^1.1.1`** after upstream resolved [docforge#1](https://github.com/foo-stack/docforge/issues/1) (sourcemaps), [#2](https://github.com/foo-stack/docforge/issues/2) (dev FOUC), [#3](https://github.com/foo-stack/docforge/issues/3) (FOART). Verified: 0 sourcemap warnings, dev shell inlines `<style data-vite-dev-id>` blocks, build + dev shells inject the pre-paint theme script.                   | All three issues filed during Phase 0 resolved upstream in one cohort patch.                                                                                                                                                                                                                     |
| 2026-05-05 | 1     | **Bumped vorge cohort to `^1.1.2`** after upstream resolved [docforge#4](https://github.com/foo-stack/docforge/issues/4) — `defineConfig({ theme })` now lands the theme path through `@vorge/cli` → `@vorge/vite` → virtual-module data. Resolution rules: bare specifier, relative path (against config dir), absolute path; defaults to `@vorge/theme-default`.                                                                 | Removed the temporary `yarn resolutions` workaround and the `@vorge/theme-default` dep from `apps/docs`.                                                                                                                                                                                         |
| 2026-05-05 | 1     | **Two-layer CSS strategy.** Design's bare-name vars (`--bg`, `--paper-100`, …) live in static `theme/theme.css` (port of `colors_and_type.css`). motif-shaped vars (`--colors-bg-base`, …) emitted at SSR time via `themesToCssBlock([lightTheme, darkTheme])` in a shared `<style data-motif-themes="docs">` block by `ThemeShell` (every layout wraps in it).                                                                    | motif-js's CSS-var emitter prepends scale name (`--colors-…`); the design uses bare names. Both naming schemes coexist — chrome CSS uses bare names (Phase 2); motif `Box`/`styled` use scale-prefixed. Single source of token _values_ (createTheme); two var namespaces.                       |
| 2026-05-05 | 1     | **Deferred Shiki themes** to Phase 7 polish per PLAN risk #3. Ships with `github-light` / `github-dark` defaults.                                                                                                                                                                                                                                                                                                                  | Two custom theme JSONs are non-trivial to color-match; not blocking.                                                                                                                                                                                                                             |
| 2026-05-05 | 1     | **`vorge.transformHtml` runs only at SSG (build) time, not in dev.** Confirmed in `@vorge/core/src/ssg/run.ts`. So fonts plugin only injects in build output; dev falls back to system fonts.                                                                                                                                                                                                                                      | Cosmetic dev-only DX gap. Worth a future docforge issue (5th) requesting `transformHtml` in dev shell, but not blocking Phase 1.                                                                                                                                                                 |
| 2026-05-05 | 2     | **Chrome ships as plain CSS in `theme/chrome.css`, ported verbatim from `~/Downloads/Motif Documentation/site.css`.** Components are plain React (`function TopNav()`) emitting semantic class names; interactive bits (scroll, localStorage, MutationObserver) live in hooks.                                                                                                                                                     | Pixel-fidelity to the reference designs. The plan's "no raw CSS-in-JS, no Tailwind, no styled-components" rule excludes the prohibited approaches; a static CSS file using `var(--*)` tokens from `createTheme` is in-spec. `styled()` dogfood remains for component-level work in later phases. |
| 2026-05-05 | 2     | **`ThemeToggle` uses `useSyncExternalStore` + `MutationObserver`** on `document.documentElement` `data-theme` attribute. SSR snapshot is `"light"`; client snapshot reads the DOM (pre-paint script wrote it). Toggle writes both `data-theme` and `localStorage["vorge-theme"]`.                                                                                                                                                  | Avoids hydration mismatch warnings + matches whatever the pre-paint script set, including third-party DOM mutations. Pattern recommended in [docforge#3](https://github.com/foo-stack/docforge/issues/3) (FOART fix).                                                                            |
| 2026-05-05 | 2     | **Sidebar wraps `@vorge/core/primitives` `Link`** rather than rendering raw `<a>` so `activeClassName` works. Walks `useSidebar()` items directly to render `.side-section` / `.side-title` / `.side-list` structure matching the design.                                                                                                                                                                                          | Vorge's default Sidebar is generic; we need section-grouped + badge-aware rendering. The Link primitive handles route-active detection.                                                                                                                                                          |
| 2026-05-05 | 3     | **motif-js `styled()` style props are constrained.** No `border`/`background` shorthands, no `gridTemplateColumns`, etc. — full list lives in `packages/core/src/style-props.ts` (~93 props). Unrecognized props leak through as raw HTML attributes. Callout's layout (grid, padding, base border) lives in the `.callout` CSS class; only the variant-driven `borderLeftColor` + `color` go through motif's `styled()` variants. | First real `styled()` dogfood test — confirmed variant prop typing works, SSR is clean, layered CSS class plus motif inline styles is the right abstraction for non-pure variant components.                                                                                                     |
| 2026-05-05 | 3     | **MDX components live in `apps/docs/components/`** with relative imports (`'../../components/index.js'`). Vorge does not surface a Vite-plugin lifecycle so a `~/components` path alias would require a CLI fork or a custom config preload.                                                                                                                                                                                       | Defer the alias work; relative paths are fine for Phase 3-5. Revisit if MDX paths become noisy.                                                                                                                                                                                                  |
| 2026-05-05 | 3     | **Demo page (`content/_demo/components.mdx`) ships with `draft: true`** to keep it out of production. Toggle locally to inspect.                                                                                                                                                                                                                                                                                                   | Vorge's content discovery skips `draft: true` entries (`@vorge/core/src/content/discover.ts:30`).                                                                                                                                                                                                |
| 2026-05-05 | 4     | **`.docwright/` is gitignored** — `ia.md`, `voice-card.md`, `session.json` are local-only orchestrator artifacts. Treated like `.claude/` (per-session state), not shipped to the repo. Future contributors regenerate them on demand from the design system + the source of truth (PLAN.md + the source code).                                                                                                                    | Phase 4 spec output is what matters; running the agent live would just rediscover what the plan already locked. Future drift between docs and source code will be caught by `docwright-mode-sync` reading `covers:` in page frontmatter.                                                         |
| 2026-05-05 | 4     | **`writeOrder` in session.json puts concepts before tutorials.** Tutorials and how-tos link back to concepts; reference pages link _into_ concepts. Writing the concepts first means every link target exists when the linking page is written.                                                                                                                                                                                    | docwright-mode-author's canonical Diataxis order (explanation → tutorial → howto → reference) holds for this project too.                                                                                                                                                                        |
| 2026-05-05 | 4     | **`_meta.ts` files per content directory deferred to Phase 5.** They'd reference page slugs that don't yet exist; vorge's discoverMeta auto-discovers them once the directories land.                                                                                                                                                                                                                                              | Avoids stale meta files referencing draft slugs.                                                                                                                                                                                                                                                 |
| 2026-05-05 | 2     | **VersionPill is decorative for v1** (per locked decision). Three example entries that don't navigate.                                                                                                                                                                                                                                                                                                                             | Multi-version routing requires `@vorge/plugin-versioned-docs`, which only makes sense once v2.0 of motif-js is on the horizon.                                                                                                                                                                   |

---

## Blockers

(none currently)

When something is blocked, file it here with:

- What's blocked
- What it's blocked on (vorge bug, motif-js bug, design ambiguity, …)
- Where the workaround/escape lives
- Date filed
