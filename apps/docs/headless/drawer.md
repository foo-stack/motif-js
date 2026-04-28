# Drawer / Sheet

Anchored Dialog variants. Drawer slides in from the side; Sheet
slides in from the bottom.

## Import

```ts
import { Drawer, Sheet } from '@motif-js/headless';
```

## Drawer

```tsx
<Drawer.Root>
  <Drawer.Trigger>
    <Button>Open menu</Button>
  </Drawer.Trigger>
  <Drawer.Content side="left">
    <VStack gap="$3" p="$4" w={280}>
      <Drawer.Title>Navigation</Drawer.Title>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/settings">Settings</Link>
      <Link href="/help">Help</Link>
    </VStack>
  </Drawer.Content>
</Drawer.Root>
```

### Drawer Content props

| Prop                | Type                                     | Default   | Description                       |
| ------------------- | ---------------------------------------- | --------- | --------------------------------- |
| `side`              | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` | Anchor side.                      |
| `...Dialog.Content` | All [Dialog](./dialog) Content props     | —         | Inherited (dismissOnScrim, etc.). |

The Drawer is functionally a Dialog with side-anchored CSS. Same
focus trap, Escape dismiss, scrim click semantics.

## Sheet

Bottom-anchored — the mobile-friendly modal pattern. Slides up from
the bottom of the viewport, snaps to one or more heights.

```tsx
<Sheet.Root>
  <Sheet.Trigger>
    <Button>Open filters</Button>
  </Sheet.Trigger>
  <Sheet.Content snapPoints={[0.4, 0.9]}>
    <VStack gap="$3" p="$4">
      <Sheet.Handle />
      <Sheet.Title>Filters</Sheet.Title>
      <Field>
        <Label>Category</Label>
        <Select.Root options={categories} />
      </Field>
    </VStack>
  </Sheet.Content>
</Sheet.Root>
```

### Sheet Content props

| Prop          | Type       | Default         | Description                                               |
| ------------- | ---------- | --------------- | --------------------------------------------------------- |
| `snapPoints`  | `number[]` | `[0.5]`         | Heights as ratios of viewport (0..1). Drag-snaps between. |
| `defaultSnap` | `number`   | `snapPoints[0]` | Initial snap point.                                       |

## Native

Both render through RN's `<Modal transparent>` with the appropriate
slide animation. Sheet is the right primitive for most mobile
modals — Drawer side anchors are uncommon on RN.

## See also

- [Dialog](./dialog) — centred modal.
- [Popover](./popover) — non-modal anchored panel.
