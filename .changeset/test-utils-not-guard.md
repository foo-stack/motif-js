---
'@usemotif/test-utils': patch
---

`toHaveStyle` / `toHaveStyleAt` now throw when `received` is not a `RendererOutput`, instead of returning `{ pass: false }`. Under `expect(x).not.toHaveStyle(...)`, vitest inverts `pass`, so a malformed or `undefined` `received` previously made the negated assertion pass — laundering a "you passed the wrong thing" guard into a green test. Throwing fails the assertion regardless of negation.
