# Menu / ContextMenu

`role="menu"` with `aria-orientation` + arrow-key navigation. Menu
opens on click; ContextMenu opens at pointer coords on right-click.

## Import

```ts
import { Menu, ContextMenu } from '@motif-js/headless';
```

## Menu

```tsx
<Menu.Root>
  <Menu.Trigger>
    <Button>Actions</Button>
  </Menu.Trigger>
  <Menu.Content>
    <Menu.Item onSelect={() => save()}>Save</Menu.Item>
    <Menu.Item onSelect={() => exportFile()}>Export</Menu.Item>
    <Menu.Separator />
    <Menu.Item disabled>Archive</Menu.Item>
    <Menu.Item onSelect={() => del()} intent="danger">
      Delete
    </Menu.Item>
  </Menu.Content>
</Menu.Root>
```

### Subcomponents

- **`Menu.Root`** — context.
- **`Menu.Trigger`** — clones child + open handler.
- **`Menu.Content`** — `role="menu"` panel, portalled.
- **`Menu.Item`** — `role="menuitem"`, fires `onSelect` on
  click / Enter / Space.
- **`Menu.Separator`** — visual divider, `role="separator"`.

### Item props

| Prop       | Type         | Default | Description                                 |
| ---------- | ------------ | ------- | ------------------------------------------- |
| `onSelect` | `() => void` | —       | Fires on activation. Closes the menu.       |
| `disabled` | `boolean`    | `false` | Skipped in keyboard nav; `aria-disabled`.   |
| `intent`   | `string`     | —       | Pass-through for styling (e.g. `'danger'`). |

### Keyboard navigation

- ArrowDown / ArrowUp — move highlight (skipping disabled).
- Home / End — jump to first / last.
- Enter / Space — activate highlighted item.
- Escape — close.

## ContextMenu

Same shape as Menu but the trigger fires on `contextmenu` (right-click
on web, long-press on touch). Web-only — touch devices don't have
right-click; native uses long-press as the substitute.

```tsx
<ContextMenu.Root>
  <ContextMenu.Trigger>
    <Box p="$4">Right-click me</Box>
  </ContextMenu.Trigger>
  <ContextMenu.Content>
    <ContextMenu.Item onSelect={() => copy()}>Copy</ContextMenu.Item>
    <ContextMenu.Item onSelect={() => paste()}>Paste</ContextMenu.Item>
  </ContextMenu.Content>
</ContextMenu.Root>
```

The Trigger calls `e.preventDefault()` on `contextmenu` to suppress
the browser's default menu and opens motif's menu at the pointer
coordinates.

## See also

- [Popover](./popover) — for non-menu overlays.
- [NavigationMenu](./navigation) — for primary site navigation.
