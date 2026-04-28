# Migrate from NativeWind

This guide ports a NativeWind app to motif. The biggest shift is
authoring style — Tailwind class strings become typed style props.
Plan on a few hours for a small app, a day for a large one. Most
of the time is hand-translating className strings; the build
pipeline cleanup is quick.

For a feature-by-feature comparison, see
[vs NativeWind](../comparisons/nativewind).

## Prerequisites

- NativeWind 4.x (the modern preset; v2 / v3 had different setup).
- React 18.0+, RN 0.74+.

## 1. Install motif, remove NativeWind

```sh
yarn add @motif-js/react @motif-js/tokens
yarn remove nativewind tailwindcss
# also remove tailwindcss-related plugins (typography, forms, etc.)
```

Remove the Babel preset:

```diff
// babel.config.js
 module.exports = {
   presets: ['module:@react-native/babel-preset'],
-  plugins: ['nativewind/babel'],
 };
```

Delete `tailwind.config.js`, `app.css` (if present), and any
`global.css` Tailwind-import files.

## 2. Convert the Tailwind config

`tailwind.config.js` becomes a motif `Theme` object. The
extension surface in Tailwind maps:

| Tailwind config             | motif Theme          |
| --------------------------- | -------------------- |
| `theme.extend.colors`       | `tokens.colors`      |
| `theme.extend.spacing`      | `tokens.space`       |
| `theme.extend.fontSize`     | `tokens.fontSizes`   |
| `theme.extend.fontWeight`   | `tokens.fontWeights` |
| `theme.extend.borderRadius` | `tokens.radii`       |
| `theme.extend.screens`      | `tokens.breakpoints` |

**Before:**

```js
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{tsx,ts}'],
  theme: {
    extend: {
      colors: {
        brand: { 500: '#3b82f6', 600: '#2563eb' },
      },
      spacing: { 1: 4, 2: 8, 4: 16 },
    },
  },
};
```

**After:**

```ts
// theme.ts
import type { Theme } from '@motif-js/core';

export const theme: Theme = {
  name: 'app',
  tokens: {
    colors: {
      brand: { 500: '#3b82f6', 600: '#2563eb' },
      surface: { base: '#ffffff' },
      text: { default: '#111827' },
    },
    space: { 1: 4, 2: 8, 4: 16 },
    breakpoints: { sm: 480, md: 768, lg: 1024 },
  },
};
```

## 3. Wrap the app in a provider

```tsx
import { ThemeProvider } from '@motif-js/react';
import { theme } from './theme';

export function App() {
  return (
    <ThemeProvider themes={[theme]} active="app">
      <RootStack />
    </ThemeProvider>
  );
}
```

## 4. Translate className strings

Most utility classes have a direct prop equivalent. The
translation table:

| Tailwind class      | motif prop                             |
| ------------------- | -------------------------------------- |
| `p-4`               | `p="$4"`                               |
| `px-4`              | `px="$4"`                              |
| `bg-blue-500`       | `bg="$colors.brand.500"` (or whatever) |
| `text-white`        | `color="$colors.text.inverse"`         |
| `text-lg`           | `fontSize="$lg"`                       |
| `font-semibold`     | `fontWeight="$semibold"`               |
| `rounded-md`        | `borderRadius="$md"`                   |
| `flex-row`          | Use `<HStack>` instead of `<View>`     |
| `gap-2`             | `gap="$2"`                             |
| `items-center`      | `alignItems="center"`                  |
| `justify-between`   | `justifyContent="space-between"`       |
| `md:p-8`            | `p={{ base: '$4', md: '$8' }}`         |
| `hover:bg-blue-600` | `_hover={{ bg: '$colors.brand.600' }}` |

**Before:**

```tsx
<View className="p-4 bg-white rounded-md flex-row items-center gap-2">
  <Text className="text-lg font-semibold text-gray-900">Settings</Text>
</View>
```

**After:**

```tsx
<HStack p="$4" bg="$colors.surface.base" borderRadius="$md" alignItems="center" gap="$2">
  <Text fontSize="$lg" fontWeight="$semibold" color="$colors.text.default">
    Settings
  </Text>
</HStack>
```

For arbitrary class strings (`p-[13px]`), pass numbers directly:

```tsx
<Box p={13} />
```

## 5. Bulk conversion strategy

For large codebases, a script-based pass works well:

1. Replace `className="..."` with empty props on every component
2. Hand-translate the highest-traffic 50 components
3. Use TypeScript errors to find what still references missing
   props (the `className` prop motif doesn't expose on most
   primitives surfaces unconverted call sites)
4. Iterate until typecheck passes

A naïve regex replacement is risky because Tailwind's compound
classes (`md:hover:bg-blue-600`) don't decompose mechanically. Do
a quick pass with a regex, then walk the diff by hand.

## 6. Headless components

NativeWind doesn't ship headless components, so you've probably
been composing your own from RN primitives or a separate library.

If you used React Aria / Radix UI / similar — those still work
alongside motif (motif primitives are fine wrappers around
arbitrary children).

If you want to consolidate, motif's headless package covers most
common components:

```sh
yarn add @motif-js/headless
```

See the [headless components index](/headless/) for the full list.

## 7. Verify

- **Typecheck** — every untranslated `className` surfaces here.
- **Visual diff** — Tailwind's defaults differ from motif's
  defaults for some properties (line height, button padding).
  Walk a representative screen and adjust.
- **Bundle size** — expect a smaller bundle without NativeWind's
  runtime + the Tailwind CSS file. The motif runtime + your CSS
  output should be 30-50% smaller.

## Edge cases

- **`@apply`** — Tailwind's directive for composing classes in
  your own CSS doesn't translate. Use motif's [`styled()`](../guides/styled)
  factory to compose styled primitives.
- **Plugins** — Tailwind plugins like `@tailwindcss/typography`
  don't have motif equivalents. Most are easy to recreate as a
  styled primitive ("Prose" wrapper with descendant styles).
- **CSS variables** — NativeWind 4 emits CSS variables for
  themes; motif emits CSS variables too (web), addressed via the
  `$colors.foo` references. The bridge is mechanical but you may
  need to retire any consumer of NativeWind's variable names.
