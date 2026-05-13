# @motif-js/react

> DOM bindings for motif-js.

This package ships the web renderer: `Box`, `Stack`, `Pressable`, `styled()`, the SSR style collector, and the rest of the React + react-dom surface.

Most users want [`usemotif`](https://www.npmjs.com/package/motif-js) instead — it re-exports this package on web and `@motif-js/react-native` on native via the `react-native` export condition, so one import site works on both platforms. Install `@motif-js/react` directly only when you want the web renderer without the cross-platform aggregation (e.g., a tree-shaking-sensitive build, or to avoid pulling in `@motif-js/react-native` as a transitive dependency).

> **Renamed in v2.0.0.** This package was previously published as `@motif-js/react-web`. The npm name `@motif-js/react` was previously the cross-platform aggregator; that role moved to the unscoped `usemotif` package. See the [migration guide](https://usemotif.dev/migrating/v1-to-v2) before upgrading.

## Install

```sh
yarn add @motif-js/react
```

## Docs

<https://usemotif.dev>

## License

[MIT](../../LICENSE)
