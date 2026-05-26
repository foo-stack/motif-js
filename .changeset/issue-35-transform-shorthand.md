---
'@usemotif/core': minor
'@usemotif/react': minor
'@usemotif/react-native': minor
'usemotif': minor
---

Add transform shorthand style props — `x`, `y`, `z`, `rotate`, `rotateX`, `rotateY`, `rotateZ`, `scale`, `scaleX`, `scaleY`, `skew`, `skewX`, `skewY`. Each one composes into a single `transform` declaration at resolution time, so multiple shorthand props on the same Box merge into one canonical-order CSS `transform` (web) or RN transform-array (native).

```tsx
// Static:
<Box x={10} rotate={45} scale={0.9} />
// → web:    transform: translateX(10px) rotate(45deg) scale(0.9);
// → native: transform: [{ translateX: 10 }, { rotate: '45deg' }, { scale: 0.9 }]

// Motion-value driven (composes coalesced per frame):
const x = useSpring(0);
const rotate = useSpring(0);
<Box x={x} rotate={rotate} />
x.set(100);   // recomposes the entire transform; sibling axes preserved

// Theme-resolved translate via the space scale:
<Box x="$space.4" />
```

Canonical emission order is `translate → rotate → scale → skew` to match framer-motion (matrix multiplication is non-commutative, so the order is load-bearing). `x` / `y` / `z` use the `space` token scale; rotations and skews are unitless numerics treated as degrees by the composer.

Literal `transform="..."` wins when set alongside shorthand — author-explicit override beats compositional intent; the shorthand is silently dropped on that element. Mixing requires composing into the literal manually.

Motion-value integration: the 13 new props join `MotionValueWidenedProp` so each accepts a `MotionValue<number>`. The runtime treats axis MVs specially — multiple axes on one Box share the single `transform` slot, and the per-axis subscriber re-composes the whole `transform` string (web) or array (native) on every change instead of issuing per-axis writes that would clobber each other. The default `animatedDriver` keys one `Animated.Value` per axis and composes the RN array; the `noopDriver` snaps to the composed array; the `reanimatedDriver` composes on the JS thread (worklet-thread composition is a follow-up).

New exports from `@usemotif/core`:

- `composeTransformAxesWeb(axes)` — compose to a CSS `transform` string
- `composeTransformAxesNative(axes)` — compose to RN's transform array
- `TRANSFORM_AXIS_NAMES`, `TRANSFORM_AXIS_SET` — canonical-order list + membership set
- `TransformAxis`, `TransformAxes`, `NativeTransformEntry` types

Pseudo-state interop (`_hover={{ x: 5 }}`) works through the existing flat resolver — the same composer rewrites the pseudo bag's `transform` slot.
