# Theming

motif's theming model has two layers — **primitive tokens** (the raw values:
hex codes, pixel sizes, font weights) and **semantic tokens** (intent-named
references to primitives: `surface.base`, `text.default`, `action.primary.bg`).
The semantic layer is what your components reference; the primitive layer is
what changes between themes.

## Three things `<ThemeProvider>` does

1. **Mounts a stylesheet** at `[data-theme="<name>"]` containing every token
   as a CSS variable (web) or seeds the React context with literal values
   (native).
2. **Sets the active theme** via the `data-theme` attribute on its root div.
   Theme switches are attribute swaps, not re-renders — Box / Stack /
   everything stays mounted.
3. **Hosts nested sub-themes** via `<Theme name="...">`. The nested boundary
   sets a new `data-theme` attribute and CSS-var inheritance does the rest.

## Example

```tsx
import { Box, Text, ThemeProvider, Theme } from '@motif-js/react';
import { lightTheme, darkTheme } from '@motif-js/tokens';

<ThemeProvider themes={[lightTheme, darkTheme]} active="light">
  <Box bg="$colors.surface.base">
    <Text color="$colors.text.default">In the active theme</Text>
    <Theme name="dark">
      <Box bg="$colors.surface.base">
        <Text color="$colors.text.default">Always dark</Text>
      </Box>
    </Theme>
  </Box>
</ThemeProvider>;
```

## Building your own theme

> **TODO** — full guide: token-scale shapes, conventions, validation.
> Until this lands, see `packages/tokens/src/themes.ts` for the canonical
> light + dark themes — they're the reference shape.
