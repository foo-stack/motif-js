# Typography

Pre-styled `<Text>` variants for common roles. Each is a thin wrapper
that sets sensible defaults (font-size, weight, line-height, semantic
tag) and inherits the rest of `<Text>`'s props.

## Import

```ts
import { Heading, Paragraph, Code, Kbd, Blockquote } from '@motif-js/react';
```

## Heading

Semantic heading. `as` controls both the tag (`h1`–`h6`) and the
default font-size / weight from theme tokens.

```tsx
<Heading as="h1">Page title</Heading>
<Heading as="h2">Section</Heading>
<Heading as="h3" color="$colors.text.muted">Subsection</Heading>
```

| Prop      | Type                     | Default | Description    |
| --------- | ------------------------ | ------- | -------------- |
| `as`      | `'h1'`–`'h6'`            | `'h2'`  | Heading level. |
| `...Text` | All [Text](./text) props | —       | Inherited.     |

Default font-sizes come from theme tokens: `h1 = $4xl`, `h2 = $3xl`,
`h3 = $2xl`, `h4 = $xl`, `h5 = $lg`, `h6 = $md`. Override per-instance
via `fontSize`.

## Paragraph

Body copy. Renders `<p>` with `lineHeight: '$paragraph'` and
`color: '$colors.text.default'`.

```tsx
<Paragraph>Long-form copy. Inherits font tokens and line-height from theme.</Paragraph>
```

## Code

Inline `<code>` with monospace font + subtle background.

```tsx
<Paragraph>
  Set <Code>NODE_ENV=production</Code> before running.
</Paragraph>
```

For block-level code, wrap a `<Code>` in a `<Box as="pre" overflow="auto">`.

## Kbd

Keyboard-key glyph — bordered, monospace, slightly padded.

```tsx
<Text>
  Press <Kbd>⌘</Kbd> + <Kbd>K</Kbd> to open.
</Text>
```

## Blockquote

Blockquote with a left border + muted colour.

```tsx
<Blockquote>Less is more. — Mies van der Rohe</Blockquote>
```

## See also

- [Text](./text) — the underlying primitive these wrap.
- [Theming](../guides/theming) — `fontSizes`, `fontWeights`,
  `fontFamilies`, `lineHeights` token shapes.
