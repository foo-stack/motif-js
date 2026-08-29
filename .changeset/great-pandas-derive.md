---
'@usemotif/core': minor
---

Preserve the literal token shape through `createTheme`, and add the types that
derive `$` references from it.

`createTheme` returned `Theme & { readonly tokens: T }`. `Theme` already
declares `tokens: TokenMap`, so the intersection was `TokenMap & T` rather than
`T`, and `TokenMap`'s scales are `TokenScale`, which carries
`[key: string]: TokenNode<V>`. That index signature put `string` back into
`keyof`, collapsing any type derived from the result:

```ts
const theme = createTheme({
  name: 'app',
  tokens: { colors: { brand: { 500: '#3b82f6' } } },
} as const);
type P = Paths<(typeof theme)['tokens']['colors']>;
//   before: string
//   after:  'brand.500'
```

The return type is now `Omit<Theme, 'tokens'> & { readonly tokens: T }`. It
still satisfies `Theme`, so this is additive for callers.

Three new exported types, all type-level with no runtime emit:

- `Paths<T>` gives the dotted leaf paths of a token tree. A token whose value is
  itself a `$` reference is a leaf, not a path into what it points at.
- `ScalePath<TTokens, S>` gives the `$`-prefixed references of one scale.
- `KnownScaleName` names the 15 derivable scales. `animations` is excluded: it
  holds object leaves and resolves through `resolveAnimationToken` rather than
  the generic `$`-path walk.

**Keep references scoped to a single scale.** A union of every scale's paths is
both slower to typecheck and wrong: it admits cross-product nonsense like
`$colors.4` and `$space.brand.500`.

Nothing about style props changes yet. `p="$anything"` still compiles exactly as
before; this release only makes the derivation possible.
