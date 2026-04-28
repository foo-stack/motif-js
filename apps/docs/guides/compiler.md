# Compiler

The runtime always works without a build plugin. The compiler is **opt-in
performance** — it walks JSX call sites, classifies style props as
static / partial-static / dynamic, and rewrites the static subset into
baked `style={...}` + `className=` pairs plus extracted at-rule CSS.

Compiled output is **byte-identical** to runtime output: same
`m-<hash>` class names, same CSS bodies. Half-compiled apps dedupe
correctly because both paths go through the same resolver in
`@motif-js/core`.

## Vite / Rollup / webpack / Rspack / esbuild / Farm

```ts
// vite.config.ts
import motif from '@motif-js/compiler-swc';
import react from '@vitejs/plugin-react-swc';

export default {
  plugins: [motif.vite(), react()],
};
```

Layer motif **before** the host's React/JSX transformer.

## Babel

```js
// babel.config.js
const motif = require('@motif-js/compiler-babel').default;

module.exports = {
  presets: ['@babel/preset-react'],
  plugins: [motif],
};
```

## Metro / Expo

```js
// babel.config.js
const motif = require('@motif-js/compiler-metro').default;

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [motif()],
  };
};
```

## What the compiler does

A `<Box>` like:

```tsx
<Box p="$4" bg="$colors.action.primary.bg" />
```

becomes:

```tsx
<Box style={{ padding: 'var(--space-4)', backgroundColor: 'var(--colors-action-primary-bg)' }} />
```

For responsive props, the compiler also emits the at-rule CSS into a
host-managed sheet (Vite virtual module / webpack child compilation /
etc.) and adds the corresponding `className`.

## Performance

Measured on a 200-Box render-heavy bench (vitest bench, jsdom):

- runtime: 1,096 hz (mean 0.91 ms / render)
- **compiled: 1,895 hz (mean 0.53 ms / render) — 1.73× faster**
- vanilla `<div>`: 2,303 hz (theoretical floor)

The compiled path closes 80% of the gap to vanilla.
