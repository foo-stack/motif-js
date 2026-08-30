---
'@usemotif/core': minor
'@usemotif/react': minor
'@usemotif/react-native': minor
'usemotif': minor
---

Add opt-in rejection of `$` paths a theme does not contain.

`MotifTypeOptions` is a second augmentation interface, separate from
`MotifCustomTheme` on purpose: deriving autocomplete from a theme and rejecting
a bad path are two decisions, and a consumer has to be able to make the first
without the second.

```ts
declare module 'usemotif' {
  interface MotifCustomTheme extends AppTheme {}
  interface MotifTypeOptions {
    strictTokens: true;
  }
}
```

With the flag set, `<Box p="$nope" />` reports
`Not a path in the 'space' scale: $nope`. Without it, nothing changes.

Only a literal `$` string is checked, so raw CSS values, numbers, non-ASCII
strings, and any value whose type is `string` all still compile. Reaching the
literal requires a generic type parameter, so every component that accepts
style props is now declared through `MotifComponent`, which resolves to the
plain non-generic signature unless the flag is set. Consumers who do not opt in
pay nothing.

Pseudo bags (`_hover`), the responsive forms, and a `styled()` config's own
style bags are deliberately not checked. Autocomplete still works inside all of
them.
