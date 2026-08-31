# @usemotif/icons

> Lucide icons wrapped as motif-js primitives - 1,940 glyphs, cross-platform, tree-shakeable.

## Install

```sh
yarn add @usemotif/icons
```

## Use

```tsx
import { Heart, ArrowRight } from '@usemotif/icons';

<Heart size={20} color="$colors.brand.500" />
<ArrowRight size={16} />
```

Each glyph is a thin wrapper around the `Icon` primitive. Tree-shakes to ~100 B gzipped per imported icon - `sideEffects: false` guarantees it.

## Docs

<https://usemotif.dev>

## License

[MIT](../../LICENSE)
