# Container queries

motif treats container queries as a first-class peer to media queries. Every
responsive shape (object, array, DSL) accepts container-query keys; the
runtime resolver and the static compiler both handle them.

## On web

`<Container>` sets `container-type: inline-size` and (optionally)
`container-name`. Children's container-query keys (`@<bp>` or `@<name>.<bp>`)
generate `@container` rules.

```tsx
<Container name="card">
  <Box flexDirection={{ base: 'column', '@card.md': 'row' }} p={{ base: '$3', '@card.lg': '$6' }} />
</Container>
```

## On native

RN doesn't support real container queries. motif polyfills via `View.onLayout`:
`<Container>` measures itself and exposes the width through React context.
Children re-resolve their responsive props when the container's width changes
across a breakpoint.

The polyfill's re-measure rate is rate-capped (default 16ms = 1 frame). Pass
`rateCapMs={0}` to opt out for content that should track every layout pass,
or `rateCapMs={100}` for low-power scrolling lists.
