# @usemotif/core

> The motif-js engine — tokens, themes, the style-prop schema, and the runtime resolvers.

Both renderers (`@usemotif/react`, `@usemotif/react-native`) and the compiler depend on this package. Most users get it transitively via `usemotif`.

## Install

```sh
yarn add @usemotif/core
```

## Direct use

The most commonly direct-imported piece is the theme factory:

```ts
import { createTheme } from '@usemotif/core';

export const light = createTheme({
  name: 'light',
  tokens: {
    colors: { brand: { 500: '#C2410C' } },
    space: { 1: 4, 2: 8, 4: 16 },
  },
});
```

`createTheme` is also available as a re-export from `usemotif` and `@usemotif/react`, so you usually don't need to import from `@usemotif/core` directly.

## Docs

<https://usemotif.dev>

## License

[MIT](../../LICENSE)
