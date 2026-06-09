# @usemotif/migrate

## 1.1.4

### Patch Changes

- Patch release rolling up 25 bug, accessibility, and cross-platform fixes from a full-codebase audit (issues #183–#207).

  Highlights:
  - **core**: unitless CSS props (`aspect-ratio`, `flex`, grid line props) now emit bare numbers instead of `1px`, restoring runtime/compiler output parity; fully space-delimited CSS Color 4 `rgba()`/`hsla()` (`rgb(255 0 0 0.5)`) parse for color interpolation; object-form value props such as `fontVariationSettings` are no longer mis-detected as responsive when a key collides with a breakpoint name.
  - **react**: a disabled `<Link>` no longer performs default browser navigation; `enterStyle` is no longer rendered during SSR (no FOUC, no hydration mismatch); `Avatar` falls back to initials for a cached/already-broken image; `useAnimate().finished` rejects on cancel per its documented contract; `ZStack` preserves each child's key; an orphaned `<Theme>` no longer re-renders every consumer each render.
  - **react-native**: a native style translator maps shadow tokens to native `shadow*`/`elevation`, array-izes literal `transform` strings, and drops web-only props; enter/exit animations interpolate toward each key's resting value (e.g. `opacity` → 1) instead of 0; native translate preserves percentage units.
  - **styled() (`usemotif`)**: `styled('button', …)` keeps the intended element type on React Native; an explicit `undefined` prop no longer erases a base/variant value.
  - **headless**: Popover closes on Escape when focus is on the trigger; DatePicker's trigger label updates in uncontrolled mode; nested NavigationMenu submenus collapse one level per Escape; MultiSelect detects a controlled value via `'value' in props`; Toast no longer double-announces; TreeView ArrowLeft climbs to the parent, the ColorPicker saturation/value plane is a slider with `aria-valuetext`, and FormatToggle gets roving-tabindex arrow-key navigation.
  - **compiler / build tooling**: extracted CSS aggregates in a deterministic order (reproducible builds); the literal extractor refuses to bake mutated `const` objects/arrays; query-suffixed module ids (`?v=`, `?used`) are transformed; a single malformed file no longer aborts the compile/codemod run; the tree-shaking check now fails when a target fails to bundle.

## 1.1.3

### Patch Changes

- c56dddd: Fix Markdown fence parsing in the codemod scoper. The fence matcher only understood exactly-three-character fences, so a 4+-backtick block (which CommonMark allows precisely so it can contain a ``` example) — or a longer-tilde fence — matched only up to the first inner triple fence, leaving the real code unrewritten and mis-bucketing the trailing prose. A length-aware line scanner now matches an opener of N≥3 fence chars and a close of at least N of the same char.

## 1.1.2

### Patch Changes

- Patch release rolling up 32 bug, security, and accessibility fixes from a full-codebase audit (issues #81–#111 and follow-up #143).

  Highlights: fixed a `Box` conditional-hook crash on style-prop toggles; `Show`/`Hide` now react to viewport resize; default themes ship the `durations`/`easings`/`animations` scales so the `animation` prop resolves; the compiler now matches the runtime's class output (pseudo-override lifting + canonical rule order); Calendar/TreeView keyboard navigation moves real DOM focus; Combobox/Select can be cleared to `undefined`; and `themeToCssBlock` escapes the theme name (CSS-injection hardening). Plus React-Native layout-animation/theme-persistence/loading-indicator fixes, numerous headless a11y fixes (Dialog, Menu/ContextMenu, HoverCard, NavigationMenu), and compiler/codemod/build-script robustness fixes. See the v1.1.2 release notes for the full list.

## 1.1.1

### Patch Changes

- Lockstep version bump — no functional changes. Released alongside the v1.1.1 patch so every `@usemotif/*` package stays on a single version line.

## 1.1.0

### Patch Changes

- Version sync. No behavioral changes in this package; released alongside the motion-system roadmap across the rest of the `@usemotif/*` packages.

> Renamed from `@motif-js/migrate` in v3. The CLI bin renamed from
> `motif-js-migrate` to `usemotif-migrate`. The `rename-v2` transform
> is kept for back-compat; the new primary command is `rename-v3`.

## 1.0.2

### Patch Changes

- Version sync. No behavioral changes in this package; released alongside the cross-platform `Button` fixes ([#22](https://github.com/foo-stack/usemotif/issues/22)) for version uniformity across the workspace.

## 1.0.1

### Patch Changes

- **Version bump only.** No changes in this package; bumped to keep the linked `@usemotif/*` group on a single version.

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
