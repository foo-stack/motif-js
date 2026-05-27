---
'@usemotif/react-native': minor
'usemotif': minor
---

Native `useAnimate` is now functional: replaces the v1 stub with a real driver-routed implementation.

```tsx
const [scope, animate] = useAnimate();

async function runIntro() {
  await animate(scope, { opacity: [0, 1] }, { duration: 0.3 }).finished;
  await animate(rowRef, { opacity: [0, 1], scale: [0.95, 1] }, { duration: 0.4 }).finished;
}
```

- New `useImperativeAnimate` optional method on `MotionDriver`. `animatedDriver` implements it: `Animated.Value` per (target × property), `Animated.timing` + `Animated.parallel`, per-frame `setNativeProps` writes to the target view.
- Keyframes accept `[from, to]` tuples (explicit) or a single value (uses last-known cached value or a per-property identity default — `opacity: 1`, `scale: 1`, others fall back to the target value as the starting point on first call).
- Returns the full `AnimationControls` shape (`finished` / `cancel` / `pause` / `play`).
- Selector-string targets resolve to a no-op (RN has no `querySelectorAll`). Cross-platform code that relies on selectors should branch by platform.
- Drivers that don't implement the method continue to fall back to the documented stub (immediate resolve + one-time dev warning).
