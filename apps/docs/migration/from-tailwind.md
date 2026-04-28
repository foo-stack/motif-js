# Migrate from Tailwind

This guide ports a Tailwind app to motif. The biggest shift is
authoring style — class strings become typed style props. Plan on
a few hours for a small app, several days for a large one. Most
of the time is hand-translating className values; the
infrastructure swap is quick.

For a feature-by-feature comparison, see
[vs Tailwind](../comparisons/tailwind).

## Prerequisites

- Tailwind 3.x or 4.x. The translation table below is the same
  for both.
- React 18.0+.

## Should you migrate?

Migrating a large Tailwind codebase is a real cost. Reasonable
reasons:

- **Cross-platform.** You're adding RN to a web app and want
  shared tokens. Tailwind doesn't support RN.
- **Type-safety.** Your team is bitten by silent typos
  (`bg-blue-50O` vs `bg-blue-500`). motif's typed props catch
  them.
- **A specific motif feature.** Container queries with name-based
  scoping, two-layer theming, the headless component library.

Reasonable reasons to stay:

- Tailwind works for you. Web-only is fine. The team is fluent.
  Migration cost > expected benefit.

This guide assumes you've decided. If you haven't, the
[comparison](../comparisons/tailwind) covers the trade.

## 1. Install motif, remove Tailwind

```sh
yarn add @motif-js/react @motif-js/tokens
yarn remove tailwindcss postcss autoprefixer
# also remove plugins: @tailwindcss/typography, @tailwindcss/forms, etc.
```

Remove from your build pipeline:

- `tailwind.config.{js,ts}` (delete)
- `postcss.config.js` (delete if Tailwind was the only consumer)
- The `@tailwind base; @tailwind components; @tailwind utilities;`
  imports in your CSS (delete)
- The Tailwind PostCSS step in webpack / vite / next config

## 2. Convert the config

`tailwind.config.js` becomes a motif `Theme` object:

| Tailwind                    | motif Theme          |
| --------------------------- | -------------------- |
| `theme.extend.colors`       | `tokens.colors`      |
| `theme.extend.spacing`      | `tokens.space`       |
| `theme.extend.fontSize`     | `tokens.fontSizes`   |
| `theme.extend.fontWeight`   | `tokens.fontWeights` |
| `theme.extend.borderRadius` | `tokens.radii`       |
| `theme.extend.screens`      | `tokens.breakpoints` |
| `theme.extend.boxShadow`    | `tokens.shadows`     |

If you use the default Tailwind palette, copy the values you
actually use into your motif theme — don't blindly port the
entire palette. Most apps use 10-20 colours, not Tailwind's 500+.

## 3. Add the provider

```tsx
import { ThemeProvider } from '@motif-js/react';
import { theme } from './theme';

export function App() {
  return (
    <ThemeProvider themes={[theme]} active="app">
      <Routes />
    </ThemeProvider>
  );
}
```

## 4. Translate className strings

The translation table:

| Tailwind               | motif                                                |
| ---------------------- | ---------------------------------------------------- |
| `p-4`                  | `p="$4"`                                             |
| `px-4 py-2`            | `px="$4" py="$2"`                                    |
| `bg-blue-500`          | `bg="$colors.brand.500"`                             |
| `text-white`           | `color="$colors.text.inverse"`                       |
| `text-lg`              | `fontSize="$lg"`                                     |
| `font-semibold`        | `fontWeight="$semibold"`                             |
| `rounded-md`           | `borderRadius="$md"`                                 |
| `shadow-lg`            | `boxShadow="$lg"`                                    |
| `flex flex-row`        | `<HStack>` / `display="flex"`                        |
| `flex flex-col`        | `<VStack>` / `display="flex" flexDirection="column"` |
| `gap-2`                | `gap="$2"`                                           |
| `items-center`         | `alignItems="center"`                                |
| `justify-between`      | `justifyContent="space-between"`                     |
| `w-full`               | `width="100%"`                                       |
| `min-h-screen`         | `minHeight="100vh"`                                  |
| `md:p-8`               | `p={{ base: '$4', md: '$8' }}`                       |
| `hover:bg-blue-600`    | `_hover={{ bg: '$colors.brand.600' }}`               |
| `focus-visible:ring-2` | `_focus={{ outline: '2px solid' }}`                  |
| `disabled:opacity-50`  | `_disabled={{ opacity: 0.5 }}`                       |
| `dark:bg-gray-900`     | Theme switch + dark `Theme` object                   |
| `prose`                | A motif styled `Prose` wrapper (DIY)                 |

**Before:**

```tsx
<button
  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus-visible:ring-2 focus-visible:ring-blue-300 disabled:opacity-50"
  onClick={handleClick}
  disabled={isLoading}
>
  Submit
</button>
```

**After:**

```tsx
<Pressable
  px="$4"
  py="$2"
  bg="$colors.brand.500"
  color="$colors.text.inverse"
  borderRadius="$md"
  _hover={{ bg: '$colors.brand.600' }}
  _focus={{ outline: '2px solid', outlineColor: '$colors.brand.300' }}
  _disabled={{ opacity: 0.5 }}
  onPress={handleClick}
  disabled={isLoading}
>
  Submit
</Pressable>
```

For arbitrary values (`p-[13px]`), use raw numbers / strings:

```tsx
<Box p={13} />
<Box w="calc(100% - 24px)" />
```

## 5. Bulk strategy

For a large codebase:

1. Stand up the theme + provider in a small slice (one route).
2. Convert the highest-traffic 50-100 components by hand.
3. Use a regex-based pass for the long tail. The most reliable
   pattern is class string → array of tokens → emit prop:

   ```ts
   // pseudocode for the bulk converter
   const classesToProps: Record<string, [string, string]> = {
     'p-4': ['p', '$4'],
     'bg-blue-500': ['bg', '$colors.brand.500'],
     // ...
   };
   ```

4. Verify each batch with TypeScript + visual diff before moving
   on. Don't try to convert everything at once.

A useful intermediate state: keep the Tailwind utility CSS file
loaded while you migrate. Both systems coexist on the same page —
Tailwind classes still work; motif props apply to motif elements.
You ship to prod from a half-converted state and finish the
migration over weeks.

## 6. Headless components

Tailwind doesn't ship headless components, but most apps use one
of:

- **Headless UI** (Tailwind Labs) — keep using it, motif wraps
  arbitrary children fine.
- **Radix UI / React Aria** — same.
- **shadcn/ui** — most components are Radix + Tailwind. After
  migration the visuals translate to motif props; the behaviour
  stays Radix.

If you want to consolidate, motif's `@motif-js/headless` covers
~36 common components.

## 7. Verify

- Typecheck.
- Visual diff (Percy / Chromatic / Playwright snapshot).
- Bundle size — expect the JS bundle slightly larger (motif's
  runtime ~6KB), the CSS bundle smaller (no Tailwind utility
  classes). Net is usually neutral for medium apps.
- Production build with the [compiler](../guides/compiler) opted
  in extracts most call sites to atomic CSS, recovering the
  vanilla-CSS-class fastpath.

## Edge cases

- **Arbitrary class strings outside your codebase** — third-party
  HTML / dangerouslySetInnerHTML still references Tailwind
  classes. Either keep the Tailwind CSS file loaded (small cost)
  or run the third-party output through a transform.
- **Tailwind plugins** — `@tailwindcss/typography` and similar
  emit complex selectors. Recreate as a motif styled component
  (`<Prose>` with descendant rules) or write the CSS by hand.
- **CSS variables** — Tailwind 4 emits CSS variables; motif also
  does. Variable names differ; consumers of Tailwind's variables
  need updating.
- **Plugins / presets** — none of motif's primitives respect
  Tailwind's preset system. Translate any preset overrides into
  the motif `Theme` directly.
