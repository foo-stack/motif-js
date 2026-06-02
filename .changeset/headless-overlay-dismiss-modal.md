---
'@usemotif/headless': patch
---

Fix two headless overlay bugs. `useClickOutside` now accepts an `ignore` ref (or array) whose clicks count as "inside"; the listener fires on `mousedown`, which previously raced the trigger's own `click` toggle so clicking a trigger while open dismissed then immediately reopened the surface. Popover and Menu now pass their trigger ref, and Combobox/MultiSelect pass their input/anchor ref, so a trigger can close the surface it opened. `CommandPalette.Root` now renders its body inside `Dialog.Content` instead of the context-only `Dialog.Root`, so the palette is actually modal — focus trap, scrim, Portal, Escape-to-close, and `aria-modal` — as its documentation promised; it also no longer renders inline when closed. `dismissOnEscape`/`dismissOnScrimClick` are exposed on `CommandPalette.Root`.
