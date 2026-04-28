# Box

`<Box>` is the atom of motif. Every other primitive composes on top of
it. It accepts the full motif style-prop surface (~50 props) plus an
`as` prop for tag override.

## Import

```ts
import { Box } from '@motif-js/react';
```

## Example

```tsx
<Box p="$4" bg="$colors.surface.base" borderRadius="$md">
  <Text color="$colors.text.default">Hello</Text>
</Box>
```

## Props

| Prop        | Type                                | Default | Description                                         |
| ----------- | ----------------------------------- | ------- | --------------------------------------------------- |
| `as`        | `ElementType`                       | `'div'` | HTML tag (web) / View (RN). E.g. `as="section"`.    |
| `className` | `string`                            | —       | Extra class names — concatenated with motif's emit. |
| `style`     | `CSSProperties`                     | —       | Escape hatch for raw CSS. Always wins over props.   |
| `children`  | `ReactNode`                         | —       | Children.                                           |
| `...style`  | [Style props](../guides/responsive) | —       | All ~50 motif style props — `p`, `m`, `bg`, etc.    |

`Box` extends every responsive style prop motif ships. Each accepts a
literal value, a token reference (`$colors.brand.500`), a responsive
object (`{ base: '$2', md: '$4' }`), an array tuple, or motif's
[DSL string form](../guides/responsive#dsl-syntax).

## Tag override

`as` swaps the underlying element on web; on RN it's ignored
(everything is `<View>`). Use it for semantic HTML:

```tsx
<Box as="header" px="$6" py="$4" bg="$colors.surface.raised">
  ...
</Box>
```

## Theming + tokens

Tokens resolve through the active `<ThemeProvider>`:

```tsx
<Box bg="$colors.brand.500" color="$colors.brand.contrast" />
```

See the [theming guide](../guides/theming) for the two-layer model.

## Cross-platform

Web emits a `<div>` (or whatever `as` specifies). Native renders an RN
`<View>` with the same style schema resolved to a `ViewStyle` object.
The compiler's wrapper-stripping pass replaces a fully-static `<Box>`
with the underlying tag at build time — see
[Compiler guide](../guides/compiler).

## See also

- [Stack / HStack / VStack](./stack) — flex containers built on Box.
- [Pressable](./pressable) — interactive Box with pseudo-state styling.
- [Container](./container) — Box with container-query support.
- [Style props reference](../guides/responsive) — all ~50 props.
