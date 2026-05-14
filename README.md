# motif-js

> Cross-platform React styling library for **web**, **React Native** (Expo and
> bare), and **desktop** — all three treated as first-class equals.

[![CI](https://github.com/foo-stack/usemotif/actions/workflows/ci.yml/badge.svg)](https://github.com/foo-stack/usemotif/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

**Status: v1.0.0 on the `@usemotif/*` scope.** v3 consolidates the
13 sibling packages from `@motif-js/*` into a single coherent
`@usemotif/*` namespace, anchoring a fresh `1.0.0` line on the new
scope. The unscoped `usemotif` meta package keeps its name. v2's
`@motif-js/*@2.0.0` and v1's `@motif-js/*@1.7.0` remain on npm with
deprecation notices; existing installs keep working until you choose
to upgrade.

See [the v2→v3 migration guide](https://usemotif.dev/migrating/v2-to-v3)
or run `npx @usemotif/migrate rename-v3 src/` for the mechanical
rewrite. v1 holdouts: run `rename-v2` first, then `rename-v3`.

---

## What it is

motif-js is one library combining:

- A **style-prop API** and a **`styled()` factory** for authoring components
- A **two-layer token system** (primitive + semantic) with **nested sub-themes**
- **Container queries** and **media queries** with **three responsive syntaxes**
  (object, array, string DSL)
- A **progressive compiler** that statically extracts what it can while the
  runtime path always works without a build plugin
- ~50 cross-platform **layout / typography / media / form / a11y primitives**
- ~38 fully accessible **headless behavior components** (Dialog, Combobox,
  Menu, etc.)

It runs on **real DOM + real CSS** on the web and **real React Native** on
mobile and desktop — never one papered over the other.

---

## Why

There is no library today that combines Tamagui-grade styling ergonomics,
Radix-grade accessibility, and modern CSS features (container queries, `:has`,
view transitions) in a single cross-platform package. motif-js's bet is that
co-designing all of these together produces a better result than stitching
existing libraries.

---

## Install

```sh
yarn add usemotif @usemotif/tokens
# or: npm install / pnpm add
```

`usemotif` is the single entry point for both platforms. Its
package-exports route to the DOM bindings (`@usemotif/react`) for
Vite/Next/etc. and to the React Native bindings
(`@usemotif/react-native`) for Metro — the bundler picks the right
one without you wiring anything. `@usemotif/tokens` ships an
opinionated default light / dark token set you can use as-is or
replace.

For web-only / tree-shake-sensitive builds, install `@usemotif/react`
directly. For native-only builds, install `@usemotif/react-native`.

---

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
            _focus={{ borderColor: '$colors.action.primary.fg' }}
          >
            Get started
          </Pressable>
        </HStack>
      </Box>
    </ThemeProvider>
  );
}
```

### Next.js App Router

Add a registry to `app/layout.tsx` so SSR styles get inlined into the
streamed `<head>`. The 30-line pattern lives in
[`apps/ssr-next/app/motif-style-registry.tsx`](./apps/ssr-next/app/motif-style-registry.tsx) —
copy it into your app and you're set.

---

## Workspace

This is a Yarn 4 + Turborepo monorepo. Common scripts at the repo root:

| Script              | What it does                        |
| ------------------- | ----------------------------------- |
| `yarn build`        | Build all packages via Turbo + tsup |
| `yarn typecheck`    | Run `tsc` across all packages       |
| `yarn lint`         | oxlint                              |
| `yarn format`       | oxfmt (write)                       |
| `yarn format:check` | oxfmt (check only)                  |
| `yarn test`         | Vitest across all packages          |

---

## License

[MIT](./LICENSE) © 2026 Nate Irikefe
