# Last memory — session hand-off

> Per-session hand-off note. Overwritten at the end of every session. Read this **second**, after `DOC_PLAN.md` (the spec) and `PROGRESS.md` (the cross-session tracker).

---

## Session ended

**2026-04-30** — closing the docs-site planning + Phase −1.

## What this session did

A long pre-docs pass. Strategic decisions, then publish-pipeline cleanup, then artifact creation:

1. **Locked the docs-site plan** — stack (Vite + RR7 + vite-react-ssg + MDX + Shiki + Pagefind + full Sandpack + full tweaks panel), pragmatic dogfood, npm-pinned to `@motif-js/*@1.1.1`. Captured in `DOC_PLAN.md`.
2. **Phase −1 stabilization cut** — audited 8 packages, deleted 3 stub packages (`color`/`forms`/`primitives`), added `createTheme` factory, fixed `@motif-js/react` cross-platform routing, wrote 13 per-package READMEs, rewrote top-level README banner, cleaned 21 stale changesets.
3. **Manually bumped versions to v1.1.1** — `@changesets/cli@2.31.0` linked-mode bug majors any minor on a stable version (same root cause as the original v0.3.0 → v1.0.0 graduation). Bypassed the cli; sed-based version edits + manual CHANGELOG entries. See `feedback_changesets_cli_linked_mode_bug.md` in agent memory.
4. **Patched `scripts/publish.mjs`** — initial fix tried `yarn npm publish`, but yarn's auth resolution didn't see the user's `~/.npmrc` token ("No authentication configured for request"). Switched to a manual `workspace:*` rewriter inside the script: per-package, in-memory rewrite of `dependencies`/`devDependencies`/`peerDependencies` to concrete versions, run `npm publish`, restore the original file in a `finally` block. Verified via `yarn pack` and the actual v1.1.1 publish.
5. **User published v1.1.1** to npm — confirmed concrete deps (no `workspace:*` leakage).
6. **Smoke test passed** in `/tmp/motif-smoke` — fresh Vite project + pinned `@motif-js/*@1.1.1` installed cleanly, build succeeded.
7. **Filed issue #5** — compiler-swc produces no CSS file in Vite output. Runtime path works; build-time extraction appears to no-op.
8. **Wrote `DOC_PLAN.md`, `PROGRESS.md`, this file** — survival kit for the next session.

## Where to start (next session)

**Phase 0 — scaffold `apps/docs/`.** Specifically the unchecked tasks under "Next up — Phase 0: scaffold" in `PROGRESS.md`. Top of the list:

1. Create `apps/docs/` directory
2. Write `apps/docs/package.json` with pinned `@motif-js/*@1.1.1` deps
3. Wire Vite + React Router v7 + `vite-react-ssg` + MDX + compiler-swc
4. Port `~/Downloads/Motif Design System/colors_and_type.css` to `apps/docs/theme/motif.ts` as a `createTheme()` declaration
5. Get one MDX page rendering with the brand theme

`DOC_PLAN.md` "Phase 0 — scaffold" has the full task list with done-criteria.

## In-flight / unverified before next session starts

These were user-side actions the user said "Done" to but I didn't directly verify. Worth confirming early in the next session:

- **`npm deprecate` for the broken predecessors.** v1.0.0 and v1.1.0 of every `@motif-js/*` package were published with `workspace:*` leaked. The plan was for the user to deprecate them after v1.1.1 published. Verify with `npm view @motif-js/react@1.0.0` (look for `deprecated` field). If not deprecated, surface a reminder; the deprecate commands are in the v1.1.1 commit's body.
- **`npm deprecate` + `npm unpublish` for the three stub packages** (`@motif-js/color@1.0.0`, `@motif-js/forms@1.0.0`, `@motif-js/primitives@1.0.0`). Same — user-side, may or may not have happened. Verify with `npm view @motif-js/color`.
- **The four most recent commits aren't pushed yet** as of session close — the user got hit with a `v1.0.0` tag conflict on the previous push and resolved it but I don't know if the new commits made it up. Run `git log --oneline -5 origin/main` and compare with local `git log --oneline -5` to verify. If not pushed, the user pushes when ready.

## Open issues

- **#5 — `compiler-swc`: no extracted CSS file in Vite build output.** https://github.com/foo-stack/motif-js/issues/5. Doesn't block Phase 0 (runtime path works); investigate during scaffold or chrome.

## Recent commits (most recent first)

```
d7a78ba  docs: add DOC_PLAN.md, PROGRESS.md, untrack PROGRESS.md from .gitignore
0121c88  fix: rewrite workspace:* deps in publish.mjs without yarn auth
97dc02f  fix: publish via `yarn npm publish` so workspace:* gets rewritten — v1.1.1
f58153d  chore: v1.1.0 stabilization cut
2b8529b  feat: native-render bench harness — compile-path + motion-exit + virtual-list
```

`97dc02f` is superseded by `0121c88` — the yarn-publish path was abandoned in favor of the in-script workspace rewriter. Both are kept in history for context.

## Local environment notes

- `/tmp/motif-smoke/` exists from the smoke test — harmless, OS will eventually clean it.
- The user's IDE had `scripts/publish.mjs` open at session close.
- `gh` CLI is now installed and authenticated as `0xNeit`.
