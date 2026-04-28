# Tooltip

Hover / focus tooltip with WCAG-friendly delays + `aria-describedby`
binding.

## Import

```ts
import { Tooltip } from '@motif-js/headless';
```

## Composition

```tsx
<Tooltip.Root>
  <Tooltip.Trigger>
    <IconButton aria-label="Settings" icon={<Settings />} />
  </Tooltip.Trigger>
  <Tooltip.Content>Open settings (⌘,)</Tooltip.Content>
</Tooltip.Root>
```

## Behaviour

- **Hover** — opens after `openDelay` (default 500ms). Closes on
  pointer-leave after `closeDelay` (default 200ms).
- **Focus** — opens immediately on keyboard focus
  (`focus-visible`). Closes on blur.
- **Touch** — does not open. Tooltips don't fit the touch model;
  mobile devices show their content via long-press of the underlying
  trigger if configured separately.
- **Escape** — closes regardless of pointer state.

`aria-describedby` is set on the trigger when the tooltip is open and
points at `Tooltip.Content`. Screen readers read the content as a
description after the trigger's accessible name.

## Root props

| Prop           | Type             | Default | Description                     |
| -------------- | ---------------- | ------- | ------------------------------- |
| `open`         | `boolean`        | —       | Controlled open state.          |
| `defaultOpen`  | `boolean`        | `false` | Uncontrolled initial state.     |
| `onOpenChange` | `(open) => void` | —       | Transitions hook.               |
| `openDelay`    | `number`         | `500`   | ms before hover-opens.          |
| `closeDelay`   | `number`         | `200`   | ms before pointer-leave closes. |

## Content props

| Prop        | Type              | Default | Description          |
| ----------- | ----------------- | ------- | -------------------- |
| `placement` | Popover placement | `'top'` | Floating placement.  |
| `style`     | `CSSProperties`   | —       | Tooltip panel style. |

## Native

On native, Tooltip activates via long-press (the platform-correct
hover analogue). `openDelay` / `closeDelay` are ignored; long-press
triggers immediate open, release closes.

## When NOT to use a Tooltip

If the trigger has no visible label, the tooltip is your label — use
`aria-label` on the trigger directly instead. Tooltips are
_supplementary_ descriptions, not substitute names.

## See also

- [HoverCard](./hover-card) — Tooltip-shaped but interactive content.
- [Popover](./popover) — click-driven floating panel.
