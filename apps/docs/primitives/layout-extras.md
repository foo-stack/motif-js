# Layout extras

A small grab-bag of layout primitives that don't fit elsewhere:
`ZStack`, `Spacer`, `Center`, `Wrap`, `AspectRatio`, `Grid`, `Flex`,
`SafeArea`.

## Import

```ts
import { AspectRatio, Center, Flex, Grid, SafeArea, Spacer, Wrap, ZStack } from '@motif-js/react';
```

## ZStack

Overlay children on top of each other in the same grid cell.

```tsx
<ZStack w={200} h={200}>
  <Image src="hero.jpg" alt="" w="100%" h="100%" />
  <Box position="absolute" bottom={0} left={0} right={0} bg="rgba(0,0,0,0.5)" p="$2">
    <Text color="white">Caption</Text>
  </Box>
</ZStack>
```

## Spacer

Flex `flex: 1` filler. Pushes siblings apart in a flex container.

```tsx
<HStack>
  <Text>Left</Text>
  <Spacer />
  <Text>Right</Text>
</HStack>
```

## Center

Centres a child both axes via flex.

```tsx
<Center h={400}>
  <Text>Centred</Text>
</Center>
```

## Wrap

Flex with `flexWrap: 'wrap'` + sensible row direction.

```tsx
<Wrap gap="$2">
  {tags.map((t) => (
    <Tag key={t}>{t}</Tag>
  ))}
</Wrap>
```

## AspectRatio

Constrains a child to a fixed aspect ratio.

```tsx
<AspectRatio ratio={16 / 9}>
  <Image src="…" alt="" w="100%" h="100%" objectFit="cover" />
</AspectRatio>
```

| Prop    | Type     | Description                        |
| ------- | -------- | ---------------------------------- |
| `ratio` | `number` | Width-to-height ratio (e.g. 16/9). |

## Grid

Convenience wrapper around CSS Grid. `columns` shorthand for the
common case of N equal columns; `templateColumns` for explicit.

```tsx
{
  /* 3 equal columns */
}
<Grid columns={3} gap="$3">
  <Card />
  <Card />
  <Card />
</Grid>;

{
  /* Explicit template */
}
<Grid templateColumns="200px 1fr" gap="$3">
  <Sidebar />
  <Main />
</Grid>;
```

| Prop              | Type     | Description                                           |
| ----------------- | -------- | ----------------------------------------------------- |
| `columns`         | `number` | Repeat-N-equal-columns shorthand.                     |
| `templateColumns` | `string` | Raw CSS `grid-template-columns`. Wins over `columns`. |
| `templateRows`    | `string` | CSS `grid-template-rows`.                             |

On native, `Grid` polyfills via flex (row-direction wrap + per-child
`flexBasis: ${100 / columns}%`). Explicit templates are web-only.

## Flex

Plain flex container — like `<Box display="flex">` but with shorter
syntax for the common case.

```tsx
<Flex direction="row" gap="$2" alignItems="center">
  <Avatar />
  <Text>Name</Text>
</Flex>
```

| Prop        | Type                | Default | Description     |
| ----------- | ------------------- | ------- | --------------- |
| `direction` | `'row' \| 'column'` | `'row'` | Flex direction. |

## SafeArea

Native safe-area inset. Web is a styled `Box` (no-op vs RN insets).

```tsx
<SafeArea bg="$colors.surface.base">
  <App />
</SafeArea>
```

On native, padding equals the device safe-area insets via RN's
`SafeAreaView`. On web, just renders as `<Box>` so the same component
works cross-platform without conditionals.

## See also

- [Stack / HStack / VStack](./stack) — flex containers with `gap`.
- [Box](./box) — the underlying primitive for all of these.
