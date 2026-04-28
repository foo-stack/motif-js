# motif-js

> Cross-platform React styling library for **web**, **React Native** (Expo and
> bare), and **desktop** — all three treated as first-class equals.

[![CI](https://github.com/foo-stack/motif-js/actions/workflows/ci.yml/badge.svg)](https://github.com/foo-stack/motif-js/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

⚠️ **Status: v1.0.0 published — but read this carefully.** All 16
`@motif-js/*` packages live on npm at v1.0.0 (Phase E close,
2026-04-28). That tag covers the engine + web + native renderers +
~35 primitives + the static compiler, but it is **not** the
original v1.0 quality bar (headless components, full accessibility
audit, docs site — all still ahead in Phases F + G of the
[ROADMAP](./ROADMAP.md)). The graduation to v1.0.0 was unintended:
changesets bumped 0.3.0 → 1.0.0 instead of the planned 0.4.0. We
accepted the publish and continue forward; the original quality-bar
milestone now ships as v1.x patches at the end of Phase G. **APIs
may still shift between v1.0 and the Phase G quality-bar release**
— semantic stability commits at the end of Phase G, not now.

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

See [PLAN.md](./PLAN.md) for the full mission and architectural decisions.

---

## Install

```sh
yarn add @motif-js/react @motif-js/tokens
# or: npm install / pnpm add
```

`@motif-js/react` re-exports the web renderer's primitives plus the
`styled()` factory. `@motif-js/tokens` ships an opinionated default
light / dark token set you can use as-is or replace.

---

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

## Project documentation

- [PLAN.md](./PLAN.md) — architecture and scope (source of truth)
- [ROADMAP.md](./ROADMAP.md) — phased milestones to v1.0
- [PROGRESS.md](./PROGRESS.md) — running progress log

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
