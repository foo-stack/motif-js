# Popover

Non-modal floating panel anchored to a trigger. Same shape as Dialog
without the focus trap or scrim — just an overlay you can click
outside of.

## Import

```ts
import { Popover } from '@motif-js/headless';
```

## Composition

```tsx
<Popover.Root>
  <Popover.Trigger>
    <Button>Options</Button>
  </Popover.Trigger>
  <Popover.Content placement="bottom-start">
    <VStack gap="$2" p="$3">
      <Pressable>Edit</Pressable>
      <Pressable>Duplicate</Pressable>
      <Pressable>Delete</Pressable>
    </VStack>
  </Popover.Content>
</Popover.Root>
```

## Subcomponents

- **`Popover.Root`** — context provider.
- **`Popover.Trigger`** — clones a child, attaches click +
  `aria-expanded`.
- **`Popover.Content`** — Portal-rendered floating panel positioned
  via `useFloatingPosition`.
- **`Popover.Close`** — child wrapper that closes on click.

## Root props

| Prop           | Type             | Default | Description                 |
| -------------- | ---------------- | ------- | --------------------------- |
| `open`         | `boolean`        | —       | Controlled open state.      |
| `defaultOpen`  | `boolean`        | `false` | Uncontrolled initial state. |
| `onOpenChange` | `(open) => void` | —       | Fires on transitions.       |

## Content props

| Prop        | Type                                                         | Default    | Description             |
| ----------- | ------------------------------------------------------------ | ---------- | ----------------------- |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` + `-start` / `-end` | `'bottom'` | Anchor placement.       |
| `offset`    | `number`                                                     | `8`        | Pixel gap from trigger. |
| `style`     | `CSSProperties`                                              | —          | Panel style.            |

## Click-outside behaviour

Clicks outside `Popover.Content` close the popover. Inner clicks are
preserved — interact freely with the panel without dismissing.

For modal popovers (focus trap, scrim, force-explicit-close), use
[Dialog](./dialog) instead.

## Native

On native, Content renders inside an RN `<Modal transparent>` with a
transparent backdrop. The placement prop accepts `'center'`,
`'bottom'`, `'top'` (the floating positioning system isn't used —
mobile-friendly placement only).

## See also

- [Dialog](./dialog) — modal variant with focus trap.
- [HoverCard](./hover-card) — Popover that opens on hover.
- [Menu](./menu) — Popover with role=menu + arrow-key nav.
