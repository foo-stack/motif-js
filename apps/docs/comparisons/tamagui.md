# vs Tamagui

[Tamagui](https://tamagui.dev) is a React + React Native styling
library by Nate Wienert (no relation to motif's Nate). It's the
closest competitor in scope: cross-platform, style-prop API,
compile-time CSS extraction. The two libraries make different
tradeoffs in three areas — perf model, type ergonomics, and
component scope.

## Design philosophy

| Axis                | Tamagui                                        | motif                                                   |
| ------------------- | ---------------------------------------------- | ------------------------------------------------------- |
| Platform target     | React Native first, web via `react-native-web` | Web + React Native + desktop, native bundles per target |
| Style API           | Style-prop with `$tokens` references           | Style-prop with `$tokens` references                    |
| Compiler            | Babel optimizer (mature, complex)              | Babel + Metro plugins (simpler, narrower)               |
| Runtime fallback    | Required (some props can't extract)            | Required, same path                                     |
| Headless components | `@tamagui/*` packages, large surface           | `@motif-js/headless` (~36 components)                   |
| Theming             | Token + sub-theme nesting                      | Two-layer (semantic ↔ primitive) tokens                 |

The two libraries look similar at the call site (`<View bg="$blue10"
p="$4">`) and diverge under the hood. Tamagui is older, has a
larger team, and a deeper component library. motif is younger,
smaller, and bets harder on compile-time extraction matching the
runtime byte-for-byte.

## Performance

Numbers from `benchmarks/render/list-of-boxes.bench.tsx` (200-item
SSR render, ops/sec higher = better):

| Renderer                   | hz       | vs vanilla CSS |
| -------------------------- | -------- | -------------- |
| vanilla CSS (stylesheet)   | 1,895.97 | 1.00× (floor)  |
| motif compiled-stripped    | 1,774.42 | 0.94×          |
| motif compiled (pre-strip) | 1,267.85 | 0.67×          |
| motif runtime              | 725.89   | 0.38×          |
| Tamagui (runtime path)     | 21.82    | 0.012×         |

A few things to flag:

- **Tamagui's runtime row is slow.** Most production Tamagui apps
  run with the Babel optimizer enabled, which extracts atomic CSS
  classes at build time and bypasses the runtime entirely. The
  optimizer's output is closer to motif's `compiled-stripped` row
  (a fully static `<div className="...">`). The runtime row above
  is what an unoptimized Tamagui app — or any prop that can't
  extract — pays.
- **motif's runtime is faster than Tamagui's runtime.** Roughly 33×
  on this bench. That gap closes once both libraries' compilers
  run.
- **motif's compiler beats vanilla inline styles.** When the call
  site is fully static, motif's wrapper-stripping pass replaces
  `<Box p="$4">` with `<div className="m-12ab">`, hitting the
  vanilla-CSS-class fastpath.

The honest summary: Tamagui-with-optimizer and motif-compiled are
in the same ballpark; Tamagui-without-optimizer is slow; motif's
runtime path is competitive.

## Type ergonomics

Both libraries type tokens as `$key` strings. Tamagui generates
TypeScript types from a config object you pass to `createTamagui`;
motif generates from `Theme` objects you pass to `ThemeProvider`.

Tamagui has a richer cross-platform type story for media queries
(it generates `$gtSm` / `$gtMd` keys from your config). motif uses
a `{ base, sm, md, lg, xl, '@bp' }` shape that's simpler but less
ergonomic when the breakpoint set is non-standard.

Both libraries fully type style-prop autocomplete. motif's
`exactOptionalPropertyTypes` policy means `style={undefined}` and
`style={...}` are different types — this catches a few real bugs
that Tamagui's looser config does not, at the cost of slightly
more verbose conditional styling.

## When to pick which

**Pick Tamagui if:**

- You're shipping React Native first and the web build is
  secondary. Tamagui's `react-native-web` integration is more
  mature, and its component library is broader on the native side.
- You need its component primitives — `Sheet`, `Dialog`, `Select`,
  `Toast` — and don't want to assemble them from a headless layer.
- Your team has Tamagui experience or is migrating from
  `react-native-web` directly.

**Pick motif if:**

- Web is a first-class target and you want a library that ships
  real DOM nodes (no `react-native-web` shim).
- You want a simpler compiler with byte-identical runtime fallback
  — half-compiled apps stay correct, mid-migration is painless.
- You want a smaller, more focused dependency surface (~16
  packages, the core is one of them).
- Your stack already uses native CSS / Tailwind on the web and you
  don't want a `react-native-web` shadow runtime.

Neither library is "always better." Tamagui has more components
out-of-the-box and a more battle-tested optimizer; motif has a
faster runtime, simpler types, and a lighter web build. Both
support the same call-site shape, so an honest 30-minute
prototype on each is the fastest way to decide.

## See also

- [Migration guide: Tamagui → motif](../migration/from-tamagui)
- [Compiler guide](../guides/compiler)
- [Theming guide](../guides/theming)
