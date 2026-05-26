---
'@usemotif/core': patch
'@usemotif/react': patch
'@usemotif/react-native': patch
'usemotif': patch
---

Add the `background-*` family — `background`, `backgroundImage`, `backgroundPosition`, `backgroundRepeat`, `backgroundSize`, `backgroundOrigin`, `backgroundClip`, `backgroundAttachment`, `backgroundBlendMode` — to the typed style-prop surface. Previously accepted by TypeScript via the `HTMLAttributes` widening but silently dropped at runtime, so gradient fills couldn't be authored without the `style={{ … }}` escape hatch. Pure pass-through (CSS-function-string values); no scale in v1.
