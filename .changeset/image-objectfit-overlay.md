---
'@usemotif/react': patch
---

Fix `Image` dropping `objectFit`/`objectPosition` when a `placeholder` or `fallback` is set. In the overlay path those props were spread onto the wrapper Box (where they have no effect) instead of the inner `<img>`, so `objectFit="cover"` alongside a placeholder — the component's own docstring example — silently did nothing. Image-presentation props are now forwarded to the inner `<img>`.
