# Final IA — usemotif docs rewrite

**Locked:** 2026-05-15
**Approval gate:** passed (Q&A this phase resolved 4 open questions; remaining defaults from `discovery.md` accepted implicitly).
**Consumed by:** docwright-mode-author for Phases 2–8.

This file is the source of truth for the sidebar, page paths, and Diataxis quadrants for every page in the rewrite. Voice rules: `voice-card.md`. Per-component page template: `tamagui-reference.md`.

## Decisions resolved in the Phase 1 approval gate

| # | Question | Resolution |
|---|---|---|
| 1 | Hooks page strategy | **Standalone for top-level theme hooks; inline for component-paired.** `/reference/use-theme`, `/reference/use-theme-chain`, `/reference/use-theme-name`, `/reference/use-theme-setting`. `useDialogState`, `useToast`, `useCommandPaletteShortcut`, `useActiveCollector` live inline on their paired surface. |
| 2 | Utility family naming | **Split into A11y + Control flow + Utilities.** A11y: `FocusScope`, `LiveRegion`, `VisuallyHidden`. Control flow: `Show`, `Hide`. Utilities: `Overlay`, `Portal`. |
| 3 | Cross-platform docs strategy | **One page per component with a Cross-platform notes section.** Voice card's "On web …; on native …" pattern enforces consistency. Revisit only if a single page exceeds ~600 lines of MDX. |
| 4 | "Migrating from X" recipes | **All four**: styled-components, Emotion, Tailwind, Tamagui. |

Defaults accepted implicitly (from `discovery.md` open questions list):

- Icons: single searchable gallery at `/reference/icons`, no per-glyph pages.
- compiler-core: single advanced reference page at `/reference/compiler-core` with a "plugin authors only" disclaimer.
- Family-index pages: yes, lightweight grid + one-line descriptions.
- `/reference/use-theme.mdx` consolidation: yes — replaces split `theme.mdx`/`use-theme.mdx`.
- Icon naming: motif-native, no Lucide mention in user-facing prose.
- `_demo/*` pages: invisible in sidebar (no `_meta.ts` entries).
- Per-bundler depth: one page each; sub-router nuances handled with `<Tabs>` inside the page.

## Sidebar tree

Pages marked **(salvage)** carry forward existing prose as the draft.

```
/                                       marketing            (keep, out of scope)
/changelog                              changelog            (Phase 8; sources from CHANGELOG.md)
/404                                    keep

Getting started                                              ── PHASE 2 ──
  /getting-started/introduction         tutorial             (salvage)
  /getting-started/installation         howto                (salvage)
  /getting-started/your-first-style     tutorial             (salvage)
  /getting-started/cross-platform       tutorial             (salvage from web-and-native.mdx, restructure)
  /getting-started/with-an-example      tutorial             (new — pointer to apps/ssr-next + playgrounds)

Concepts                                                     ── PHASE 2 ──
  /concepts/mental-model                explanation          (new)
  /concepts/tokens                      explanation          (salvage)
  /concepts/style-props                 explanation          (new — covers styleProps, MOTION_PROPS, PSEUDO_*)
  /concepts/responsive                  explanation          (salvage)
  /concepts/theming                     explanation          (salvage)
  /concepts/variants                    explanation          (salvage)
  /concepts/composition                 explanation          (salvage)
  /concepts/compiler                    explanation          (new — the progressive compiler story)
  /concepts/ssr-and-hydration           explanation          (new)

Components (~46 + 9 family indexes = 55 pages)               ── PHASE 4 ──
  /components                           index                (gallery landing)

  /components/layout                    family index
    /components/layout/box              reference (hybrid)
    /components/layout/stack            reference (hybrid)
    /components/layout/hstack           reference (hybrid)
    /components/layout/vstack           reference (hybrid)
    /components/layout/container        reference (hybrid)
    /components/layout/center           reference (hybrid)
    /components/layout/flex             reference (hybrid)
    /components/layout/grid             reference (hybrid)
    /components/layout/wrap             reference (hybrid)
    /components/layout/zstack           reference (hybrid)
    /components/layout/aspect-ratio    reference (hybrid)
    /components/layout/spacer           reference (hybrid)
    /components/layout/safe-area        reference (hybrid)

  /components/typography                family index
    /components/typography/text         reference (hybrid)
    /components/typography/heading      reference (hybrid)
    /components/typography/paragraph    reference (hybrid)
    /components/typography/blockquote   reference (hybrid)
    /components/typography/code         reference (hybrid)
    /components/typography/kbd          reference (hybrid)

  /components/forms                     family index
    /components/forms/input             reference (hybrid)
    /components/forms/textarea          reference (hybrid)
    /components/forms/number-input      reference (hybrid)
    /components/forms/password-input    reference (hybrid)
    /components/forms/label             reference (hybrid)
    /components/forms/field             reference (hybrid)
    /components/forms/field-help        reference (hybrid)
    /components/forms/field-error       reference (hybrid)
    /components/forms/fieldset          reference (hybrid)

  /components/media                     family index
    /components/media/avatar            reference (hybrid)
    /components/media/icon              reference (hybrid)
    /components/media/image             reference (hybrid)
    /components/media/svg               reference (hybrid)
    /components/media/link              reference (hybrid)

  /components/interactive               family index
    /components/interactive/pressable   reference (hybrid)
    /components/interactive/button      reference (hybrid)
    /components/interactive/icon-button reference (hybrid)

  /components/scroll                    family index
    /components/scroll/scroll-view      reference (hybrid)
    /components/scroll/sticky           reference (hybrid)
    /components/scroll/virtual-list     reference (hybrid)

  /components/a11y                      family index
    /components/a11y/focus-scope        reference (hybrid)
    /components/a11y/live-region        reference (hybrid)
    /components/a11y/visually-hidden    reference (hybrid)

  /components/control-flow              family index
    /components/control-flow/show       reference (hybrid)
    /components/control-flow/hide       reference (hybrid)

  /components/utilities                 family index
    /components/utilities/overlay       reference (hybrid)
    /components/utilities/portal        reference (hybrid)

Headless (~37 + 9 family indexes = 46 pages)                 ── PHASE 5 ──
  /headless                             index                (gallery landing)

  /headless/overlay                     family index
    /headless/overlay/dialog            reference (hybrid)
    /headless/overlay/alert-dialog      reference (hybrid)
    /headless/overlay/popover           reference (hybrid)
    /headless/overlay/hover-card        reference (hybrid)
    /headless/overlay/tooltip           reference (hybrid)
    /headless/overlay/drawer            reference (hybrid)
    /headless/overlay/sheet             reference (hybrid)

  /headless/menu                        family index
    /headless/menu/menu                 reference (hybrid)
    /headless/menu/context-menu         reference (hybrid)
    /headless/menu/navigation-menu      reference (hybrid)
    /headless/menu/command-palette      reference (hybrid)   (useCommandPaletteShortcut inline)

  /headless/disclosure                  family index
    /headless/disclosure/accordion      reference (hybrid)
    /headless/disclosure/collapsible    reference (hybrid)
    /headless/disclosure/tabs           reference (hybrid)

  /headless/selection                   family index
    /headless/selection/checkbox        reference (hybrid)
    /headless/selection/radio-group     reference (hybrid)
    /headless/selection/switch          reference (hybrid)
    /headless/selection/combobox        reference (hybrid)
    /headless/selection/multi-select    reference (hybrid)
    /headless/selection/search          reference (hybrid)
    /headless/selection/select          reference (hybrid)

  /headless/datetime                    family index
    /headless/datetime/calendar         reference (hybrid)
    /headless/datetime/date-picker      reference (hybrid)
    /headless/datetime/time-input       reference (hybrid)

  /headless/numeric                     family index
    /headless/numeric/slider            reference (hybrid)
    /headless/numeric/range-slider      reference (hybrid)
    /headless/numeric/progress          reference (hybrid)
    /headless/numeric/rating-input      reference (hybrid)

  /headless/feedback                    family index
    /headless/feedback/toast            reference (hybrid)   (useToast inline)

  /headless/navigation                  family index
    /headless/navigation/breadcrumb     reference (hybrid)
    /headless/navigation/pagination     reference (hybrid)
    /headless/navigation/stepper        reference (hybrid)
    /headless/navigation/toolbar        reference (hybrid)

  /headless/specialized                 family index
    /headless/specialized/color-picker  reference (hybrid)
    /headless/specialized/file-upload   reference (hybrid)
    /headless/specialized/tree-view     reference (hybrid)

Reference (16 pages)                                         ── PHASE 3 ──
  /reference/styled                     reference            (salvage)
  /reference/create-theme               reference            (salvage)
  /reference/theme-provider             reference            (new, covers ThemeProvider + Theme)
  /reference/use-theme                  reference            (consolidate from theme.mdx + use-theme.mdx)
  /reference/use-theme-chain            reference            (new)
  /reference/use-theme-name             reference            (new)
  /reference/use-theme-setting          reference            (new)
  /reference/keyframes                  reference            (new)
  /reference/ssr                        reference            (salvage; useActiveCollector inline)
  /reference/style-props                reference            (new — the prop catalog)
  /reference/breakpoints                reference            (new)
  /reference/tokens                     reference            (new — @usemotif/tokens)
  /reference/icons                      reference            (new — searchable gallery + IconProps)
  /reference/reset                      reference            (new — @usemotif/reset)
  /reference/test-utils                 reference            (new — @usemotif/test-utils)
  /reference/migrate                    reference            (new — CLI + Node API)
  /reference/compiler-core              reference            (new — advanced, plugin authors)

Bundlers (4 pages)                                           ── PHASE 6 ──
  /bundlers/vite                        howto                (@usemotif/compiler-swc plugin)
  /bundlers/next                        howto                (App Router style registry; covers compiler-swc)
  /bundlers/metro                       howto                (@usemotif/compiler-metro)
  /bundlers/webpack-swc                 howto                (@usemotif/compiler-swc)

Recipes (~11 pages)                                          ── PHASE 7 ──
  /recipes/dark-mode-toggle             howto                (new)
  /recipes/design-system-from-scratch   howto                (salvage from guides/design-system.mdx)
  /recipes/cms-theming                  howto                (new)
  /recipes/animation-patterns           howto                (salvage from recipes/animation.mdx)
  /recipes/form-patterns                howto                (salvage from recipes/forms.mdx)
  /recipes/sub-themes-per-route         howto                (new)
  /recipes/print-styles                 howto                (new)
  /recipes/from-styled-components       howto                (salvage from guides/migrating-styled-components.mdx)
  /recipes/from-emotion                 howto                (new — port the styled-components recipe)
  /recipes/from-tailwind                howto                (new)
  /recipes/from-tamagui                 howto                (new)

Guides (~3 pages)                                            ── PHASE 7 ──
  /guides/performance                   howto                (salvage)
  /guides/server-rendering              explanation          (salvage)
  /guides/testing                       howto                (new — covers @usemotif/test-utils)
  /guides/contributing                  howto                (new)

Migrating (3 pages)                                          ── PHASE 8 ──
  /migrating/v1-to-v2                   migration            (salvage)
  /migrating/v2-to-v3                   migration            (salvage)
  /migrating/from-other-libraries       migration            (new — umbrella linking the /recipes/from-* pages)

Architecture decisions (8 pages)                             ── PHASE 8 ──
  /adr                                  index
  /adr/0001-renderer-model              adr                  (web = real DOM + RN = real RN)
  /adr/0002-style-prop-api              adr
  /adr/0003-two-layer-tokens            adr
  /adr/0004-progressive-compiler        adr
  /adr/0005-three-responsive-syntaxes   adr
  /adr/0006-headless-styled-split       adr
  /adr/0007-scope-strategy              adr                  (the v1/v2/v3 rebrand history)
  /adr/0008-versioning-policy           adr

Archived (in `_archive/`, not in sidebar)
  /styled-with-motif                    archive              (pre-v1 marketing)
  /recipes/layouts                      archive              (replaced by component pages)
  /recipes/buttons                      archive              (replaced by /components/interactive/button)
```

## Page count

| Section | Pages |
|---|---|
| Top-level (index, changelog, 404) | 3 |
| Getting started | 5 |
| Concepts | 9 |
| Components (incl. 9 family indexes) | 55 |
| Headless (incl. 9 family indexes) | 46 |
| Reference | 17 |
| Bundlers | 4 |
| Recipes | 11 |
| Guides | 4 |
| Migrating | 3 |
| ADRs (incl. index) | 9 |
| **Total** | **166 pages** |

PLAN.md's "~120" estimate was low — the realistic count after Phase 1 reconciliation is 166. This is driven by:

- Family-index pages add 18 (vs. PLAN's implicit zero).
- The hooks decision adds 4 standalone hook pages.
- The A11y/Control-flow/Utilities split adds 2 family indexes vs. one "Utilities" family.
- 4 "migrating from" recipes (vs. PLAN's "more as written").
- 8 ADRs + 1 index (vs. PLAN's "8" total — missed the index page).

## Phase reassignments

PLAN.md's phase ordering still holds. Some pages reassigned per the final IA:

- **Phase 3 Reference** now covers 17 pages (was ~10) — added per-hook pages, breakpoints, style-props catalog, icons gallery, reset, test-utils, migrate, compiler-core.
- **Phase 4 Components** stays at 55 pages (46 components + 9 family indexes).
- **Phase 5 Headless** stays at 46 pages (37 behaviors + 9 family indexes).
- **Phase 7 Recipes** grows from 8 to 11 pages (added 3 migration recipes: Emotion, Tailwind, Tamagui).

The PLAN.md estimate of ~17 focused days is therefore low; revised estimate is ~22–25 focused days. Worth flagging at the next phase boundary, not blocking Phase 2.

## What's now ready

- **Voice card** → every doc-type skill from Phase 2 onward consumes `voice-card.md` as a hard constraint.
- **Per-component template** → `tamagui-reference.md` defines the layout. The `<ComponentDemoStrip>` from Phase 0 is the demo block.
- **IA** → this file. Pages get authored in PLAN.md's phase order; each page's frontmatter declares its `diataxis:` quadrant and `covers:` list.
- **Demo registry** (from Phase 0) → Phase 4/5 will add one registered demo per component page.

## What Phase 2 needs before authoring

1. The voice card (this file → done).
2. The salvage map (in `discovery.md` → done).
3. A scratch staging area for in-flight drafts — using `apps/docs/content/` directly, gated by per-page approval at family boundaries.

No new tooling. Phase 2 starts with `/concepts/mental-model.mdx` (new, the umbrella page) and walks the IA in order.
