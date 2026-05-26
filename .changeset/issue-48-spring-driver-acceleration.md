---
'@usemotif/react-native': minor
'usemotif': minor
---

Native `useSpring` now routes through the active motion driver when the driver implements `useSpringBacking`, moving the spring physics off the JS thread.

- **`animatedDriver`** (default): backed by `Animated.spring`. Listener on the `Animated.Value` mirrors per-frame updates to motion-value subscribers.
- **`reanimatedDriver`**: backed by `withSpring` on the UI thread. `useAnimatedReaction` + `runOnJS` bridges the shared value back to JS subscribers. JS-thread rAF integrator is used when the Reanimated peer isn't actually loadable, so the driver doesn't degrade harder than the default.
- **`noopDriver`**: snaps to target (matches its no-animation contract).

Drivers that don't implement `useSpringBacking` continue to drive the JS-thread `requestAnimationFrame` integrator that `useSpring` shipped with — same physics, same behaviour, no consumer changes needed.

```tsx
import { useSpring } from '@usemotif/react-native';

const x = useSpring(0, { stiffness: 200, damping: 18 });
x.set(100); // spring math now runs on the driver's chosen thread
```
