# vs Stitches

[Stitches](https://stitches.dev) is a CSS-in-JS library by Modulz
that pioneered the "near-zero runtime" pattern many libraries
(motif included) borrowed. As of 2023 it has been in maintenance
mode — no new development, but the package still works and is
widely used in legacy apps.

## Design philosophy

| Axis             | Stitches                               | motif                                 |
| ---------------- | -------------------------------------- | ------------------------------------- |
| API style        | `styled('div', { ... })` factory       | Style props (`<Box p="$4">`)          |
| Token references | `$tokenName` strings in style objects  | `$tokenName` strings on style props   |
| Variants         | First-class `variants: { ... }` config | `styled()` factory ships in motif too |
| Platform target  | Web only (no RN support)               | Web + RN + desktop                    |
| Project status   | Maintenance mode (no new development)  | Active                                |
| Compiler         | None (runtime emits styles)            | Optional Babel + Metro plugins        |

The two libraries share more DNA than the API suggests. Both
generate atomic CSS, both use `$token` references, both expose a
`styled()` factory for composing variants. Stitches predated motif
and influenced its design.

## Performance

Numbers from `benchmarks/render/list-of-boxes.bench.tsx` (200-item
SSR render, ops/sec higher = better):

| Renderer                 | hz       | vs vanilla CSS |
| ------------------------ | -------- | -------------- |
| vanilla CSS (stylesheet) | 1,895.97 | 1.00× (floor)  |
| motif compiled-stripped  | 1,774.42 | 0.94×          |
| motif runtime            | 725.89   | 0.38×          |
| Stitches                 | 749.40   | 0.40×          |

Stitches and motif's runtime path are within ~3% of each other —
both are CSS-in-JS systems that emit styles into a global registry
and dedupe. The difference: motif also has a compile step that
extracts static styles at build time, lifting it to the
`compiled-stripped` row above (2.4× faster than runtime).

Stitches has no compiler. What you author at runtime is what runs
at runtime.

## Cross-platform

Stitches is web-only. There's no React Native target, and the
maintainers don't plan one. If you need RN, Stitches is a non-
starter.

motif's `@motif-js/react-native` package implements the same API
on RN with a polyfilled responsive resolver, container queries,
and Metro-resolved native files (`*.native.tsx` → RN bundle,
`*.tsx` → web bundle).

## Theming

Stitches' theming model is closer to motif's two-layer system than
NativeWind's flat-utility model. Both express tokens as nested
objects, both support `$key` references, both let you swap themes
at runtime via a `theme` prop / className override.

motif's two-layer model adds an explicit semantic ↔ primitive
distinction (`$colors.text.default` resolves via the active
theme to a primitive `$colors.gray.900` or `$colors.gray.100`).
Stitches expresses the same idea with `theme.colors.text` →
literal hex, no intermediate layer.

## Variants

Stitches' `variants` config is one of its best features:

```tsx
const Button = styled('button', {
  variants: {
    size: { sm: { fontSize: 12 }, md: { fontSize: 14 } },
    intent: { primary: { bg: '$blue9' }, danger: { bg: '$red9' } },
  },
});
```

motif ships `styled()` with the same shape. Translation is
mechanical — see the [migration guide](../migration/from-stitches).

## When to pick which

**Pick Stitches if:**

- You're maintaining a legacy app that already uses it. Migrating
  away is rarely worth the effort if everything works.
- Web-only is fine forever and you want a small, stable dependency
  that won't change under you.
- You like the `styled()` factory as the primary authoring style.

**Pick motif if:**

- You need cross-platform (web + RN). Stitches doesn't support
  this.
- You want active development — bug fixes, new features,
  responsive / container query support.
- You want a compile step that beats runtime CSS-in-JS by 2-3×
  on hot paths.
- You prefer the style-prop API to the `styled()` factory (motif
  ships both; you can mix and match).

If you're maintaining a Stitches app and the project is stable,
there's no urgent reason to migrate. If you're starting fresh in
2026, the active alternatives (motif, Tamagui, vanilla CSS-in-JS
with extraction) are all reasonable picks; Stitches' maintenance
mode means you'd be choosing a frozen library.

## See also

- [Migration guide: Stitches → motif](../migration/from-stitches)
- [`styled()` factory guide](../guides/styled)
- [Theming guide](../guides/theming)
