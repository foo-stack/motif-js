---
'@usemotif/core': minor
'@usemotif/react': minor
'@usemotif/react-native': minor
'usemotif': minor
---

Add `target` + `offset` to `useScroll` — progress advances `0 → 1` as a specific element enters / exits the viewport (or scroll container). framer-motion-compatible offset shape.

```tsx
// Web — pass any ref to the tracked element.
const ref = useRef<HTMLDivElement>(null);
const { scrollYProgress } = useScroll({
  target: ref,
  offset: ['start end', 'end start'], // default
});
```

```tsx
// Native — useScrollTarget yields a { ref, onLayout } handle to spread
// onto the tracked element so the hook can read its layout without
// hopping the UI thread per scroll tick.
const scrollRef = useRef<MotifScrollViewRef>(null);
const target = useScrollTarget();
const { scrollYProgress } = useScroll({ container: scrollRef, target });

<ScrollView ref={scrollRef}>
  <Box ref={target.ref} onLayout={target.onLayout}>tracked</Box>
</ScrollView>;
```

Offset entries accept the keyword forms (`'start'`, `'center'`, `'end'`), percentages (`'25%'`, `'100%'`), and bare 0..1 fractions. Default offset is `['start end', 'end start']` — element-top entering viewport-bottom → element-bottom exiting viewport-top.

Web also adds `ResizeObserver` plumbing so target-layout changes (font / image load, dynamic content) refresh the progress anchors without a scroll event.
