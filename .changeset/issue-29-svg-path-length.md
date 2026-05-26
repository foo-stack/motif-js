---
'@usemotif/react': minor
'@usemotif/react-native': minor
'usemotif': minor
---

Add `<Path>` with `pathLength` for SVG stroke-drawing animations. Cross-platform: web and native share the same surface.

```tsx
import { Svg, Path, useMotionValue } from '@usemotif/react'; // or @usemotif/react-native

function DrawingArrow() {
  const progress = useMotionValue(0);
  useEffect(() => { progress.set(1); }, []);
  return (
    <Svg viewBox="0 0 24 24">
      <Path d="M5 12h14M13 6l6 6-6 6" pathLength={progress} />
    </Svg>
  );
}
```

`pathLength` accepts a literal `number` in `0..1` or a `MotionValue<number>`. Internally motif emits SVG's intrinsic `pathLength="1"` on the underlying path along with `strokeDasharray="1 1"` and a `strokeDashoffset` that walks between hidden (`1`) and fully drawn (`0`) — so the same `0..1` range works regardless of the path's real geometry.

Web maps to `<path>` directly. Native maps to `react-native-svg`'s `Path` when the peer dep is installed; degrades to `null` (under the existing `<Svg>` sized-Box placeholder) when it isn't.

Reduced-motion handling stays consumer-side: branch on `useReducedMotion()` and pass `1` directly when reduced motion is on.
