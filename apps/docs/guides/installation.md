# Installation

motif-js publishes as a set of `@motif-js/*` packages on npm. Pick the entry
points that match your platform.

## Web

```sh
yarn add @motif-js/react @motif-js/tokens
# Optional, when you adopt the compiler later
yarn add -D @motif-js/compiler-swc
```

## React Native (Expo or bare)

```sh
yarn add @motif-js/react @motif-js/tokens
# Optional Metro-side compiler shim
yarn add -D @motif-js/compiler-metro
```

motif's RN renderer pins to **react-native 0.83.6** in its peer dependencies
(matching Expo SDK 55's vendored RN). If your project pins a different RN
version, you may need to adjust the peer-dep range — file an issue if you
hit one.

## Server-rendered (Next.js / SSR)

```sh
yarn add @motif-js/react @motif-js/tokens
```

For App Router integration, see the [SSR guide](./ssr). The minimum is a
`<MotifStyleRegistry>` client component that wraps your `<html>` tree and
flushes captured CSS via `useServerInsertedHTML`. The motif team's reference
implementation is ~30 lines; the guide walks through it.

## What you get per package

| package                    | what it does                                                        |
| -------------------------- | ------------------------------------------------------------------- |
| `@motif-js/core`           | Engine: types, tokens, resolver, schema. No React.                  |
| `@motif-js/react`          | Cross-platform primitives. Routes to web or native.                 |
| `@motif-js/react-web`      | Web-side primitives (DOM).                                          |
| `@motif-js/react-native`   | RN-side primitives (View / Text / Pressable).                       |
| `@motif-js/tokens`         | Default light + dark themes.                                        |
| `@motif-js/headless`       | Behaviour components (Dialog, Menu, Combobox, etc.).                |
| `@motif-js/icons`          | 12-icon starter set (Plus, Check, Heart, etc.).                     |
| `@motif-js/compiler-core`  | Static-extraction analyzer.                                         |
| `@motif-js/compiler-babel` | Babel plugin entry.                                                 |
| `@motif-js/compiler-swc`   | Vite / webpack / rollup / esbuild plugin (via unplugin).            |
| `@motif-js/compiler-metro` | Metro / Expo babel-tuple wrapper.                                   |
| `@motif-js/test-utils`     | Cross-renderer conformance harness for testing your own components. |

The compiler packages are optional. The runtime path always works without them.
