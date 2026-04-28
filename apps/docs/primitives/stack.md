# Stack / HStack / VStack

Flex containers with `gap` for consistent spacing between children. No
negative-margin hacks — `gap` works in both directions.

## Import

```ts
import { Stack, HStack, VStack } from '@motif-js/react';
```

## Example

```tsx
<VStack gap="$4" alignItems="stretch">
  <Heading>Title</Heading>
  <Text>Body</Text>
  <HStack gap="$2" justifyContent="flex-end">
    <Button variant="ghost">Cancel</Button>
    <Button>Save</Button>
  </HStack>
</VStack>
```

## Variants

- **Stack** — column by default; pass `direction="row"` for horizontal.
- **VStack** — `Stack` with `direction="column"` baked in.
- **HStack** — `Stack` with `direction="row"` baked in.

Use the shorthand variants for readability when the direction is
obvious; reach for `Stack direction={...}` when the direction is
dynamic / responsive.

## Props

| Prop        | Type                             | Default                           | Description                              |
| ----------- | -------------------------------- | --------------------------------- | ---------------------------------------- |
| `direction` | `'row' \| 'column'` (responsive) | `'column'` (`'row'` for `HStack`) | Stack axis. Accepts responsive shapes.   |
| `gap`       | Token / number / responsive      | —                                 | Gap between children. Maps to CSS `gap`. |
| `...Box`    | All [Box](./box) props           | —                                 | Inherited.                               |

## Responsive direction

Switch direction at a breakpoint by passing a responsive value:

```tsx
<Stack direction={{ base: 'column', md: 'row' }} gap="$4">
  <Box flex={1}>Sidebar</Box>
  <Box flex={3}>Main</Box>
</Stack>
```

## See also

- [Box](./box) — the underlying primitive.
- [Layout extras](./layout-extras) — `Spacer`, `Center`, `Wrap`,
  `Grid`, `AspectRatio`.
- [Container queries](../guides/container-queries) — for component-
  scoped reflow instead of viewport breakpoints.
