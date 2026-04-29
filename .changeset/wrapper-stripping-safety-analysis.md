---
'@motif-js/compiler-core': minor
'@motif-js/compiler-babel': patch
---

**Wrapper stripping — centralised safety analysis with the full
bail-out list.**

Adds `analyzeStripSafety()` to `@motif-js/compiler-core` — a
dedicated module that decides whether a fully-static motif primitive
call site can be safely rewritten to its underlying lowercase HTML
element. The Babel plugin (`@motif-js/compiler-babel`) now delegates
strip-safety decisions to this module instead of inlining ad-hoc
checks.

```ts
import {
  analyzeStripSafety,
  classifyJsxAttributes,
  getPrimitiveInfo,
} from '@motif-js/compiler-core';

const primitive = getPrimitiveInfo('Box')!;
const analysis = classifyJsxAttributes(opening.attributes, scope, primitive);
const safety = analyzeStripSafety(opening, parentJsxElement, primitive, analysis);
if (safety.safe) {
  // rewrite <Box> → <div>
} else {
  // safety.bailReason: 'has-spread' | 'ref-attribute' | …
}
```

**Bail-out list** (each is a stable identifier on the `BailReason`
type — match on these in downstream tooling for diagnostics):

- `not-strippable` — primitive owns runtime logic the compiler hasn't
  replicated yet (Pressable's pseudo-state handling, Image's
  load/error overlay tree).
- `has-spread` — `{...spread}` may carry a `ref`, an event handler
  with custom semantics, or anything else that would break stripping.
- `non-static-classification` — at least one style prop is dynamic.
- `as-attribute` — user explicitly asked to render a different
  element.
- `ref-attribute` — function components don't forward refs unless
  they use `forwardRef`; stripping would change the ref target's
  identity. Conservative bail.
- `function-as-child` — `<Box>{(s) => …}</Box>`. Lowercase HTML
  elements can't render functions; React would error.
- `blocked-prop:<name>` — primitive-specific prop in
  `nonStrippableProps` was set (e.g. Pressable's `_hover`,
  `onPress`).

**Two new bail-outs added in this pass: `ref-attribute` and
`function-as-child`.** Previously, `<Box ref={r} p={4} />` would
have stripped to `<div ref={r} style={{padding:4}} />`, which works
on `<div>` but breaks the contract that stripping is invisible to
the caller (Box itself doesn't `forwardRef` so the ref target wasn't
defined before; arguably stripping fixed broken code). The
conservative call is to leave these alone.

**Bench (200-row SSR list of boxes)**:

- vanilla inline: 2,655 Hz
- **motif compiled-stripped: 2,388 Hz (89.9% of vanilla — within the
  10% target band)**
- motif compiled (pre-strip shape): 1,753 Hz
- motif runtime: 1,031 Hz (above the 1,000 Hz floor)
- Stitches: 1,028 Hz
- Tamagui (no optimizer): 38.6 Hz

14 new tests in `compiler-core/src/safety-analysis.test.ts` covering
all bail-out cases + safe cases, plus 4 new strip-related tests in
`compiler-babel/src/index.test.ts` for the new bail-out conditions.

Bundle: `@motif-js/compiler-core` 3.2 → 3.5 KB gz; budget bumped
from 3.4 KB → 4.4 KB to cover the new module.
