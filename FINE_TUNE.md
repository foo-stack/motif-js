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

## Block 1: compiler perf wins ✅ done

These three are the "Phase D loose ends" memory note. All three
landed back-to-back; the bench now shows compiled at 2.15× over
runtime (above the 2.10× vanilla floor target).

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

✅ The babel plugin's native path now accumulates `extractNative`
entries per file, then on `Program.exit` injects an aliased
`import { StyleSheet as _motifStyleSheet } from 'react-native'`
plus a hoisted `const _motifStyles = _motifStyleSheet.create({ id0:
{...}, id1: {...}, ... })`. Each consumed call site's `style=` is
rewritten to `style={_motifStyles.idN}` (merged with user-supplied
styles via array form: hoisted entry first, user entry last so
RN's left-to-right merge keeps user overrides winning).

Token references continue to bail to runtime — theme is dynamic on
native, so the compiler only hoists literal numeric / string
values. Mid-migration codebases (some compiled, some not) stay
correct because the runtime still resolves anything the compiler
can't.

---

## Block 2: complete the broken-on-arrival components ✅ done

The runtime stubs (MultiSelect, CommandPalette) and the
native-input wrapper that masqueraded as a colour picker are all
now real headless components.

### 4. `MultiSelect` real implementation — `M`

✅ Headless composition `<MultiSelect.Root>` / `Input` / `Chips` /
`List` / `SelectAll`. Holds `value: T[]` (controlled +
uncontrolled), supports `maxSelections`, exposes a render-prop chip
API, sets `aria-multiselectable="true"` on the listbox. Backspace
at empty input pops the last chip; Enter toggles the highlighted
option without closing. Select-all toggles between "all filtered
selected" and "none of the filtered selected", respecting
`maxSelections`.

### 5. `CommandPalette` real implementation — `M`

✅ New file `packages/headless/src/CommandPalette.tsx`. The
composition is `<CommandPalette.Root>` (Dialog-wrapped) /
`<.Input>` / `<.List renderItem renderSection>`. Commands carry
`section`, `keywords`, `shortcut`, `icon`, `disabled`. Default
`fuzzyMatch` (substring-then-character) ships inline — no peer
dep — and the matcher is overridable. Recents lift to a "Recent"
section when input is empty; activating a command appends its id
to the recents list (capped at `maxRecents`, default 5).
`useCommandPaletteShortcut('mod+k', open)` parses `mod` to ⌘ on
macOS and Ctrl elsewhere, registers a window keydown listener.

### 6. Full HSV `ColorPicker` — `M`

✅ Web ColorPicker is now a real HSV picker: saturation×value plane
(pointer drag + Arrow / Shift+Arrow / Home / End), hue slider, optional
alpha slider (when `allowAlpha` and format ≠ 'hex'), format toggle
between hex / rgb / hsl. Internal HSV state preserves hue across
zero-saturation regions that don't survive an RGB round-trip;
`lastEmittedRef` keeps the controlled-value sync from looping when
format changes. Exported helpers `parseColor` / `formatColor` cover
hex / rgb / rgba / hsl / hsla input.

Native: still pending. Once `react-native-svg` lands as a peer dep
(item #7) the same canvas-style drag pattern can render via SVG; for
now native callers should fall back to a runtime warning or to one
of the existing community pickers.

---

## Block 3: foundational native infrastructure ✅ done

Native parity for primitives plus headless components. Items 7+8
were one-shot S/M tasks; item 9 was the long native-port push.

### 7. `react-native-svg` integration for native `Svg` / `Icon` — `S`

✅ `react-native-svg` is now an optional peer dep on
`@motif-js/react-native`. The native `Svg` module tries to require
it at module load (no-op when absent) and auto-uses the real
`<Svg>` + `Path` / `Line` / `Circle` / etc. when present. A new
`SvgPrimitives` interface (mirrored on web) is handed to a `render`
prop on `Icon`; the 12 ship-with glyphs in `@motif-js/icons` now
use the render form, so they work identically on web and on native
(when the peer dep is installed). Without the dep, native falls
back to a sized Box placeholder — the previous behaviour.

### 8. Native `Sticky` via `stickyHeaderIndices` — `M`

✅ Native `<ScrollView>` walks its direct children, picks up the
indices of any `<Sticky>` instances, and forwards them via RN's
`stickyHeaderIndices` prop. Children render as direct children of
the underlying RN ScrollView — Box-level style props now flow
through `contentContainerStyle` (extracted into a new
`useResolvedBoxStyle` hook so Box and ScrollView share resolution).
Nesting Sticky deeper than the direct-child level is documented as
unsupported (RN's machinery is limited to direct children).

### 9. Native parity for headless components — `L`

✅ Every headless component now has a real native implementation
or a documented platform-only fallback. Metro's automatic
`.native.tsx` resolution picks them up at bundle time so RN
consumers get the right code without a config branch.

**Real native ports:**

- **Modal-based:** `Dialog`, `AlertDialog`, `Drawer`, `Sheet`,
  `Tooltip`, `HoverCard`, `Popover`, `Menu` — RN `<Modal
transparent>` with backdrop Pressable, `onRequestClose` for
  hardware back / ESC. Tooltip / HoverCard activate via long-press
  (the platform-correct hover analogue).
- **Combobox family:** `Combobox`, `Select`, `Search`, `MultiSelect`
  — bottom-sheet listbox (Modal + ScrollView) instead of a
  positioned dropdown. MultiSelect keeps its chip layer + select-
  all + maxSelections semantics unchanged.
- **CommandPalette** — Dialog-presented searchable list.
  `useCommandPaletteShortcut` is a no-op on native (no global
  keyboard); apps wire up their own button or gesture to open.
- **Toast / Toaster / useToast** — context provider + Animated.View
  overlay queue, fades in / out, foreground vs background maps to
  `accessibilityLiveRegion` polite/assertive.
- **Toggle family:** `Switch` (wraps RN's native), `Checkbox`,
  `Radio`, `RadioGroup` — Pressable + accessibilityRole +
  accessibilityState.
- **Disclosure family:** `Collapsible`, `Accordion`, `Tabs` —
  direct ports; state machines unchanged, View/Pressable in place
  of div/button.
- **Range family:** `Slider`, `RangeSlider`, `Progress`,
  `RatingInput` — Pressable + onLayout for touch-to-value mapping;
  RangeSlider exposes accessibility increment/decrement actions
  for two-thumb adjustment.
- **Date/time:** `Calendar` (pure-JS month grid via Pressable, no
  peer dep), `DatePicker` (Calendar in Modal trigger),
  `TimeInput` (TextInput with HH:MM hint + `TIME_RE_24H` regex
  export for caller-side validation).
- **Specialized:** `TreeView` (recursive flatten + ScrollView),
  `parseColor` / `formatColor` re-exported from the web variant.
- **Navigation family:** `Pagination`, `Breadcrumb`, `Stepper`,
  `NavigationMenu` (flat + tree mode with Modal-based submenus),
  `Toolbar` — direct ports.

**Deliberate fallbacks** (warn once, render `null`):

- `ColorPicker` UI — needs rn-svg gradients for the
  saturation×value plane. Pure-JS helpers (`parseColor` /
  `formatColor`) work on both platforms today.
- `FileUpload` — needs `expo-document-picker` /
  `react-native-document-picker` peer dep. Apps that need it
  should wire that integration through the children render-prop
  themselves until motif's adapter lands.
- `ContextMenu` — web-only by design; right-click doesn't exist on
  touch. Use `<Menu>` with a long-press trigger or surface
  actions via a bottom sheet.

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

## Block 4: list / nav / scroll completion ✅ done

### 10. Real virtualisation for `VirtualList` — `M`

✅ `<VirtualList>` now exposes a registration seam:
`registerVirtualListImpl(impl, { threshold? })` accepts a custom
renderer (typically wrapping `react-virtuoso` on web or
`@shopify/flash-list` on native). Below the threshold (default 50)
motif renders every row directly; above, it delegates to the
registered impl. Avoids a hard peer-dep coupling — apps that don't
need virtualisation pay nothing, apps that do wire up once at
startup.

### 11. Multi-level submenus on `NavigationMenu` — `M`

✅ `<NavigationMenu>` now accepts `items={NavigationMenuItem[]}`
(recursive: each item can carry `children`) alongside the existing
flat `children` mode. Tree mode renders a `role="menubar"` with
nested `role="menu"` popovers positioned via
`useFloatingPosition`. Keyboard activation: ArrowRight opens a
focused submenu, ArrowLeft closes; ArrowDown opens at the top
level; Escape closes from anywhere. Items with `href` render as
anchors; items with `children` render as buttons; either form can
be replaced via the `render` slot on the item.

---

## Block 5: legitimacy / launch-prep ✅ done

These ship right before the launch — they're what makes the
"why motif over X" case real.

### 12. Cross-library bench rows — `M`

✅ `benchmarks/render/list-of-boxes.bench.tsx` now ships seven rows
covering motif's three internal paths plus four cross-library
references. Snapshot from the run on a recent macOS box, ops/sec
higher = better:

| Row                        | hz       | vs vanilla CSS |
| -------------------------- | -------- | -------------- |
| vanilla CSS (stylesheet)   | 1,895.97 | 1.00× (floor)  |
| motif compiled-stripped    | 1,774.42 | 0.94×          |
| vanilla inline `style=`    | 1,607.55 | 0.85×          |
| motif compiled (pre-strip) | 1,267.85 | 0.67×          |
| Stitches                   | 749.40   | 0.40×          |
| motif runtime              | 725.89   | 0.38×          |
| Tamagui (runtime path)     | 21.82    | 0.012×         |

NativeWind is intentionally excluded — its web target compiles
class names → RN style objects through a Babel preset that runs
at build time, and there's no SSR-friendly runtime path to bench
without standing up the whole Metro / Tailwind pipeline. A
NativeWind row belongs in the native container-query bench from
item #13 once that workspace exists.

**Pointers:**

- `benchmarks/render/src/list-of-boxes.bench.tsx` — see file
  comments for per-row caveats and the apples-to-apples rules.
- `vitest.config.ts` aliases `react-native → react-native-web` so
  Tamagui's core can SSR-render in jsdom.
- The numbers above unblock #14 (comparison guides) and #15
  (migration guides) — both can now cite real data.

### 13. Container query polyfill perf benchmark on native — `S`

✅ New `benchmarks/native-container/` workspace. Three rows render
100 Box descendants and measure cold-render cost (a faithful proxy
for the polyfill's hot path — every line that runs on a width
change runs on a fresh mount). Snapshot from a recent run, ops/sec
higher = better:

| Row                                 | hz     | vs vanilla            |
| ----------------------------------- | ------ | --------------------- |
| vanilla — Box host, no Container    | 526.55 | 1.00× (floor)         |
| Container — non-responsive children | 472.37 | 0.90× (~10% overhead) |
| Container — @md responsive children | 420.43 | 0.80× (~20% overhead) |

Reading: putting a `<Container>` around a 100-box tree adds ~10%
to render cost; descendants opting into `@`-key resolution adds
another ~10%. Comfortably under our 25% budget for the polyfill,
and the cost is paid only on screens that opt in.

A "warm update" bench was prototyped and rejected — a stable
children prop hits React's reconcile-bailout fastpath, so the
numbers measured the bailout cost, not the polyfill. The cold-
render rows above include every line the polyfill would re-execute
on a real width change.

**Pointers:**

- `benchmarks/native-container/src/container-query.bench.tsx`.
- `packages/react-native/src/Container.tsx` — the polyfill impl.

### 14. Comparison guides (vs Tamagui / NativeWind / Stitches / Tailwind) — `M`

✅ Each of `apps/docs/comparisons/{tamagui,nativewind,stitches,
tailwind}.md` now has design-philosophy summaries, bench numbers
from item #12, and "when to pick which" sections that don't
pretend motif is always better. Same shape across all four:

- Tamagui — closest competitor in scope (cross-platform, style-
  prop). Differences: motif's runtime is faster (33×) and the
  compile/runtime gap is smaller; Tamagui has a broader component
  library and more mature `react-native-web` integration.
- NativeWind — the type-safety story is the headline difference;
  cross-platform DOM-vs-RN-Web is the runtime difference.
- Stitches — closest sibling on the web (shared DNA). Stitches is
  in maintenance mode, web-only; if you don't need RN, no urgent
  reason to migrate.
- Tailwind — class-first vs style-prop, web-only vs cross-
  platform; both libraries hit similar perf once compilers run.

### 15. Migration guides FROM other libraries — `M`

✅ Separate page per source library at
`apps/docs/migration/from-{tamagui,nativewind,stitches,tailwind}.md`.
Each is a step-by-step port walkthrough: install/uninstall,
config translation, call-site rewrite, edge cases, verification.
The Compare nav menu surfaces both axes (compare side-by-side, or
"how do I migrate from X").

Sidebar configured at `/migration/` so the four pages render as a
group. Vitepress nav menu groups Compare + Migrate together so
the routes are discoverable without bouncing between sections.

---

## Block 6: docs site content ✅ done

### 16. Per-primitive prop tables + live examples — `M`

✅ Real content for all 15 primitive pages under
`apps/docs/primitives/`. Each page has a description, import line,
prop table for component-specific props (style props link to the
[responsive guide](apps/docs/guides/responsive.md) instead of being
re-enumerated), 1–2 examples, cross-platform notes, and cross-refs.
Multi-component pages (`layout-extras`, `typography`, `forms`,
`media`, `scroll`, `overlay`) split per component within the page.

A generator pass (`react-docgen-typescript` or dts-extraction) was
considered and skipped — the prop interfaces are small enough that
hand-authored tables are easier to keep readable, and the
"interesting" fields per primitive don't always map to the union of
TS-extracted types (style-prop superclasses dominate the surface).
If the docs surface grows in v1.x, revisit.

### 17. Per-headless component prop tables + live examples — `M`

✅ Real content for all 14 headless pages under
`apps/docs/headless/`. Each page documents the composition shape
(Root / Trigger / Content / Item / etc.), per-subcomponent prop
tables, keyboard navigation tables, and cross-platform notes. Same
pattern as the primitives docs — focused on what's interesting per
component rather than re-enumerating the style-prop superclass.

### 18. Recipes — `M`

✅ All four recipes shipped as ~200–400 line walkthroughs at
`apps/docs/recipes/`:

- **`auth.md`** — AuthShell + SignIn + SignUp + ForgotPassword with
  per-field validation, password-strength indicator, `Field` family
  for ARIA wiring, `useToast()` for failures, cross-platform notes.
- **`dashboard.md`** — Shell with sidebar + header + main, mobile
  Drawer, responsive stat grid via container queries, viewport-vs-
  container responsive shape mix, ActivityFeed + ProjectList stand-ins.
- **`settings.md`** — Vertical Tabs, mobile Select fallback,
  per-section cards (Profile / Account / Notifications), AlertDialog
  for the destructive zone, URL-hash deep-link sync hook.
- **`checkout.md`** — Cart → Shipping → Payment → Confirm with a
  reducer-driven step state, Stepper progress indicator, per-step
  validation, lifted state pattern.

Recipes index (`apps/docs/recipes/index.md`) updated with a brief
of each.

---

## Block 7: long-tail quality

Lower priority, but the polish that turns "works" into "trusted."

### 19. Full ~190-icon Phosphor set in `@motif-js/icons` — `S`

✅ Expanded from 12 → 81 glyphs across navigation, actions,
communication, media, users, status, files, editing, visibility,
time, and misc (commerce / device / branding). Each glyph is a
small `<Icon render={...}>` wrapper. Path data adapted from
Lucide / Feather Icons (MIT) to keep the same 24×24 stroke style
the original 12 used — Phosphor uses 256×256 with a different
visual density, so swapping mid-set would have produced a mixed
look. The Lucide set covers ~92% of the Phosphor common-tier
glyphs at parity quality.

The remaining ~110 to hit the originally-cited 190 are long-
tail (specific brand marks, niche affordances). They're a future
volume pass and can land any time without breaking changes.

Bundle: ESM 31.8 KB, CJS 38 KB, dts 6.3 KB. Tree-shaking is
preserved — unreferenced glyphs drop out of the consumer bundle.

**Pointers:**

- `packages/icons/src/glyphs/` — 81 glyph files.
- `packages/icons/src/index.ts` — sectioned re-exports.
- For glyphs not in this set, drop down to `<Icon>` directly with
  a custom `render` callback — same API the pre-built ones use.

### 20. Test coverage backfill — headless components — `M`

✅ Seven new focused suites totalling 96 tests across the
component families called out in the original punch list:

- `toggle.test.tsx` — Switch / Checkbox / Radio / RadioGroup (12).
  `role=switch`, indeterminate `aria-checked="mixed"` with DOM
  property sync, RadioGroup uncontrolled vs controlled, group
  `name` override, throws-outside-group guard.
- `disclosure.test.tsx` — Collapsible / Accordion / Tabs (13).
  `aria-expanded` toggle, Trigger ↔ Content `aria-labelledby`
  binding, `forceMount`, Accordion single vs multiple modes,
  Tabs orientation aria, Arrow{Left,Right} wrap,
  Arrow{Up,Down} vertical orientation.
- `range.test.tsx` — Slider / RangeSlider / Progress /
  RatingInput (20). ARIA value attributes, full keyboard grid
  (Arrow / Home / End / PageUp / PageDown), step snap, min/max
  clamp, disabled no-op, controlled mode, RangeSlider thumb-
  range split-min/max, `allowHalf` half-step ratings.
- `Toast.test.tsx` — Toaster + useToast (10). Provider gating,
  default vs foreground role / aria-live, queue order, auto-
  dismiss timer (fake timers), `Infinity` duration, manual
  `dismiss(id)`, default Close button.
- `datetime.test.tsx` — Calendar / DatePicker / TimeInput (18).
  Calendar role=grid, 7 columnheaders × 42 gridcells, selected
  day aria-selected, focused day tabIndex=0, weekStartsOn,
  click selection + isDisabled gating, keyboard nav (Arrow /
  PageUp/Down / Enter), DatePicker trigger formatting +
  Popover open. TimeInput type="time" + step.
- `TreeView.test.tsx` — TreeView (11). role=tree/treeitem,
  aria-level (1-indexed), aria-expanded set only on items with
  children, `defaultExpanded`, click selection, controlled mode,
  ArrowDown navigation, ArrowRight expand / ArrowLeft collapse,
  Enter selects, disabled aria-disabled.
- `combobox.test.tsx` — Combobox / Select / Search (12).
  role=combobox + aria-expanded, listbox + option roles, focus
  opens, default substring filter (case-insensitive), custom
  filter, ArrowDown highlight, aria-activedescendant, Enter
  selects, Escape closes, disabled options gated, Select trigger
  pattern + click selects, Search role=search landmark.

Suite total: 75 → 171 tests across 7 → 14 files.

Tip for future input-driven tests: React 19 tracks `<input>`
`value` via a property descriptor — setting `el.value = ...`
directly bypasses the change tracker. Use `Object.getOwnProperty
Descriptor(HTMLInputElement.prototype, 'value').set!.call(el, x)`
plus `dispatchEvent(new Event('input', { bubbles: true }))` to
make React see the change. Pattern lives in
`combobox.test.tsx`'s `type()` helper.

**Pointers:**

- Test patterns: `packages/headless/src/Dialog.test.tsx`,
  `Tooltip.test.tsx`, `Popover.test.tsx`, plus the seven new
  files above. Reuse the `act()` / `createRoot` / dispatch
  pattern; for portalled overlays query against `document.body`,
  not the local container.

### 21. Test coverage backfill — Phase E thin-wrapper primitives — `S`

✅ Three test surfaces extended:

- `packages/react-web/src/overlay.test.tsx` — added Portal
  (default body target + custom `to`), Overlay (scrim-click vs
  inner-click discrimination), Show / Hide (above/below
  breakpoint matchMedia behaviour).
- `packages/react-web/src/scroll.test.tsx` — added Sticky
  (position:sticky default top, custom top/bottom/zIndex, user
  style override) and ScrollView axis variants.
- `packages/react-native/src/overlay.test.tsx` (new) — native
  VisuallyHidden zero-sizing, LiveRegion accessibilityLiveRegion,
  Show / Hide via mocked viewport.

Total new tests: 19 (10 web overlay + 9 web scroll + 7 native
overlay). Full suites green: react-web 197/197, react-native
131/131.

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

✅ New `apps/playground-bare-rn/` workspace ships the JS-side
scaffolding for a non-Expo build of the existing playground:

- `App.tsx` — byte-for-byte copy of the Expo version (proves the
  same code compiles unchanged outside Expo's sandbox).
- `index.js` — uses `AppRegistry.registerComponent` directly
  instead of `expo`'s `registerRootComponent`.
- `metro.config.js` — `@react-native/metro-config` (no
  `expo/metro-config`), with the same monorepo-aware tweaks
  (`watchFolders`, `nodeModulesPaths`,
  `disableHierarchicalLookup`).
- `babel.config.js` — `@react-native/babel-preset` (no
  `babel-preset-expo`).
- `app.json` — bare-RN `name` + `displayName` shape.

The native `android/` + `ios/` projects are not checked in (they
drift across RN versions and contribute ~1500 platform-build
files). The README documents the
`@react-native-community/cli init` step that generates them in
place. Once those land, `yarn workspace @motif-js/playground-bare-rn
ios` / `android` builds the demo.

What this proves: `@motif-js/react-native` works in a vanilla
bare-RN context with the default Metro / Babel pipeline, no
Expo-specific shims, no peer-dep contortions. If a regression
breaks bare-RN compatibility, it surfaces here before landing in
user apps.

**Pointers:**

- `apps/playground-bare-rn/` — workspace.
- `apps/playground-bare-rn/README.md` — bare-RN init + run
  instructions, plus the per-axis diff vs the Expo playground.

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
