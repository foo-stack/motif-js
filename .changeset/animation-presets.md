---
'@motif-js/core': minor
'@motif-js/tokens': minor
'@motif-js/react-web': minor
'@motif-js/react-native': patch
---

**Named-curve animation presets — `<Box animation="bouncy">`.**

Adds `animations` to the token scale set + an `animation` prop to
every styled primitive. Pre-set durations, easings, and full spring
configs live alongside other tokens; themes can override individual
entries; consumers reach them by name. Closes Tier 2.

```tsx
import { animations, lightTheme } from '@motif-js/tokens';
import { Box, ThemeProvider } from '@motif-js/react-web';

const theme = { ...lightTheme, tokens: { ...lightTheme.tokens, animations } };

<ThemeProvider themes={[theme]} active={theme.name}>
  <Box
    animation="bouncy"
    enterStyle={{ opacity: 0, transform: 'scale(0.8)' }}
    animateOnly={['opacity', 'transform']}
  >
    Slides in.
  </Box>
</ThemeProvider>;
```

- **Token scale**: `TokenMap.animations` is a flat `Record<string,
AnimationToken>`. Each entry is either a timing config
  (`{ duration?, easing? }`) or a spring config
  (`{ type: 'spring', mass?, damping?, stiffness? }`). `duration` /
  `easing` accept literal CSS values OR `$durations.<n>` /
  `$easings.<name>` token references.

- **Default presets** in `@motif-js/tokens` (consumers can override or
  extend per-theme):
  - `quick` (~150ms, standard) — small UI affordances
  - `normal` (~200ms, standard) — default for prop-change transitions
  - `slow` (~500ms, decelerate) — drawers, sheets
  - `bouncy` (~300ms, overshoot bezier) — cubic-bezier tuned for soft springs
  - `snappy` (spring; mass: 0.7, damping: 18, stiffness: 220)
  - `lazy` (spring; mass: 1.2, damping: 14, stiffness: 80)

- **`animation="<name>"` on web** expands to a CSS `transition`
  string built from `var(--motif-anim-<name>-duration)` /
  `var(--motif-anim-<name>-easing)` references. Theme switches flip
  the timing through the cascade — no React re-renders. Spring
  configs go through a fitted spring → bezier approximation
  (`springToCssTiming`) at CSS-var emit time.

- **`animation="<name>"` on native** looks up the named preset via
  `resolveAnimationToken(name, theme)` and feeds
  `{ durationMs, easing }` to the active motion driver. Spring
  configs fall back to the CSS approximation for the JS-thread
  Animated driver; the Reanimated driver, when registered, can
  read the spring directly from the prop and run it on the UI
  thread (the driver-API contract was already in place from T1.2).

- **`animateOnly`** restricts the property list. Default `'all'`;
  pass `['transform']` for transform-only, or
  `['transform', 'opacity']` for both. On web, expands to a comma-
  joined transition list. On native, accepted at the type level
  but no-op for the entry-overlay driver (the overlay already
  applies only to keys present in `enterStyle`).

- **`transition` wins over `animation`** when both are set —
  `transition` is the more specific, lower-level instruction.

- **Animation tokens are themed**. Each theme can override
  individual `animations` entries; the per-theme CSS block emits
  the corresponding `--motif-anim-*` vars so the cascade picks them
  up. Animation-prop CSS-var emission deliberately bypasses the
  generic `resolveToken` path because animation tokens are object
  leaves, not primitive `string | number` values.

- **Compiler-side animation extraction deferred to T3.6**, consistent
  with the deferral pattern from T1.1 / T1.2 / T1.4 / T2.1.

13 new core tests cover `resolveAnimationToken` and the
`springToCssTiming` heuristics across timing/spring inputs and
under-/critically-damped regimes. 2 new conformance cases on the
web renderer (`animation`, `animation + animateOnly`).

Bundle: `@motif-js/core` 4.9 → 5.5 KB gz, `@motif-js/react-web`
9.0 → 9.3 KB gz, `@motif-js/tokens` 1.9 → 2.0 KB gz — all under
budget.
