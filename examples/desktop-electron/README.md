# Desktop examples

Proof that motif's "web, native, **desktop** — all first-class" claim holds: one
shared component rendered in real desktop shells.

## The pieces

- **`examples/desktop-shared`** — exports `<DemoScreen/>`, built only on the
  primitives that are identical on web and native (`Box`, `Stack`, `Text`,
  `Button`, tokens, `ThemeProvider`). The single source of truth every target
  imports.
- **`examples/desktop-web`** — a Vite app rendering `<DemoScreen/>` through
  `@usemotif/react`. Built with `base: './'` so the output loads over `file://`.
  This build _is_ the desktop payload; Electron and Tauri both point at it.
- **`examples/desktop-electron`** — an Electron shell (`main.js`) that opens a
  window onto the `desktop-web` build, plus a Playwright-Electron smoke test
  asserting the demo actually painted.
- **`examples/desktop-tauri`** — a Tauri (Rust + system WebView) shell that
  loads the **same** `desktop-web/dist`. Its proof is the build: `generate_context!`
  compiles the shell and embeds the frontend. `bundle.active` is off, so no
  installer/codesigning is involved.

`desktop-shared`'s `<DemoScreen/>` will also back the react-native-windows /
-macos targets — added in later increments.

## Build the Tauri shell

```sh
# Build the web payload, then compile the Rust shell that embeds it.
yarn workspace @usemotif/example-desktop-web build
cargo build --manifest-path examples/desktop-tauri/src-tauri/Cargo.toml
# or, for a full app: yarn workspace @usemotif/example-desktop-tauri app:build
```

macOS uses the built-in WKWebView (no extra deps); a Linux build needs
`webkit2gtk`. The icon at `src-tauri/icons/icon.png` is a placeholder the
`generate_context!` macro requires.

## Run the Electron smoke locally

```sh
# 1. Build the web payload Electron loads.
yarn workspace @usemotif/example-desktop-web build

# 2. Install Electron's binary in this example (skipped in the normal install).
yarn workspace @usemotif/example-desktop-electron install

# 3. Launch the window, or run the headless smoke test.
yarn workspace @usemotif/example-desktop-electron start
yarn workspace @usemotif/example-desktop-electron smoke
```

On Linux/CI the smoke runs under a virtual display: `xvfb-run -a yarn ... smoke`.

## CI

`.github/workflows/desktop.yml` runs the Electron smoke on every push — build
the web payload, then launch Electron under `xvfb` and assert the shared demo
renders. Like the bench lane, it is **not** a required check yet: desktop runners
are heavier and slower than unit CI, so the lane runs alongside without blocking
merges until it has proven stable.

The normal install skips Electron's ~150 MB binary download
(`ELECTRON_SKIP_BINARY_DOWNLOAD`), so it only lands in the desktop lane that
actually launches it.
