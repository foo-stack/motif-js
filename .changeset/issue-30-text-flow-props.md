---
'@usemotif/core': patch
'@usemotif/react': patch
'@usemotif/react-native': patch
'usemotif': patch
---

Add the text-flow style props — `whiteSpace`, `wordBreak`, `overflowWrap`, `hyphens`, `textOverflow` — to the typed style-prop surface. Previously rejected at the type level and silently dropped at runtime; the canonical single-line ellipsis triplet `whiteSpace: 'nowrap' / overflow: 'hidden' / textOverflow: 'ellipsis'` now flows through the resolver. Enum-string passthrough, no scale.
