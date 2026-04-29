---
'@motif-js/react-native': minor
---

**Reanimated driver — UI-thread integration via `useSharedValue` + `useAnimatedStyle`.**

Closes the "Reanimated driver — UI-thread integration (T1.2 deferral)" entry from the v0.4.x deferred-work window. The v1 driver was a thin shim that did JS-thread `setState`-per-frame interpolation; this commit upgrades it to drive animations through Reanimated's UI-thread primitives so the React tree never re-renders during the animation.

```tsx
import { registerMotionDriver } from '@motif-js/react-native';
import { reanimatedDriver } from '@motif-js/react-native/reanimated';

// Once at app startup. Apps with `react-native-reanimated` installed
// get UI-thread animations; apps without get the JS-thread fallback.
registerMotionDriver(reanimatedDriver);
```

**What changed:**

- **`MotionDriver` interface** gains an optional `AnimatedHost` slot. Drivers that need a custom host component (Reanimated's `Animated.View` is the canonical case — `useAnimatedStyle` results only animate when consumed by it) expose it through this slot. Box reads `driver.AnimatedHost ?? View` whenever motion props are active and uses that host for rendering. Drivers that don't need a custom host (`animatedDriver`, `noopDriver`) leave the slot undefined and Box keeps using plain `View`.

- **Return type widened from `Record<string, string | number>` to `Record<string, unknown>`.** Reanimated's `useAnimatedStyle` returns an opaque proxy object that satisfies the wider shape; the existing JS-thread drivers' plain numeric / string dictionaries still satisfy it. RN's `View` accepts arbitrary keys in `style` (it warns on unknowns but doesn't crash); Reanimated's `Animated.View` understands the proxy.

- **`reanimatedDriver` rewritten.** The hot path (when the peer is loadable):
  1. `useSharedValue(0)` creates a UI-thread progress value.
  2. `withTiming(1, { duration, easing })` animates it to 1 — entirely on the UI thread.
  3. `useAnimatedStyle(worklet)` returns a Reanimated style object whose worklet body runs on the UI thread per frame.
  4. The worklet interpolates between `from` and `to` keys; numeric values cross-fade linearly, non-numeric values snap at the midpoint (Reanimated has no cross-fade primitive for arbitrary string values).
  5. For exits, `withTiming`'s completion callback fires `onComplete` via `runOnJS` (when available) so the parent presence boundary can settle.

- **Fallback path preserved.** When the peer dep isn't installed (or fails to load — Metro hasn't linked the native module, etc.), the driver detects the missing surface and degrades to JS-thread `setState` interpolation — the same shape as the v1 driver. Apps still get a working entry / exit animation; they just lose the UI-thread benefit until the peer is properly installed.

- **Worklet directive.** The interpolation function carries the `'worklet'` directive Reanimated's Babel plugin uses to lift the body to the UI thread. Without the plugin (vanilla codebases) the worklet runs on the JS thread — same as the fallback path.

**Easing mapping.** `linear` / `ease` / `ease-in` / `ease-out` / `ease-in-out` map to the corresponding `Easing` functions from `react-native-reanimated`. Unknown / cubic-bezier values fall through to `Easing.inOut(Easing.ease)`, matching the JS-thread driver's behaviour.

**Rules of Hooks compliance.** Both motion hooks call the same React hooks unconditionally on both the UI-thread and fallback paths. The branch happens inside `useEffect`'s body, not in the hook-call sequence — so React sees a stable hook order regardless of whether Reanimated is loadable.

**Test coverage.** 4 new tests verify:

- Driver-interface conformance (name, both motion hooks defined).
- `AnimatedHost` is undefined on the fallback path (no peer installed in headless's devDeps).
- Fallback `useEntryAnimation` settles to `null` once the JS-thread rAF loop reaches `t=1`.
- Fallback `useExitAnimation` fires `onComplete` once at completion.

The UI-thread path itself isn't exercised in jsdom — `tryRequire` resolves `'react-native-reanimated'` through `globalThis.require`, which vitest's module mocker can't intercept. The contract is documented and reviewable from the source; running real worklets inside jsdom would test the mock more than the driver. Apps that have Reanimated installed will exercise the UI-thread path on a real device.

Total tests: 1,079 → 1,083 passing (+4). Skipped unchanged at 9. Bundle: `@motif-js/react-native`'s reanimated subpath grows ~1.0 KB gz (still opt-in, only paid by consumers that import it). Main entry untouched.

**Native Box adoption.** Both `_box-enter.tsx` and `_box-exit.tsx` now route through `driver.AnimatedHost ?? View`. Apps using the bundled `animatedDriver` (default) or `noopDriver` see no change in behaviour; apps that register `reanimatedDriver` get the UI-thread host automatically when the peer is loadable.

The full Reanimated story (driver-aware version of `Animated.createAnimatedComponent` for arbitrary primitives, spring-config-aware exit timing, gesture-handler interop) is a larger undertaking — this commit is the first half: motif's Box now hands the right host + style proxy to Reanimated. The rest can land as Reanimated's API surface stabilises in the broader RN ecosystem.
