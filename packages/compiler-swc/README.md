# @usemotif/compiler-swc

> **Deprecated — renamed to [`@usemotif/compiler-web`](../compiler-web).**

This package was always a Babel-based [`unplugin`](https://unplugin.unjs.io/),
not an SWC plugin — the `-swc` name was a misnomer. It now ships as
`@usemotif/compiler-web` (the web-bundler counterpart to
`@usemotif/compiler-metro`).

This package remains as a thin alias that re-exports `@usemotif/compiler-web`
unchanged, so existing imports keep working. It will be removed in a future
major.

## Migrate

```sh
yarn remove @usemotif/compiler-swc
yarn add -D @usemotif/compiler-web
```

```diff
- import motifExtract from '@usemotif/compiler-swc';
+ import motifExtract from '@usemotif/compiler-web';
```

The API is identical. See [`@usemotif/compiler-web`](../compiler-web) for usage.

## License

[MIT](../../LICENSE)
