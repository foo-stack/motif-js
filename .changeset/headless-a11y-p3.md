---
'@usemotif/headless': patch
---

Four a11y refinements. `Tooltip` content is now `pointerEvents: none` with no hover-keepalive — a `role="tooltip"` is not an interactive hover target (WAI-ARIA APG), so it can't be parked open by moving the cursor onto it (that behavior belongs to HoverCard). `CommandPalette` clamps the highlighted index during render, so a programmatic `commands` change can no longer leave `aria-activedescendant` pointing past the end of the list for a render. `MultiSelect.SelectAll` adds keyboard activation (Space/Enter) and `tabIndex`, so the `role="checkbox"` control is operable even when the child is a non-button (WCAG 2.1.1). `Toast` drops the redundant per-toast `aria-live` (the alert/status role already implies politeness) and makes the toaster container a single persistent live region so polite toasts announce reliably.
