# Desktop · React Native (macOS / Windows)

The fourth and fifth desktop targets: the **same** `<DemoScreen/>` the web shells
render, here on the **react-native** bundle via react-native-macos and
react-native-windows. The bundler resolves `usemotif` to its native entry, so
`App.tsx` is just `<DemoScreen/>` — no platform branching.

## The version lag (why this is provisioned, not pinned in the workspace)

This monorepo runs **React Native 0.85**, but **react-native-macos / -windows
lag** — their newest line is **0.81**. There is no 0.85 release of either yet.
So this example can't use the workspace's RN version; it pins **RN 0.81 +
react-native-macos 0.81**.

To keep that older toolchain from touching the root lockfile and the required
CI install, the heavy RN dependencies are **not** declared here — the desktop
CI lane installs them into this folder on demand, generates the native projects,
and builds. The only workspace dependency is the shared demo; everything motif
needs (`@usemotif/react-native`, tokens) resolves from the monorepo via the
Metro config. When react-native-macos catches up to 0.85, this collapses to a
normal pinned dependency.

## Build it (what the CI lane does)

```sh
cd examples/desktop-rn

# 1. Provision the lagging RN toolchain locally (not in the workspace).
npm install --no-save \
  react@19.0.0 react-native@0.81.7 react-native-macos@0.81.7 \
  @react-native/metro-config@0.81.7 @react-native/babel-preset@0.81.7

# 2. Generate the macOS native project (Xcode project + Podfile).
npx --yes react-native-macos-init --overwrite

# 3. Pods, then build.
( cd macos && pod install )
xcodebuild -workspace macos/MotifDesktopDemo.xcworkspace \
  -scheme MotifDesktopDemo-macOS -configuration Debug \
  CODE_SIGNING_ALLOWED=NO build
```

react-native-windows is the same shape (`npx react-native-windows-init`,
`msbuild`), and lands on a Windows runner since it can't build on macOS/Linux.

## CI

`.github/workflows/desktop.yml`'s `rn-macos-build` job runs the above on a macOS
runner. Like the other desktop lanes it is **not** required — react-native
desktop builds (CocoaPods + `xcodebuild`) are the heaviest and slowest, and the
toolchain version lag makes them the most likely to need tuning. The job is
authored honestly for CI: the macOS project generation + native build run there,
not in the unit-test path. The Windows lane lands the same way, on a Windows
host, in a later increment.
