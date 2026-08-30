---
'@usemotif/core': minor
'@usemotif/react': minor
'@usemotif/react-native': minor
'usemotif': minor
---

Derive `$`-reference autocomplete from the consumer's own theme.

`MotifCustomTheme` is a new interface a consumer extends with their theme via
`declare module`. Once declared, every style prop offers the `$` paths of the one
token scale it is bound to: `p` suggests `space` paths, `backgroundColor`
suggests `colors` paths. Scales stay separate, which is both cheaper to
type-check and more accurate than one union of every path.

Permissive by design. Raw CSS values, numbers, and a `$` path the scale does not
contain all still compile, so this is additive. An app that never augments keeps
exactly the types it had.

Also fixes two places where the token paths were being silently dropped from a
prop's type. `Box`'s responsive props and `StateStyleBag` both wrapped their
value in `NonNullable`, which is `T & {}`; that intersection reduces
`(string & {}) | '$space.4'` back to a bare `string`, discarding every literal.
The value stayed assignable either way, so nothing failed - the editor simply
offered nothing. `yarn tokens:check` now fails if either regresses.
