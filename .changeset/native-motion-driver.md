---
'@motif-js/react-native': minor
---

**Native motion — `enterStyle` + transition timing on every primitive.**

`<Box enterStyle={...} transition={...}>` (and every primitive that
delegates to Box: `<Stack>`, `<HStack>`, `<VStack>`, `<Pressable>`, …)
now runs an interpolated entry animation on first mount.

```tsx
import { Box } from '@motif-js/react-native';

<Box
  opacity={1}
  enterStyle={{ opacity: 0 }}
  transition={{ duration: '$durations.3', easing: 'ease-out' }}
>
  <Text>Slides in.</Text>
</Box>;
```

- **Driver model.** Animations run through a pluggable `MotionDriver`.
  The default (`animatedDriver`) is backed by RN's built-in `Animated`
  API — runs on the JS thread, no extra peer deps required, ships with
  every React Native install. Apps wanting UI-thread perf register the
  Reanimated driver at startup:

  ```tsx
  import { registerMotionDriver } from '@motif-js/react-native';
  import { reanimatedDriver } from '@motif-js/react-native/reanimated';

  registerMotionDriver(reanimatedDriver);
  ```

  The Reanimated driver is in a separate module — apps that don't
  import it pay zero bundle cost for `react-native-reanimated`.

- **Timing.** `transition.duration` and `transition.easing` size the
  entry animation. Token references (`$durations.3`, `$easings.standard`)
  resolve against the active theme. CSS-shorthand strings
  (`"opacity 200ms ease"`) are also accepted and parsed for parity
  with web. Defaults: `200ms`, `ease`.

- **Interpolation.** Numeric props (opacity, scale, translate\*,
  width/height, padding/margin, etc.) interpolate linearly between
  `enterStyle[k]` and the resolved base-style value. Non-numeric props
  snap at the midpoint (no JS-side string interpolation).

- **`exitStyle` is accepted at the type level** for cross-platform
  parity but currently no-ops on native. Native exit transitions
  require a presence-boundary contract analogous to web's
  `[data-motif-state="exiting"]`; that's queued for a v0.4.x follow-up
  alongside the broader native exit story.

- **Test driver.** A `noopDriver` is exported for deterministic test
  setups — registers via `registerMotionDriver(noopDriver)` and
  short-circuits the animation to a single-frame entry.

15 new unit tests cover driver registration, the noop / animated
drivers, Box's motion-path dispatch, and the conformance suite gains
a `Box / enterStyle` case that asserts the settled style equals the
resolved base after mount.
