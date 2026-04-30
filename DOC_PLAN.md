# Motif docs site — build plan

> The plan for `apps/docs/` — Motif's first public app, built with Motif itself. Locked 2026-04-30. This is the spec; `PROGRESS.md` tracks execution.

---

## Why this exists

The docs site is the dogfood proof. Every visible element flows through Motif primitives and the Motif compiler. If a visitor opens DevTools and sees Tailwind classes, hand-rolled CSS modules, or styled-components, the project has lost its reason to exist. That constraint shapes every decision below.

The docs site is also necessary-but-not-sufficient as a flagship — it's web-only, so it doesn't validate the React Native parity story. Three cross-platform apps follow the docs site (motion-heavy, data-dense, theming-heavy) and complete the proof.

---

## Locked decisions

These are settled. Don't relitigate without explicit user input.

| Concern               | Pick                                                        | Rationale                                                                                                                                                                                       |
| --------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Location              | `apps/docs/`                                                | Sits alongside `apps/playground-web` etc. in the workspace.                                                                                                                                     |
| Framework             | **Vite + React Router v7** (data router)                    | User pick. Modern, no framework lock-in.                                                                                                                                                        |
| Static generation     | `vite-react-ssg`                                            | Prerenders MDX pages for SEO + first-paint. Pure SPA is a non-starter for docs.                                                                                                                 |
| Content               | **MDX**                                                     | Markdown for prose, embedded React components for live demos.                                                                                                                                   |
| Code highlighting     | **Shiki** at build time                                     | Themeable to brand; zero runtime cost.                                                                                                                                                          |
| Search                | **Pagefind**                                                | Static index built from output. No service, no quota, no vendor lock-in.                                                                                                                        |
| Live previews         | **Sandpack-react** on every Tier-1+2 concept page           | User pick: full live playgrounds, not just on showcase pages.                                                                                                                                   |
| Tweaks panel          | **Full** — mode + accent picker + content width + body font | User pick. Best multi-theme dogfood.                                                                                                                                                            |
| Headless behaviors    | `@motif-js/headless`                                        | Modal (search + tweaks), Tabs (code blocks), Combobox (search results), Tooltip (kbd hints), Disclosure (sidebar groups).                                                                       |
| Versioning            | **Skip for v1**                                             | Single current version. Add at v1.0 stable.                                                                                                                                                     |
| Dogfooding strictness | **Pragmatic**                                               | Motif primitives for everything that ships visible styling; raw `<div>`/`<a>` allowed only as the internal DOM that primitives render. No inline `style={{}}`, no `className=`, no CSS modules. |
| Docs-app dep strategy | **Strict version pin** to `@motif-js/*@1.1.1` from npm      | User pick: contributes to npm download numbers, forces continuous publishing, guarantees what users see in docs equals `npm install`.                                                           |
| Domain                | **usemotif.dev**                                            | Placeholder for package READMEs. Not yet registered.                                                                                                                                            |

---

## Reference inputs

The user provided these in `~/Downloads/`:

- **`~/Downloads/Motif Design System/`** — brand foundations
  - `README.md` — full brand voice, visual foundations, iconography rules
  - `SKILL.md` — agent-invocable skill manifest
  - `colors_and_type.css` — design tokens (CSS custom properties) for light + dark, semantic + raw scales. **Source of truth for porting to Motif `createTheme()`.**
  - `assets/` — `monogram.svg`, `wordmark.svg`, `lockup-horizontal.svg`, `weave.svg`, `paper-grain.svg`, `wordmark-italic.svg`
  - `assets/icons/` — Lucide rules
  - `ui_kits/marketing/` — landing-page kit (Hero, FeatureGrid, CodeShowcase, Quote, Footer, Nav)
  - `ui_kits/docs/` — three-column docs kit (DocsNav, Sidebar, Article, OnThisPage, PageNav)
  - `preview/` — atomic preview cards for type/color/components/brand

- **`~/Downloads/Motif Documentation/`** — reference layout (single-page React + Babel demo)
  - `index.html` — entry
  - `Pages.jsx` — Home, Docs (article), Guide, API, 404
  - `Nav.jsx` — top nav with version pill + search + theme toggle
  - `Sidebar.jsx` — left nav, grouped sections, active state
  - `Components.jsx` — CodeBlock, Callout, Tag patterns
  - `Search.jsx` — Cmd-K modal
  - `Playground.jsx` — live editor
  - `tweaks-panel.jsx` — runtime theme switching
  - `colors_and_type.css` — same as design system
  - `site.css` — page-level layout

**Important caveat about reference code samples:** the reference design's MDX uses a fictional `motif.view({...})` factory. The real Motif API is style-prop-based (`<Box p="$4" bg="$colors.brand.500">`). All sample code in the docs must be ported to the real API.

---

## Brand voice (from Motif Design System README)

- **Direct, but warm.** Get to the point, don't be cold.
- **Sentence case for everything.** Headings, buttons, nav. No title-case. No ALL CAPS except the smallest eyebrow labels (~11px).
- **"You" and "we"**, never "users". The reader is a developer; we are the people who built the library.
- **First person plural welcome.** "We chose…", "We think…" — opinions are a feature.
- **Contractions are fine.**
- **No exclamation marks.** Voice is calm.
- **No emoji** in product surfaces. (Exception: human-written changelog notes can use a single 🎉 or 🐛 sparingly.)
- **Oxford commas, em dashes with no spaces (`like—this`),** occasional aside in parentheses.
- **Numerals over words for ≥ 10.** Single digits spelled out ("three platforms, 12 components").

---

## Stack details — what gets installed

```jsonc
// apps/docs/package.json (sketch)
{
  "name": "@motif-js/docs",
  "private": true,
  "type": "module",
  "dependencies": {
    "@motif-js/react": "1.1.1", // exact pin (no ^)
    "@motif-js/headless": "1.1.1",
    "@motif-js/icons": "1.1.1",
    "@motif-js/reset": "1.1.1",
    "@motif-js/tokens": "1.1.1",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.x",
    "@codesandbox/sandpack-react": "^2.x",
  },
  "devDependencies": {
    "@motif-js/compiler-swc": "1.1.1",
    "@vitejs/plugin-react": "^5.x",
    "vite": "^8.x",
    "vite-react-ssg": "^1.x",
    "@mdx-js/rollup": "^3.x",
    "shiki": "^3.x",
    "pagefind": "^1.x",
    "typescript": "^6.0.3",
  },
}
```

Package versions above are placeholders — pick the latest stable at scaffold time, then pin.

---

## What this dogfoods

Every Motif feature this surface exercises:

- **Tokens** — `$colors`, `$space`, `$radii`, `$fonts`, `$shadows`. Brand theme expressed as a `createTheme()` with the values from `~/Downloads/Motif Design System/colors_and_type.css` ported in.
- **Theme chain** — `paper` base + `dark` sub-theme + a per-tweaks-panel-accent override theme.
- **Variants** — `Button` (`intent`/`size`), Callout (`kind: info|tip|warning|danger`), Tag (`stable|canary`), Eyebrow patterns.
- **Responsive props** — Sidebar collapses to a sheet below `$bp.md`; article column reflows.
- **Container queries** — code-block tab affordances adapt to container width, not viewport.
- **Animation** — presence-boundary for the search modal + tweaks panel; cross-fade for code-block tab switching; reduced-motion path verified.
- **`@motif-js/forms`-equivalent** — text input, switch, radio for the playground inputs (form components live in `@motif-js/react` and `@motif-js/react-native` after the Phase −1 stub-package removal — note the `@motif-js/forms` package itself was deleted; the components ship via the renderer entry).
- **`@motif-js/icons`** — Lucide wrapper, used everywhere icons appear.
- **`@motif-js/reset`** — global reset, three injection modes available; pick `<MotifReset />` for SSG-friendliness.
- **`@motif-js/headless`** — Modal (search + tweaks), Tabs (code blocks), Combobox (search results), Tooltip (kbd hint), Disclosure (sidebar group expand/collapse).

---

## Content scope, three tiers

**Tier 1 — must ship at launch (~10 pages):**

- `/` — landing/home page
- `/docs/introduction`
- `/docs/installation`
- `/docs/your-first-style`
- `/docs/web-and-native`
- `/docs/tokens`
- `/docs/variants`
- `/docs/theming`
- `/api/box`
- `/api/createTheme`
- `/404`

**Tier 2 — within ~2 weeks of launch:**

- `/docs/composition`
- `/docs/responsive`
- `/docs/animation`
- Remaining API pages (`/api/createTheme`, `/api/styled`, `/api/useTheme`, `/api/useThemeSetting`, etc.)
- `/guides/building-a-design-system`

**Tier 3 — defer:**

- Recipes (Buttons, Forms, Layouts, Animation)
- Migration guides (from styled-components, Tamagui, vanilla-extract)
- Performance & SSR guides
- Versioned docs

---

## Phased build

### Phase 0 — scaffold (1–2 days)

Goal: a single MDX page renders in the brand theme, the compiler runs, types are happy.

Concrete tasks:

- [ ] `apps/docs/` directory with `package.json`, `vite.config.ts`, `tsconfig.json`
- [ ] Install pinned `@motif-js/*@1.1.1` deps from npm (not `workspace:*`)
- [ ] Wire `@motif-js/compiler-swc` into `vite.config.ts`. **Note:** issue #5 is filed against compiler-swc — the runtime path works regardless, so blocking on it is unnecessary; just be aware the compile-time extraction may not be active until that's resolved.
- [ ] Wire `@mdx-js/rollup` for MDX
- [ ] Wire `vite-react-ssg` for prerender
- [ ] Wire React Router v7 (data router, file-based or code-driven — pick one and stick with it)
- [ ] Port `~/Downloads/Motif Design System/colors_and_type.css` into `apps/docs/theme/motif.ts` as a real `createTheme()` declaration. Light + dark sub-themes via the theme chain. Honor every value: paper, ink, terracotta accent, type scale, spacing scale, radii.
- [ ] Load Fraunces, Inter, JetBrains Mono via Google Fonts (matching the source CSS's `@import`)
- [ ] One MDX page (`/docs/introduction.mdx`) renders with full brand styling — Heading + Paragraph + Code via the MDX provider mapping to Motif primitives
- [ ] `<MotifReset />` mounted at the root
- [ ] `npm run build` produces a single-page static SSG build with no errors

Phase-0 done when: the introduction page loads with correct fonts, colors, and spacing in production preview, with no inline `style=` and no `className=` other than what Motif emits.

### Phase 1 — chrome (3–5 days)

Goal: the structural layout matches the reference design.

- [ ] `TopNav` — lockup, version pill, Cmd-K search button (no search yet), nav links, theme toggle. Built with `Box`, `HStack`, `Pressable`, `Link`. Sticky with hairline-on-scroll behavior.
- [ ] `Sidebar` — grouped sections, active link highlight, collapses to a sheet on `< $bp.md`. Uses `@motif-js/headless` Disclosure for the section toggles and a Sheet/Drawer pattern for mobile.
- [ ] `Article` shell — three-column layout at `≥ $bp.lg`, prose column at `≥ $bp.md`, single-column on mobile. Outer padding from `$space.16` etc.
- [ ] `OnThisPage` — TOC with scrollspy, sticky on the right column at desktop sizes.
- [ ] `Footer` — minimal lockup + meta + nav columns.
- [ ] Cmd-K modal — opens via `⌘K`, uses `@motif-js/headless` Modal + Combobox + an empty state placeholder. No search results yet (Pagefind comes in Phase 4).
- [ ] Theme toggle — flips light/dark via active theme on `<ThemeProvider>`.

Phase-1 done when: the introduction page can be navigated to from the home page via the nav, the sidebar shows on desktop and collapses on mobile, the OnThisPage scrollspy works, and Cmd-K opens an empty modal.

### Phase 2 — content components (3–5 days)

Goal: MDX prose looks finished.

- [ ] `CodeBlock` — Shiki at build time, brand-themed colors (terracotta highlight). Tabs (web/native variants), copy button, optional line highlighting, optional filename header.
- [ ] `Callout` — info / tip / warning / danger variants. Hairline left border in the variant color, faint tinted background.
- [ ] `Card` — hairline border, optional accent corner, used on the home page card grid.
- [ ] Eyebrow / lede / meta patterns for article headers.
- [ ] MDX provider — maps `p` → `Paragraph`, `h1`-`h4` → `Heading` with the right level, `code` → `Code`, `pre` → `CodeBlock`, `ul` → `Box as="ul"` etc.

Phase-2 done when: a fully MDX-authored article renders identically to a hand-coded equivalent built with Motif primitives.

### Phase 3 — Tier 1 content (5–7 days)

Goal: the ~10 Tier-1 pages exist with real prose and real code samples.

- [ ] Home (`/`) — hero, feature grid, footer CTA
- [ ] `/docs/introduction`
- [ ] `/docs/installation`
- [ ] `/docs/your-first-style`
- [ ] `/docs/web-and-native`
- [ ] `/docs/tokens`
- [ ] `/docs/variants`
- [ ] `/docs/theming`
- [ ] `/api/box`
- [ ] `/api/createTheme`
- [ ] `/404`

All code samples use the real Motif API (`<Box p="$4" bg="$accent">`), not the reference design's fictional `motif.view({...})` factory.

Phase-3 done when: every Tier-1 page is real prose, real examples, no placeholder Lorem Ipsum, voice consistent with the brand README.

### Phase 4 — search + playground (3–5 days)

Goal: search works, live demos work.

- [ ] Pagefind — index after each build, surface results in the Cmd-K modal via Combobox.
- [ ] Sandpack — embedded on every Tier-1+2 concept page. Pinned to `@motif-js/*@1.1.1` from npm. Per-page demo content tailored to the concept (variants page → variant interplay, theming → theme swap, animation → exitStyle).
- [ ] Tweaks panel — full version per the locked spec: mode (light/dark), accent picker (synthesizes a custom-accent theme on the chain), content width (standard/wide), body font (sans/serif — flips between Inter and Fraunces by swapping the active theme).
- [ ] LocalStorage persistence for tweaks panel state.

Phase-4 done when: Cmd-K returns useful results across all Tier-1 pages, Sandpack renders a working demo on at least three concept pages, and the tweaks panel changes are persistent across reloads.

### Phase 5 — polish (2–3 days)

- [ ] OG image generation per page
- [ ] Sitemap (`/sitemap.xml`)
- [ ] RSS for blog (if blog ships in v1; otherwise defer)
- [ ] Lighthouse pass — target 95+ on all four categories on the home page
- [ ] Mobile responsive sweep — phone, small tablet, large tablet
- [ ] Keyboard navigation audit — every interactive element reachable, focus rings visible, escape closes modals
- [ ] Reduced-motion verification — the `prefers-reduced-motion` path strips animations to opacity-only at 1ms
- [ ] Dark-mode verification — no broken contrast, no hard-coded light values
- [ ] Final brand-voice pass — no exclamation marks, sentence case, no emoji

Total: ~3–4 weeks of focused work for Tier 1.

---

## Dogfooding rules (pragmatic)

A practical rulebook so we don't drift. Pin this to the wall:

1. **No inline `style={{...}}`.** If you need a one-off style, add a token or use Motif style props.
2. **No `className=`.** Only Motif components emit classes (the compiler does it for us).
3. **No CSS modules, no styled-components, no Tailwind.** Period.
4. **MDX-emitted nodes pass through the MDX provider** to Motif components. The DOM that those components render is whatever Motif emits — that's the layer we don't worry about.
5. **Headless behavior comes from `@motif-js/headless`.** Not from Radix, not from Headless UI, not hand-rolled. Modal/Tabs/Combobox/Tooltip/Disclosure all from there.
6. **Icons from `@motif-js/icons`.** Lucide via Motif's wrapper, not direct from `lucide-react`.
7. **Reset from `@motif-js/reset`.** Single source.
8. **Imports from `@motif-js/react`.** Not from `@motif-js/react-web` directly. The single canonical entry is the dogfood proof.

If a rule needs to be broken, document why in a code comment near the deviation.

---

## Open issues

- **#5 — `compiler-swc`: no extracted CSS file in Vite build output.** https://github.com/foo-stack/motif-js/issues/5. The runtime path is functional, so this doesn't block docs work; investigate during Phase 0 wiring or Phase 1 chrome. Resolution may unlock the build-time extraction win across the docs site.

---

## Out of scope for v1

- Versioned docs
- I18n / multiple languages
- Authentication or user accounts
- Comments / community discussion
- Server-side analytics (deferred until launch)
- Full a11y audit beyond keyboard + reduced-motion (a separate Phase G item per the broader project roadmap)
- Migration guides from competing libraries
- Conf-talk landing page
- A separate marketing landing different from the docs home

---

## After this ships

The docs site is the **first** of four flagship apps. After Tier-1 ships and stabilizes, three cross-platform apps follow — deliberately differentiated shapes to spread proof across axes:

1. **Motion / gesture-heavy app** (chat, media player) → stresses presence-boundary + driver story
2. **Data-dense app** (dashboard, admin, finance) → stresses virtualization, responsive, table primitives
3. **Theming-heavy app** (multi-tenant, white-label, marketplace) → stresses theme chain + variant DSL

Together those four apps validate every claim Motif makes. The docs site is web-only, so the three follow-ups carry the React Native parity story.
