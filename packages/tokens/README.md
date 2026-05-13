# @motif-js/tokens

> Default opinionated token presets for motif-js — colors, spacing, typography, radii, shadows, plus light and dark themes built on top.

## Install

```sh
yarn add @motif-js/tokens
```

## Use

The pre-built themes:

```tsx
import { ThemeProvider } from 'usemotif';
import { lightTheme, darkTheme } from '@motif-js/tokens';

<ThemeProvider themes={[lightTheme, darkTheme]} active="light">
  …
</ThemeProvider>;
```

Or extend them with your own brand:

```tsx
import { createTheme } from 'usemotif';
import { colors, space } from '@motif-js/tokens';

export const brand = createTheme({
  name: 'brand',
  tokens: {
    colors: { ...colors, accent: '#C2410C' },
    space,
  },
});
```

## Docs

<https://usemotif.dev>

## License

[MIT](../../LICENSE)
