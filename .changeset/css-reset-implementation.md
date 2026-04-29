---
'@motif-js/reset': minor
---

**`@motif-js/reset` — opt-in CSS reset, fully implemented.**

The package was a stub; this fills it in with a normalize-style
reset audited against modern-normalize and Tailwind preflight.
Three ways to apply it, in increasing order of automatism:

```tsx
// 1. SSR-friendly React component (preferred):
import { MotifReset } from '@motif-js/reset';
<MotifReset />;

// 2. Imperative inject at startup (browser only, idempotent):
import { injectResetStylesheet } from '@motif-js/reset';
injectResetStylesheet();

// 3. Side-effect import that auto-injects:
import '@motif-js/reset/auto';
```

The reset is also available as a string (`RESET_CSS`) and an id
constant (`RESET_STYLE_ID`) for consumers who want to splice it
into their own stylesheet pipeline.

**Deliberate deviations from modern-normalize / Tailwind preflight
(documented in JSDoc):**

- No global `font-family: system-ui, sans-serif` default — motif
  themes own typography via `fontFamilies` tokens; an unconditional
  default would clobber theme-set body fonts on first paint.
- No global `text-decoration: none` on links — silent removal of
  underlines is a usability regression; opt in per-component via
  `<Link>` or a Box-level style prop instead.
- No `button { all: unset }` — strips too much (Safari focus rings,
  default form submission). Tailwind's per-property approach is
  preserved instead.

**Native is intentionally not covered.** React Native has no global
stylesheet to reset; the platform's defaults are the baseline.

The auto-inject sub-export (`@motif-js/reset/auto`) is marked in
`package.json#sideEffects` so bundlers don't tree-shake it; the
main entry (`@motif-js/reset`) stays side-effect-free for
tree-shake-safe imports of the named exports.

10 unit tests cover RESET_CSS shape, idempotent inject, ordering
within `<head>` (reset goes first so author CSS wins ties), the
`<MotifReset />` component, and the auto-inject side-effect path.
Bundle: 295 B gz total (well under the bumped 1.2 KB budget).
