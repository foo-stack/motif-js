# @motif-js/react

> Cross-platform React bindings for motif-js. The primary entry for both web and React Native.

## Install

```sh
yarn add @motif-js/react @motif-js/tokens
# or: npm install / pnpm add
```

Install once. The package's exports condition routes Vite, Next, and other web bundlers to the web renderer (`@motif-js/react-web`) and Metro to the native renderer (`@motif-js/react-native`).

## What this is

A re-export hub plus the `styled()` factory. Provides the cross-platform primitive surface — `Box`, `Stack`, `Heading`, `Pressable`, `Theme`, `ThemeProvider`, `createTheme`, and the rest — backed by either renderer depending on where you build.

## Quick example

```tsx
import { Box, HStack, Text, ThemeProvider, Pressable } from '@motif-js/react';
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
