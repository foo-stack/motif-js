---
'@motif-js/react-native': minor
---

**Native `exitStyle` — presence-boundary contract analogous to web's `[data-motif-state="exiting"]`.**

Closes the "Native `exitStyle` (T1.2 deferral)" entry from the v0.4.x deferred-work window. `exitStyle` was accepted at the type level for cross-platform parity but no-op'd at runtime; this commit wires it through a real presence-boundary so a parent (Dialog, Drawer, etc.) can hold the subtree mounted long enough for the descendant exit animation to play.

```tsx
import {
  Box,
  useExitTransitionNative,
  // For your own boundary primitives:
  PresenceContext,
  usePresence,
} from '@motif-js/react-native';

function MyDialog({ open, onClose, children }) {
  const { shouldRender, ExitBoundary } = useExitTransitionNative(open);
  if (!shouldRender) return null;
  return (
    <Modal visible={shouldRender} onRequestClose={onClose}>
      <ExitBoundary>
        <Box exitStyle={{ opacity: 0 }} transition={{ duration: '200ms' }}>
          {children}
        </Box>
      </ExitBoundary>
    </Modal>
  );
}
```

**The contract:**

- `useExitTransitionNative(open, fallbackDurationMs?)` returns `{ shouldRender, phase, ExitBoundary }`. Mirrors `@motif-js/headless`'s web `useExitTransition` but without `transitionend` (no DOM events on native) — the exit window settles when descendant `<Box exitStyle>` calls signal completion through the new `PresenceContext`, OR when the fallback timer fires (whichever happens first).
- `ExitBoundary` wraps the exit-aware children and provides the `PresenceContext` value. Descendant boxes inside read `phase` and call `registerExit()` to register a pending exit animation; the returned callback is called when the driver settles.
- Outside any presence boundary the descendant phase is `'open'` and `registerExit` is a no-op — `<Box exitStyle={...}>` standalone is silently inert (no orphan-exit warnings; the boundary contract is opt-in).

**Driver interface extended:**

The `MotionDriver` type adds a `useExitAnimation(opts)` method symmetric with `useEntryAnimation`. `MotionDriverExitOptions` is the same shape as `MotionDriverEntryOptions` plus an `onComplete` callback the driver calls when the exit settles. All three bundled drivers implement it:

- `noopDriver` — single-frame exit (renders `from`, then snaps to `to` + signals).
- `animatedDriver` — RN `Animated.timing` from 0→1 with per-frame interpolation; signals at progress=1.
- `reanimatedDriver` — same shape as `useEntryAnimation`, falls back to JS-thread interpolation when the peer isn't loadable. (Full UI-thread `useAnimatedStyle` integration is still tracked separately.)

**Wrapper-stripping safety:** unchanged. The compiler already marks `enterStyle` non-strippable; `exitStyle` extracts to a class-scoped `[data-motif-state="exiting"]` rule on web, so wrapper stripping there stays safe. Native compilation doesn't reduce motion props to a StyleSheet entry, so this commit is purely runtime — no compiler changes needed.

**Failure modes:**

- A descendant that never signals (driver bug, peer dep missing, etc.) doesn't deadlock the parent — the fallback timer (default 400ms) fires and settles the boundary anyway.
- `fallbackDurationMs <= 0` skips the exit phase entirely, matching the pre-T1.2 instant-unmount path for callers that don't want any exit animation.
- A descendant that unmounts mid-flight (parent settled via fallback before the driver completed) drains its registration through a cleanup-time complete call so the boundary's pending-set never leaks.

**Test coverage:** 17 new tests across:

- 2 driver tests (`useExitAnimation` for `noopDriver` + `animatedDriver`) confirming `onComplete` fires once and the overlay lands at `to`.
- 9 presence-context tests covering phase transitions (open → exiting → closed), fallback-timer settling, descendant-signal settling (single + multi), stuck-descendant fallback, opt-out via `fallbackDurationMs<=0`, default `usePresence()` outside any boundary, and explicit `<PresenceContext.Provider>` usage.
- 5 Box-level integration tests covering no-boundary inertness, exit overlay during the boundary's exit phase, passThrough props during exit, fallback-timer rescue when the driver doesn't signal, and skip-exit semantics.

Total tests: 1,062 → 1,079 passing (+17). Skipped unchanged at 9. Bundle: `@motif-js/react-native` adds ~1.2 KB gz for the boundary helper + driver-method extensions; consumers that don't import `useExitTransitionNative` only pay the driver-interface widening (~50 bytes). Under the package's existing budget.

**API surface added (all from `@motif-js/react-native`):**

- `useExitTransitionNative(open, fallbackDurationMs?)`
- `PresenceContext`
- `usePresence()`
- `MotionPhase` / `PresenceContextValue` / `UseExitTransitionNativeResult`

The web `useExitTransition` hook in `@motif-js/headless` is untouched — it stays the source of truth for web's `transitionend`-driven flow. Native and web boundaries diverge by design: each platform uses its idiomatic completion signal (CSS event vs context callback).

Native Dialog adoption (where this hook actually wires through to a user-facing component) is queued as a follow-on so the contract can settle before downstream consumers depend on it.
