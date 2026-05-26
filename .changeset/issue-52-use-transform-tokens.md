---
'@usemotif/core': minor
'@usemotif/react': minor
'@usemotif/react-native': minor
'usemotif': minor
---

`useTransform` now resolves `$...` token references in its output range against the active theme at hook setup, so theme-aware color interpolation works directly without a manual `resolveToken` hop.

```tsx
const heroColor = useTransform(scrollYProgress, [0, 1], [
  '$colors.brand.red',
  '$colors.brand.blue',
]);
```

- Token entries resolve to their literal theme values (`#ff0000` etc.); literal colors / unit strings / numbers pass through unchanged.
- Unresolved tokens (typo, no theme in scope) pass through as the raw `$…` string and fall into the existing step-function fallback.
- Resolved range is cached against `(outputRange identity, theme identity)`, so the classifier only walks the range when either flips.
- Adds `resolveOutputRangeTokens(outputRange, theme)` to `@usemotif/core` as the shared helper.
