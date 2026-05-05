# motif-js docs site — LAST_MEMORY

> Single-paragraph summary of the most recent session, plus a precise pickup-point for the next one. Replace this file's body wholesale at the end of every session — it is not a log; the log lives in [PROGRESS.md](./PROGRESS.md). Always pair with [PLAN.md](./PLAN.md).

---

## Session: 2026-05-05 — Phase 5 (concepts + tutorials batches)

### What was done

This session shipped two Phase 5 batches in succession — the five concepts pages, then the four Getting started pages — for a total of 9 authored MDX pages plus two `_meta.ts` sidebar files. Source extraction grounded every page against `@motif-js/react@1.1.2`: `@motif-js/core` (`createTheme.ts`, `types.ts`, `token.ts`, `css-vars.ts`, `breakpoints.ts`), `@motif-js/react-web` (`Theme.tsx`, `Box.tsx`, `styled.tsx`), and `@motif-js/react-native` (the parallel surface inventory). Confirmed during the tutorials batch: there is no `motif` namespace export — the IA's `covers: ['motif', 'createTheme']` for the introduction was speculative; real consumers use named imports (`import { Box, styled, ThemeProvider, … } from '@motif-js/react'`). The introduction page's `covers:` was updated to `['createTheme', 'Box', 'styled']` to match what the page actually demonstrates. Each page conforms to the voice card; tutorials use the warm/encouraging/second-person register and `your-first-style` uses `<Steps>` for six numbered steps that end at a visible cream-vs-ochre `<Card tone="…">` result. Installation uses `<Tabs>` for the four package managers (npm/yarn/pnpm/bun) and lists the peer dep matrix (`react ≥ 18.0.0`, `react-dom ≥ 18.0.0` web, `react-native ≥ 0.74.0` native — both renderers marked optional). All gates: `lint` 772 warnings (baseline) / 0 errors, `format:check` clean, `typecheck` exit 0, `build` exit 0 (10 pages now: `/`, 5 concepts, 4 getting-started).

### Files touched this session

**Concepts batch** (committed as `c3c9623`):

- `apps/docs/content/concepts/tokens.mdx` — explanation; covers `createTheme`, `Theme`
- `apps/docs/content/concepts/variants.mdx` — explanation; covers `styled`, `variants`
- `apps/docs/content/concepts/theming.mdx` — explanation; covers `createTheme`, `ThemeProvider`
- `apps/docs/content/concepts/composition.mdx` — explanation; covers `styled`, `Box`
- `apps/docs/content/concepts/responsive.mdx` — explanation; covers `[]` (runtime is private to `@motif-js/core`)
- `apps/docs/content/concepts/_meta.ts` — sidebar order

**Tutorials batch** (this commit):

- `apps/docs/content/getting-started/introduction.mdx` — tutorial; covers `createTheme`, `Box`, `styled`
- `apps/docs/content/getting-started/installation.mdx` — howto; covers `[]`
- `apps/docs/content/getting-started/your-first-style.mdx` — tutorial; covers `Box`, `styled`
- `apps/docs/content/getting-started/web-and-native.mdx` — explanation; covers `[]`
- `apps/docs/content/getting-started/_meta.ts` — sidebar order

**Tracking**:

- `apps/docs/PROGRESS.md` — Phase 5 concepts + tutorials boxes ticked; three decisions log entries appended (manual auth, responsive covers `[]`, `motif`-not-a-symbol)
- `apps/docs/LAST_MEMORY.md` — replaced (this file)

### Open questions / known gaps carried forward

1. **No `motif` namespace export.** The IA listed `covers: ['motif', …]` for `/getting-started/introduction` and `'motif.view'` (placeholder) for `/getting-started/your-first-style` — both speculative. Real surface is named exports (`createTheme`, `Box`, `styled`, `ThemeProvider`, `Theme`, `Stack`, `Text`, …) from `@motif-js/react`. Reference pages later in Phase 5 should drop any reliance on a `motif` symbol entirely.
2. **`covers: []` on howto + cross-platform pages is intentional.** Installation (howto) and web-and-native (explanation) describe the surface holistically rather than documenting specific symbols. `docwright-mode-sync` will skip these on signature drift detection.
3. **Reference page signatures must come from source extraction.** Coming up next batch (or the one after): `/reference/{create-theme,styled,…}` need `tsc --noEmit`-grounded signatures. Read `dist/index.d.ts` from the published builds, not the source — the published types are what consumers see.
4. **Code samples are illustrative, not executed.** Same as last session. `docwright-verification`'s `samples-run` gate will land later; for now, validation is by reading. Every sample compiles mentally against the real `@motif-js/react@1.1.2` types.

### What to do next session

**Continue Phase 5 with the howto batch (Guides + Recipes — 8 pages)** per `session.json` writeOrder:

1. **Guides (4 pages)**
   - `/guides/design-system`
   - `/guides/migrating-styled-components`
   - `/guides/performance`
   - `/guides/server-rendering`
2. **Recipes (4 pages)**
   - `/recipes/buttons`
   - `/recipes/forms`
   - `/recipes/layouts`
   - `/recipes/animation`

**Per-page workflow** — same as the previous two batches:

1. Identify the goal of each page (howto pages assume the goal is known; lede should be "to do X, …").
2. Read the relevant source (Pressable, Button, Stack, Field/Input, motion.ts, etc.) for any concrete code samples.
3. Draft `apps/docs/content/<dir>/<slug>.mdx` using the components in `apps/docs/components/index.ts` (relative import `'../../components/index.js'`).
4. Add `_meta.ts` per directory in the same commit.
5. Gates: `yarn lint && yarn format:check && yarn workspace @motif-js/docs typecheck && yarn workspace @motif-js/docs build`.
6. Commit. The howto batch is split-able if 8 pages is too much for one session — consider committing guides and recipes as two commits.

**Voice for howto** (per voice card "Tone matrix"): _terse, recipe-shaped, no preamble; verb-first; assumes goal is known_. The lede should read "To do X, …" or similar — no "In this guide we'll…". Use `<Steps>` only when the steps must be ordered; otherwise keep prose tight and lead with code.

**After howto, the reference batch (5 pages):** the riskier one. Signatures must come from `dist/index.d.ts` of the published packages. Use `<ApiSignature>` for the function/component head and the param table.

### Watch-outs for the next batch

- **Howto pages should not feel like tutorials.** The reader has already finished Getting started; they know the API. Don't re-explain `createTheme` or `<ThemeProvider>` — link back to the relevant concept page.
- **`/guides/migrating-styled-components` is the most-likely-to-drift page.** It compares motif's API to styled-components' API; if styled-components ships a major API change, the comparison may stop reading right. Flag this on the page itself with a `last_verified:` and a soft caveat in prose.
- **`/guides/server-rendering` references `SSRStyleCollector`** — the only SSR-specific symbol in the public surface. Confirm in `@motif-js/react-web/src/index.ts` that the export still ships before drafting the page.
- **`/recipes/animation` should reference `enterStyle`, `exitStyle`, `transition`.** These are motion props on `Box` (per `BoxProps` in `react-web/src/Box.tsx`). The runtime sits in `@motif-js/core/src/motion.ts`. Show, don't only tell — at least one snippet per motion prop.
- **Top-level `content/_meta.ts` may become necessary** as the sidebar fills out. Vorge sorts directory entries alphabetically by default, which would put `concepts` before `getting-started` — the wrong order. Add the top-level meta when authoring the first guide (or earlier if the sidebar order looks off).
- **The CodeBlock component renders raw text** (no Shiki). Phase 7 polish will swap it. Continue preferring fenced ` ```tsx ` blocks (Shiki via vorge's pipeline) over `<CodeBlock>` for inline code; reserve `<CodeBlock>` for filename headers, copy buttons, and tab variants.
