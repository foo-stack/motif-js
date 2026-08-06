# @usemotif/react-native

> React Native implementations of motif-js primitives.

Most users want [`usemotif`](https://www.npmjs.com/package/usemotif) instead — its `react-native` exports condition routes Metro to this package automatically, while web bundlers route to `@usemotif/react`. Install `@usemotif/react-native` directly only when you want the native renderer without the cross-platform aggregation (e.g., to avoid pulling in `@usemotif/react` as a transitive dependency on a strictly native project).

The styling API is the same either way: `styled()`, `createStyledContext()`, and every primitive are implemented here, and `usemotif` only re-exports them. Nothing is exclusive to the umbrella package.

## Install

```sh
yarn add @usemotif/react-native
```

## Docs

<https://usemotif.dev>

## License

[MIT](../../LICENSE)
