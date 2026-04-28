# Scroll

Scroll containers + sticky headers + a virtualisation seam.

## Import

```ts
import { ScrollView, Sticky, VirtualList } from '@motif-js/react';
import { registerVirtualListImpl } from '@motif-js/react';
```

## ScrollView

A styled container that scrolls when its content overflows.

```tsx
<ScrollView direction="vertical" hideScrollbar={false}>
  {/* …long content… */}
</ScrollView>
```

| Prop            | Type                                   | Default      | Description                                     |
| --------------- | -------------------------------------- | ------------ | ----------------------------------------------- |
| `direction`     | `'vertical' \| 'horizontal' \| 'both'` | `'vertical'` | Scroll axis.                                    |
| `hideScrollbar` | `boolean`                              | `false`      | Visually hide the scrollbar (still scrollable). |
| `...Box`        | All [Box](./box) props                 | —            | Inherited.                                      |

Web defaults: `WebkitOverflowScrolling: 'touch'` (iOS momentum) +
`overscrollBehavior: 'contain'` (no parent bubbling).

Native renders RN's `<ScrollView>` directly with `contentContainerStyle`
mapped from the resolved Box style.

## Sticky

Wrapper that pins itself to the scroll-container's edge.

```tsx
<ScrollView>
  <Sticky top={0} zIndex={10} bg="$colors.surface.base">
    <Heading>Section A</Heading>
  </Sticky>
  {/* …rows… */}
</ScrollView>
```

| Prop     | Type                   | Default | Description                                        |
| -------- | ---------------------- | ------- | -------------------------------------------------- |
| `top`    | `number \| string`     | `0`     | Pin offset from the top.                           |
| `bottom` | `number \| string`     | —       | Footer-style sticky (mutually exclusive with top). |
| `zIndex` | `number`               | `1`     | Stack order vs scroll content.                     |
| `...Box` | All [Box](./box) props | —       | Inherited.                                         |

### Native quirk: direct children only

Native's `stickyHeaderIndices` only respects direct children of
`<ScrollView>`. Nesting `<Sticky>` deeper (inside a Box, inside a
list) is documented as unsupported on native — works on web but not
RN.

## VirtualList

Virtualisation seam. Below `threshold` items, renders every row
directly. Above, delegates to whatever implementation has been
registered.

```tsx
<VirtualList
  data={items}
  renderItem={(item, i) => <Row item={item} />}
  keyOf={(item) => item.id}
  itemHeight={48}
/>
```

| Prop            | Type                                | Default | Description                                         |
| --------------- | ----------------------------------- | ------- | --------------------------------------------------- |
| `data`          | `readonly T[]`                      | —       | Items to render.                                    |
| `renderItem`    | `(item, index) => ReactNode`        | —       | Per-row render fn.                                  |
| `keyOf`         | `(item, index) => string \| number` | (index) | Stable item key.                                    |
| `itemHeight`    | `number`                            | —       | Approximate row height (used by virtualised impls). |
| `...ScrollView` | All `ScrollView` props              | —       | Inherited (axis, hideScrollbar, etc.).              |

### Registering a virtualised renderer

```ts
import { Virtuoso } from 'react-virtuoso';
import { registerVirtualListImpl } from '@motif-js/react';

registerVirtualListImpl(({ data, renderItem, keyOf }) => (
  <Virtuoso
    data={data}
    itemContent={(i, item) => renderItem(item, i)}
    computeItemKey={(i, item) => keyOf?.(item, i) ?? i}
  />
));
```

Call once at app startup. Below the registered `threshold` (default
50), motif's fallback renders all rows directly — virtualisation has
fixed cost that isn't worth paying for short lists.

The fallback path makes the JSX shape work without any peer dep, so
apps that don't need virtualisation pay nothing.

## See also

- [Box](./box) — base for ScrollView + Sticky.
- [Layout extras](./layout-extras) — `Spacer`, `Center`, `Wrap`, etc.
