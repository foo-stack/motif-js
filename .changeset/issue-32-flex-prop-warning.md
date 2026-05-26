---
'@usemotif/react': patch
'usemotif': patch
---

Add a dev-only warning when a `<Box>` has flex- or grid-only style props (`flexDirection`, `alignItems`, `gap`, …) set without an explicit `display="flex"` (or `inline-flex` / `grid` / `inline-grid`). `<Box>` defaults to `display: block`; in that mode the flex / grid props land on the element but have no effect — until now the only signal was the visual. Tolerates responsive `display` objects and arrays: if any breakpoint resolves to flex / grid, the warning skips. Dedups by `(elementType, sorted-triggering-props)` so re-renders don't flood the console. Tree-shakes in production.
