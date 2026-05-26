---
'@usemotif/react': minor
'@usemotif/react-native': minor
'usemotif': minor
---

Add `useScroll` — scroll position as motion values that bypass React renders.

```tsx
// Web — window scroll:
const { scrollYProgress } = useScroll();
const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

// Web — element scroll container:
const ref = useRef<HTMLDivElement>(null);
const { scrollYProgress } = useScroll({ container: ref });
<div ref={ref} style={{ overflow: 'auto' }}>…</div>

// Native — bind to a motif ScrollView via ref:
const ref = useRef<MotifScrollViewRef>(null);
const { scrollYProgress } = useScroll({ container: ref });
<ScrollView ref={ref}>…</ScrollView>
```

Returns four `MotionValue<number>`s: `scrollX`, `scrollY`, `scrollXProgress`, `scrollYProgress`. The `*Progress` values are `0..1` ratios of scroll position relative to the maximum scrollable distance on each axis. Compose with `useTransform` to drive parallax, scroll-linked opacity, sticky-reveal effects, and progress indicators.

On native, the motif `<ScrollView>` now accepts a `ref` exposing a scroll publisher; `useScroll` subscribes through it. Consumer `onScroll` handlers still fire alongside.

Out of scope for v1 (separate follow-up issue):
- `target`-relative progress (element-into-viewport with `offset: ['start end', 'end start']` edge strings)
- `ScrollTimeline` API path on web for off-main-thread updates
