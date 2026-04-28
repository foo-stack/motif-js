# Overlay & a11y

Low-level overlay + accessibility primitives. The headless components
([Dialog](../headless/dialog), [Popover](../headless/popover),
[Menu](../headless/menu), [Tooltip](../headless/tooltip)) compose
these — most app code reaches for the headless layer instead.

## Import

```ts
import {
  Portal,
  Overlay,
  VisuallyHidden,
  LiveRegion,
  FocusScope,
  Show,
  Hide,
} from '@motif-js/react';
```

## Portal

Renders children into a different part of the DOM, outside the
parent's hierarchy. Used as the foundation for overlays, modals,
tooltips, etc.

```tsx
<Portal>
  <div>This is rendered into document.body</div>
</Portal>
```

| Prop       | Type                  | Default         | Description               |
| ---------- | --------------------- | --------------- | ------------------------- |
| `to`       | `HTMLElement \| null` | `document.body` | Target element. Web only. |
| `children` | `ReactNode`           | —               |                           |

SSR-safe — returns `null` until `document` is available. On native, a
Portal wraps an RN `<Modal transparent>` (the closest equivalent to
DOM portals).

## Overlay

Full-viewport scrim. Composes Portal + a fixed-position Box so the
overlay covers everything regardless of where the caller renders.

```tsx
<Overlay onScrimClick={() => setOpen(false)}>
  <Box bg="$colors.surface.raised" p="$6" borderRadius="$lg">
    Content here is centred over a translucent black scrim.
  </Box>
</Overlay>
```

| Prop           | Type               | Default                | Description                          |
| -------------- | ------------------ | ---------------------- | ------------------------------------ |
| `onScrimClick` | `() => void`       | —                      | Fires on clicks of the scrim itself. |
| `scrim`        | `string`           | `'rgba(0, 0, 0, 0.5)'` | Background tint colour.              |
| `...Box`       | [Box](./box) props | —                      | Inherited (minus `position`).        |

`onScrimClick` only fires when the click target is the scrim element
itself — clicks on inner content don't bubble through. That's the
standard tap-outside-to-dismiss pattern.

## VisuallyHidden

Visually hides content while keeping it in the accessibility tree.
Use for sr-only labels, off-screen headings, etc.

```tsx
<button>
  <Trash />
  <VisuallyHidden>Delete row</VisuallyHidden>
</button>
```

Web renders the standard "sr-only" pattern (1×1 clipped span). Native
uses a zero-sized View with `accessible={true}`.

## LiveRegion

`aria-live` container for announcing updates to screen readers.

```tsx
<LiveRegion politeness="polite">Saved at {new Date().toLocaleTimeString()}</LiveRegion>
```

| Prop             | Type                               | Default    | Description                   |
| ---------------- | ---------------------------------- | ---------- | ----------------------------- |
| `politeness`     | `'polite' \| 'assertive' \| 'off'` | `'polite'` | `aria-live` urgency.          |
| `visuallyHidden` | `boolean`                          | `false`    | Also visually hide (sr-only). |

`'polite'` queues announcements; `'assertive'` interrupts. Use
assertive sparingly — for things like errors that need immediate
attention.

## FocusScope

Focus management for overlays. Three behaviours, each independently
togglable:

- `autoFocus` (default `true`) — moves focus to the first focusable
  descendant on mount.
- `restoreFocus` (default `true`) — returns focus to the previously-
  active element on unmount.
- `trapFocus` (default `true`) — keeps Tab / Shift+Tab cycling
  inside the scope.

`onEscape` fires when the user presses Escape inside the scope. Wire
it to the parent's dismiss handler.

```tsx
<FocusScope onEscape={() => setOpen(false)}>
  <Box>
    <Input autoFocus />
    <Button>Submit</Button>
  </Box>
</FocusScope>
```

| Prop           | Type         | Default | Description                                |
| -------------- | ------------ | ------- | ------------------------------------------ |
| `autoFocus`    | `boolean`    | `true`  | Focus first descendant on mount.           |
| `restoreFocus` | `boolean`    | `true`  | Return focus on unmount.                   |
| `trapFocus`    | `boolean`    | `true`  | Trap Tab cycling inside.                   |
| `onEscape`     | `() => void` | —       | Fires on Escape keypress inside the scope. |

## Show / Hide

Declarative responsive visibility.

```tsx
<Show above="md">
  <Box>Visible at md+ viewports</Box>
</Show>

<Hide above="md">
  <Box>Hidden at md+ viewports</Box>
</Hide>
```

| Prop    | Type                                    | Description                             |
| ------- | --------------------------------------- | --------------------------------------- |
| `above` | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` | Show/hide at this breakpoint and above. |
| `below` | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` | Show/hide below this breakpoint.        |

Children re-render on viewport change. For finer control (e.g. by
container width instead of viewport), use [Container queries](../guides/container-queries).

## See also

- [Dialog (headless)](../headless/dialog) — composes Portal + Overlay
  - FocusScope.
- [Popover (headless)](../headless/popover) — non-modal overlay.
