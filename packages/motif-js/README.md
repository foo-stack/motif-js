# motif-js

> Cross-platform React styling — one install for web, native, and desktop.

This is the primary entry point. The package's `react-native` exports condition routes Vite / Next / esbuild / Rollup to the DOM bindings ([`@motif-js/react`](../react)) and Metro / Expo to the React Native bindings ([`@motif-js/react-native`](../react-native)). Same import sites, same component surface, same theme tokens — the bundler picks the right renderer.

> **Renamed in v2.0.0.** This package was previously published as `@motif-js/react`. The DOM-only bindings (`@motif-js/react-web` in v1) now claim the npm name `@motif-js/react`. See the [migration guide](https://usemotif.dev/migrating/v1-to-v2) before upgrading from v1.

## Install

```sh
yarn add motif-js @motif-js/tokens
# or: npm install / pnpm add
```

For web-only / tree-shake-sensitive builds, install `@motif-js/react` directly and skip pulling `@motif-js/react-native` in as a transitive dep. For native-only builds, install `@motif-js/react-native` directly.

## What this is

A re-export hub plus the cross-platform `styled()` factory. Provides the primitive surface — `Box`, `Stack`, `Heading`, `Pressable`, `Theme`, `ThemeProvider`, `createTheme`, and the rest — backed by either renderer depending on where you build.

## Quick example

```tsx
import { Box, HStack, Text, ThemeProvider, Pressable } from 'motif-js';
import { darkTheme, lightTheme } from '@motif-js/tokens';

export function App() {
  return (
    <ThemeProvider themes={[lightTheme, darkTheme]} active="light">
      <Box bg="$colors.surface.raised" p={{ base: '$3', md: '$5' }} borderRadius="$md">
        <HStack gap="$3" alignItems="center">
          <Text fontSize="$lg" color="$colors.text.default">
            Hello, motif-js
          </Text>
          <Pressable
            px="$4"
            py="$2"
            borderRadius="$md"
            bg="$colors.action.primary.bg"
            color="$colors.action.primary.fg"
            _hover={{ opacity: 0.9 }}
          >
            Get started
          </Pressable>
        </HStack>
      </Box>
    </ThemeProvider>
  );
}
```

## Docs

<https://usemotif.dev>

## License

[MIT](../../LICENSE)
