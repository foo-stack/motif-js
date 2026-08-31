# usemotif

> Cross-platform React styling - one install for web, native, and desktop.

This is the primary entry point. The package's `react-native` exports condition routes Vite / Next / esbuild / Rollup to the DOM bindings ([`@usemotif/react`](../react)) and Metro / Expo to the React Native bindings ([`@usemotif/react-native`](../react-native)). Same import sites, same component surface, same theme tokens - the bundler picks the right renderer.

> **History breadcrumb.** This package was `@motif-js/react` in v1 (cross-platform aggregator), then briefly planned as the unscoped `motif-js` in v2 - npm blocked that name as too similar to an existing `motif.js` package - and so it shipped as `usemotif` from v2 onward, matching the docs domain at <https://usemotif.dev>. v3 keeps the same unscoped name while moving the sibling packages into a coherent `@usemotif/*` scope. See the [v2 → v3 migration guide](https://usemotif.dev/migrating/v2-to-v3) (or the [v1 → v2 guide](https://usemotif.dev/migrating/v1-to-v2) if you're jumping from v1).

## Install

```sh
yarn add usemotif @usemotif/tokens
# or: npm install / pnpm add
```

For web-only / tree-shake-sensitive builds, install `@usemotif/react` directly and skip pulling `@usemotif/react-native` in as a transitive dep. For native-only builds, install `@usemotif/react-native` directly.

## What this is

A re-export hub plus the cross-platform `styled()` factory. Provides the primitive surface - `Box`, `Stack`, `Heading`, `Pressable`, `Theme`, `ThemeProvider`, `createTheme`, and the rest - backed by either renderer depending on where you build.

## Quick example

```tsx
import { Box, HStack, Text, ThemeProvider, Pressable } from 'usemotif';
import { darkTheme, lightTheme } from '@usemotif/tokens';

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
