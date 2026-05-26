---
'@usemotif/react': minor
'@usemotif/react-native': minor
'usemotif': minor
---

Add `useSpring` — a motion value whose `.set(target)` springs from the current value toward `target` over the spring's natural duration instead of snapping.

```tsx
const x = useSpring(0, { stiffness: 200, damping: 18 });
x.set(100);                     // springs from current to 100
<Box style={{ transform: `translateX(${x.get()}px)` }} />;

// Theme-aware config:
const y = useSpring(0, '$animations.bouncy');
```

The returned value is a `MotionValue<number>`, so it drops into every styled-primitive prop that already accepts a motion value — including `useTransform` for chaining and the existing motion-value bindings on `Box`. Mid-flight `.set()` smoothly redirects the spring without resetting velocity (the "drop the panel" / drag-release feel).

Config is either a literal `SpringConfig` (`stiffness`, `damping`, `mass`, `restSpeed`, `restDistance`, `velocity`) or a theme-token name (`'bouncy'` or `'$animations.bouncy'`). Timing tokens and unknown names fall back to the default spring.

Out of scope for v1 (separate follow-up):
- Native driver acceleration — Reanimated `withSpring` / `Animated.spring` paths that take the spring off the JS thread. v1 ships a JS-thread `requestAnimationFrame` integrator on both platforms.

Honour user reduced-motion preference at the consumer level — branch on `useReducedMotion()` (from `@usemotif/headless` or via `prefers-reduced-motion: reduce`) and bypass `useSpring` for an instant write when reduced motion is on.
