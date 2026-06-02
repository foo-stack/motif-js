---
"@usemotif/core": patch
---

Escape emitted CSS values to close two style-injection holes. `themeToCssBlock` now escapes custom-property values (not just the theme name), so a token value containing `}`/`;`/`<` — common when tokens come from imported design-token JSON — can no longer break out of the rule block or the surrounding `<style>` element. The shared `stringifyDeclarations` (used by the web runtime, the compiler, and `@keyframes`) escapes values the same way, keeping runtime and compiler output byte-identical. `@font-face` `src`/`format`/`tech` and the freeform descriptors are likewise escaped to prevent `url('…')` quote-breakout. Legitimate values are unchanged and render identically.
