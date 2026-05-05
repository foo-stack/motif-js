# motif-js docs site — LAST_MEMORY

> Single-paragraph summary of the most recent session, plus a precise pickup-point for the next one. Replace this file's body wholesale at the end of every session — it is not a log; the log lives in [PROGRESS.md](./PROGRESS.md). Always pair with [PLAN.md](./PLAN.md).

---

## Session: 2026-05-05 — Phase 0

### What was done

Phase 0 plumbing landed end-to-end. Created `apps/docs/package.json` (`@motif-js/docs`, private, scripts `dev`/`build`/`preview`/`typecheck`), `apps/docs/tsconfig.json` (extends `@motif-js/tsconfig/app.json`), minimal `apps/docs/vorge.config.ts` (`title`, `description`, `server.port: 4321`), and `apps/docs/content/index.mdx` (hello-world). Installed vorge `^1.0.0` and friends from npm; resolved one yarn peer warning by adding `vite@^6.0.3` as a direct dep. Discovered vorge's CLI hard-codes `themeImport: '@vorge/theme-default'` for `virtual:vorge/theme` resolution (no config knob), so added `@vorge/theme-default@^1.0.0` to Phase 0 deps; Phase 1 swaps it for the local `@motif-js/docs-theme`. `yarn dev` serves on `http://localhost:4321`, `yarn build` emits `dist/index.html` rendering the hello content under vorge's default theme. Added `.vorge/` to `.gitignore`, `.oxfmtignore`, and `.oxlintrc.json` `ignorePatterns` so vorge's generated `entry-server.jsx`/`entry-client.jsx`/`server/` artifacts don't trip the format/lint gates. Ran `yarn format` to normalize whitespace in the freshly-written PLAN/PROGRESS/LAST_MEMORY markdown. Verified gates: `yarn lint` 0 errors (772 pre-existing warnings in `scripts/` and other packages, untouched), `yarn format:check` clean, `yarn workspace @motif-js/docs typecheck` exit 0, `yarn build` exit 0.

### Files touched this session

- `apps/docs/package.json` — created
- `apps/docs/tsconfig.json` — created
- `apps/docs/vorge.config.ts` — created
- `apps/docs/content/index.mdx` — created
- `apps/docs/PLAN.md` — re-formatted by oxfmt (table alignment + JSON whitespace; no content changes)
- `apps/docs/PROGRESS.md` — Phase 0 marked done; decisions log extended with port choice, theme-default note, vite peer-dep note
- `apps/docs/LAST_MEMORY.md` — replaced (this file)
- `.gitignore` — added `.vorge/`
- `.oxfmtignore` — added `.vorge/`
- `.oxlintrc.json` — added `**/.vorge/**` to `ignorePatterns`
- `yarn.lock` — regenerated

### Open question carried into Phase 1

Vorge's CLI does not surface a `theme` knob in `defineConfig()` — the option exists in `@vorge/vite`'s `vorge({ theme })` factory but the CLI calls it without `theme`. Two paths for Phase 1:

1. **Wrap the CLI** — replace `vorge dev`/`vorge build`/`vorge preview` scripts with a thin local script that calls `vorge()` from `@vorge/vite` directly with `theme: '@motif-js/docs-theme'`, then runs Vite. (Most explicit; some glue code.)
2. **Publish-as-name workaround** — name our local theme package `@vorge/theme-default` via a yarn `resolutions:` override that points at the local workspace package. (Hacky; abuses npm name resolution.)
3. **Patch vorge upstream** — file a PR/patch in `~/Documents/GitHub/foo-stack/docforge/` adding a `theme` option to the config schema and wiring it through `cli/src/dev.ts`+`build.ts`+`preview.ts`. (Cleanest; requires a 1.0.x patch publish before consumption.)

Per PLAN risk note 1, **option 3 is preferred** — fix vorge upstream first, then upgrade `apps/docs`. Investigate at start of Phase 1.

### What to do next session

**Start Phase 1** — tokens + theme package + fonts. Open [PLAN.md](./PLAN.md) "Phase 1" section. First steps:

1. **Resolve the theme-resolution question above.** Read `~/Documents/GitHub/foo-stack/docforge/packages/cli/src/dev.ts` + `build.ts` + `preview.ts`, decide between options 1/2/3, and execute. Recommend option 3 (upstream patch) unless the user wants to ship faster.
2. **Port `colors_and_type.css` into `apps/docs/theme/tokens.ts`.** Use motif-js's `createTheme()`. Two themes (`light`, `dark`). Reference: `~/Downloads/Motif Design System/colors_and_type.css`.
3. **Stub layout exports in `apps/docs/theme/index.ts`.** Each layout is `({ children }) => <>{children}</>` for now; Phase 2 fleshes out `DocLayout` + chrome.
4. **Wire Google Fonts** (Fraunces / Inter / JetBrains Mono) — vorge head-injection hook or a one-off `transformHtml` plugin.
5. **Generate Shiki themes** `motif-paper.json` + `motif-ink.json` matching the warm palette; wire via `markdown.shiki.themes` in `vorge.config.ts`.
6. **Verify** a `<motif.View bg="$bg-paper">` renders cream under `[data-theme="light"]` and ink under `[data-theme="dark"]`.

End the session with a green build + lint/format/typecheck clean and a commit covering Phase 1.
