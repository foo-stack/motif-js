# Getting started

motif-js ships as ~16 packages under the `@motif-js/` scope. For most apps you'll
import from one of three entry points:

- **`@motif-js/react`** — cross-platform primitives. Re-exports the right
  implementation from `@motif-js/react-web` (web bundlers) or
  `@motif-js/react-native` (Metro) automatically.
- **`@motif-js/tokens`** — the canonical light + dark themes. You can build your
  own; these are a sensible starting set.
- **`@motif-js/headless`** — accessibility-first behaviour components (Dialog,
  Combobox, Calendar, etc.). Compose with primitives for the visuals.

## Install

```sh
yarn add @motif-js/react @motif-js/tokens
```

For headless components:

```sh
yarn add @motif-js/headless
```

For the bundled icon set:

```sh
yarn add @motif-js/icons
```

## Minimal app

```tsx
import { Box, Button, Stack, Text, ThemeProvider } from '@motif-js/react';
import { lightTheme, darkTheme } from '@motif-js/tokens';
import { useState } from 'react';

export function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <ThemeProvider themes={[lightTheme, darkTheme]} active={theme}>
      <Box p="$6" bg="$colors.surface.base" minH="100vh">
        <Stack gap="$4" maxW={520} mx="auto">
          <Text as="h1" fontSize="$3xl" fontWeight="$bold">
            Hello, motif!
          </Text>
          <Text color="$colors.text.muted">
            Style-prop API, two-layer tokens, container queries, all on the same atom you'd build a
            div on.
          </Text>
          <Button onPress={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}>
            Toggle theme
          </Button>
        </Stack>
      </Box>
    </ThemeProvider>
  );
}
```

## Next steps

- [Theming](./theming) — how the two-layer token system works, sub-themes, and
  semantic vs primitive tokens.
- [Responsive props](./responsive) — three responsive shapes (object, array,
  DSL) and when to use each.
- [Compiler](./compiler) — opt-in static extraction. Same runtime; faster paths.
- [Primitives](/primitives/) — the full primitives roster (~50 components).
- [Headless components](/headless/) — accessible behaviour components (~36).
