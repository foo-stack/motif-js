# Headless components — overview

`@motif-js/headless` ships **36 accessibility-first behaviour components**.
Each is "headless" — behaviour + ARIA wiring, no built-in styling. Compose
visuals out of motif primitives (Box / Button / Text / etc.).

## Foundation a11y patterns

- [Dialog / AlertDialog](./dialog) — modal dialogs with focus trap,
  Escape, scrim dismiss, controlled or uncontrolled state.
- [Tooltip](./tooltip) — hover / focus tooltip with WCAG-friendly delays.

## Popover family

- [Popover](./popover) — non-modal floating panel.
- [HoverCard](./hover-card) — Tooltip-shaped, interactive content.
- [Menu / ContextMenu](./menu) — dropdown menus with arrow-key nav.

## Toggle family

- [Switch / Checkbox / Radio](./toggle) — form-integrated inputs.

## Disclosure family

- [Tabs / Accordion / Collapsible](./disclosure) — show/hide patterns.

## Toast

- [Toast / Toaster](./toast) — transient notifications via aria-live.

## Form-input behavioral

- [Combobox / Select / Search](./combobox) — listbox-pattern inputs.
  `MultiSelect` and `CommandPalette` ship as runtime stubs in v0; full
  implementations queued for v1.x.

## Range

- [Slider / Progress / RatingInput](./range) — value-along-an-axis
  controls with full keyboard support.

## Mobile overlays

- [Drawer / Sheet](./drawer) — side-anchored / bottom-anchored Dialogs.

## Date & time

- [Calendar / DatePicker / TimeInput](./datetime) — month-grid Calendar
  with full keyboard nav; DatePicker = Calendar in Popover.

## Specialized

- [ColorPicker / FileUpload / TreeView](./specialized) — niche primitives.

## Navigation

- [Pagination / Breadcrumb / Stepper / NavigationMenu / Toolbar](./navigation)
  — site/app navigation patterns.

> All components ship web-first in v0. Native parity for headless is
> incremental v1.x work — Dialog / Tooltip / Menu / Drawer have natural
> RN counterparts (Modal / accessibility hooks); some, like
> ContextMenu, have no direct native equivalent.
