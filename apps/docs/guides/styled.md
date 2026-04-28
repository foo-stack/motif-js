# `styled()` factory

When you need named, variant-driven components but don't want to maintain
all the wiring by hand, motif's `styled()` factory takes a base element
plus a configuration object and returns a typed React component.

```tsx
import { styled } from '@motif-js/react';

const Tag = styled('span', {
  base: {
    px: '$2',
    py: '$1',
    borderRadius: '$full',
    fontSize: '$xs',
    fontWeight: '$semibold',
  },
  variants: {
    intent: {
      success: { bg: '$colors.action.success.bg', color: '$colors.action.success.fg' },
      danger: { bg: '$colors.action.danger.bg', color: '$colors.action.danger.fg' },
      info: { bg: '$colors.surface.muted', color: '$colors.text.default' },
    },
    size: {
      sm: { fontSize: '$xs', px: '$1.5' },
      md: { fontSize: '$sm', px: '$2' },
    },
  },
  compoundVariants: [{ intent: 'success', size: 'md', css: { fontWeight: '$bold' } }],
  defaultVariants: { intent: 'info', size: 'md' },
});

<Tag intent="success">Saved</Tag>
<Tag intent="danger" size="sm">Deleted</Tag>
```

`styled()` is fully typed: variant props become typed required-or-optional
based on `defaultVariants`. Boolean variants (with keys `'true'` / `'false'`)
accept native booleans for ergonomics.

For a flagship interactive component, prefer `Button` (which ships its own
variant matrix). `styled()` is for the cases where you want a custom
component that fits naturally into your design system.
