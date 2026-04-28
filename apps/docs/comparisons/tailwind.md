# vs Tailwind

[Tailwind CSS](https://tailwindcss.com) is the most-deployed
styling system on the web. The core idea — utility classes that
cover the entire CSS surface — has won mind- and market-share that
no other approach has matched.

motif and Tailwind solve the same problem (apply styles to
elements) with very different shapes. This page covers what
changes when you switch.

## Design philosophy

| Axis              | Tailwind                                 | motif                                 |
| ----------------- | ---------------------------------------- | ------------------------------------- |
| Authoring style   | `className="p-4 bg-blue-500"`            | `<Box p="$4" bg="$colors.brand.500">` |
| Token references  | Class names mapped via `tailwind.config` | Typed `$token` strings on props       |
| Type-safety       | None on values (string)                  | Full autocomplete + typecheck         |
| RN support        | None (NativeWind is a separate library)  | First-class                           |
| Build pipeline    | PostCSS / Tailwind CLI required          | None required (compiler optional)     |
| Output            | Single CSS file (purged in prod)         | CSS injected per usage; deduped       |
| Component library | None — bring your own                    | `@motif-js/headless` (~36)            |

Tailwind treats CSS as the configuration surface. motif treats
TypeScript as the configuration surface.

## Type-safety

Same difference as the [NativeWind comparison](./nativewind):
Tailwind class strings are untyped. Editors don't autocomplete
class names without plugins, and typos compile silently. Modern
plugins (`tailwindcss-language-server`) close most of that gap, but
the language server still doesn't know your custom tokens unless
you wire them in.

motif's `<Box bg="$colors.brand.500">` is fully typed against your
`Theme` object. Renaming a token breaks the build instead of
silently dropping the style.

## Performance

Tailwind's runtime cost is essentially zero — it generates a CSS
file at build time and your HTML references classes from it. The
class-name approach is the fastest possible delivery path.

motif's compiled-stripped row in `benchmarks/render` measures the
same shape: `<div className="m-12ab">` after the wrapper-stripping
compiler pass:

| Renderer                 | hz       | vs vanilla CSS |
| ------------------------ | -------- | -------------- |
| vanilla CSS (stylesheet) | 1,895.97 | 1.00× (floor)  |
| motif compiled-stripped  | 1,774.42 | 0.94×          |
| motif runtime            | 725.89   | 0.38×          |

A fully Tailwind app and a fully compiled-motif app land in the
same neighbourhood (both within ~6% of the vanilla-CSS floor).
The difference shows up when the compiler can't extract — Tailwind
breaks (no class name resolves), motif falls back to its runtime
(slower but correct).

## Cross-platform

Tailwind is web-only. RN-flavoured Tailwind (NativeWind) is a
separate library with a separate maintainer. Sharing tokens
between web and RN means duplicating them in two places.

motif unifies token + primitive + behaviour across web and RN. One
`Theme` object, one set of style-prop names, one API call shape.

## Authoring shape

A small example to make the difference concrete.

Tailwind:

```tsx
<button
  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
  onClick={handleClick}
  disabled={isLoading}
>
  Submit
</button>
```

motif:

```tsx
<Pressable
  px="$4"
  py="$2"
  bg="$colors.brand.500"
  color="$colors.text.inverse"
  borderRadius="$md"
  _hover={{ bg: '$colors.brand.600' }}
  _disabled={{ opacity: 0.5 }}
  onPress={handleClick}
  disabled={isLoading}
>
  Submit
</Pressable>
```

Same visual output, different shapes. Tailwind's classes pack
denser; motif's props are typed. Pick the one that feels right
for your team.

## When to pick which

**Pick Tailwind if:**

- You're building a web-only product and don't need RN.
- Your team has Tailwind muscle memory and wants to keep it.
- You want zero runtime cost and don't need a runtime fallback.
- You're integrating with a CSS-only design system that already
  ships utility classes.

**Pick motif if:**

- You need cross-platform (web + RN) with shared tokens.
- Type-safety on tokens matters — the IDE story is meaningfully
  better.
- You want a compile step that extracts to atomic CSS _and_ a
  runtime fallback for cases where the compiler can't see (dynamic
  values, prop spreading, etc.).
- You want headless components in the same package.

You can mix the two — Tailwind on app shell, motif on shared cross-
platform components — but a fully unified system is simpler if you
can pick one.

## See also

- [Migration guide: Tailwind → motif](../migration/from-tailwind)
- [Compiler guide](../guides/compiler)
- [Theming guide](../guides/theming)
