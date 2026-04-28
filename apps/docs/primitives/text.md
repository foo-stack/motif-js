# Text

Theme-aware text rendering. Inherits motif's text style props
(`fontSize`, `fontWeight`, `color`, `lineHeight`, `letterSpacing`,
`textAlign`, etc.).

## Import

```ts
import { Text } from '@motif-js/react';
```

## Example

```tsx
<Text fontSize="$lg" fontWeight="$semibold" color="$colors.text.default">
  Welcome back
</Text>
```

## Props

| Prop            | Type                                   | Default  | Description                                           |
| --------------- | -------------------------------------- | -------- | ----------------------------------------------------- |
| `as`            | `'p' \| 'span' \| 'h1' \| ...`         | `'span'` | HTML tag. Use `as="h1"` etc. for semantics.           |
| `numberOfLines` | `number`                               | —        | Truncate to N lines with ellipsis. Cross-platform.    |
| `truncate`      | `boolean`                              | `false`  | Single-line truncate (alias for `numberOfLines={1}`). |
| `...Box`        | All [Box](./box) props (text-relevant) | —        | `fontSize`, `fontWeight`, `color`, `textAlign`, etc.  |

## Cross-platform tag mapping

On web, `as` maps directly to the HTML element. On native, every
`<Text>` renders RN's `<Text>` regardless of `as` — semantic role
ships via `accessibilityRole` instead.

```tsx
<Text as="h1" fontSize="$3xl" fontWeight="$bold">Page title</Text>
<Text>Body</Text>
<Text as="code" fontFamily="$mono">snake_case</Text>
```

## Truncation

```tsx
<Text numberOfLines={2}>
  Long copy that should clip after two lines with an ellipsis at the end.
</Text>
```

On web this maps to `-webkit-line-clamp` + `display: -webkit-box`. On
native it forwards to RN's `numberOfLines` prop directly.

## See also

- [Typography](./typography) — `Heading`, `Paragraph`, `Code`, `Kbd`,
  `Blockquote` — pre-styled `<Text>` variants.
- [Theming](../guides/theming) — typography tokens (`fontSizes`,
  `fontWeights`, `fontFamilies`).
