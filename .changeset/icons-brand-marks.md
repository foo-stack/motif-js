---
'@motif-js/icons': minor
---

**Lucide brand marks — Twitter, LinkedIn, Facebook, YouTube, Instagram, Slack, Discord.**

Closes the "Lucide brand marks (T2.4 deferred)" entry. Lucide v1 moved its brand pack out of `lucide-react`, but motif's barrel needs to keep the most-recognised social marks available so consumers don't see breaking name removals between motif majors. Each is shipped as a hand-rolled `src/_extras/` entry — same pattern as the existing `Github` mark.

```tsx
import {
  Github,
  Twitter,
  Linkedin,
  Facebook,
  Youtube,
  Instagram,
  Slack,
  Discord,
} from '@motif-js/icons';

// Same `IconProps` surface as every other glyph — `size`, `color`,
// `strokeWidth` flow through.
<Twitter size={20} color="$colors.brand.500" />;
```

**What's added:**

- **`Twitter`** — original lucide v0.x bird mark (pre-rebrand). Apps targeting the post-rebrand "X" should pull a dedicated brand pack.
- **`Linkedin`** — rectangle + small "in" pictogram (lucide v0.x).
- **`Facebook`** — single-stroke "f" (lucide v0.x).
- **`Youtube`** — rounded rectangle + play triangle (lucide v0.x).
- **`Instagram`** — outline + lens + indicator dot (lucide v0.x).
- **`Slack`** — four-rectangle hash (lucide v0.x).
- **`Discord`** — simplified single-stroke "speech bubble with eyes" mark; hand-rolled, public-domain. Discord was never in lucide proper but is one of the most-requested chat-app brand marks; carried here for parity with Slack.

All paths are MIT-licensed (lucide v0.x) or public-domain (Discord). The generator picks up `.tsx` files in `_extras/` automatically and the index re-export was regenerated; no further wiring needed.

**Surfaces unchanged:** every glyph still goes through `<Icon>` so `IconProps` (size, color, strokeWidth, render-customisation, accessibility) flow through identically. Bundle: each brand-mark file is ~600–900 bytes raw source — well under the 4 KB-per-glyph ceiling the generator-output test enforces. Apps that don't import the brand marks tree-shake them out entirely.

Total tests: 1,083 → 1,084 passing (+1 brand-marks resolution test). The icon barrel lands at 1,939 glyphs total (1,932 generated + 7 hand-rolled extras: Github + the 6 brand marks above + Discord).
