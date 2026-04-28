# Container

A Box that exposes its measured width to descendants. Lets you write
component-scoped responsive styles instead of always reflowing on
viewport breakpoints.

## Import

```ts
import { Container } from '@motif-js/react';
```

## Example

```tsx
<Container name="card">
  <Stack direction={{ base: 'column', '@card.md': 'row' }} gap="$3">
    <Box flex={1}>Item A</Box>
    <Box flex={1}>Item B</Box>
  </Stack>
</Container>
```

The `@card.md` key targets the named container's width (≥768px), not
the device viewport. Resize the parent and the layout reflows; resize
the device window without changing the parent and nothing happens.

## Props

| Prop        | Type                   | Default | Description                                                               |
| ----------- | ---------------------- | ------- | ------------------------------------------------------------------------- |
| `name`      | `string`               | —       | Optional name for `@<name>.<bp>` targeting.                               |
| `rateCapMs` | `number`               | `16`    | Re-measure rate cap (ms). Suppresses `onLayout` updates faster than this. |
| `...Box`    | All [Box](./box) props | —       | Inherited.                                                                |

## Anonymous vs named queries

- **Anonymous** — descendants use `@<bp>` keys (`@md`, `@lg`, etc.)
  to target the **nearest** enclosing Container.
- **Named** — `<Container name="card">` lets descendants use
  `@card.<bp>` keys to target a specific ancestor by name. Useful
  when you have nested Containers and need to address a specific one.

## Web vs native

- **Web** — emits CSS container queries — `container-type: inline-size`
  on the parent and `@container <name> (min-width: ...)` queries on
  descendants. Native CSS implementation, no JS overhead.
- **Native** — polyfilled via `View.onLayout`. Tracks the width with
  `useState`, exposes via React context, descendants resolve `@`-keys
  through the resolver. ~10–20% render-cost overhead vs plain Box;
  see [native container-query bench](https://github.com/foo-stack/motif-js/tree/main/benchmarks/native-container).

## Performance — native polyfill

`rateCapMs={16}` (default) caps `onLayout` updates at one frame. For
heavily-animated containers, set `rateCapMs={0}` to disable the cap.
For static containers that only resize on rotation, `rateCapMs={50}`
skips transient updates.

## See also

- [Container queries guide](../guides/container-queries) — full DSL +
  cascade order vs viewport breakpoints.
- [Responsive guide](../guides/responsive) — three responsive shapes
  (object / array / DSL).
