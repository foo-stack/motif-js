# @motif-js/compiler-swc

> Unplugin for Vite, Rollup, Webpack, esbuild, rspack, and farm. Statically extracts motif-js style props at build time.

## Install

```sh
yarn add -D @motif-js/compiler-swc
```

## Vite

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import motifExtract from '@motif-js/compiler-swc';

export default defineConfig({
  plugins: [motifExtract.vite(), react()],
});
```

Then add one import in your entry (root layout, `main.tsx`, etc.) so the bundler chunks the extracted CSS into a real asset:

```ts
import 'virtual:motif-extract.css';
```

Without that import the JSX rewrite still happens, but the resulting CSS has no asset to land in — styles fall back to motif's runtime path. With it, Vite chunks and hashes the CSS, and frameworks like React Router / Next inject the `<link rel="stylesheet">` automatically.

Rollup, Webpack, esbuild, rspack, and farm consume the same `motifExtract` instance — call the matching method (`.rollup()`, `.webpack()`, …) per the unplugin convention. The `virtual:motif-extract.css` import works in all of them.

## What it does

Walks every JSX call to a motif-js primitive, resolves literal-arg style props against the active theme at build time, and rewrites the call site so the runtime resolver can short-circuit. The result: atomic CSS classes (web) or hoisted `StyleSheet.create` ids (React Native, via `@motif-js/compiler-metro`) replace the per-render resolver work.

## Docs

<https://usemotif.dev>

## License

[MIT](../../LICENSE)
