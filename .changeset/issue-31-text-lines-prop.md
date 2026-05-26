---
'@usemotif/react': minor
'@usemotif/react-native': minor
'usemotif': minor
---

Add `lines` prop to `Text` — a typed, cross-platform line-clamp surface. On web it emits the canonical single-line ellipsis triplet (`white-space: nowrap` + `overflow: hidden` + `text-overflow: ellipsis`) when `lines={1}`, or the `-webkit-line-clamp` set (`display: -webkit-box` + `-webkit-line-clamp: N` + `-webkit-box-orient: vertical` + `overflow: hidden`) when `lines>1`. On native it maps to `numberOfLines={N}` on the underlying RN `Text`. Replaces the per-consumer wrapper that web/native ports were authoring by hand.

```tsx
// One typed prop, cross-platform:
<Text lines={1}>This long string will truncate with an ellipsis.</Text>
<Text lines={2}>This wraps to two lines then clamps.</Text>
```

The line-clamp styles land via inline `style` on web, so consumer `style={{ … }}` overrides take precedence per-property — useful for opting out of an individual declaration on a specific instance.
