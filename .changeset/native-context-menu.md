---
'@motif-js/headless': minor
'@motif-js/react-native': patch
---

**Native `<ContextMenu>` — long-press to open (T3.1a).**

Replaces the previous null-stub-with-warning native implementation
with a real long-press-driven menu. Touch devices have no portable
right-click affordance, so the trigger uses RN's
`Pressable.onLongPress` instead. Surface is a Modal sheet (matches
the native `<Menu>` pattern); items are Pressable rows with
`accessibilityRole="menuitem"`.

```tsx
import { ContextMenu } from '@motif-js/headless';
import { Pressable, Text } from 'react-native';

<ContextMenu.Root>
  <ContextMenu.Trigger>
    <Pressable>
      <Text>Long-press me</Text>
    </Pressable>
  </ContextMenu.Trigger>
  <ContextMenu.Content>
    <ContextMenu.Item onSelect={cut}>Cut</ContextMenu.Item>
    <ContextMenu.Item onSelect={copy}>Copy</ContextMenu.Item>
    <ContextMenu.Separator />
    <ContextMenu.Item disabled>Paste</ContextMenu.Item>
  </ContextMenu.Content>
</ContextMenu.Root>;
```

- **API matches the web ContextMenu** — `Root / Trigger / Content
  / Item / Separator`. `Root` accepts the same controlled-open
  shape (`open` / `defaultOpen` / `onOpenChange`) as native `<Menu>`.
- **Touch-coordinate position is dropped** — the web version opens
  at pointer `(x, y)`. On native, touch coordinates aren't a useful
  Modal anchor, so the surface uses a `placement` enum
  (`'center'` default | `'bottom'` | `'top'`) instead. Documented
  in JSDoc.
- **Dismiss paths**: tap an item (fires `onSelect` then closes), tap
  the scrim, hardware back / ESC (Modal's `onRequestClose`).
- **Disabled items** are non-interactive — `disabled` flows through
  to RN's Pressable, accessibilityState reflects it.

Adds a vitest alias in `@motif-js/headless` to reuse
`@motif-js/react-native`'s jsdom RN mock so headless `*.native.test.tsx`
files can render Modal / Pressable / View as DOM hosts. The mock
gains `onLongPress` translation — dispatches as a
`'longpress'` CustomEvent on the Pressable host so tests can
trigger long-press behaviour without simulating timing-based
gesture recognition. Future T3.1b/c/d native components reuse the
same harness.

6 new tests cover open-on-long-press, dismiss-on-item-select,
dismiss-without-select for disabled items, Separator rendering,
controlled-open mode, and the no-render-when-closed path. Bundle:
`@motif-js/headless` 26.2 → 26.4 KB gz (under 31.3 KB budget).
