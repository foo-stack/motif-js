# Migrate from Stitches

This guide ports a Stitches app to motif. Both libraries share
DNA — `$token` references, `styled()` factories, atomic CSS — so
the migration is more rename-and-restructure than rewrite. Plan
on an afternoon for a small app, a couple of days for a large
one.

For a feature-by-feature comparison, see
[vs Stitches](../comparisons/stitches).

## Prerequisites

- Stitches `1.x` (the only release line). React 17+; motif needs
  React 18+ so factor in a React upgrade if you're still on 17.

## 1. Install motif, remove Stitches

```sh
yarn add @motif-js/react @motif-js/tokens
yarn remove @stitches/react
```

## 2. Convert the config

`createStitches` config maps closely to motif's `Theme`:

| Stitches            | motif Theme                        |
| ------------------- | ---------------------------------- |
| `theme.colors`      | `tokens.colors`                    |
| `theme.space`       | `tokens.space`                     |
| `theme.fontSizes`   | `tokens.fontSizes`                 |
| `theme.fontWeights` | `tokens.fontWeights`               |
| `theme.radii`       | `tokens.radii`                     |
| `theme.shadows`     | `tokens.shadows`                   |
| `theme.fonts`       | `tokens.fonts`                     |
| `media`             | `tokens.breakpoints`               |
| `utils`             | (no direct equivalent — see below) |

**Before:**

```ts
import { createStitches } from '@stitches/react';

export const { styled, css, theme, getCssText } = createStitches({
  theme: {
    colors: { brand500: '#3b82f6', surfaceBase: '#ffffff' },
    space: { 1: '4px', 2: '8px', 4: '16px' },
  },
  media: { sm: '(min-width: 480px)', md: '(min-width: 768px)' },
});
```

**After:**

```ts
import type { Theme } from '@motif-js/core';

export const theme: Theme = {
  name: 'app',
  tokens: {
    colors: {
      brand: { 500: '#3b82f6' },
      surface: { base: '#ffffff' },
    },
    space: { 1: 4, 2: 8, 4: 16 }, // numbers, not strings
    breakpoints: { sm: 480, md: 768 },
  },
};
```

Note: motif uses **numbers** for space tokens (interpreted as
pixels), not Stitches' string `'4px'`. The conversion is mechanical
but doesn't auto-translate.

The flat `colors.brand500` in Stitches becomes nested
`colors.brand.500` in motif. Pick the level of nesting that fits
your design system.

## 3. Wrap the app

```tsx
import { ThemeProvider } from '@motif-js/react';
import { theme } from './theme';

<ThemeProvider themes={[theme]} active="app">
  <App />
</ThemeProvider>;
```

Drop Stitches' `getCssText()` SSR helper — motif's
`SSRStyleCollector` does the equivalent. See the
[SSR guide](../guides/ssr).

## 4. Convert `styled()` calls

Stitches' `styled('div', { ... })` becomes motif's
`styled('div', { ... })` (the factory mirrors the API):

**Before:**

```tsx
const Card = styled('div', {
  padding: '$4',
  backgroundColor: '$surfaceBase',
  borderRadius: '$md',
  variants: {
    intent: {
      primary: { backgroundColor: '$brand500', color: 'white' },
      muted: { backgroundColor: '$grayBase' },
    },
  },
  defaultVariants: { intent: 'muted' },
});
```

**After:**

```tsx
import { styled } from '@motif-js/react';

const Card = styled('div', {
  p: '$4', // motif aliases padding → p
  bg: '$colors.surface.base',
  borderRadius: '$md',
  variants: {
    intent: {
      primary: { bg: '$colors.brand.500', color: '$colors.text.inverse' },
      muted: { bg: '$colors.gray.100' },
    },
  },
  defaultVariants: { intent: 'muted' },
});
```

Token references update from `$brand500` to `$colors.brand.500`
to match the nested theme structure.

The `variants` and `compoundVariants` configs work identically.
`defaultVariants` is the same.

## 5. Convert call sites

Most `<StyledComponent>` usages just work after the styled()
rewrite. Inline `css()` blocks need translation:

**Before:**

```tsx
<div className={css({ p: '$2', bg: '$brand500' })()}>...</div>
```

**After:**

```tsx
<Box p="$2" bg="$colors.brand.500">
  ...
</Box>
```

Or, if you'd rather keep the styled-string approach:

```tsx
import { css } from '@motif-js/react';
const blockStyle = css({ p: '$2', bg: '$colors.brand.500' });
<div className={blockStyle}>...</div>;
```

## 6. Utils

Stitches' `utils` config — custom prop names that map to longer
CSS sequences — has no direct motif equivalent. Replacements:

- For one-line aliases (`mt: { marginTop: '$mt' }`), motif has
  these built in (`mt`, `mb`, `mx`, etc.).
- For multi-property utils, write a thin styled component that
  accepts a single prop and applies the long form internally.

## 7. Themes

Stitches' `createTheme()` for dark / alt themes maps to a second
`Theme` object passed into motif's `ThemeProvider`:

```tsx
<ThemeProvider themes={[lightTheme, darkTheme]} active={mode}>
  <App />
</ThemeProvider>
```

Stitches' className-based theme override (`theme.darkClassName`)
isn't a thing in motif — you switch the active theme name and
all descendants pick up the change.

## 8. SSR

Replace the Stitches SSR pattern:

**Before:**

```tsx
const sheetTags = getCssText();
return `<style>${sheetTags}</style>${html}`;
```

**After:**

```tsx
import { SSRStyleCollector } from '@motif-js/react-web';

const collector = new SSRStyleCollector();
const html = collector.collect(() => renderToString(<App />));
return collector.toStyleTag() + html;
```

See the [SSR guide](../guides/ssr) for the full Next.js / Remix /
RSC patterns.

## 9. Verify

- Typecheck — token rename mistakes (e.g. `$brand500` →
  `$colors.brand.500`) surface here.
- Visual diff — number-vs-string space tokens occasionally render
  differently if Stitches was using `'4px'` and motif uses `4`.
- Bundle size — motif's runtime + your call sites should be
  similar; the compiler (if you opt in) extracts most static call
  sites to atomic CSS, beating Stitches' runtime.

## Edge cases

- **Animations / keyframes** — Stitches' `keyframes()` doesn't
  exist in motif. Use raw CSS via a `<style>` tag, or
  `@motif-js/react-web`'s `injectStyle` helper.
- **Global styles** — Stitches' `globalCss()` becomes motif's
  `injectGlobalStyle`. Same purpose, slightly different API.
- **Theme switching at runtime** — Stitches changed the
  `<html className=>`. motif uses `<ThemeProvider active=>`. The
  swap is one component, not a className mutation.
