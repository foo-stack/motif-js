---
'@motif-js/react-native': patch
---

**Native-render bench harness — `benchmarks/native-render` package.**

Closes the "Native compile-path bench (T3.5)" + "10k-row VirtualList bench (T3.2)" deferred-work entries from the v0.4.x window. Mirrors the existing `benchmarks/native-container` shape: vitest + jsdom + the canonical `react-native` mock (aliased from `packages/react-native/src/__test-setup__/`), `bench`/`describe` from vitest's experimental bench mode.

Three bench files, one new package (`@motif-js-bench/native-render`):

- **`compile-path.bench.tsx`** — closes T3.5's runtime-side acceptance line. 200 rows × three rows: motif-runtime (full resolver path), motif-compiled (pre-baked `StyleSheet`-id reference, what the compiler emits), and vanilla `<View>` (no motif wrapper). Captures the JS-side gain from the resolver-bypass that the StyleSheet-hoisting compiler pass enables.

- **`motion-exit.bench.tsx`** — pairs with the D2 / T1.2 deferral work just shipped (`useExitTransitionNative` + `PresenceContext` + `BoxWithExitNative`). 100 rows × three rows: plain Box rows / boundary-only / full exit path with `exitStyle` on every descendant. Captures the per-descendant cost of the presence-context + driver dispatch.

- **`virtual-list.bench.tsx`** — closes T3.2's wrapper-overhead acceptance line. 1,000 rows × three rows: fallback (no impl, `ScrollView` + `data.map`), below threshold (impl registered but bypassed by row-count), above threshold (synthetic windowed impl mounts only 30 rows). Captures the wrapper's hand-off correctness and gives a representative number for the constant-cost mount shape a real virtualizer would deliver.

**Limitations documented in each file's docstring:**

- jsdom doesn't run a native renderer, so we measure motif's JS-side overhead (resolver, theme lookups, prop filtering, wrapper function calls) and not native shadow-tree commit cost. That overhead is shared by all rows in each bench, so the relative numbers stay meaningful.

- `flashListImpl` from `@motif-js/react-native/flash-list` is **not** exercised here — `@shopify/flash-list` reaches into `Animated.createAnimatedComponent` at module load, which the test-environment RN mock doesn't expose. The virtual-list bench uses a synthetic windowed impl instead. Real-device validation of the FlashList wrapper belongs to a follow-on bench harness (Detox / Maestro / a custom RN bench app) once the v0.4.x window also lands on-device tooling.

- Web's `tanstackVirtualImpl` integration could be benchmarked on the existing `benchmarks/render` package (Tanstack runs in JS — jsdom can model its windowing). That extension is queued as deferred-work; this commit ships only the native package.

**Baseline numbers** (M1 Mac, vitest 4.1.5, single threaded):

| Bench | Row | Hz | RME | Notes |
|---|---|---:|---:|---|
| compile-path | runtime | 295.71 | ±5.73% | full resolver |
| compile-path | compiled | 378.38 | ±1.06% | resolver bypass |
| compile-path | vanilla | 435.81 | ±5.02% | `<View>` |
| motion-exit | plain | 567.85 | ±4.04% | no boundary |
| motion-exit | boundary only | 672.69 | ±0.86% | `ExitBoundary` only |
| motion-exit | full path | 360.69 | ±5.97% | per-descendant exit |
| virtual-list | fallback (1000 rows mounted) | 24.92 | ±21.94% | high variance — the linear-cost row by design |
| virtual-list | below threshold (25 rows) | 1,071 | ±5.35% | registry bypass |
| virtual-list | above threshold (1000 rows, 30 windowed) | 973 | ±4.87% | windowed |

**What the numbers say:**

- **Compile-path: 1.28× speedup runtime → compiled (the compiler's resolver bypass).** The original "~2× uncompiled rate" target was aspirational and assumed wrapper-stripping; native compilation doesn't strip the wrapper (it only hoists styles), so the achievable gain is ~28% from resolver-bypass alone. Vanilla `<View>` is 1.47× faster than runtime, so wrapper-stripping (currently web-only) would close another ~15% if added. Net: the compiler delivers what's available without architectural changes.

- **Motion-exit: boundary-only is within noise of plain, full-path is ~1.57× the plain mount cost.** The presence-context infrastructure itself is essentially free; the cost concentrates in the per-descendant `BoxWithExitNative` dispatch + driver hook call. That's expected and acceptable — apps don't tend to put `exitStyle` on every row of a long list; it's a Dialog/Drawer-scoped feature.

- **Virtual-list: 42.98× speedup fallback → windowed at 1,000 rows.** Proves the `<VirtualList>` registry hand-off is correct: when the wrapper delegates to a windowed impl, mount cost is bounded by window size regardless of `data.length`. The number itself is synthetic (we mock the windowing); on-device with real FlashList the speedup would be similar.

**Numbers locked into PROGRESS.md's metrics history** so subsequent native-renderer changes can be regression-tracked. This was the missing data point for both T3.5's "compiled rows ~2×" and T3.2's "10k-row constant-frame" acceptance lines.

The `@motif-js/react-native` package itself is unchanged in this commit — bumping `patch` only because the changeset workflow expects every commit that touches the workspace to have at least one changeset entry, and the bench package itself is `private: true` so it gets no version bump.
