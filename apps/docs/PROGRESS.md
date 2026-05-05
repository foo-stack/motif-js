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

Status: **not started**

- [ ] `theme/tokens.ts` ported from `colors_and_type.css`
- [ ] `theme/index.ts` exports `layouts` (stubbed)
- [ ] vorge wired to use the local theme
- [ ] Google Fonts (Fraunces / Inter / JetBrains Mono) loaded
- [ ] Two Shiki themes generated + wired
- [ ] motif-js `createTheme` import is real (proves dogfood wiring)

Verification: a `<motif.View bg="$bg-paper">` element renders cream; `data-theme="dark"` toggles to ink.

---

## Phase 2 — Site chrome

Status: **not started**

- [ ] `TopNav.tsx` (sticky, scroll-bordered, 3-col grid)
- [ ] `VersionPill.tsx` (dropdown, click-outside)
- [ ] `SearchTrigger.tsx` (icon + placeholder + ⌘K kbd)
- [ ] `Sidebar.tsx` (wraps `@vorge/core/primitives` Sidebar)
- [ ] `OnThisPage.tsx` (wraps TOC, scrollspy)
- [ ] `PageNav.tsx` (wraps Pager)
- [ ] `Footer.tsx`
- [ ] `ThemeToggle.tsx` (SSR-safe, no flash)
- [ ] `DocLayout.tsx` (3-col grid composition)

Verification: empty page chrome looks right; theme toggle persists across reloads; nav border appears on scroll.

---

## Phase 3 — Article surface + MDX components

Status: **not started**

- [ ] `Eyebrow.tsx`
- [ ] `Lede.tsx`
- [ ] `Callout.tsx` (info / warn / danger / success)
- [ ] `CodeBlock.tsx` (filename + copy + line highlights)
- [ ] `Tabs.tsx` + `Tab.tsx`
- [ ] `Steps.tsx`
- [ ] `FileTree.tsx`
- [ ] `Image.tsx`
- [ ] `ApiSignature.tsx`
- [ ] Demo page exercising every component (`content/_demo/components.mdx`, `draft: true`)

Verification: visual diff vs. reference HTML is within 4px on every component.

---

## Phase 4 — Discovery + IA + voice card

Status: **not started**

- [ ] docwright author mode invoked
- [ ] IA proposed and approved
- [ ] Voice card approved
- [ ] `.docwright/session.json` written with `platform: "vorge"`

Verification: session JSON committed; IA matches reference Sidebar; voice card matches design system voice rules.

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

| Date       | Phase | Decision                                                                                                                                                                                                           | Rationale                                                             |
| ---------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| 2026-05-05 | —     | Build fresh in `apps/docs/`. Previous attempt deleted in `cae8565`; do not migrate prior content.                                                                                                                  | User request — fresh attempt.                                         |
| 2026-05-05 | —     | Target framework is **vorge** from sibling repo `~/Documents/GitHub/foo-stack/docforge/`.                                                                                                                          | User request.                                                         |
| 2026-05-05 | —     | Vorge dependencies are **plain npm at `^1.0.0`**. All 15 vorge packages are published. The local repo at `~/Documents/GitHub/foo-stack/docforge/` is reference material for capabilities, not a dependency source. | Vorge 1.0.0 ships across `@vorge/*` and `create-vorge`.               |
| 2026-05-05 | —     | **Custom theme package** (`apps/docs/theme/`) replaces `@vorge/theme-default`.                                                                                                                                     | We don't want Tailwind. Dogfood motif-js for layouts.                 |
| 2026-05-05 | —     | **Per-page MDX component imports**, not auto-mapping.                                                                                                                                                              | Aligns with `docwright-vorge` skill spec. Revisit if painful.         |
| 2026-05-05 | —     | **No Sandpack in v1.** Hero "Try it" tabs use static-highlighted code.                                                                                                                                             | Adds 700 KB to one page; not worth it for the first cut.              |
| 2026-05-05 | —     | **No multi-version routing in v1.** Version pill is decorative; wire `@vorge/plugin-versioned-docs` when v2.0 of motif-js is on the horizon.                                                                       | Nothing to switch between yet.                                        |
| 2026-05-05 | —     | **No i18n in v1.**                                                                                                                                                                                                 | Adds noise; English-only is fine.                                     |
| 2026-05-05 | 0     | **Dev/preview port is `4321`** (not vorge's default 5173).                                                                                                                                                         | `apps/playground-web` already uses 5173.                              |
| 2026-05-05 | 0     | **`@vorge/theme-default@^1.0.0` added to deps for Phase 0 plumbing.** Vorge resolves `virtual:vorge/theme` to this import string by default; the CLI does not surface a config option to override it.              | Phase 1 will replace it once the local `@motif-js/docs-theme` exists. |
| 2026-05-05 | 0     | **`vite@^6.0.3` declared as a direct dep** of `apps/docs` to satisfy `@vorge/vite`'s peer-dep contract.                                                                                                            | Was emitting a yarn peer warning otherwise.                           |

---

## Blockers

(none currently)

When something is blocked, file it here with:

- What's blocked
- What it's blocked on (vorge bug, motif-js bug, design ambiguity, …)
- Where the workaround/escape lives
- Date filed
