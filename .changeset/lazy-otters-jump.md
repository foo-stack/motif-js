---
'@usemotif/react-native': patch
---

Cut per-render allocation on the native `Box` and stop the animation layer churning its work each render.

`Box` re-ran the full resolve → sanitize → direction-inject pipeline on every
render and called `StyleSheet.create` each time, handing back a fresh style
object whose new identity defeated `StyleSheet.create` reuse and any
downstream referential-stability check — on the most-used primitive. The
pipeline output is now memoized against its inputs (theme, direction, viewport
width, container, breakpoints, and a shallow compare of the prop bag), so a
re-render with unchanged inputs reuses both the work and the style identity.
The shared `ScrollView` resolver benefits too.

The `Animated` and Reanimated motion-value drivers subscribed a listener per
binding inside an effect with no dependency array, tearing down and re-adding
every listener on any re-render. They now resubscribe only when the set of
(node ← motion-value) pairings changes, so an unrelated re-render leaves the
subscriptions untouched while swapping a motion value onto a prop still moves
the listener.

The imperative-animation driver no longer reads `Animated.Value`'s private
`_value` field to find a property's current position; it tracks the latest
value through the tick listener it already runs and reads that instead.
