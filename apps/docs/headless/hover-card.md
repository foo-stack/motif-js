# HoverCard

Tooltip-shaped panel with **interactive** content. Useful for user-
profile previews, link previews, etc. — content the user might want
to click into.

## Import

```ts
import { HoverCard } from '@motif-js/headless';
```

## Composition

```tsx
<HoverCard.Root>
  <HoverCard.Trigger>
    <Link href="/u/jane">@jane</Link>
  </HoverCard.Trigger>
  <HoverCard.Content>
    <HStack gap="$3" p="$4">
      <Avatar src="…" name="Jane Doe" size="lg" />
      <VStack gap="$1">
        <Heading as="h4">Jane Doe</Heading>
        <Text color="$colors.text.muted">@jane · 1.2k followers</Text>
        <Button size="sm" variant="outline">
          Follow
        </Button>
      </VStack>
    </HStack>
  </HoverCard.Content>
</HoverCard.Root>
```

## Difference from Tooltip

- **Tooltip** — non-interactive, supplementary description, sets
  `aria-describedby`. Hover or focus opens.
- **HoverCard** — interactive, the user can click into the content
  (links, buttons). Pointer-leave delay is longer so users can move
  into the panel without it closing.

## Behaviour

- Hover opens after `openDelay` (default 700ms — longer than Tooltip
  to avoid flashing on cursor-passes).
- Pointer entering the panel keeps it open.
- Pointer leaving both trigger AND panel after `closeDelay` (default
  300ms) closes.
- Focus on the trigger does NOT open the card by default — the
  content is interactive, so keyboard users get there via Tab into
  the content normally.

## Native

Activates via long-press, same pattern as Tooltip on native. Pan
into the popped-up panel keeps it open.

## See also

- [Tooltip](./tooltip) — non-interactive description.
- [Popover](./popover) — click-driven equivalent.
