---
'@usemotif/react-native': minor
'usemotif': minor
---

Add a `useDragBacking` seam on `MotionDriver` so native drag can opt into a UI-thread gesture pipeline. The default `animatedDriver` keeps the JS-thread `PanResponder` integrator; `reanimatedDriver` implements `useDragBacking` when both `react-native-reanimated` AND `react-native-gesture-handler` are loadable, wiring a `Gesture.Pan()` into shared values and bridging back to motion-value subscribers via `runOnJS`.

```tsx
// App startup:
import { registerMotionDriver } from '@usemotif/react-native';
import { reanimatedDriver } from '@usemotif/react-native/reanimated';
registerMotionDriver(reanimatedDriver);

// Components — useDrag picks up the driver automatically:
function Card() {
  const { Wrapper, dragProps, x, y } = useDrag({
    constraints: { left: -100, right: 100 },
    dragMomentum: true,
  });
  return (
    <Wrapper>
      <Box {...dragProps} x={x} y={y}>drag me</Box>
    </Wrapper>
  );
}
```

`useDrag`'s result now includes a `Wrapper` component. On the default driver `Wrapper` is a passthrough `Fragment` — consumer code keeps working unchanged. On the gesture-handler / reanimated path `Wrapper` is the required `<GestureDetector gesture={…}>` host. The canonical `<Wrapper><Box {...dragProps} … /></Wrapper>` pattern works uniformly under both drivers.

`Box`'s declarative `drag` prop already wires this through internally; consumers don't need to touch the surface.

If only one of the peers is installed, the driver omits `useDragBacking` and consumers transparently fall back to the JS-thread `PanResponder` integrator.
