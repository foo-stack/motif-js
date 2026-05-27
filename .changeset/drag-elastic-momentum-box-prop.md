---
'@usemotif/react': minor
'@usemotif/react-native': minor
'usemotif': minor
---

Three drag improvements bundled together:

**`dragElastic`** (closes #59) — rubber-band overshoot past `constraints`. `0` (default) clamps hard; values in `(0, 1]` scale the over-bound portion of the offset linearly, the canonical iOS-style over-scroll. Has no effect without `constraints`.

```tsx
const { dragProps, x, y } = useDrag({
  constraints: { left: -100, right: 100 },
  dragElastic: 0.5,
});
```

**`dragMomentum` + `dragTransition`** (closes #58) — when `dragMomentum: true`, the released value continues with velocity-driven inertia and settles via a spring back into `constraints`. `dragTransition` tunes the settle spring (defaults `stiffness=200, damping=25, mass=1`). The spring also handles the elastic-return case (released past bounds while `dragElastic > 0`).

```tsx
const { dragProps, x, y } = useDrag({
  constraints: { left: -100, right: 100 },
  dragMomentum: true,
  dragTransition: { stiffness: 300, damping: 30 },
});
```

**`drag` prop on `Box`** (closes #60) — declarative wrapper around `useDrag` with the full prop surface mirrored:

```tsx
<Box
  drag                                     // boolean | 'x' | 'y'
  dragConstraints={{ left: -100, right: 100 }}
  dragElastic={0.5}
  dragMomentum
  onDragEnd={({ offset }) => console.log(offset)}
>
  drag me
</Box>
```

Internally `Box` dispatches to a wrapper sub-component that runs `useDrag` and binds its `x` / `y` motion values to the Box's transform shorthand. The drag pointer handler composes with any consumer-supplied `onPointerDown`. Native uses RN's PanResponder via the same hook; the panHandlers spread onto the underlying View.
