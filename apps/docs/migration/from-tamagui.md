# Migrate from Tamagui

This guide walks through porting a Tamagui app to motif in roughly
30 minutes for a small project, an afternoon for a medium one. The
two libraries share a style-prop API, so the conversion is mostly
mechanical token + import rewrites.

For a feature-by-feature comparison, see
[vs Tamagui](../comparisons/tamagui).

## Prerequisites

- Tamagui app on `1.x` or `2.x`. Earlier versions had different
  config shapes; this guide assumes the modern v3 config preset.
- React 18.2+ (motif requires 18.0+, RN 0.74+).

## 1. Install motif

```sh
yarn add @motif-js/react @motif-js/tokens
yarn remove tamagui @tamagui/core @tamagui/config
```

If you used Tamagui's headless components (`@tamagui/sheet`,
`@tamagui/dialog`, etc.), also add motif's headless package:

```sh
yarn add @motif-js/headless
```

## 2. Convert the config

Tamagui's `createTamagui` config maps roughly 1:1 to motif's
`Theme` object. The key fields:

| Tamagui                  | motif                                        |
| ------------------------ | -------------------------------------------- |
| `tokens.color`           | `tokens.colors`                              |
| `tokens.space`           | `tokens.space` (same shape)                  |
| `tokens.size`            | `tokens.sizes`                               |
| `tokens.radius`          | `tokens.radii`                               |
| `themes.light` / `.dark` | A second `Theme` object                      |
| `media`                  | `tokens.breakpoints`                         |
| `fonts`                  | `tokens.fonts` + `fontWeights` + `fontSizes` |

**Before (Tamagui):**

```ts
import { createTamagui } from '@tamagui/core';
import { config } from '@tamagui/config/v3';

export const tamaguiConfig = createTamagui(config);
```

**After (motif):**

```ts
import type { Theme } from '@motif-js/core';

export const lightTheme: Theme = {
  name: 'light',
  tokens: {
    colors: {
      brand: { 500: '#3b82f6', 600: '#2563eb' },
      surface: { base: '#ffffff' },
      text: { default: '#111827', muted: '#6b7280' },
    },
    space: { 1: 4, 2: 8, 3: 12, 4: 16, 6: 24, 8: 32 },
    sizes: { xs: 320, sm: 480, md: 768, lg: 1024 },
    radii: { sm: 4, md: 8, lg: 16 },
    breakpoints: { sm: 480, md: 768, lg: 1024, xl: 1280 },
  },
};
```

If you had multiple themes (light / dark), build one `Theme`
object per — motif's `ThemeProvider` accepts an array and switches
on `active`.

## 3. Replace the provider

**Before:**

```tsx
import { TamaguiProvider } from '@tamagui/core';

<TamaguiProvider config={tamaguiConfig} defaultTheme="light">
  <App />
</TamaguiProvider>;
```

**After:**

```tsx
import { ThemeProvider } from '@motif-js/react';

<ThemeProvider themes={[lightTheme, darkTheme]} active="light">
  <App />
</ThemeProvider>;
```

## 4. Rewrite call sites

The style-prop names mostly match. The differences:

| Tamagui                     | motif                                 |
| --------------------------- | ------------------------------------- |
| `<Stack>`                   | `<Stack>` (same name, same default)   |
| `<XStack>`                  | `<HStack>` (renamed for clarity)      |
| `<YStack>`                  | `<VStack>` (renamed for clarity)      |
| `<View>`                    | `<Box>`                               |
| `<Text>`                    | `<Text>`                              |
| `<Button>`                  | `<Pressable>` or `<Button>`           |
| `padding="$4"`              | `p="$4"` (motif aliases)              |
| `backgroundColor="$blue10"` | `bg="$colors.brand.500"`              |
| `$gtSm` media keys          | Object form: `{ base: ..., sm: ... }` |
| `themeInverse`              | Per-component `theme` prop            |

A find-and-replace handles most of it:

```sh
# rename XStack/YStack
sd 'XStack' 'HStack' src/**/*.tsx
sd 'YStack' 'VStack' src/**/*.tsx
# rename View → Box (be careful — RN's View is also imported in places)
```

Token references usually need touching by hand because Tamagui's
`$blue10` shorthand maps to `$colors.brand.500` (or whatever your
theme calls it).

## 5. Replace component usage

If you used Tamagui's headless components, swap to motif's
equivalents:

| Tamagui   | motif                       |
| --------- | --------------------------- |
| `Sheet`   | `Drawer` (motif) or `Sheet` |
| `Dialog`  | `Dialog`                    |
| `Select`  | `Select`                    |
| `Tooltip` | `Tooltip`                   |
| `Popover` | `Popover`                   |

The composition shape (Trigger / Content / Close subcomponents)
matches; the prop names are similar but not identical. Read the
target component's [headless docs](/headless/) before pasting.

## 6. Compiler setup (optional)

Tamagui's optimizer Babel preset becomes motif's two compiler
plugins:

**Before (Tamagui):**

```js
// babel.config.js
module.exports = {
  plugins: [['@tamagui/babel-plugin', { config: './tamagui.config.ts' }]],
};
```

**After (motif):**

```js
// babel.config.js
module.exports = {
  plugins: [
    ['@motif-js/compiler-babel'], // web (extracts CSS)
    ['@motif-js/compiler-metro'], // RN (hoists StyleSheet.create)
  ],
};
```

The motif compilers are opt-in — your app works without them. They
extract static styles to atomic CSS / StyleSheet entries when the
compiler can prove the call site is fully static; everything else
falls back to the runtime.

## 7. Verify

- Typecheck — most rename mistakes surface here.
- Run the test suite.
- Eyeball the dev build at a few breakpoints to catch any media-key
  conversions that didn't translate.
- Run the production build and bundle-analyze; expect ~10-30%
  smaller JS than Tamagui's runtime, plus emitted atomic CSS for
  any compiled call sites.

## Edge cases

- **`themeInverse`** — Tamagui's prop for inverting a section's
  theme has no direct motif equivalent. Use a nested
  `<ThemeProvider>` switching to your inverse theme, or a sub-theme
  override at the component level.
- **Animations** — Tamagui's `enterStyle` / `exitStyle` /
  `animation="bouncy"` don't have a motif equivalent. Use
  `react-native-reanimated` (or web `<motion.div>`) directly; motif
  doesn't ship animation primitives.
- **Compound variants** — Both libraries support them. Tamagui
  inlines them in the variants config; motif uses the same shape
  via `styled(..., { variants, compoundVariants })`.
