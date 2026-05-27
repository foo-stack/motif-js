---
'@usemotif/react': minor
'@usemotif/react-native': minor
'usemotif': minor
---

Add a `stagger` prop to `Stack` (and `HStack` / `VStack`) for orchestrating per-child entry-animation delays.

```tsx
<Stack stagger={0.05}>
  {items.map((item) => (
    <Box key={item.id} enterStyle={{ opacity: 0 }}>{item.label}</Box>
  ))}
</Stack>
```

Each direct child gets `index * stagger` seconds of delay added to its mount animation:

- **Web** routes the delay through `transitionDelay` on the inline style, layered on top of the existing `transition` from each child.
- **Native** forwards a new `delayMs` field on `MotionDriverEntryOptions`; `animatedDriver` and `reanimatedDriver` `setTimeout`-defer their animation kickoff; `noopDriver` honours it too for test determinism.

Reduced-motion handling:

- Web reads `(prefers-reduced-motion: reduce)` synchronously at render and collapses stagger to `0` when on.
- Native v1 keeps reduced-motion gating consumer-side — branch on `useReducedMotion()` from `@usemotif/headless` and pass `0` when reduced motion is on. (Same policy the rest of motif's motion surface uses.)

Children without `enterStyle` are unaffected. `stagger={0}` (or omitted) is a no-op — no context provider work, no per-child wrapping.
