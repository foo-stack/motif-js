---
'@usemotif/core': minor
'@usemotif/react': minor
'@usemotif/react-native': minor
'usemotif': minor
---

**Motion values** — a reactive animatable value primitive that lives outside React's render cycle.
`createMotionValue(initial)` returns an object with `.get()`, `.set()`, and `.on('change', cb)`;
`useMotionValue(initial)` and `useTransform(source, …)` are the React-facing hooks. On web, a
`<Box opacity={mv} />` subscribes to `mv` and writes `element.style.opacity` directly when
`mv.set(...)` fires — no React render. On native, motion values route through the active motion
driver (`Animated.Value` for the default driver, Reanimated shared values when registered) so
60fps updates bypass JS-thread reconciliation.

`useTransform(source, inputRange, outputRange)` does piecewise-linear interpolation for numeric
outputs and a step function for string outputs (token strings included; real colour interpolation
is a follow-up). The function form `useTransform(source, transformer)` runs an arbitrary mapping.

Motion-value-bound style props in v1 are: `opacity`, `width` / `height` (and `min*` / `max*`),
`top` / `right` / `bottom` / `left` / `start` / `end`, `borderRadius`, `fontSize`, `zIndex`,
and `transform`. The widening is additive — embedding a motion value inside a responsive object
(`<Box opacity={{ base: mv, md: 1 }}>`) is rejected; consumers wanting per-breakpoint MV behaviour
use `useTransform` to derive a value.

Motion-value writes are imperative and bypass the `transition` prop (matching framer-motion). For
eased writes on `.set()`, watch for a future `useSpring`. Drag (#25) and scroll-linked animation
(#26) build on this primitive.
