---
'@usemotif/core': patch
---

Two small correctness fixes. `parseResponsiveDSL` now coerces a value to a number only when the round-trip is lossless (`String(Number(raw)) === raw`), so DSL values like `md:09`, `md:050`, or `md:1.50` stay strings — matching the object/array syntaxes and preserving string token-key segments. Color interpolation now decides `rgb()` vs `rgba()` on the rounded alpha string, so an interpolated alpha of `0.9999` collapses to `rgb(…)` instead of emitting a fully-opaque `rgba(…, 1)`.
