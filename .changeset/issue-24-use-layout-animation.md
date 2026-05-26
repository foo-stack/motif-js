---
'@usemotif/react': minor
'@usemotif/react-native': minor
'usemotif': minor
---

Animate layout changes (FLIP) with the new `useLayoutAnimation` hook and a `layout` prop on `Box` that wires the hook for the declarative case.

```tsx
// Declarative — most consumers want this:
<Box layout>{children}</Box>
<Box layout="position">{children}</Box>
<Box layout="size">{children}</Box>

// Hook for custom hosts:
const { ref, onLayout, style } = useLayoutAnimation();
<Box ref={ref} onLayout={onLayout} style={style}>…</Box>
```

The hook returns a unified cross-platform shape: `{ ref, onLayout?, style? }`. Spread the relevant fields onto a Box (the `layout` prop does this internally). On web, the FLIP runs through `getBoundingClientRect()` inside `useLayoutEffect` — synchronous measurement before paint, inverse transform applied inline, then a `requestAnimationFrame` clears it under a CSS transition. On native, the FLIP runs through `onLayout` plus `Animated.timing` on four `Animated.Value`s (translateX / translateY / scaleX / scaleY) composed into `style.transform`; `useNativeDriver: true` keeps the interpolation off the JS thread on the default driver.

Options:

| Field | Type | Description |
| --- | --- | --- |
| `kind` | `'all' \| 'position' \| 'size'` | Which axes to animate. Default `'all'`. |
| `duration` | `number` (seconds) | Default `0.3`. |
| `easing` | `string` | Web: CSS easing function. Native: maps `linear`/`ease`/`ease-in`/`ease-out`/`ease-in-out` to RN's Easing curves. Default `'ease-in-out'`. |

**Web FLIP** preserves the element's existing transform / transition / transformOrigin via save-and-restore around the animation, so layout animation doesn't leak into resting style.

**Native FLIP** carries a one-frame visual delta between RN's layout commit and `onLayout` firing — for large layout deltas a brief flash is possible. Web's `useLayoutEffect` avoids this; RN has no synchronous equivalent. Most UI-scale layout changes (collapsing panels, resizing cards) are small enough that the flash isn't perceptible.

Out of scope (separate follow-ups):

- Shared-layout transitions (`layoutId` — morph-between-elements across mount/unmount).
- Theme-token resolution for `duration` / `easing`.
- Defined precedence rules between `layout` and `transform`-based `transition` / `animation` on the same element.
- UI-thread native FLIP via Reanimated `useAnimatedReaction`.
