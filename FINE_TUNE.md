# FINE_TUNE.md — post-launch punch list

Engineering items queued for v1.x patches after the seven-phase
ROADMAP closes. Ordered by recommended execution sequence:
foundational items first (unblock later work), then highest
user-visible value, then legitimacy / launch-prep, then long-tail
quality polish.

Items that need humans (the external a11y audit and the launch
post / video / Show HN) live in the ROADMAP, not here. This file
is for things a future engineering session can pick up and ship
independently.

Status legend: ⬜ not started · 🟦 in progress · ✅ done

Effort key:

- **S** — small, single focused session.
- **M** — medium, ~2–4 sessions.
- **L** — large, multiple sessions or needs external infra.

---

## Block 1: compiler perf wins (sequence; share context)

These three are the "Phase D loose ends" memory note. Doing them
back-to-back means one context load on the compiler architecture,
one shared mental model.

### 1. Wrapper-stripping for fully-static cases — `S`

✅ Box / Text / Stack / HStack / VStack are now replaced with their
underlying HTML tag (`div` / `span`) when the call site is fully
static, has no `as` prop, and (Stack/HStack/VStack) when synthesized
`display: flex` / `flexDirection` apply. Bench: compiled went from
1.73× → 2.15× over runtime, beating the 2.10× vanilla floor.

Pressable stripping is still gated on item #2 (pseudo-state
extraction) and a follow-up that handles `onPress` / `disabled` /
cursor remap. Image stripping is intentionally never on the table —
the overlay state machine lives in the wrapper.

**Pointers:**

- `packages/compiler-core/src/primitives.ts` — per-primitive metadata
  (default tag, synthesized props, alias map, strippable flag).
- `packages/compiler-babel/src/index.ts` `maybeStripWrapper`.
- `benchmarks/render/src/list-of-boxes.bench.tsx` — added the
  `compiled-stripped` row that measures the post-strip shape.

### 2. Pseudo-state extraction in `compiler-core` — `S`

✅ `_hover` / `_focus` / `_active` / `_disabled` bags on Pressable
extract at compile time when the value is a literal object. Output
is one `m-<hash>` class plus a CSS body built via
`buildPseudoCss` — byte-identical to what the runtime emits, so a
half-compiled / half-runtime app dedupes correctly. The 3
previously-skipped differential cases now pass.

Pressable wrapper-stripping is still a follow-up: even with pseudo
extracted, the wrapper still owns `onPress`, `disabled`, the
disabled-click suppression and the cursor default. Those need a
separate compile-time rewrite before `nonStrippableProps` can
narrow.

### 3. Native `StyleSheet.create` hoisting in `compiler-metro` — `M`

⬜ Today the native target is a Babel-side no-op. `extractNative`
produces entries; nothing splices them into a hoisted
`StyleSheet.create({...})`.

**Implementation sketch:**

- Per-file accumulator in `compiler-babel`'s plugin state.
- `Program.exit` hook injects `import { StyleSheet } from 'react-native'`
  and a top-level `const _motifStyles = StyleSheet.create({ id1: {...}, ... })`.
- Each call site's `style={...}` becomes `style={_motifStyles.idN}`
  (merged with any user-supplied style via array form).

**Pointers:**

- `packages/compiler-core/src/extract-native.ts` — already produces
  the literal-only base style entries.
- `packages/compiler-babel/src/index.ts` — extend the plugin to
  branch on `target === 'native'`.

---

## Block 2: complete the broken-on-arrival components

These are the things that ship in v1.0.0 either as runtime stubs
(throw on use) or as obviously-incomplete v0 shims. They feel
broken to a fresh user reading the docs; close them before any
launch push.

### 4. `MultiSelect` real implementation — `M`

⬜ Currently throws `Error('MultiSelect is not yet implemented...')`
at runtime. Real impl needs:

- `value: T[]` state shape (controlled + uncontrolled).
- Chip layer inside the input — render selected items as
  removable chips before the cursor.
- `maxSelections?: number` ceiling.
- `enableSelectAll?: boolean` for bulk select / clear.
- ARIA: `aria-multiselectable="true"` on the listbox.

**Pointers:**

- `packages/headless/src/combobox.tsx` — extend the `Combobox`
  state machine; share filter / option-rendering logic.
- Reference: Radix's `Multi-select` pattern + react-aria's
  `useMultiSelect`.

### 5. `CommandPalette` real implementation — `M`

⬜ Currently throws. Real impl needs:

- Section labels (Recent / Suggested / Actions / etc.).
- Keyboard-shortcut hints rendered alongside items (`<Kbd>⌘P</Kbd>`).
- Fuzzy match (typically [`cmdk`](https://github.com/pacocoursey/cmdk)
  or [`fzf`](https://github.com/junegunn/fzf)-style; pick a small
  pure-JS fuzzy lib).
- `⌘K` / `Ctrl+K` global activation hook.
- Recent / pinned items.

**Pointers:**

- `packages/headless/src/combobox.tsx` — Combobox is the foundation;
  CommandPalette wraps it inside Dialog with a keyboard-shortcut
  registration hook.

### 6. Full HSV `ColorPicker` — `M`

⬜ v0 wraps native `<input type="color">`. Real picker needs:

- Saturation × value plane (drag to pick).
- Hue slider.
- Alpha slider (when `format !== 'hex'`).
- Format toggle: hex / rgb / hsl.
- Native: react-native-color-picker integration (peer dep).

**Pointers:**

- `packages/headless/src/specialized.tsx` — extend `ColorPicker`.
- The same picker shape works for the icon set's "swatch picker"
  use case in the playground.

---

## Block 3: foundational native infrastructure

Native parity work that unblocks the headless-on-native shipment
in Block 4.

### 7. `react-native-svg` integration for native `Svg` / `Icon` — `S`

⬜ Native `Svg` already accepts a `SvgComponent` prop today; the
default is a sized Box that's useful for testing / emoji
fallbacks. Real integration:

- Add `react-native-svg` as a peer dep.
- Detect at runtime; auto-pass when present.
- Native `Icon` / `Svg` render the actual SVG when the integration
  is wired.
- `@motif-js/icons` glyphs work on native automatically once this
  lands.

**Pointers:**

- `packages/react-native/src/Svg.tsx` — current shell.
- `packages/react-native/package.json` — add the optional peer.

### 8. Native `Sticky` via `stickyHeaderIndices` — `M`

⬜ Currently a documented passthrough. RN's `stickyHeaderIndices`
is per-list (must be passed to a `<ScrollView>`), not per-element.
Real impl needs a `<ScrollView>` integration that auto-collects
sticky-children's indices and passes them through.

**Pointers:**

- `packages/react-native/src/scroll.tsx` — extend `ScrollView` to
  detect `Sticky` children and collect indices via context.
- React Native docs: `stickyHeaderIndices` + `StickyHeaderComponent`.

### 9. Native parity for headless components — `L`

⬜ All 36 headless components ship web-first. Native equivalents:

- **Direct port:** `Dialog`, `AlertDialog`, `Drawer`, `Sheet` —
  use RN's `<Modal>` (already mocked in test infra). `Tooltip`,
  `HoverCard` — adapt to long-press triggers (mobile pattern).
- **Adapt:** `Menu`, `Popover` — touch-friendly interaction
  patterns; bottom-sheet on small screens.
- **Inputs:** `Switch`, `Checkbox`, `Radio` — RN's native
  `<Switch>` exists; wrap with motif's a11y additions.
- **No direct native equivalent:** `ContextMenu` (right-click
  doesn't exist on touch); document as web-only.
- **Form-input behavioral:** `Combobox`, `Select`, `Search` —
  RN's `Picker` is too limited; build on top of bottom-sheet +
  list pattern.
- **Date/time:** `Calendar`, `DatePicker` — adopt
  `@react-native-community/datetimepicker` as peer dep, motif's
  Calendar wraps it.
- **Specialized:** `FileUpload` — native equivalent is
  `expo-document-picker` / `react-native-document-picker`.
  `TreeView` — direct port (no native primitive; the web impl
  works as-is on RN with proper styling).

**Pointers:**

- Each component in `packages/headless/src/*.tsx` — port to
  `packages/react-native/src/<component>.tsx` or extend the
  existing files with platform-conditional code paths.
- `@motif-js/react` package.json `react-native` field already
  routes correctly.

---

## Block 4: list / nav / scroll completion

### 10. Real virtualisation for `VirtualList` — `M`

⬜ v0 renders every item. The prop shape is final so callers
don't migrate when virtualisation lands. Add:

- Web: `react-virtuoso` peer dep, conditional render based on data
  size. Below threshold (~50 items) keep the v0 path; above,
  delegate to Virtuoso.
- Native: `@shopify/flash-list` peer dep, same pattern.

**Pointers:**

- `packages/react-web/src/scroll.tsx` and
  `packages/react-native/src/scroll.tsx` — already export
  `VirtualList`. Extend the implementation.

### 11. Multi-level submenus on `NavigationMenu` — `M`

⬜ v0 ships a flat single-level pattern. Multi-level needs:

- Recursive item shape.
- Hover / focus to open submenus.
- Keyboard nav: `ArrowRight` opens submenu, `ArrowLeft` closes.
- Position submenus relative to parent item using existing
  `useFloatingPosition`.

**Pointers:**

- `packages/headless/src/navigation.tsx` — extend `NavigationMenu`.
- Pattern reference: Radix `NavigationMenu` (the canonical impl).

---

## Block 5: legitimacy / launch-prep

These ship right before the launch — they're what makes the
"why motif over X" case real.

### 12. Cross-library bench rows — `M`

⬜ Add Tamagui / NativeWind / Stitches / vanilla-CSS rows to the
existing `benchmarks/render/list-of-boxes.bench.tsx`. Apples-to-
apples comparisons need:

- Each library's idiomatic equivalent of `<Box p="$4" bg="$colors.brand.500" />`.
- Same render-tree shape (200 items).
- Same SSR setup (per-render reset of any per-library cache).

**Pointers:**

- `benchmarks/render/src/list-of-boxes.bench.tsx` — current bench.
- This unblocks #15 (comparison guides) — the guides need numbers
  to cite.

### 13. Container query polyfill perf benchmark on native — `S`

⬜ Phase C deferred this. Add a bench that compares motif's
`onLayout`-based polyfill against vanilla RN re-render-on-resize.
Helps validate that the polyfill cost is acceptable for typical
apps and gives us numbers to cite in the docs.

**Pointers:**

- `benchmarks/` — create `benchmarks/native-container/` workspace.
- `packages/react-native/src/Container.tsx` — the polyfill impl.

### 14. Comparison guides (vs Tamagui / NativeWind / Stitches / Tailwind) — `M`

⬜ Currently stubs in `apps/docs/comparisons/`. Each needs:

- Honest summary of the other library's design philosophy.
- Where motif aligns / differs (cross-platform, type-safety,
  compiler, theming model).
- Bench numbers from #12.
- "When to pick which" — not pretending motif is always better.

**Pointers:**

- `apps/docs/comparisons/{tamagui,nativewind,stitches,tailwind}.md`.
- Pair with #15 below.

### 15. Migration guides FROM other libraries — `M`

⬜ Currently bundled with the comparison stubs. Each needs a
"port a Tamagui app to motif in 30 minutes" walkthrough. Same
pages or separate; either works.

---

## Block 6: docs site content

The docs scaffold ships every page; the per-component pages and
the recipes are stubs. This is volume work that improves
discoverability.

### 16. Per-primitive prop tables + live examples — `M`

⬜ Sidebar lists every primitive. Each page is currently ~10-line
stub with a TODO. Generate prop tables from TS types (use
`react-docgen-typescript` or extract during the tsup dts pipeline)
and add 1–2 live examples per primitive.

**Pointers:**

- `apps/docs/primitives/*.md` — current stubs.
- 50+ primitives total — batch via a generator script if
  practical.

### 17. Per-headless component prop tables + live examples — `M`

⬜ Same for the 36 headless components.

**Pointers:**

- `apps/docs/headless/*.md` — current stubs.

### 18. Recipes — `M`

⬜ End-to-end app patterns. Each recipe is a 200–400 line
walkthrough showing motif at scale, not just one primitive.

- `apps/docs/recipes/auth.md` — sign-in / sign-up / forgot-password.
- `apps/docs/recipes/dashboard.md` — sidebar nav + content grid.
- `apps/docs/recipes/settings.md` — multi-section settings with
  tabbed nav.
- `apps/docs/recipes/checkout.md` — cart → shipping → payment →
  confirmation.

---

## Block 7: long-tail quality

Lower priority, but the polish that turns "works" into "trusted."

### 19. Full ~190-icon Phosphor set in `@motif-js/icons` — `S`

⬜ 12 ship; ~190 deferred. Pure volume — each glyph is ~10-15
lines (path data + an `<Icon>` wrapper). Can be batched in a
single session by transforming Phosphor's icon JSON.

**Pointers:**

- `packages/icons/src/glyphs/` — existing 12 as templates.
- Phosphor source: https://github.com/phosphor-icons/core (MIT).

### 20. Test coverage backfill — headless components — `M`

⬜ Dialog / Popover / Menu / Tooltip have dedicated tests. Most
others rely on TS types + transitive coverage. Add focused
suites for: Toast, Combobox, Switch / Checkbox / Radio, Tabs /
Accordion, Slider / RangeSlider / RatingInput, Calendar,
TreeView.

**Pointers:**

- Test patterns live in `packages/headless/src/Dialog.test.tsx`,
  `Tooltip.test.tsx`, `Popover.test.tsx`. Reuse the
  `act()` / `createRoot` / fireEvent pattern.

### 21. Test coverage backfill — Phase E thin-wrapper primitives — `S`

⬜ ZStack / Sticky / Show / Hide / native overlay are covered
transitively. Add focused smoke tests so the underlying behaviour
is locked in (esp. before adding native parity in #9).

**Pointers:**

- `packages/react-web/src/layout-extras.test.tsx` — pattern.
- `packages/react-web/src/overlay.test.tsx` — pattern.

### 22. Visual regression testing (Playwright + Detox) — `L`

⬜ Phase C deferred. Playwright for web; Detox for native. Needs
simulator infra (or BrowserStack / SauceLabs). Hooks into the
conformance suite — every standardCase gets a screenshot diff.

**Pointers:**

- `packages/test-utils/src/standard-cases.ts` — the cases.
- `apps/playground-web` and `apps/playground-native` — host apps
  for the snapshots.

### 23. Real CI integration for the RN startup bench — `L`

⬜ Currently methodology + fixture only. Needs a device cloud
(Sauce Labs, BrowserStack App Live, or AWS Device Farm). Wire
into a workflow that runs on tags / scheduled cron and posts the
delta to the PR.

**Pointers:**

- `benchmarks/rn-startup/README.md` — methodology.
- `benchmarks/rn-startup/src/App.tsx` — fixture.

### 24. Cross-screen-reader a11y verification per component — `L`

⬜ NVDA / JAWS / VoiceOver iOS / TalkBack. Mostly manual — needs
a process where each component family gets a once-over per
release. Pairs with #22 (visual regression) since they share
device cloud setup.

**Pointers:**

- ROADMAP Phase F exit gate.
- The external a11y audit (user-action item) is the bigger
  version of this; this is the in-house complement.

### 25. Bare RN demo app — `S`

⬜ Phase C deferred. Expo demo at `apps/playground-native` covers
the surface; a bare-RN variant proves the same code works without
Expo's vendored RN. Useful for documentation.

**Pointers:**

- `apps/playground-native/` — Expo version.
- New `apps/playground-bare-rn/` — bare RN init + same `App.tsx`.

---

## How to use this file

When picking the next thing to ship:

1. Start at block 1 and work down — the order is intentional. Block 1
   unlocks 2 (component completions are blocked on the native compiler
   in #3 if they need native StyleSheet hoisting). Block 3 (#7
   especially) unblocks block 4's headless-on-native work in #9.
2. Mark items 🟦 when starting; ✅ when done. Move ✅ items to
   PROGRESS.md and prune from this file at each major release.
3. Effort estimates are rough — 'S' is one focused session,
   'M' is 2–4, 'L' is multi-session or needs external infra.
   Real time depends on the path TypeScript takes you down.

When new items surface (a new deferral notice, a regression, a
"we should do this someday"), append them at the bottom of the
relevant block. Keep this file the single source of truth for
post-launch engineering work.
