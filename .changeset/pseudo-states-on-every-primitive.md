---
'@motif-js/core': minor
'@motif-js/react-web': minor
'@motif-js/react-native': minor
'@motif-js/test-utils': minor
---

**Pseudo-state props on every styled primitive.**

`_hover`, `_focus`, `_active`, and `_disabled` now work on `Box` and on
every primitive that extends it (`Stack`, `HStack`, `VStack`, `Flex`,
`Grid`, `Heading`, `Paragraph`, `Code`, `Card`, `Field`, etc.) — not
just `Pressable`. Web emits class-based CSS rules using the same
infrastructure (`injectPseudoRules`, `hashPseudoRules`,
`buildPseudoCss`) that Pressable used previously, so the dedup story
and the SSR collector path are unchanged.

```tsx
<Box
  bg="$colors.surface.base"
  _hover={{ bg: '$colors.surface.muted' }}
  _focus={{ outlineWidth: 2, outlineColor: '$colors.action.primary.bg' }}
/>
```

The schema (`PSEUDO_STATE_PROP_NAMES`, `PSEUDO_SELECTOR`,
`StateStyleBag`, `StateStyleProps`, `isPseudoStateProp`) is now exported
from `@motif-js/core` so renderers and the compiler share one source of
truth.

`_focus` continues to map to `:focus-visible` (mouse-click focus does
not show the focus ring). On web a dev-only warning fires when
`_focus` is set on an element that has no implicit tab stop and no
explicit `tabIndex` — the styling would never apply otherwise.

On native, `Box` accepts the four props for type-level cross-platform
parity but discards them at runtime: RN `<View>` does not track
hovered/focused/pressed state. To apply state-driven styling on native,
use `<Pressable>` (which uses RN's children-as-style function form) as
before.

`Pressable` no longer hand-rolls pseudo emission — it composes `Box`
with the four props passed straight through, so behaviour is identical
whether the props are set on `<Pressable>` or any other styled
primitive. `Button` and `IconButton` no longer omit the four props from
their public type, so callers can override the built-in hover / focus
styles when needed.

The cross-renderer conformance harness gains a `skipOnRenderer` field
on `ConformanceCase` and three new Box-targeted pseudo-state cases
that exercise the runtime path on web (and skip on native, by design).
