---
'@usemotif/react': minor
'@usemotif/headless': patch
'@usemotif/ui': patch
---

`Overlay` now isolates what is behind it.

Background content is marked `inert` and `aria-hidden` while the overlay is
open, and page scrolling is locked. These are the two WAI-ARIA modal
requirements motif was missing: focus management (`trapFocus`, `captureFocus`,
`restoreFocus`) already shipped, but a screen reader could still reach the page
underneath and the background still scrolled.

Both behaviours are on by default and independently opt-out:

```tsx
<Overlay isolateBackground={false} lockScroll={false}>
```

`Dialog`, `AlertDialog`, `Drawer`, `Sheet`, and `CommandPalette` compose
`Overlay`, so they gain this with no code change on their side. `Popover`,
`Menu`, `Tooltip`, `HoverCard`, and `ContextMenu` use `Portal` directly and are
deliberately untouched: they are non-modal, and the page stays interactive and
scrollable behind them.

Details worth knowing:

- Both effects are reference-counted, so a Dialog opened over a Drawer holds
  isolation until the outer one closes.
- The scroll lock compensates for the removed scrollbar with matching
  `padding-right`, so locking does not shift the page.
- `overflow: hidden` does not stop touch scrolling in iOS Safari, so a
  non-passive `touchmove` listener cancels the gesture unless it lands on
  something scrollable inside the overlay. Pinch-zoom is left alone.
- A live region is never hidden, so toasts keep announcing while a modal is
  open.
- Prior `inert` and `aria-hidden` attributes are restored rather than removed,
  and the release is idempotent so React strict mode's double cleanup in
  development cannot reveal the background early.

Native is unaffected: `Portal` on React Native wraps `<Modal>`, which already
isolates at the host-view level.
