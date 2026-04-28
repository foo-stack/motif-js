# Responsive props

Every motif style prop accepts three shapes for responsive values. Each
shape resolves through the same engine; you can mix and match.

## Object syntax

The canonical form. Keys are `base` (unconditional) plus any breakpoint
name (`sm`, `md`, `lg`, `xl`, `2xl`).

```tsx
<Box p={{ base: '$2', md: '$4', lg: '$6' }} />
```

Container-query variants:

- `@<bp>` — anonymous container query against the nearest container ancestor.
- `@<name>.<bp>` — named container query against `<Container name="...">`.

```tsx
<Box p={{ base: '$2', '@card.md': '$8' }} />
```

## Array syntax

Positional shorthand. Slot 0 is `base`; subsequent slots map to
`sm`, `md`, `lg`, `xl`, `2xl` in order. Sparse OK; trailing slots dropped.
Media-query only.

```tsx
<Box p={['$2', '$4', '$6']} />
```

## String DSL

Space-separated `<key>:<value>` pairs. Inherits container-query support
from the object form.

```tsx
<Box p="base:$2 md:$4 @card.lg:$8" />
```

## Cascade order

Within each prop, motif emits at-rules in this order:

1. **Media queries**, mobile-first (sm → 2xl).
2. **Anonymous container queries**, mobile-first.
3. **Named container queries**, alphabetical by name.

Container rules win over media rules at the same breakpoint — matches the
"local container is more specific" mental model.
