# motif-js docs site — PLAN

A fresh build of the documentation site at `apps/docs/`. Targets pixel-level fidelity with the design at `~/Downloads/Motif Design System/` and `~/Downloads/Motif Documentation/`. Built on **vorge** (the React + Vite SSG at `~/Documents/GitHub/foo-stack/docforge/`) and **dogfoods motif-js itself** for every styled surface — chrome, layouts, MDX components.

> Sibling files: [PROGRESS.md](./PROGRESS.md) tracks per-phase status across sessions. [LAST_MEMORY.md](./LAST_MEMORY.md) is the resume-point summary written at the end of each session.

---

## Goals & non-goals

### Goals

1. **Pixel-level fidelity** with the reference designs. Every spacing value, hairline, type ramp, hover state, radius, focus ring matches the design's `colors_and_type.css` + `site.css` + `home.css`.
2. **Dogfood motif-js v1.x.** All chrome and layout-level styling goes through `@motif-js/react`'s `styled` / primitives. No raw CSS-in-JS, no Tailwind, no styled-components. Tokens flow through `createTheme` and `@motif-js/tokens`.
3. **Vorge as the framework.** Use vorge `^1.0.0` from npm as the SSG — no Vocs, no Nextra. The local repo at `~/Documents/GitHub/foo-stack/docforge/` is the source of truth for behavior; npm is the source of code.
4. **docwright drives content.** All prose is authored via the docwright orchestrator + `docwright-vorge` platform skill. Discovery → voice → per-page write → verify → approve. No content shipped without verification.
5. **Anchored against npm.** Every public symbol documented in `/reference/` matches `@motif-js/*@1.1.2` (or whatever's current at the time of writing). Sync mode keeps it true.
6. **Multi-session resumability.** Plan, progress, and last-memory files persist enough state that any session can pick up cleanly.

### Non-goals (this build)

- **No SSR at request time.** SSG only. Static output deployable to any host.
- **No Algolia.** Search is Pagefind via `@vorge/plugin-pagefind`, built-in to vorge.
- **No i18n in v1.** English only. The plugin exists in vorge but adds noise we don't need yet.
- **No multi-version sidebar yet.** The reference design shows a version-pill dropdown — we'll render it as a decorative widget for v1 and wire `@vorge/plugin-versioned-docs` when v2.0 is on the horizon.
- **No native mobile app.** Web only.
- **No legacy Markdown migration.** Greenfield content; the previous `apps/docs/` was deleted (`cae8565`) and is not being migrated.

---

## Locked decisions

| Dimension           | Choice                                                                                               | Rationale                                                                                                                                                            |
| ------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SSG framework       | `@vorge/cli@^1.0.0` from npm                                                                         | Vorge 1.0.0 is published. The local repo at `~/Documents/GitHub/foo-stack/docforge/` remains the source of truth for capabilities/quirks; npm is the source of code. |
| Dependency strategy | Plain npm: `yarn add @vorge/cli@^1.0.0 @vorge/core@^1.0.0 @vorge/vite@^1.0.0 …`                      | Published, stable. No `portal:`, no vendoring.                                                                                                                       |
| Theme               | Custom local theme `@motif-js/docs-theme` (private, in `apps/docs/`)                                 | We don't want `@vorge/theme-default`'s Tailwind. Build layouts on motif-js primitives.                                                                               |
| Token system        | `colors_and_type.css` ports verbatim into a motif-js `createTheme` call                              | Single source of truth — same tokens drive `<motif.View>` and Shiki theme.                                                                                           |
| Fonts               | Fraunces (Google), Inter (Google), JetBrains Mono (Google) — preloaded woff2 in `<head>`             | Fidelity to design. Self-hosted later if licensing or perf require.                                                                                                  |
| Styling primitive   | `styled()` from `@motif-js/react` for every component; no inline styles                              | Dogfood. Shows the library doing real work.                                                                                                                          |
| MDX dialect         | vorge defaults: remark-gfm, remark-directive, remark-frontmatter, rehype-shiki dual-themes           | Matches docwright-vorge skill spec.                                                                                                                                  |
| Component imports   | Explicit per-page (`import { Callout } from '~/components'`)                                         | vorge does not auto-import. Aligns with the docwright-vorge skill.                                                                                                   |
| Code highlighting   | Shiki with two custom themes (`motif-paper` + `motif-ink`) tied to `data-theme`                      | Default `github-light/dark` doesn't match the warm palette.                                                                                                          |
| Search              | Pagefind via `@vorge/plugin-pagefind`; Cmd-K modal as an island                                      | Build-time index, zero server, fits SSG.                                                                                                                             |
| Sandpack            | **Skipped in v1.** Hero-page "Try it" tab uses static highlighted code, not live edit.               | Sandpack adds ~700 KB to a single page; not worth it for the first cut.                                                                                              |
| Deploy              | Out of scope for the build phase. We'll generate the static `dist/`; deployment target picked later. | Decision deferred to whoever wires the host.                                                                                                                         |

---

## Architecture

Three nested layers inside `apps/docs/`:

```
apps/docs/
├─ vorge.config.ts                  # framework config — plugins, theme, sidebar overrides
├─ package.json                     # name @motif-js/docs (private)
├─ tsconfig.json
├─ public/                          # static assets (logos, paper-grain, OG images)
│  ├─ monogram.svg
│  ├─ wordmark.svg
│  └─ og-default.png
├─ content/                         # MDX/Markdown — vorge's default contentDir
│  ├─ index.mdx                     # landing — uses MarketingLayout (or a dedicated home layout)
│  ├─ _meta.ts                      # top-level sidebar order
│  ├─ getting-started/
│  │  ├─ _meta.ts
│  │  ├─ introduction.mdx
│  │  ├─ installation.mdx
│  │  ├─ your-first-style.mdx
│  │  └─ web-and-native.mdx
│  ├─ concepts/                     # explanation pages
│  ├─ guides/                       # how-to pages
│  ├─ reference/                    # API
│  ├─ recipes/                      # how-to (task-shaped)
│  ├─ changelog.mdx
│  └─ 404.mdx
├─ theme/                           # local-only theme package — vorge points at it
│  ├─ index.ts                      # `export const layouts = { doc, blank, marketing, blog-post, changelog, api, guide, 404 }`
│  ├─ tokens.ts                     # createTheme() with the design's tokens
│  ├─ shiki/
│  │  ├─ motif-paper.json           # generated — light theme
│  │  └─ motif-ink.json             # generated — dark theme
│  ├─ layouts/
│  │  ├─ DocLayout.tsx              # 3-col (Sidebar | Article | TOC)
│  │  ├─ ApiLayout.tsx              # like Doc, with reference-page chrome
│  │  ├─ GuideLayout.tsx            # like Doc, prose-wide variant
│  │  ├─ MarketingLayout.tsx        # full-width hero page
│  │  ├─ ChangelogLayout.tsx        # entry list with anchor jumps
│  │  ├─ BlankLayout.tsx
│  │  └─ NotFoundLayout.tsx
│  ├─ chrome/                       # site chrome — top nav, footer, sidebar, TOC, pager
│  │  ├─ TopNav.tsx
│  │  ├─ VersionPill.tsx
│  │  ├─ Sidebar.tsx                # wraps @vorge/core/primitives Sidebar
│  │  ├─ OnThisPage.tsx             # wraps @vorge/core/primitives TOC
│  │  ├─ PageNav.tsx                # wraps @vorge/core/primitives Pager
│  │  ├─ Footer.tsx
│  │  ├─ ThemeToggle.tsx
│  │  └─ SearchTrigger.tsx          # button that opens SearchModal island
│  ├─ islands/
│  │  └─ SearchModal.tsx            # Pagefind UI, Cmd-K — loaded via <Island client="idle">
│  └─ icons/                        # currentColor-only SVG components (Lucide subset)
├─ components/                      # MDX components — author-facing
│  ├─ index.ts
│  ├─ Eyebrow.tsx
│  ├─ Lede.tsx
│  ├─ Callout.tsx                   # variant="info|warn|danger|success"
│  ├─ CodeBlock.tsx                 # filename header, copy button, line highlights
│  ├─ Tabs.tsx                      # variant switcher
│  ├─ Steps.tsx                     # numbered tutorial steps
│  ├─ FileTree.tsx
│  ├─ Image.tsx                     # caption + figure
│  ├─ Hero.tsx                      # landing-only
│  ├─ FeatureGrid.tsx               # landing-only
│  └─ ApiSignature.tsx              # reference-only (param table + types)
├─ PLAN.md                          # this file
├─ PROGRESS.md
└─ LAST_MEMORY.md
```

### Data flow

```
vorge config + Vite plugin
        │
        ▼
   route manifest                   ←   content/**/*.mdx
        │                                + frontmatter (validated)
        ▼
   layouts (theme)                  ←   theme/index.ts exports `layouts`
        │
        ▼
   render(MDX)  ─────────────────►  motif-js styled() chrome + components
        │
        ▼
   HTML/JS/CSS in dist/             ←   Pagefind post-build indexer
```

Every layout is a motif-js component. Every chrome component composes motif-js's `styled()`. The MDX components are the same. The page itself becomes a real consumer of the library.

---

## Phased rollout

Each phase ends with a **green local build, lint+format clean, types passing**, and **a meaningful committable artifact**. Per memory: always run format + lint at the end of every pass.

### Phase 0 — Scaffold + wiring (1 session)

Get a "hello vorge" page rendering at `apps/docs/` with no styling whatsoever. Pure plumbing.

- [ ] Create `apps/docs/package.json` (private, name `@motif-js/docs`, scripts: `dev`, `build`, `preview`, `typecheck`). Dependencies pin to published vorge `1.0.0`:
  ```json
  "dependencies": {
    "@vorge/cli":  "^1.0.0",
    "@vorge/core": "^1.0.0",
    "@vorge/vite": "^1.0.0",
    "@vorge/plugin-pagefind": "^1.0.0",
    "@vorge/plugin-sitemap":  "^1.0.0"
  }
  ```
  Add other plugins (`@vorge/plugin-blog`, `@vorge/plugin-deploy`, `@vorge/plugin-typedoc`) only when their phase brings them in.
- [ ] `yarn install` from motif-js root, verify resolution.
- [ ] Create `apps/docs/tsconfig.json` extending the workspace base.
- [ ] Create minimal `vorge.config.ts` — `defineConfig({ title: 'motif-js' })` only.
- [ ] Create `apps/docs/content/index.mdx` — single H1, "hello".
- [ ] Run `yarn workspace @motif-js/docs dev`. Confirm it serves on a port (vorge default 5173; pick something else if motif-js's playground-web also uses 5173).
- [ ] Run `yarn workspace @motif-js/docs build` — confirm static HTML in `dist/`.
- [ ] Update Turbo pipeline (`turbo.json`) so `docs#dev` doesn't depend on every package's build at start time, but `docs#build` does depend on every motif-js package's `build`.
- [ ] **Verification: dev server hot-reloads, build emits HTML, no errors.**

**Exit:** "Hello, motif-js docs." renders at `localhost:<port>/`. No design yet — just plumbing.

### Phase 1 — Tokens + theme package + fonts (1 session)

Port the design tokens into a motif-js `createTheme` call and wire fonts.

- [ ] Create `apps/docs/theme/tokens.ts`. Port every variable from `colors_and_type.css` into a flat `createTheme({ colors, space, radii, fonts, sizes, ... })` call. Two themes (`light`, `dark`) — match the `[data-theme="dark"]` block exactly.
- [ ] Cross-check token names against `@motif-js/tokens`'s `lightTheme` / `darkTheme` exports. If there's overlap, **extend** those rather than redefining — the docs theme is a supertype.
- [ ] Create `theme/index.ts`. Export `layouts` (stub for each: `Doc`, `Blank`, `Marketing`, `BlogPost`, `Changelog`, `Api`, `Guide`, `NotFound`) — every stub returns `<>{children}</>` for now.
- [ ] Wire vorge to use the local theme. Two options:
  1. `vorge({ theme: './theme' })` if vorge supports a relative path (check `@vorge/vite/src/index.ts` for resolution rules).
  2. Otherwise, declare the theme as a workspace package (`@motif-js/docs-theme`, listed in `apps/docs/theme/package.json`).
- [ ] Add Google Fonts preloads in vorge's HTML template. If vorge doesn't expose a head-injection hook by config, write a one-off plugin in `apps/docs/plugins/fonts.ts` using the `transformHtml` lifecycle.
- [ ] Generate two Shiki themes (`motif-paper.json`, `motif-ink.json`) from a base + the design's accent palette. Wire via `markdown.shiki.themes` in vorge.config.
- [ ] Add a `@motif-js/react` import in the theme package so the workspace dependency is real (proves the dogfood wiring works).
- [ ] **Verification: a `<motif.View bg="$bg-paper">` renders the cream paper background; toggling `data-theme="dark"` flips correctly.**

**Exit:** the existing "hello" page now uses the right colors, fonts, and base type ramp via motif-js. Still no chrome.

### Phase 2 — Site chrome (1–2 sessions)

Build the top nav, sidebar, on-this-page TOC, page nav, and footer. Match the reference designs exactly.

For each component below: visual reference is `~/Downloads/Motif Design System/ui_kits/docs/` for the simpler version and `~/Downloads/Motif Documentation/` for the production-fidelity version. **Use the production version** wherever they differ.

- [ ] **`TopNav.tsx`**:
  - Sticky, opaque-on-scroll (border-bottom appears once `scrollY > 4`).
  - Backdrop blur: `saturate(140%) blur(10px)`, background `color-mix(in oklab, var(--bg-paper) 88%, transparent)`.
  - 3-column grid (lockup+version | search | nav links + theme + GitHub).
  - 1440px max-width, `padding: 14px 32px`.
  - Lockup: monogram (terracotta `currentColor`) + "Motif" wordmark (Fraunces 600 19px).
  - Version pill: dropdown menu with three example versions (latest, previous, canary).
- [ ] **`VersionPill.tsx`** (split out): the dropdown menu using motif-js's primitives. Click-outside dismissal.
- [ ] **`SearchTrigger.tsx`**: button styled as a search input — icon + "Search the docs" placeholder + `⌘K` kbd. Opens `SearchModal` island on click or Cmd-K.
- [ ] **`Sidebar.tsx`**: wraps `@vorge/core/primitives` `Sidebar`. Renders our visual style (grouped sections, eyebrow titles, active-state pill, badge support). Sticky position, max-height `calc(100vh - 80px)`.
- [ ] **`OnThisPage.tsx`**: wraps `@vorge/core/primitives` `TOC`. Active link tracking via scrollspy. Border-left accent on active. Footer with "Edit this page on GitHub ↗" link.
- [ ] **`PageNav.tsx`**: wraps `@vorge/core/primitives` `Pager`. Two-column grid of prev/next cards with "Previous" / "Next" eyebrows.
- [ ] **`Footer.tsx`**: dim, hairline-top, three columns (resources / community / sitemap), copyright on right.
- [ ] **`ThemeToggle.tsx`**: sun/moon icon button, toggles `data-theme` on `<html>`, persists in `localStorage`. SSR-safe — no flash on first paint.
- [ ] **`DocLayout.tsx`**: composes TopNav + 3-col grid (Sidebar | Article | TOC) + Footer. 1440px max-width, 56px gaps, 32px outer padding.
- [ ] Replace the stub layouts in `theme/index.ts` with real `DocLayout`. Other layouts (Marketing, Blank, etc.) stay as stubs for now.
- [ ] **Verification: navigate the (empty) sidebar items and watch active state, scroll past the threshold to see the nav border appear, toggle theme and watch everything flip.**

**Exit:** an empty page with a fully-shaped chrome. Paste in any old Markdown, the chrome should still look right.

### Phase 3 — Article surface + MDX components (1 session)

Build every component the prose pages will use. All styled with motif-js.

- [ ] **`Eyebrow.tsx`** — uppercase JetBrains Mono 11px, `tracking-widest`, faint color.
- [ ] **`Lede.tsx`** — large opening paragraph, Inter 18px/1.55, muted color, `max-width: 580px`.
- [ ] **`Callout.tsx`** — `variant="info|warn|danger|success"`, optional `title`. Border-left 2px in variant color. Background `--bg-paper`. Match `dx-callout` styles.
- [ ] **`CodeBlock.tsx`** — header bar with `filename` + Copy button. Body wraps Shiki's pre/code output. Supports `highlightLines` (renders a 2px accent border-left on highlighted lines, 9% accent fill). Match `dx-code` styles.
- [ ] **`Tabs.tsx` + `Tab.tsx`** — npm/yarn/pnpm/bun snippet switcher. Used heavily on installation pages and the hero "Try it" tab. Underline-indicator for active tab; 160ms ease.
- [ ] **`Steps.tsx`** — auto-numbered children. Each `### Heading` becomes "1.", "2." in the margin. Used in tutorials.
- [ ] **`FileTree.tsx`** — diagrammatic. Indented vertical lines, monospace.
- [ ] **`Image.tsx`** — `<figure>` + `<figcaption>`. Hairline border, 6px radius.
- [ ] **`ApiSignature.tsx`** — used on `/reference/...` pages. Renders a function signature with parameter table (Name / Type / Default / Description). The reference page kit.
- [ ] Wire components via vorge's MDX components map in `vorge.config.ts` so authors don't have to import them per page. **Decision pending: per-page imports (vorge default) vs auto-mapping.** Default to per-page imports — matches the docwright-vorge skill spec. Revisit if it becomes painful.
- [ ] Author one demo page (`content/_demo/components.mdx`, marked `draft: true` to keep it out of prod) that exercises every component. This is the visual regression baseline.
- [ ] **Verification: open the demo page, eyeball every variant against the reference HTML in `~/Downloads/Motif Documentation/index.html`. Every spacing, hairline, hover state matches.**

**Exit:** a designer could write a real MDX page using only these components and have it look correct.

### Phase 4 — Discovery + IA + voice card (1 session, docwright-driven)

Hand off to the docwright orchestrator for content planning.

- [ ] Invoke docwright in author mode. It will run `docwright-discovery` first and propose an IA + voice card.
- [ ] Approve / adjust the IA. Target shape (matches the reference Sidebar exactly):
  ```
  /                                   readme           covers: <none>
  /getting-started/introduction       tutorial         covers: motif, createTheme
  /getting-started/installation       howto            covers: <none>
  /getting-started/your-first-style   tutorial         covers: motif.view (or whatever the API is)
  /getting-started/web-and-native     explanation      covers: <none>
  /concepts/tokens                    explanation      covers: createTheme, Theme
  /concepts/variants                  explanation      covers: styled, variants
  /concepts/theming                   explanation      covers: createTheme, ThemeProvider
  /concepts/composition               explanation      covers: styled, motif.view
  /concepts/responsive                explanation      covers: <responsive symbols>
  /guides/design-system               howto            covers: <none>
  /guides/migrating-styled-components howto            covers: <none>
  /guides/performance                 howto            covers: <none>
  /guides/server-rendering            howto            covers: <none>
  /reference/motif                    reference        covers: motif
  /reference/create-theme             reference        covers: createTheme
  /reference/use-style                reference        covers: useStyle
  /reference/styled                   reference        covers: styled
  /reference/css                      reference        covers: css
  /recipes/buttons                    howto
  /recipes/forms                      howto
  /recipes/layouts                    howto
  /recipes/animation                  howto
  /changelog                          changelog
  /404                                (special)
  ```
- [ ] Approve the voice card. Should match the design system's voice rules (sentence case, "you" + "we", no exclamation marks, contractions fine, oxford commas, em dashes without spaces).
- [ ] Write `apps/docs/.docwright/session.json` with `platform: "vorge"`. (docwright-mode-author writes this; we just confirm.)
- [ ] **Verification: discovery output is committed; IA matches the reference Sidebar; voice card is on disk.**

**Exit:** docwright knows what it's writing.

### Phase 5 — Author all pages (3–4 sessions, docwright-driven)

Doc-type order, per `docwright-mode-author`'s canonical sequence: explanation → tutorial → howto → reference → readme → adr → changelog.

For each page: the orchestrator runs the relevant doc-type skill, source extraction (via `ts-morph`), test extraction (via `docwright-research`), passes to the doc-type skill with the voice card, drafts the page, runs `docwright-verification` (signature checks, link checks, MDX parse, code-sample execution), and surfaces for user approval.

Mark each page checkbox as it's approved by the user:

- **Concepts (explanation) — write first so other pages can link back**
  - [ ] `/concepts/tokens`
  - [ ] `/concepts/variants`
  - [ ] `/concepts/theming`
  - [ ] `/concepts/composition`
  - [ ] `/concepts/responsive`
- **Getting started (tutorial)**
  - [ ] `/getting-started/introduction`
  - [ ] `/getting-started/installation`
  - [ ] `/getting-started/your-first-style`
  - [ ] `/getting-started/web-and-native`
- **Guides + Recipes (howto)**
  - [ ] `/guides/design-system`
  - [ ] `/guides/migrating-styled-components`
  - [ ] `/guides/performance`
  - [ ] `/guides/server-rendering`
  - [ ] `/recipes/buttons`
  - [ ] `/recipes/forms`
  - [ ] `/recipes/layouts`
  - [ ] `/recipes/animation`
- **Reference (reference)** — symbols extracted from `@motif-js/react@1.1.2`
  - [ ] `/reference/motif`
  - [ ] `/reference/create-theme`
  - [ ] `/reference/use-style`
  - [ ] `/reference/styled`
  - [ ] `/reference/css`
- **Landing**
  - [ ] `/` (home — done by `docwright-readme` adapted for a landing page; uses `MarketingLayout`)
- **Changelog**
  - [ ] `/changelog` (`docwright-changelog`, ref range = first published tag → HEAD on motif-js)

Each page is a separate user-approval checkpoint by default (`--yolo` not used unless the user explicitly opts in).

**Exit:** every IA page exists, verifies, and the user has approved its prose.

### Phase 6 — Landing page (1 session)

The home page is a marketing surface. It mostly bypasses the doc-type skills and is hand-built — but the design has a lot of section variety.

Build, in order, mirroring `~/Downloads/Motif Documentation/HomePage.jsx`:

- [ ] **`Hero`** — eyebrow ("v1.x · Now stable"), display headline (with italic emphasis on a phrase), lede, primary CTA + copy-install button + GitHub stars button, meta strip (KB / zero-runtime / platforms / license), tabbed code preview (Component / Theme / Variants).
- [ ] **`UsedBy`** — logo strip with low-opacity logos.
- [ ] **`BentoFeatures`** — 4–6 cards in an asymmetric bento grid. Each card is a feature with an inline code snippet or diagram.
- [ ] **`UniversalShowcase`** — split panel: web preview vs. native preview, same source code.
- [ ] **`Comparison`** — table comparing motif-js vs. styled-components vs. CSS modules vs. vanilla extract.
- [ ] **`StatsStrip`** — bundle size, perf, install count.
- [ ] **`ComponentGallery`** — sample components built with motif-js, rendered live.
- [ ] **`Testimonials`** — pull quotes (filler text marked clearly until real ones land).
- [ ] **`ChangelogPeek`** — last 3 changelog entries, "View full changelog" link.
- [ ] **`FinalCTA`** — closing band with primary CTA.

All sections built with motif-js's `styled` and primitives. Type ramp uses the design tokens. **Verification: visually diff against the reference HTML in `index.html`.**

**Exit:** `/` looks like the reference home page.

### Phase 7 — Search + 404 + polish (1 session)

- [ ] Wire `@vorge/plugin-pagefind` in `vorge.config.ts`.
- [ ] Build `SearchModal` island with Pagefind UI. Cmd-K opens, Esc closes, focus-trap, recent searches in `localStorage`.
- [ ] Make `SearchTrigger` open the modal.
- [ ] Author `/404`. Match the reference NotFoundPage: "This page doesn't exist." plus a search trigger and a list of likely-intent links.
- [ ] Sitemap + robots.txt via `@vorge/plugin-sitemap`.
- [ ] OG image + favicon + apple-touch-icon — generate from the monogram SVG.
- [ ] Cross-page link verification (`docwright-verification` final pass).
- [ ] Lighthouse pass on `/` and a sample doc page. Mobile target: ≥95 performance, ≥95 accessibility, ≥95 best-practices, ≥95 SEO.
- [ ] Reduced-motion check (every transition collapses to opacity-only at 1ms).
- [ ] `prefers-color-scheme` initial-paint correctness — no flash of wrong theme.

**Exit:** site is shippable.

### Phase 8 — Visual fidelity audit (1 session)

The honest fidelity check.

- [ ] Side-by-side screenshot diff: reference HTML vs. live site. Pages: `/`, `/getting-started/introduction`, `/concepts/tokens`, `/reference/motif`, `/changelog`, `/404`.
- [ ] For each diff > 4px or 2 hex-units, file a fix-task and address.
- [ ] Resolve final visual debt; re-screenshot; sign off.
- [ ] Commit final diff bundle.

**Exit:** every page matches its reference within 4px and 2 hex-units.

---

## Cross-cutting principles

- **Format + lint at the end of every pass.** `yarn lint && yarn format:check && yarn typecheck` must pass before any commit. Per memory.
- **No commits with `Co-Authored-By: Claude` trailers.** Per global preference.
- **Skip `@changesets/cli` for any version bumps the docs theme package may need** — edit package.json + CHANGELOG manually. Per memory.
- **Uniform versions across all `@motif-js/*` packages.** If the docs site needs to bump motif-js, bump every linked package together. Per memory.
- **Every public symbol documented matches the published `@motif-js/*@1.1.2` (or current).** docwright-verification owns this.
- **Pixel-fidelity is non-negotiable.** Spec is the design — when in doubt, match the reference HTML exactly.
- **No comments in code unless the WHY is non-obvious.** Per project conventions.
- **No new markdown/.md files unless asked.** Exception: PLAN/PROGRESS/LAST_MEMORY are explicitly part of this brief.

---

## Risks & open questions

1. **Vorge is freshly 1.0.0.** It's published and presumably the surface that the docforge repo's tests cover, but real-world dogfooding may surface bugs. Mitigation: when a blocker shows up, file a fix in `~/Documents/GitHub/foo-stack/docforge/` first (publish a 1.0.x patch), then upgrade `apps/docs/`. Don't fork vorge into the motif-js repo.
2. **motif-js's SSR story for Vite.** Vorge does SSR builds; if motif-js's `styled()` doesn't SSR cleanly (e.g., needs a server renderer for atomic CSS extraction), we'll need to wire that in `apps/docs/vorge.config.ts`'s Vite SSR config. Investigate at start of Phase 1.
3. **Shiki theme generation.** Generating two Shiki JSON themes that match the design's palette (warm paper / warm ink) is a small amount of color work. If we can't get Shiki output to match the reference HTML's code blocks within Phase 1, defer to Phase 7 polish and ship default `github-light/dark` in the meantime.
4. **Hero "Try it" tab.** Reference shows live-editable code. v1 ships with static-highlighted tabs only — Sandpack adds 700 KB to one page. Surface this trade-off when building Phase 6.
5. **Version-pill dropdown is decorative until v2.0 of motif-js exists.** The pill is fine to render with three example entries; the dropdown navigates nowhere. Surface the decorative-only nature in a small comment in `VersionPill.tsx`.
6. **docwright-discovery may propose a different IA than the reference Sidebar.** That's fine — it's the agent's job to read the source and propose. The user has final say. We'll merge the proposed IA with the reference shape and pick the better fit per page.

---

## Verification gates (per phase)

| Phase | Gate                                                                             |
| ----- | -------------------------------------------------------------------------------- |
| 0     | `yarn dev` serves; `yarn build` writes `dist/index.html`; no errors              |
| 1     | `<motif.View bg="$bg-paper">` renders cream paper; `data-theme="dark"` flips     |
| 2     | Sidebar/TOC active states track scroll; theme toggle persists; pager arrows work |
| 3     | Demo page exercises every MDX component; visual diff vs. reference is < 4px      |
| 4     | `.docwright/session.json` exists with approved IA + voice card                   |
| 5     | Every page status `done` in session.json; `docwright-verification` clean         |
| 6     | `/` matches reference home within 4px on each section                            |
| 7     | Cmd-K opens search; Lighthouse mobile ≥95 across the board                       |
| 8     | Side-by-side diffs of every reference page within 4px and 2 hex-units            |

Across all phases:

- `yarn workspace @motif-js/docs typecheck` is green.
- `yarn lint` is clean (oxlint passes).
- `yarn format:check` is clean.
- `yarn workspace @motif-js/docs build` exits 0.

---

## Estimated total: 10–12 sessions

- Phases 0–3 are mechanical (1 session each, 4 total).
- Phase 4 is 1 session.
- Phase 5 spans 3–4 sessions (24 pages, 6–8 per session).
- Phases 6–8 are 1 session each (3 total).

The PROGRESS.md file tracks actual session count and any drift.
