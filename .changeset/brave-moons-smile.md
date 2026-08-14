---
'@usemotif/core': patch
---

Resolve token keys that contain a dot, so the half-step spacing tokens work.

`resolveToken` split a `$`-path on `.`, so `$space.1.5` looked up
`space['1']['5']` and found nothing. The default `space` scale ships `0.5`,
`1.5`, `2.5` and `3.5` (and `sizes` spreads them), so those four values were
emitted as CSS variables and visible in the scale but unreachable by the
syntax every other token uses — the declaration was simply dropped.

This affected Motif's own primitives, not just consumer code: `Field` and the
typography components use `gap="$1.5"` and `px="$1.5"`, and rendered with no
gap or padding on both web and native.

Adjacent all-digit segments are now merged into a single decimal key, and
`tokenRefToCssVar` applies the same rule so the emitted `var(--space-1_5)`
matches the name in the theme block. The merge runs only after the plain
segment walk finds nothing, so every path that resolved before resolves to
the same value now.

Fixes #318
