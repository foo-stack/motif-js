# @usemotif/reset

> A small CSS reset for motif-js apps on the web.

Web-only. Native apps don't need a reset.

## Install

```sh
yarn add @usemotif/reset
```

## Three injection modes

```tsx
// 1. SSR-friendly component (recommended)
import { MotifReset } from '@usemotif/reset';

<MotifReset />;

// 2. Imperative - browser only, idempotent
import { injectResetStylesheet } from '@usemotif/reset';

injectResetStylesheet();

// 3. Side-effect import
import '@usemotif/reset/auto';
```

## Docs

<https://usemotif.dev>

## License

[MIT](../../LICENSE)
