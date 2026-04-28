# IconButton

A square Button for icon-only actions. `aria-label` is required.

## Import

```ts
import { IconButton } from '@motif-js/react';
import { Trash } from '@motif-js/icons';
```

## Example

```tsx
<IconButton aria-label="Delete row" icon={<Trash />} intent="danger" />
```

## Props

| Prop         | Type                         | Default     | Description                                   |
| ------------ | ---------------------------- | ----------- | --------------------------------------------- |
| `icon`       | `ReactNode`                  | —           | Required. The icon to render.                 |
| `aria-label` | `string`                     | —           | Required. Screen-reader label for the action. |
| `size`       | `'sm' \| 'md' \| 'lg'`       | `'md'`      | Square size — 32 / 40 / 48 px.                |
| `variant`    | `Button` variant             | `'solid'`   | Same as Button.                               |
| `intent`     | `Button` intent              | `'primary'` | Same as Button.                               |
| `...Button`  | All [Button](./button) props | —           | `loading`, `disabled`, `onPress`, etc.        |

## Why `aria-label` is required

A button with no visible text needs an accessible name. TypeScript
flags missing labels as a compile-time error, not a runtime warning,
because shipping unlabelled icon buttons is the most common a11y
defect motif's type system can catch.

## Sizing

Matches Button sizes — IconButton is just `Button` with `aspect-ratio:
1` and tighter padding. Size names map to:

- `sm` — 32×32, 16px icon.
- `md` — 40×40, 20px icon.
- `lg` — 48×48, 24px icon.

## See also

- [Button](./button) — text-bearing variant.
- [Icon set](./media#icon) — bundled glyphs in `@motif-js/icons`.
