# @motif-js-bench/rn-startup

React Native startup-time bench scaffold. The fixture (`src/App.tsx`)
exercises a realistic motif tree (theme + Box / Stack / Text / Button)
so measurements reflect actual usage rather than empty-bundle floors.

## Why a scaffold and not an executable bench

Startup time is a runtime measurement on a real device or simulator. It
can't be measured in pure Node like the render bench under
`benchmarks/render` can. So this package is an opinionated fixture +
documentation, not a `yarn bench` target.

## How to measure

The motif team's standard methodology:

### Setup

1. Generate a fresh Expo SDK 55 project:
   ```sh
   bunx create-expo-app@latest motif-startup --template blank-typescript
   cd motif-startup
   ```
2. Add motif:
   ```sh
   bun add @motif-js/react-native
   ```
3. Replace `App.tsx` with the contents of
   `benchmarks/rn-startup/src/App.tsx`.
4. Build the **release** variant — debug-mode startup is dominated by
   Metro / DevTools instrumentation and isn't representative.
   ```sh
   eas build --profile production --platform ios   # or android
   ```

### Measure

Hermes prints engine-init timestamps when launched with
`HERMES_VM_LOG=1`. The two numbers that matter:

- **`runtimeInit` → `bundleLoaded`** — JS engine bootstrap + bundle
  parse. This is what the choice of styling library most affects
  (parse cost scales with bundle size; tree-shaking matters here).
- **`bundleLoaded` → first JS execution complete** — module-graph
  evaluation cost. Top-level work in motif's `<ThemeProvider>` /
  resolver setup lands here.

### Compare

Run two variants:

1. **motif** — the fixture as-is.
2. **baseline** — same fixture, but with `<ThemeProvider>` /
   `<Box>` / `<Stack>` / `<Button>` replaced by RN's `<View>` /
   `<Text>` / `<Pressable>`. Same React tree shape, no motif.

The delta is motif's true startup cost. Acceptable budget: motif
should add no more than ~50ms to `bundleLoaded` on a release build
on a 2022-era device. Anything bigger is worth investigating.

## Why this is here

The Phase G ROADMAP item says "RN startup time benchmarks". The bench
isn't a guardrail (no automated check) — it's a methodology + fixture
the team can run during big refactors to confirm we haven't regressed
the motif-vs-plain-RN delta. Real CI integration is queued for a
v1.x patch once we have a device cloud (Sauce / BrowserStack) wired in.
