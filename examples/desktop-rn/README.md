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
CI lane installs them into this folder on demand with
`npm install --no-save --no-workspaces` (so npm treats this as a standalone
package instead of walking up to the Yarn workspace and choking on the
`workspace:` protocol), then generates the native projects and builds.
Everything motif needs — the shared `<DemoScreen/>`, `@usemotif/react-native`,
tokens — is a workspace package already linked into the monorepo's root
`node_modules`, which the Metro config resolves via `nodeModulesPaths`. When
react-native-macos catches up to 0.85, this collapses to a normal pinned
dependency.

## Build it (what the CI lane does)

```sh
cd examples/desktop-rn

# 1. Provision the lagging RN toolchain locally (not in the workspace).
npm install --no-save --no-workspaces --legacy-peer-deps \
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

react-native-windows is the same shape — `npx react-native-windows-init`, then
`react-native run-windows` (MSBuild) — pinned to the matching **0.81** line, on
a **Windows** host since it can't build on macOS/Linux.

## CI

`.github/workflows/desktop.yml` runs both native builds, each non-required:

- **`rn-macos-build`** (macOS runner) — provision RN 0.81, generate the macOS
  project, `pod install`, `xcodebuild`.
- **`rn-windows-build`** (Windows runner) — provision RN 0.81, generate the
  Windows project, build with `react-native run-windows --no-deploy --no-launch`.

react-native desktop builds (CocoaPods + `xcodebuild`, or MSBuild) are the
heaviest and slowest lanes, and the toolchain version lag makes them the most
likely to need tuning — so both are authored honestly for CI: the native project
generation + build run there, not in the unit-test path. The Windows lane in
particular is never exercised on this project's macOS dev machine; it is
authored for its Windows runner the same way the device-bench lane is.
