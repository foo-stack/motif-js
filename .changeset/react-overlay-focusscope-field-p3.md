---
'@usemotif/react': patch
---

Three small fixes. `Overlay` now composes a consumer `onClick` with its built-in scrim-dismiss handler instead of letting a consumer `onClick` silently clobber it (so `onScrimClick` always fires). `FocusScope` moves its restore-focus into a mount-once effect, so toggling `autoFocus`/`trapFocus`/`captureFocus` while the scope is open no longer runs the cleanup and yanks focus back to the pre-open element — restore is now an unmount-only concern. `Field` only emits `aria-describedby` ids that actually resolve: the help id when a `FieldHelp` is present and the error id when the field is `invalid`, instead of always pointing at both (often non-existent) ids.
