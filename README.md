# motif-js

> Cross-platform React styling library for **web**, **React Native** (Expo and
> bare), and **desktop** — all three treated as first-class equals.

⚠️ **Status: pre-alpha.** Active development. Not yet usable. Not yet on npm.
The first usable web-only release is targeted for ~6 months from project start
(see [ROADMAP.md](./ROADMAP.md)).

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

_(Pre-release — not yet published.)_

```sh
yarn add @motif-js/primitives @motif-js/tokens
```

---

## Quick example

_(API not finalized — illustrative only.)_

```tsx
import { Box, HStack, Text, Button } from '@motif-js/primitives';
import { Theme } from '@motif-js/core';

export function Card() {
  return (
    <Theme name="dark">
      <Box bg="$surface.raised" p="$4" borderRadius="$md">
        <HStack gap="$3" alignItems="center">
          <Text size="$lg" color="$text.default">
            Hello, motif-js
          </Text>
          <Button variant="primary">Get started</Button>
        </HStack>
      </Box>
    </Theme>
  );
}
```

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
