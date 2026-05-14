# @usemotif/migrate

> Renamed from `@motif-js/migrate` in v3. The CLI bin renamed from
> `motif-js-migrate` to `usemotif-migrate`. The `rename-v2` transform
> is kept for back-compat; the new primary command is `rename-v3`.

## 1.0.0

### Major Changes

- **Fresh v1.0.0 on the `@usemotif/*` scope (renamed from `@motif-js/migrate`).** Bin renamed from `motif-js-migrate` → `usemotif-migrate` to match the new package name.
- **New `rename-v3` transform.** Rewrites v1 OR v2 import specifiers to their v3 (`@usemotif/*`) names in one pass. The regex is a single alternation: `@motif-js/react-web` → `@usemotif/react`, every other `@motif-js/<name>` → `@usemotif/<name>`. Subpaths (`@motif-js/react/server`, `@motif-js/react/tanstack-virtual`) survive — the renamed DOM bindings package still owns those exports under `@usemotif/react`.
- **The `@motif-js/react` ambiguity.** `@motif-js/react` was the cross-platform aggregator in v1 and the DOM bindings in v2; `rename-v3` always maps it to `@usemotif/react` (the v3 DOM bindings). For v1 cross-platform code that needs the unscoped `usemotif` meta package instead, run `rename-v2` first to disambiguate, then `rename-v3`.
- **CLI changes.** `usemotif-migrate rename-v3 [path] [--dry-run]` is the new primary command. `rename-v2` retained for back-compat (v1 holdouts who want to go v1 → v2 → v3 in two steps). HELP text updated.
- **Programmatic API.** `applyRenameV3` and `needsRenameV3` exported alongside the v2 functions.

## 2.0.0

### Major Changes

- **Initial release.** New workspace package providing the `rename-v2` codemod for migrating v1 import specifiers to their v2 names. Both CLI (`npx @motif-js/migrate rename-v2`) and programmatic (`applyRenameV2`, `needsRenameV2`) surfaces. Single-pass alternation regex rewrites `@motif-js/react-web` → `@motif-js/react` and bare `@motif-js/react` → `usemotif` in one walk, sparing `@motif-js/react-native` and subpath imports like `@motif-js/react/server`. Joins the linked-version group at 2.0.0.
