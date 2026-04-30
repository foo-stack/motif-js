# Last memory — session hand-off

> Per-session hand-off note. Overwritten at the end of every session. Read this **second**, after `DOC_PLAN.md` (the spec) and `PROGRESS.md` (the cross-session tracker).

---

## Session ended

**2026-04-30** — closing Phase −1 + Phase 0 in one long sitting.

## What this session did

A multi-arc session: locked the docs-site plan, closed Phase −1 (a stabilization publish cut), then ran straight through Phase 0 (the docs-app scaffold).

### Phase −1 — v1.1.1 publish (earlier in session)

Audited 8 packages, deleted 3 stub packages (`color`/`forms`/`primitives`), added `createTheme` factory in `@motif-js/core`, fixed `@motif-js/react` cross-platform routing, wrote 13 per-package READMEs, deleted 21 stale changesets. Manually bumped versions because `@changesets/cli@2.31.0` linked-mode majors any minor on a stable version (see `feedback_changesets_cli_linked_mode_bug.md` in agent memory). Patched `scripts/publish.mjs` to rewrite `workspace:*` deps in-place around each `npm publish` (the original bug behind the broken v1.0.0 + v1.1.0 publishes). User published v1.1.1; smoke test passed against npm. Filed [issue #5](https://github.com/foo-stack/motif-js/issues/5) for compiler-swc not emitting CSS.

### Phase 0 — `apps/docs/` scaffold (later in session)

Live and prerendering. `apps/docs/build/client/index.html` and `apps/docs/build/client/docs/introduction/index.html` both exist and contain the rendered MDX content with the brand theme tokens emitted as CSS custom properties.

**Mid-phase pivot:** the originally-locked `vite-react-ssg` doesn't support React Router v7 (its README explicitly recommends RR7 users use the framework's built-in `prerender` config). Switched to RR7 framework mode — `@react-router/dev` + `react-router.config.ts`. `DOC_PLAN.md` updated to reflect.

App structure:

```
apps/docs/
├── package.json                     pinned @motif-js/*@1.1.1, RR7 framework deps
├── vite.config.ts                   mdx (enforce: pre) + reactRouter + motifExtract
├── tsconfig.json                    app/ + .react-router/types/ included
├── react-router.config.ts           ssr: false + prerender: ['/', '/docs/introduction']
├── app/
│   ├── root.tsx                     Layout + ThemeProvider + MDXProvider + MotifReset; Google Fonts via links export
│   ├── routes.ts                    index + docs/introduction
│   ├── routes/
│   │   ├── _index.tsx               renders Introduction.mdx (placeholder until Phase 3)
│   │   └── docs.introduction.tsx    renders Introduction.mdx
│   ├── pages/
│   │   └── Introduction.mdx         placeholder content from DOC_PLAN voice
│   ├── components/
│   │   └── MdxComponents.tsx        MDX → Motif primitive mapping (h1-4, p, code, blockquote, kbd, a, wrapper)
│   ├── theme/
│   │   └── motif.ts                 paperTheme + inkTheme — full port of colors_and_type.css
│   └── types.d.ts                   *.mdx module declaration + vite/client types
└── build/                           prerendered static output (gitignored)
```

Workspace-side touches:

- `.gitignore` — added `.react-router/`
- `.oxlintrc.json` — added `**/.react-router/**` (defense-in-depth; the gitignore alone gets oxlint to skip them)

Verification: `yarn build` clean, `yarn typecheck` clean, `yarn lint` clean (777 warnings, 0 errors), Phase 0 done-criterion met (intro page loads with brand theme applied, no inline `style=`, no `className=` other than what Motif emits).

## Where to start (next session)

**Phase 1 — chrome.** Per `PROGRESS.md` "Next up" section. Top of the list:

1. `TopNav` — lockup, version pill, Cmd-K search button (no search yet), nav links, theme toggle. Sticky with hairline-on-scroll.
2. `Sidebar` — grouped sections, active link highlight, collapses to a sheet on `< $bp.md` (use `@motif-js/headless` Disclosure + Sheet).
3. `Article` shell — three-column layout at `≥ $bp.lg`; outer padding from `$space.16`.
4. `OnThisPage` — TOC scrollspy.
5. `Footer`.
6. Cmd-K modal — `@motif-js/headless` Modal + Combobox, empty results.
7. Theme toggle — flips `paperTheme` ↔ `inkTheme` on `<ThemeProvider active>`.

`DOC_PLAN.md` "Phase 1 — chrome" has the full list with done-criteria.

**Reference designs to mirror** (in `~/Downloads/Motif Documentation/`):

- `Nav.jsx` — TopNav lockup + version pill + search + theme toggle
- `Sidebar.jsx` — grouped sections, active state
- `Pages.jsx` — article header eyebrow / lede / meta patterns
- `Footer.jsx` (in design-system ui_kits) — minimal lockup + meta

The reference uses fictional `motif.view({...})` factory and inline CSS — port to real Motif primitives + style props.

## In-flight / unverified before next session starts

These are user-side actions still pending. None block Phase 1, but worth confirming:

- **`npm deprecate`** for the broken predecessors (v1.0.0 and v1.1.0 of all 13 `@motif-js/*` packages). Verified at session close: `npm view @motif-js/react@1.0.0 deprecated` returned empty. The deprecate commands are in the v1.1.1 commit body.
- **`npm deprecate` + `npm unpublish`** for the three stub packages (`@motif-js/color@1.0.0`, `@motif-js/forms@1.0.0`, `@motif-js/primitives@1.0.0`). Verified at session close: still on npm, not deprecated.
- **Push state.** As of session close, multiple commits land on top of the previously-pushed tip. Run `git log origin/main..HEAD --oneline` to confirm what's unpushed.
- **`/tmp/motif-smoke/`** — sandbox from the smoke test still on disk; harmless, OS will eventually clean.

## Open issues

- **#5 — `compiler-swc`: no extracted CSS file in Vite build output.** https://github.com/foo-stack/motif-js/issues/5. Confirmed in Phase 0: still no CSS file in `apps/docs/build/client/assets/`. Theme tokens go through the runtime path (inline `<style data-motif-themes="root">` in the prerendered HTML). Doesn't block Phase 1.

## Phase 0 verification snippets (for sanity-checking the next session is in a sane state)

```sh
# build the docs site
cd apps/docs && yarn build

# expect:
#   build/client/index.html
#   build/client/docs/introduction/index.html
#   build/client/__spa-fallback.html
#   build/client/assets/*.js  (no .css file — issue #5)

# inspect the prerendered HTML
head -c 2000 apps/docs/build/client/index.html
# expect: <html data-theme="paper"> in head, <style data-motif-themes="root"> with --colors-paper-100: #FBF7F2 etc.

# typecheck
cd apps/docs && yarn typecheck       # expect clean

# lint
yarn lint                             # expect 777 warnings, 0 errors
```

## Local environment notes

- `gh` CLI is installed and authenticated as `0xNeit`.
- `/tmp/motif-smoke/` exists from the v1.1.1 smoke test — separate from `apps/docs/`.
- The brand inputs at `~/Downloads/Motif Design System/` and `~/Downloads/Motif Documentation/` are still in place and are the source of truth for visual reference + content port.
