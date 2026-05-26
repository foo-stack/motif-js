---
'@usemotif/react': minor
'@usemotif/react-native': minor
'usemotif': minor
---

Add `useLayoutAnimation` — animate an element between its previous and next layout box (FLIP).

```tsx
function ResizingPanel() {
  const ref = useLayoutAnimation();
  const [expanded, setExpanded] = useState(false);
  return (
    <div ref={ref} style={{ height: expanded ? 200 : 80 }}>
      …
    </div>
  );
}
```

The hook reads the element's `getBoundingClientRect()` inside `useLayoutEffect` (runs after the DOM updates, before paint). On every commit it compares the new rect to the previous one; if they differ, it applies an inverse transform synchronously (the element stays visually where it was) then schedules a `requestAnimationFrame` tick that clears the transform under a CSS transition, animating to the real position.

Options:

| Field | Type | Description |
| --- | --- | --- |
| `kind` | `'all' \| 'position' \| 'size'` | Which axes to animate. Default `'all'`. |
| `duration` | `number` (seconds) | Transition duration. Default `0.3`. |
| `easing` | `string` | CSS easing function. Default `'ease-in-out'`. |

The hook is purely imperative — no state changes, no re-renders. The element's existing transform / transition / transformOrigin are saved before the FLIP runs and restored when the animation settles, so layout animation doesn't leak into the element's resting style.

**Platform note:** Web only in v1. Native ships as a documented stub — RN has no synchronous measurement primitive (`onLayout` fires after layout, `measure()` is callback-based). Native FLIP via measure + motion-driver routing is a follow-up. Cross-platform workaround today: animate explicit width / position via motion-value-bound style props on `Box`.

Out of scope for v1 (separate follow-ups):

- Shared-layout transitions (`layoutId` — framer-motion's morph-between-elements pattern).
- A `layout` prop on `Box` that wraps the hook for the declarative case.
- Native FLIP implementation.
- Interaction precedence rules with `transform`-based `transition` / `animation` on the same element. The hook currently saves/restores the original transform so the resting state is preserved, but a running transition + a layout animation may visually compete; document and refine in the follow-up.
- Theme-token resolution for `duration` / `easing` options.
