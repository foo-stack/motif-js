---
'@motif-js/core': minor
'@motif-js/react': minor
'@motif-js/react-web': minor
'@motif-js/react-native': minor
'@motif-js/primitives': minor
'@motif-js/forms': minor
'@motif-js/headless': minor
'@motif-js/icons': minor
'@motif-js/compiler-core': minor
'@motif-js/compiler-babel': minor
'@motif-js/compiler-swc': minor
'@motif-js/compiler-metro': minor
'@motif-js/tokens': minor
'@motif-js/color': minor
'@motif-js/reset': minor
'@motif-js/test-utils': minor
---

**v0.1.0 — first public preview** (web-only).

The initial npm publish. The web renderer is feature-complete for Phase B
of the [ROADMAP](https://github.com/foo-stack/motif-js/blob/main/ROADMAP.md);
native and the compiler are placeholders. Treat as **pre-alpha** — APIs may
shift before v1.

What's in:

- **`@motif-js/core`** — token resolver, style-prop schema, theme types,
  responsive (object / array / DSL), media + container queries.
- **`@motif-js/react-web`** — Box, Stack, Text, Container, Pressable,
  Image. ThemeProvider with CSS-variable theming and nestable
  sub-themes. SSR collector with Sync + AsyncLocalStorage backends.
  Conformance + snapshot test infrastructure.
- **`@motif-js/react`** — re-exports the web primitives + `styled()`
  factory (variants + compoundVariants).
- **`@motif-js/tokens`** — opinionated default light / dark themes plus
  validation fixtures for Primer, Atlassian, and Material 3.
- **`@motif-js/test-utils`** — `ConformanceCase` / `RendererAdapter`,
  `standardCases`, `assertConformance`, `motifMatchers`.
- Stub packages (`react-native`, `compiler-*`, `primitives`, `forms`,
  `headless`, `icons`, `color`, `reset`) ship with package metadata but
  no runtime yet — placeholders for upcoming phases.

What's not in:

- Native renderer (Phase C)
- Static compiler (Phase D)
- Headless components, full primitives roster (Phases E, F)
