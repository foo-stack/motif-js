# Collapsible / Accordion / Tabs

Disclosure family — show / hide patterns. Three shapes: a single
disclosure (`Collapsible`), many linked disclosures (`Accordion`),
and a sibling-tabs pattern (`Tabs`).

## Import

```ts
import { Collapsible, Accordion, Tabs } from '@motif-js/headless';
```

## Collapsible

Single trigger ↔ content pair. The trigger gets
`aria-expanded` + `aria-controls`; the content gets
`aria-labelledby` pointing back at the trigger.

```tsx
<Collapsible.Root>
  <Collapsible.Trigger>
    <Button>Show details</Button>
  </Collapsible.Trigger>
  <Collapsible.Content>
    <Box p="$3">…details…</Box>
  </Collapsible.Content>
</Collapsible.Root>
```

| Prop (Root)    | Type             | Default | Description      |
| -------------- | ---------------- | ------- | ---------------- |
| `open`         | `boolean`        | —       | Controlled.      |
| `defaultOpen`  | `boolean`        | `false` | Uncontrolled.    |
| `onOpenChange` | `(open) => void` | —       | Transition hook. |

`Collapsible.Content` has a `forceMount` prop — keeps the content in
the tree even when closed (useful for animation; pair with `hidden`
attribute which motif sets automatically).

## Accordion

Multiple linked Collapsibles. Single-mode (default) closes the
previous item when a new one opens; multiple-mode lets any subset be
open.

```tsx
<Accordion.Root type="single" defaultValue={['faq-1']}>
  <Accordion.Item value="faq-1">
    <Accordion.Trigger>
      <Button>What is motif?</Button>
    </Accordion.Trigger>
    <Accordion.Content>
      <Paragraph>A cross-platform React styling library.</Paragraph>
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="faq-2">
    <Accordion.Trigger>
      <Button>Does it support RN?</Button>
    </Accordion.Trigger>
    <Accordion.Content>
      <Paragraph>Yes — same API on web + RN.</Paragraph>
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

| Prop (Root)     | Type                        | Default    | Description                    |
| --------------- | --------------------------- | ---------- | ------------------------------ |
| `type`          | `'single' \| 'multiple'`    | `'single'` | One-at-a-time vs multi-open.   |
| `value`         | `string[]`                  | —          | Controlled list of open ids.   |
| `defaultValue`  | `string[]`                  | `[]`       | Uncontrolled initial open ids. |
| `onValueChange` | `(value: string[]) => void` | —          | Fires on toggle.               |

## Tabs

Standard tab pattern: `role="tablist"` + `role="tab"` + `role="tabpanel"`,
arrow-key navigation, automatic activation on focus.

```tsx
<Tabs.Root defaultValue="overview">
  <Tabs.List>
    <Tabs.Tab value="overview">
      <span>Overview</span>
    </Tabs.Tab>
    <Tabs.Tab value="usage">
      <span>Usage</span>
    </Tabs.Tab>
    <Tabs.Tab value="api">
      <span>API</span>
    </Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="overview">…overview…</Tabs.Panel>
  <Tabs.Panel value="usage">…usage…</Tabs.Panel>
  <Tabs.Panel value="api">…api…</Tabs.Panel>
</Tabs.Root>
```

| Prop (Root)     | Type                         | Default        | Description              |
| --------------- | ---------------------------- | -------------- | ------------------------ |
| `value`         | `string`                     | —              | Controlled active tab.   |
| `defaultValue`  | `string`                     | first tab      | Uncontrolled.            |
| `onValueChange` | `(v: string) => void`        | —              | Fires on activation.     |
| `orientation`   | `'horizontal' \| 'vertical'` | `'horizontal'` | Sets `aria-orientation`. |

### Keyboard navigation

- ArrowRight / ArrowLeft — move between tabs (horizontal).
- ArrowDown / ArrowUp — move between tabs (vertical).
- Wrap around at the end / start.
- Home / End — first / last.

Tabs are activated on focus (the focused tab becomes the active
tab). This is the "automatic" activation pattern — for manual
activation (Enter/Space to commit), wrap your own state.

## See also

- [Collapsible](./disclosure) — the underlying single-disclosure.
- [Container queries](../guides/container-queries) — for tab lists
  that should reflow to vertical on narrow containers.
