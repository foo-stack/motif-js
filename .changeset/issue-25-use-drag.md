---
'@usemotif/react': minor
'@usemotif/react-native': minor
'usemotif': minor
---

Add `useDrag` — general-purpose drag gesture hook for both web and native, composing with the existing motion-value surface.

```tsx
const { dragProps, x, y, isDragging } = useDrag({
  axis: 'x',                                    // optional axis lock
  constraints: { left: -100, right: 100 },      // optional bounds
  onDragStart: ({ offset }) => console.log('start', offset),
  onDrag: ({ offset, velocity }) => …,
  onDragEnd: ({ velocity }) => …,
});

return <Box {...dragProps} x={x} y={y}>drag me</Box>;
```

Returns:

- `dragProps` — spread onto a `Box`. On web: `{ onPointerDown }`. On native: RN `panHandlers` bag.
- `x` / `y` — `MotionValue<number>`s tracking the current offset. Compose with `useTransform`, `useSpring`, the transform-shorthand motion-value plumbing — drag offset → opacity / rotation / scale derives for free, no React render per move.
- `isDragging` — boolean for affordance UI (cursor, shadow, etc.).

Options:

| Field | Type | Description |
| --- | --- | --- |
| `axis` | `'x' \| 'y' \| 'both'` | Lock to one axis. Default `'both'`. |
| `constraints` | `{ left?, right?, top?, bottom? }` | Clamp offset bounds (pixels / DIPs). Each side optional. |
| `onDragStart` / `onDrag` / `onDragEnd` | `(info: DragInfo) => void` | Lifecycle callbacks; `info` carries `offset` + `velocity`. |

**Web** uses Pointer Events with `setPointerCapture` so drag tracks outside the element bounds. **Native** uses `PanResponder` on the JS thread (default driver); UI-thread tracking via Reanimated / `react-native-gesture-handler` is a follow-up.

Out of scope for v1 (separate follow-ups):

- Momentum / spring settle on release — pair with `useSpring` at the consumer site for now: `useSpring(0).set(0)` in `onDragEnd`.
- `dragElastic` — rubber-band overshoot past constraints.
- `drag` / `dragConstraints` props on `Box` — the prop-on-primitive surface; the hook is the primitive and consumers can wrap their own.
- UI-thread native drag via the motion-driver registry.
