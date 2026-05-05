# motif-js docs site — LAST_MEMORY

> Single-paragraph summary of the most recent session, plus a precise pickup-point for the next one. Replace this file's body wholesale at the end of every session — it is not a log; the log lives in [PROGRESS.md](./PROGRESS.md). Always pair with [PLAN.md](./PLAN.md).

---

## Session: 2026-05-05 — Phase 5 closed (concepts + tutorials + howto + reference + changelog)

### What was done

This session shipped **all five Phase 5 batches plus the changelog** in succession — concepts (5), Getting started (4), howto split into Guides + Recipes (4 + 4), reference (5), and `/changelog` (1) — for a total of **23 of 24 IA pages**. The only remaining IA page is `/` (the marketing landing), which the original PLAN explicitly deferred to Phase 6. Phase 5 is therefore done from the doc-quadrants perspective. Every reference signature is grounded in the published `dist/index.d.ts` of `@motif-js/{core,react,react-web}@1.1.2`. The changelog covers v0.1.0 (2026-04-27, first publish) through v1.1.2 (2026-04-30, current); it pulled tag boundaries from `git -C ~/Documents/GitHub/foo-stack/motif-js log --decorate --tags` and grouped untagged published versions (v1.1.0, v1.1.1, v1.1.2) by their stabilisation/fix commits. The `/changelog` page falls through to the default `DocLayout` because the dedicated `changelog` layout is stubbed (Phase 1's deferral); Phase 7 polish can swap it. All gates: `lint` 772 warnings (baseline) / 0 errors, `format:check` clean, `typecheck` exit 0, `build` exit 0 — **24 pages now**.

### Files touched this session

**Concepts** (commit `c3c9623`): `apps/docs/content/concepts/{tokens,variants,theming,composition,responsive}.mdx` + `_meta.ts`
**Tutorials** (commit `839cddd`): `apps/docs/content/getting-started/{introduction,installation,your-first-style,web-and-native}.mdx` + `_meta.ts`
**Guides** (commit `b4949d0`): `apps/docs/content/guides/{design-system,migrating-styled-components,performance,server-rendering}.mdx` + `_meta.ts` + `apps/docs/content/_meta.ts` (top-level section order)
**Recipes** (commit `edf3b34`): `apps/docs/content/recipes/{buttons,forms,layouts,animation}.mdx` + `_meta.ts`
**Reference** (commit `0750243`): `apps/docs/content/reference/{create-theme,styled,theme,use-theme,ssr}.mdx` + `_meta.ts`
**Changelog** (this commit): `apps/docs/content/changelog.mdx`

**Tracking**: `apps/docs/PROGRESS.md` — Phase 5 marked done for the doc quadrants; `/` deferred to Phase 6 per the original PLAN; ten decisions log entries appended across the session. `apps/docs/LAST_MEMORY.md` — replaced (this file).

### Open questions / known gaps carried forward

1. **The dedicated `changelog` layout is stubbed.** `apps/docs/theme/index.tsx` exports it; `apps/docs/theme/layouts.tsx` returns `<>{children}</>`. The page works under `DocLayout` for now (sidebar present, but with no `_meta.ts` entry the sidebar doesn't link to the page). Footer links to `/changelog` directly. Phase 7 polish should decide whether the changelog gets its own layout (with anchor jumps per version) or stays under `DocLayout`.
2. **Code samples remain illustrative, not executed.** `docwright-verification`'s `samples-run` gate has not landed. Validation is by reading. Reference signatures are byte-for-byte from the published `dist/index.d.ts`; everything else compiles mentally against real types.
3. **`/guides/migrating-styled-components` will drift on a styled-components major.** Pinned to 6.x with a soft caveat callout. Re-verify on each motif minor cut.
4. **Reference param tables are hand-written, not extracted.** A future docwright pass might generate them from `tsdoc` / `ts-morph`.
5. **Changelog drift.** The `/changelog` page has `last_verified: 2026-05-05`. Every motif-js release after 2026-04-30 needs a new entry at the top of the page; `docwright-changelog`'s ref-range-driven mode is the natural fit when it's wired in.

### What to do next session

**Phase 5 is closed.** The plan estimates Phase 6 as one session — the marketing landing page (`/`) — and Phases 7 + 8 as one session each (search + 404 + polish, then visual fidelity audit).

**Recommended next session — Phase 6 (`/` landing page).** From the original PLAN, this is the longest single page and reads more like a marketing surface than a doc page. Build, in order, mirroring `~/Downloads/Motif Documentation/HomePage.jsx`:

1. **`Hero`** — eyebrow ("v1.x · Now stable"), display headline (italic emphasis on a phrase), lede, primary CTA + copy-install button + GitHub stars button, meta strip (KB / zero-runtime / platforms / license), tabbed code preview (Component / Theme / Variants).
2. **`UsedBy`** — logo strip with low-opacity logos.
3. **`BentoFeatures`** — 4–6 cards in an asymmetric bento grid.
4. **`UniversalShowcase`** — split panel: web preview vs. native preview, same source code.
5. **`Comparison`** — table comparing motif-js vs. styled-components vs. CSS modules vs. vanilla extract.
6. **`StatsStrip`** — bundle size, perf, install count.
7. **`ComponentGallery`** — sample components built with motif-js, rendered live.
8. **`Testimonials`** — pull quotes (filler text, marked clearly until real ones land).
9. **`ChangelogPeek`** — last 3 changelog entries, "View full changelog" link to `/changelog`.
10. **`FinalCTA`** — closing band with primary CTA.

All sections built with motif-js's `styled()` and primitives (per the dogfood rule). Type ramp uses
the design tokens. **Verification: visually diff against the reference HTML in `index.html`.**

**Per-section workflow:**

1. Open `~/Downloads/Motif Documentation/HomePage.jsx` for the visual reference.
2. Build the section component in `apps/docs/content/index.mdx` (or — better — a hand-built MDX
   that imports section components from a new `apps/docs/components/landing/` directory).
3. Skip a `<DocLayout>` chrome — the landing uses `MarketingLayout` (currently stubbed). Phase 6
   should also de-stub `MarketingLayout` so the landing has its own chrome (no sidebar / TOC).
4. Run gates and commit per section, or batch a few at a time.

**Then Phase 7 (search + 404 + polish):**

- `@vorge/plugin-pagefind` wiring, `SearchModal` island, Cmd-K to open.
- Author `/404` (per PLAN).
- Sitemap + robots.txt via `@vorge/plugin-sitemap`.
- OG image + favicon + apple-touch-icon.
- Cross-page link verification (`docwright-verification` final pass).
- Lighthouse pass on `/` and a sample doc page (≥ 95 across the board).
- Reduced-motion + `prefers-color-scheme` first-paint correctness.

**Then Phase 8 (visual fidelity audit):**

- Side-by-side screenshots: `/`, `/getting-started/introduction`, `/concepts/tokens`,
  `/reference/create-theme`, `/changelog`, `/404`.
- Resolve every diff > 4px or 2 hex-units.

### Watch-outs for Phase 6

- **Dogfood the `styled()` API** for landing-page sections. The plan's "every section is built
  with motif-js's `styled` and primitives" rule still holds. Don't reach for raw CSS modules.
- **Sandpack is out for v1.** Hero "Try it" tab uses static-highlighted code. (Per locked
  decision.)
- **`MarketingLayout` is stubbed.** First Phase 6 step is to de-stub it — full-width container, no
  sidebar, no TOC. The chrome (`TopNav` + `Footer`) still applies.
- **Landing page imports follow the same relative pattern** as the doc pages
  (`'../components/index.js'` from a top-level page like `index.mdx`).
- **The CodeBlock component renders raw text** (no Shiki). The Hero's tabbed code preview will
  look unstyled until Phase 7 polish swaps the CodeBlock to Shiki. Worth flagging in the Phase 6
  commit so it does not look like a regression.
- **Data sources for stats / testimonials.** `StatsStrip` needs real numbers (bundle size from CI,
  install count from npm); `Testimonials` will ship with placeholder text marked clearly. Confirm
  with the user whether to fetch live numbers or hardcode them per release.
