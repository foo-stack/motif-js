---
'@motif-js/icons': minor
---

**Icons v2 — generator-driven, lucide-backed, 1,932 glyphs.**

Replaces the 81 hand-rolled icon files with a code-generation
pipeline that reads lucide-react's icon-node data and emits motif
glyph wrappers. Same `<Icon>` API, same render-prop / `currentColor`
size + colour inheritance — every existing call site keeps working,
the new set is just much wider.

```tsx
import { Check, Heart, Activity, Settings, /* …1,928 more */ } from '@motif-js/icons';

<Heart size="lg" />              // 24px
<Heart color="red" />            // currentColor cascades
```

- **1,932 glyphs** generated from `lucide-react@1.14.0`. Names match
  lucide's PascalCase 1:1, so the existing 81 motif glyph names
  (`Check`, `X`, `Menu`, `Settings`, …) all continue to resolve.
- **Pixel-identical to lucide** — paths come straight from lucide's
  `__iconNode` arrays, not the previous hand-adapted versions.
  Stroke style, viewbox, and dimensions match lucide's sources.
- **Cross-platform preserved** — each glyph renders through motif's
  own `<Icon render={({ Path, Line, … }) => …}>` primitive, so the
  same source works on web AND React Native (the SVG primitives
  swap under the hood). No lucide runtime dep at consumer build
  time — `lucide-react` is a generator-time devDep only.
- **Tree-shake-safe** — `sideEffects: false` + per-icon barrel
  re-exports → consumers pay only for what they import. The
  package's `dist/index.js` barrel is large (~96 KB gz) because
  it carries all 1,932 icons; real consumers tree-shake to
  ~100 B gz per imported icon.
- **`Github` extra** — lucide v1.x dropped brand marks; the
  `Github` glyph is preserved as a hand-rolled `_extras/` entry
  with the original lucide path data so existing imports don't
  break. Future hand-rolled additions go in the same directory and
  the generator picks them up automatically.
- **`Infinity` skipped** — lucide ships `infinity`, but the
  PascalCase `Infinity` shadows the JS global and is rejected by
  the linter. Drop down to `<Icon render={...}>` if you need it.

**Build script**: `yarn workspace @motif-js/icons generate` reads
lucide-react from the workspace's `node_modules` and rewrites
`src/glyphs/` + `src/index.ts`. Idempotent — re-run after a
lucide-react version bump. Hand-rolled `_extras/` are preserved.

**Bundle size**: the per-package budget for `@motif-js/icons` is
bumped from 1.2 KB to 120 KB to reflect the full barrel; the
relevant consumer-side metric (~100 B gz per imported icon, after
tree-shaking) is documented in `.size-limits.json` as a comment.
8 unit tests cover render correctness, the backward-compat name
set, the per-glyph source-size cap (4 KB raw / file), and barrel-
index integrity (every glyph file has a matching export).
