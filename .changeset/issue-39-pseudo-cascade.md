---
'@usemotif/react': patch
'usemotif': patch
---

Fix the pseudo-state override cascade on `<Box>`. Previously, any base style prop emitted as **inline style** (specificity `1,0,0,0`) while pseudo-state rules emitted as `.class:state` (`0,1,1`) — inline always won, so declarations like `_disabled={{ boxShadow: 'none' }}` over a base `boxShadow="…"` never took effect. The bug was easy to miss because it bites the first prop a designer wants to *kill* on a disabled / hovered / active surface (drop shadows, gradient fills) but is silent on `bg` and `color` only when the values happen to look indistinguishable.

The fix: when a state-pseudo bag (`_hover`, `_focus`, `_active`, `_disabled`, `exitStyle`) overrides a base style prop, the base value is now lifted from inline style into the base class block (`.<class> { … }`, specificity `0,1,0`). The pseudo rule at `0,1,1` now wins per the spec.

Pseudo-element rules (`::before` / `::after`) are NOT lifted — they target a different element and never compete with the parent's inline style.

**SSR note**: consumers using `renderToString` / `renderToStaticMarkup` need an `SSRStyleCollector` in scope for class-block CSS to appear in the rendered HTML. This was already true for responsive props; it now extends to any Box with pseudo bags.
