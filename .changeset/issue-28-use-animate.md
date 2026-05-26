---
'@usemotif/react': minor
'@usemotif/react-native': minor
'usemotif': minor
---

Add `useAnimate` — imperative animation controls scoped to a parent ref. Run animations from event handlers, sequence multiple animations with `await`, or target multiple descendants via CSS selectors.

```tsx
const [scope, animate] = useAnimate();

async function runIntro() {
  await animate(scope, { opacity: 1 }, { duration: 0.3 }).finished;
  await animate('.row', { x: 100 }, { duration: 0.4, delay: 0.1 }).finished;
}

return (
  <Box ref={scope}>
    {rows.map(r => <Row key={r.id} className="row" {...r} />)}
    <Button onPress={runIntro}>Animate</Button>
  </Box>
);
```

`animate(target, keyframes, options?)` accepts:

- **`target`** — the scope ref (animates the scoped root) or a CSS selector string (animates every element matching inside the scope). Multiple matches animate in parallel.
- **`keyframes`** — a single style bag; the runtime animates from the element's current computed style to the provided values.
- **`options`** — `{ duration, delay, easing }` — durations in seconds (matches framer-motion's convention); `easing` accepts any CSS timing function. Defaults: `0.3s`, `0`, `'ease-in-out'`.

Returns `{ finished, cancel, pause, play }` — `finished` resolves when the animation settles so consumers can `await` sequences. Pause / play / cancel map to the underlying Web Animations primitives. In-flight animations cancel automatically on unmount.

**Platform note:** `useAnimate` runs through the Web Animations API on web (off the main thread where supported). On native, v1 ships as a documented stub — calls log a one-time dev warning and resolve immediately. RN's pull-model architecture doesn't fit imperative animate cleanly without a driver-surface change; proper native imperative animation is a follow-up. Cross-platform consumers should drive props via `useSpring` (#34) or `useTransform` (#27) + motion-value-bound style props on `Box` for now.

Out of scope here (filed as separate follow-ups):

- Child staggering — declarative `stagger` prop on Stack / Box for staggered child entrances. The issue's open question whether to split was resolved as "split"; the stagger half tracks separately.
- Native imperative animate via a `useImperativeAnimate` driver method (Reanimated `withTiming` / `withSequence`).
- Theme-token resolution for `duration` / `easing` options — v1 accepts literal CSS values only.
