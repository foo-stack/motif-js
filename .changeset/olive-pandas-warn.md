---
'@usemotif/react': patch
---

Warn in development when `cssLayer` is set but nothing ever declares where that
layer sits.

Layer order is decided by first occurrence, and motif deliberately emits no
order statement, so a layer no stylesheet names is appended last. Motif then
outranks every layered stylesheet, which is the opposite of why `cssLayer` is
set, and the rendered output gives no sign of it.

The check reads `@layer` statements out of `document.styleSheets` after mount
and stays quiet whenever the answer is unknown rather than negative: a
cross-origin stylesheet throws on `cssRules` and might carry the statement, and
a document with no readable stylesheets yet may still be loading. A statement
naming a root layer counts for its sub-layers, so `@layer motif, app;` covers
`cssLayer="motif.base"`. It warns once per layer name and compiles out of
production builds.

The cascade-layer guide is corrected in the same release. The ordering it
previously documented could not work alongside Tailwind v4, and the obvious
correction silently dropped padding and margin.
