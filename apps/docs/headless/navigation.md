# Pagination / Breadcrumb / Stepper / NavigationMenu / Toolbar

Site / app navigation patterns. Each is headless wiring only — caller
supplies the visual.

## Import

```ts
import { Pagination, Breadcrumb, Stepper, NavigationMenu, Toolbar } from '@motif-js/headless';
```

## Pagination

Render-prop API — caller controls the visual of each item type.

```tsx
<Pagination
  page={page}
  total={Math.ceil(rows.length / pageSize)}
  onPageChange={setPage}
  siblings={1}
  renderItem={({ type, page, disabled, selected, onClick }) => {
    if (type === 'ellipsis') return <Text px="$2">…</Text>;
    if (type === 'previous')
      return (
        <IconButton
          aria-label="Previous"
          icon={<ChevronLeft />}
          disabled={disabled}
          onPress={onClick}
        />
      );
    if (type === 'next')
      return (
        <IconButton
          aria-label="Next"
          icon={<ChevronRight />}
          disabled={disabled}
          onPress={onClick}
        />
      );
    return (
      <Button
        variant={selected ? 'solid' : 'ghost'}
        onPress={onClick}
        aria-current={selected ? 'page' : undefined}
      >
        {page}
      </Button>
    );
  }}
/>
```

| Prop           | Type                     | Default | Description                            |
| -------------- | ------------------------ | ------- | -------------------------------------- |
| `page`         | `number`                 | —       | Current page (1-indexed).              |
| `total`        | `number`                 | —       | Total page count.                      |
| `onPageChange` | `(next: number) => void` | —       | Handler.                               |
| `siblings`     | `number`                 | `1`     | Adjacent pages to show around current. |
| `renderItem`   | `(info) => ReactElement` | —       | Required.                              |

`renderItem` receives `{ type: 'page' | 'previous' | 'next' | 'ellipsis', page?, disabled, selected, onClick }`.

## Breadcrumb

```tsx
<Breadcrumb separator={<ChevronRight color="$colors.gray.400" />}>
  <Link href="/">Home</Link>
  <Link href="/projects">Projects</Link>
  <Text>Acme</Text>
</Breadcrumb>
```

| Prop         | Type        | Default        | Description                       |
| ------------ | ----------- | -------------- | --------------------------------- |
| `separator`  | `ReactNode` | `'/'`          | Separator inserted between items. |
| `aria-label` | `string`    | `'Breadcrumb'` | Accessible label.                 |

The last child gets `aria-current="page"` automatically. Separators
get `aria-hidden`.

## Stepper

```tsx
<Stepper
  steps={[
    { id: 'cart', label: 'Cart' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'payment', label: 'Payment' },
    { id: 'confirm', label: 'Confirm' },
  ]}
  current="shipping"
  renderStep={({ step, status, isLast }) => (
    <HStack gap="$2">
      <Box
        w={24}
        h={24}
        borderRadius="$full"
        bg={status === 'active' || status === 'complete' ? '$colors.brand.500' : '$colors.gray.200'}
      />
      <Text>{step.label}</Text>
      {!isLast && <Spacer w="$4" h={1} bg="$colors.gray.300" />}
    </HStack>
  )}
/>
```

| Prop          | Type                                                | Default        | Description     |
| ------------- | --------------------------------------------------- | -------------- | --------------- |
| `steps`       | `{ id, label, status? }[]`                          | —              | Step list.      |
| `current`     | `string`                                            | —              | Active step id. |
| `renderStep`  | `({ step, index, status, isLast }) => ReactElement` | —              | Required.       |
| `orientation` | `'horizontal' \| 'vertical'`                        | `'horizontal'` | Stepper axis.   |

## NavigationMenu

Primary site navigation. Two modes: flat children (each renders a
top-level link) or `items` (recursive — each item can carry
`children` and render submenus).

```tsx
{
  /* Flat mode */
}
<NavigationMenu>
  <Link href="/dashboard" id="dashboard">
    Dashboard
  </Link>
  <Link href="/projects" id="projects">
    Projects
  </Link>
  <Link href="/settings" id="settings">
    Settings
  </Link>
</NavigationMenu>;

{
  /* Tree mode */
}
<NavigationMenu
  items={[
    {
      id: 'products',
      label: 'Products',
      children: [
        { id: 'storage', label: 'Storage', href: '/products/storage' },
        { id: 'compute', label: 'Compute', href: '/products/compute' },
      ],
    },
    { id: 'pricing', label: 'Pricing', href: '/pricing' },
  ]}
  current={pathname}
/>;
```

In tree mode, motif renders a `role="menubar"` with nested
`role="menu"` popovers, positioned via `useFloatingPosition`.
Keyboard: ArrowRight opens a submenu, ArrowLeft closes; ArrowDown
opens at top level; Escape closes from anywhere.

## Toolbar

Generic toolbar wrapper — `role="toolbar"` + orientation.

```tsx
<Toolbar accessibilityLabel="Editor toolbar">
  <IconButton aria-label="Bold" icon={<Bold />} />
  <IconButton aria-label="Italic" icon={<Italic />} />
  <IconButton aria-label="Underline" icon={<Underline />} />
</Toolbar>
```

| Prop          | Type                         | Default        | Description |
| ------------- | ---------------------------- | -------------- | ----------- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` |             |

## Native

All variants render as the platform-correct equivalents. NavigationMenu's
tree-mode submenus open inside an RN `<Modal>` (no Portal needed —
the modal layer is already the overlay root).

## See also

- [Menu](./menu) — dropdown menus driven by a button.
- [Tabs](./disclosure) — for switching panels in place.
