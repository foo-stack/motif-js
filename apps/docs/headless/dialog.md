# Dialog / AlertDialog

Modal dialog with Portal + Overlay + FocusScope. AlertDialog is
Dialog with `role="alertdialog"` and scrim-click dismiss disabled.

## Import

```ts
import { Dialog, AlertDialog } from '@motif-js/headless';
```

## Composition

```tsx
<Dialog.Root>
  <Dialog.Trigger>
    <Button>Edit profile</Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Title>Edit profile</Dialog.Title>
    <Dialog.Description>Update your name and bio.</Dialog.Description>
    <Field>
      <Label>Name</Label>
      <Input />
    </Field>
    <HStack gap="$2" justifyContent="flex-end">
      <Dialog.Close>
        <Button variant="ghost">Cancel</Button>
      </Dialog.Close>
      <Dialog.Close>
        <Button>Save</Button>
      </Dialog.Close>
    </HStack>
  </Dialog.Content>
</Dialog.Root>
```

## Subcomponents

- **`Dialog.Root`** — provides context.
- **`Dialog.Trigger`** — clones a single child element, attaches click +
  `aria-expanded`. Toggles open.
- **`Dialog.Content`** — Portal-rendered overlay + scrim. Wires
  `role="dialog"`, `aria-modal`, focus trap, Escape dismiss.
- **`Dialog.Title`** — `<h2>` bound via `aria-labelledby`.
- **`Dialog.Description`** — paragraph bound via `aria-describedby`.
- **`Dialog.Close`** — clones a child to dismiss the dialog on click.

## Root props

| Prop           | Type             | Default | Description                        |
| -------------- | ---------------- | ------- | ---------------------------------- |
| `open`         | `boolean`        | —       | Controlled open state.             |
| `defaultOpen`  | `boolean`        | `false` | Uncontrolled initial state.        |
| `onOpenChange` | `(open) => void` | —       | Fires on open / close transitions. |

## Content props

| Prop                  | Type            | Default | Description                                             |
| --------------------- | --------------- | ------- | ------------------------------------------------------- |
| `dismissOnScrimClick` | `boolean`       | `true`  | Click outside the panel closes (false for AlertDialog). |
| `dismissOnEscape`     | `boolean`       | `true`  | Escape key closes.                                      |
| `style`               | `CSSProperties` | —       | Style for the dialog panel itself.                      |
| `children`            | `ReactNode`     | —       | Dialog body.                                            |

## AlertDialog

Drop-in replacement for Dialog when the dialog requires explicit
acknowledgement (destructive confirmations, irreversible actions):

```tsx
<AlertDialog.Root>
  <AlertDialog.Trigger>
    <Button intent="danger">Delete</Button>
  </AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Title>Delete forever?</AlertDialog.Title>
    <AlertDialog.Description>This cannot be undone.</AlertDialog.Description>
    <HStack gap="$2" justifyContent="flex-end">
      <AlertDialog.Close>
        <Button variant="ghost">Cancel</Button>
      </AlertDialog.Close>
      <AlertDialog.Close>
        <Button intent="danger">Delete</Button>
      </AlertDialog.Close>
    </HStack>
  </AlertDialog.Content>
</AlertDialog.Root>
```

The only differences from Dialog: `role="alertdialog"` and
`dismissOnScrimClick={false}`. The user must click an explicit action,
not tap-outside.

## Cross-platform

Web: Portal + scrim Box + FocusScope. Native: RN's `<Modal transparent>`
with hardware back / scrim Pressable for dismiss.

## See also

- [Drawer / Sheet](./drawer) — anchored variants.
- [Popover](./popover) — non-modal floating panel.
- [FocusScope (primitive)](../primitives/overlay#focusscope) — the
  underlying focus management.
