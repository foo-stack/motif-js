# @usemotif/react

> DOM bindings for motif-js.

This package ships the web renderer: `Box`, `Stack`, `Pressable`, `styled()`, the SSR style collector, and the rest of the React + react-dom surface.

Most users want [`usemotif`](https://www.npmjs.com/package/usemotif) instead - it re-exports this package on web and `@usemotif/react-native` on native via the `react-native` export condition, so one import site works on both platforms. Install `@usemotif/react` directly only when you want the web renderer without the cross-platform aggregation (e.g., a tree-shaking-sensitive build, or to avoid pulling in `@usemotif/react-native` as a transitive dependency).

The styling API is the same either way: `styled()`, `createStyledContext()`, and every primitive are implemented here, and `usemotif` only re-exports them. Nothing is exclusive to the umbrella package.

> **History breadcrumb.** This package was `@motif-js/react-web` in v1, then `@motif-js/react` in v2 (recycling the v1 aggregator name, which moved to the unscoped `usemotif` meta package). v3 consolidates the sibling packages under `@usemotif/*`; this package landed as `@usemotif/react` at `1.0.0`. See the [v2 → v3 migration guide](https://usemotif.dev/migrating/v2-to-v3) before upgrading from v2 (or the [v1 → v2 guide](https://usemotif.dev/migrating/v1-to-v2) if you're jumping from v1).

## Install

```sh
yarn add @usemotif/react
```

## Docs

<https://usemotif.dev>

## License

[MIT](../../LICENSE)
