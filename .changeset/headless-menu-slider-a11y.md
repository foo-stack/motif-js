---
'@usemotif/headless': patch
---

Two headless a11y fixes. `NavigationMenu` submenus now follow the WAI-ARIA menu pattern: Escape and ArrowLeft close the submenu and return focus to the parent trigger (focus was previously left on the now-unmounted item, dropping to `<body>`), and leaf submenu items — not just items with children — handle ArrowLeft/Escape to collapse a level. `RangeSlider` now clamps each thumb against its neighbor instead of sorting the pair after the fact, so driving one thumb past the other no longer swaps thumb identities and corrupts per-thumb `aria-valuenow`/`aria-valuemin`/`aria-valuemax`.
