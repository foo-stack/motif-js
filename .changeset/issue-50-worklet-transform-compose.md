---
'@usemotif/react-native': patch
'usemotif': patch
---

Compose transform-shorthand motion values on the UI thread inside the Reanimated driver. Per-axis bindings now live under their own key in the driver's shared record (`x`, `y`, `rotate`, …) instead of being pre-composed into `transform` on the JS thread. The `useAnimatedStyle` worklet body walks an inline axis-order array and emits the RN `transform` array directly — no JS-thread round-trip per frame.

When the Reanimated peer isn't loadable, the fallback path still uses the canonical JS-thread `composeTransformAxesNative` so the produced overlay matches what the default `animatedDriver` emits.

```tsx
import { registerMotionDriver, Box, useMotionValue } from '@usemotif/react-native';
import { reanimatedDriver } from '@usemotif/react-native/reanimated';

registerMotionDriver(reanimatedDriver);

function Demo() {
  const x = useMotionValue(0);
  const rotate = useMotionValue(0);
  return <Box x={x} rotate={rotate}>…</Box>; // transform composed on the UI thread
}
```
