---
'@usemotif/tokens': patch
'@usemotif/core': patch
'@usemotif/react': patch
'@usemotif/ui': patch
---

Fix dead hover states across the kit, a neutral intent that could not invert per theme, and an
illegible outline/ghost label. Warn on unresolvable token references.

`@usemotif/ui` styled its hover / highlight / drag states with `$colors.surface.default`, a
token no theme defines. Unresolvable references are dropped silently, so menu items, listbox
options, calendar days, accordion triggers and pagination controls simply never changed
background — with no error to explain why. The shipped themes gain `surface.interactive` for
that job and the kit now references it. It is a distinct entry rather than a reuse of
`surface.muted` because a panel is `raised`, and in the dark theme `raised` and `muted` resolve
to the same primitive. Three call sites that wanted a form-control background rather than a
hover fill (the `Select` trigger, the `Combobox` input, the `MultiSelect` chip container) now
use `surface.raised`, and the idle `FileUpload` dropzone uses `surface.base` so it stays
distinct from its dragging state.

`Button` and `IconButton` mapped `intent="neutral"` to primitive `gray` ramp steps. A ramp is
theme-independent by definition, so the one intent that most needs to invert was the only one
that could not — a neutral button rendered a light-grey fill with near-black text on a dark
canvas. Both shipped themes gain `action.neutral`, and the intent now reads it. Themes without
the group fall back to their own `gray` ramp, then to literals, so existing themes render
exactly as before.

The unfilled variants took their label colour from the intent's _fill_ token. That holds for
the mid-tone intents but not for neutral, whose fill is a near-white tint: `outline` and `ghost`
neutral buttons rendered at roughly 1.2:1 against a white page. Label colour now comes from a
distinct `ink` role, which for neutral is `text.default`. The ghost hover tint moved from the
`gray` ramp to `surface.interactive` for the same reason the fill did.

Theme authors using `createTheme` should add `surface.interactive` and `action.neutral`; both
degrade rather than break, but only the semantic groups invert between light and dark.

`resolveToken` now emits a dev-only warning when a `$`-reference fails to resolve, naming the
keys that _are_ available at the deepest path segment that resolved. Production builds
tree-shake it away.
