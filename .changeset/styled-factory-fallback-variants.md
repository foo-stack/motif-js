---
'@motif-js/react': minor
---

**`styled()` factory — `'...'`-fallback variants + comprehensive
tests + documented type inference.**

The previously-thin `styled()` factory now ships with a full variant
DSL: explicit-keyed variants, boolean variants, fallback-function
variants, compound variants, default variants, and inferred prop
types. The runtime layout is unchanged for callers using the
existing surface; the new `'...'`-fallback feature is additive.

```tsx
import { styled } from '@motif-js/react';

const Box = styled('div', {
  base: { padding: 8 },
  variants: {
    // Explicit values — accepted as a key union.
    size: { sm: { padding: 4 }, md: { padding: 8 }, lg: { padding: 16 } },
    // Boolean variant — accepts native booleans.
    flush: { true: { margin: 0 }, false: { margin: '$2' } },
    // Fallback function — runs for any value not in the explicit
    // record. Use for "any token in this scale" cases where
    // enumerating keys would be tedious.
    '...gap': (val: number) => ({ gap: val }),
  },
  compoundVariants: [{ size: 'lg', flush: true, css: { fontSize: 20 } }],
  defaultVariants: { size: 'md' },
});

// Types: size: 'sm' | 'md' | 'lg' | undefined,
//        flush: boolean | undefined,
//        gap: number | undefined.
```

- **Fallback variants.** Keys prefixed with `...` (e.g. `'...gap'`)
  accept a function `(val) => StyleProps` that runs when no explicit
  variant key matches the incoming value. Both forms can coexist for
  the same prop name — the explicit record is checked first, the
  fallback fn is the open-set fallback. Compound variants and
  `defaultVariants` only target explicit-keyed variants (a fallback
  value is open-ended, so matching against it is undefined).

- **Type inference.** Each variant prop is derived from the config:
  explicit-keyed variants give `keyof V[K]`, boolean variants give
  `boolean`, fallback variants give the function's first-parameter
  type. Mixed variants produce a union of both. `VariantProps<V>` is
  re-exported for downstream re-use.

- **35 new tests** covering base styles, variants, boolean variants,
  default variants, compound variants, fallback functions, override
  precedence, displayName conventions, type inference (via
  `expectTypeOf`), and a Button-matrix-parity smoke test that
  expresses the `<Button>` (variant × intent × size) matrix from
  `@motif-js/react-web` via `styled()`.

- **Compiler-side variant-call extraction is queued for T3.6** —
  consistent with the deferral pattern from T1.1 (web motion) and
  T1.2 (native motion). Until then, `styled()` runs entirely at
  runtime; styled-call sites still benefit from the existing
  Box-level fast paths and prop-extraction passes.
