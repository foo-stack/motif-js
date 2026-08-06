---
'@usemotif/react-native': patch
---

Stop leaking `styled()` string tags onto the underlying native View

`styled('button', …)` forwarded `as: Component` to the native `Box`, which has
no `as` prop and never destructures it. The tag therefore never changed the
rendered element — it fell through `Box`'s rest-spread and landed on the
underlying `View` as a stray prop.

The tag is no longer forwarded, and a development-only warning now fires the
first time each string tag is used on native, pointing at the component form
(`styled(Pressable, …)`, `styled(Text, …)`, `styled(Box, …)`) that behaves the
same on both platforms. The `styled()` reference docs now carry the same caveat.

This makes existing behavior explicit rather than changing it: a string tag
rendered a plain `View` on native before this fix and still does. Only the stray
prop is gone. Rendering a true native equivalent per tag would be a behavioral
change and is not part of this release.
