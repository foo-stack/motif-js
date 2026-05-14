---
voice_profile: motif-essayistic
sampled_pages:
  - apps/docs/content/getting-started/introduction.mdx       # tutorial
  - apps/docs/content/getting-started/installation.mdx       # howto
  - apps/docs/content/concepts/tokens.mdx                    # explanation
  - apps/docs/content/concepts/theming.mdx                   # explanation
  - apps/docs/content/concepts/responsive.mdx                # explanation
  - apps/docs/content/recipes/buttons.mdx                    # howto
  - apps/docs/content/reference/styled.mdx                   # reference
  - apps/docs/content/guides/performance.mdx                 # howto
generated: 2026-05-15
generator: docwright-voice-mirror
---

# motif voice card

## Hard rules

```yaml
person: 2nd-sparing-mixed              # "you" used when instructional ("Drop a <Box>"). Otherwise impersonal ("Motif resolves...", "A theme is...").
tense: present                          # imperative for step instructions only ("Install", "Mount", "Open the page")
formality: neutral-precise              # educated, not stuffy; never casual; never academic
sentence_length:
  median_words: 15
  range: [3, 30]
  cadence: aphoristic-then-explanatory  # short declarative sentences open paragraphs, longer ones extend
code_prose_ratio:
  tutorial: 0.45
  howto: 0.6
  reference: 0.7
  explanation: 0.3                      # essayistic; concepts pages are prose-heavy
hedge_words: avoided                    # no "probably / maybe / might / should / we recommend / it's worth"
marketing_adjectives: avoided           # never "simple / easy / powerful / blazing / seamlessly / leverage / robust / delightful / elegant / intuitive / modern"
contractions: used-moderately           # "doesn't / isn't / you're / it's / that's" — present, not casual
oxford_comma: yes                       # consistent
em_dashes: liberal                      # mid-sentence pivots, asides, summary clauses — em dashes are a hallmark
british_spellings: yes                  # "colour / colours / behaviour / organise / authorise" — distinctive choice
numbers_as_text_in_prose: small         # "three responsive syntaxes", "two renderers"; numerals for measurements
heading_style: sentence                 # never title case. Often aphoristic ("Tokens are values", "Switches are attribute swaps")
list_style: bullets-with-bold-leadins   # `- **Atomic deduplication.** Every unique style bag…`
```

## Signature phrasings (prefer when natural)

These are the rhetorical fingerprints. Reach for them when they fit; don't force.

- "**X is Y**" as a paragraph or section opener ("A token is a named value", "Tokens are values", "Themes share the same primitive layer", "Switches are attribute swaps").
- "**X is how Y**" mechanical/factual formulation ("That path is how the rest of the library refers to the value", "The cascade is how a theme switch happens").
- "**The X is the Y one**" parallelism for trade-offs ("The web path is the cheap one", "The runtime is the slow path").
- "**Same X, two Y**" / "**One tree, two renderers**" — paired-thing pattern for cross-platform / dual-renderer / dual-mode framings.
- "**That is the only Y**" — declarative narrowing of scope ("That is the only mounting step", "The collector is the only SSR-specific surface").
- "**Three steps: X, Y, Z.**" — colon-and-list Lede pattern.
- "**You'll reach for X when**" / "**Reach for X when**" — placement-in-the-ecosystem phrasing.
- "**The interesting part is what's underneath**" — closing pivot toward concepts.
- "**The pattern that costs you on motif is the pattern that costs you elsewhere**" — orientational claim before practical advice.
- Parallel conditionals: "**If X, ... . If A, ...**" — for branching guidance.
- "**X carries Y**" — for contracts/responsibilities ("Pressable carries the interactive contract", "Box carries the style-prop pipeline").

## Forbidden words

Never emit. The existing docs visibly avoid all of these.

```
simple, simply, easy, easily, easier (when describing the library/its use)
powerful, robust, production-grade
blazing, lightning-fast, blazing-fast
seamlessly, magically, automagically, just-works
leverage (use "use")
delightful, elegant, intuitive
modern, next-generation, cutting-edge
out of the box, out-of-the-box
boilerplate (only when literally meant)
just (as condescending "just do X")
obviously, clearly, of course
basically, essentially (filler)
best practices (use "the standard pattern" or "the pattern")
kind of, sort of, somewhat
quite, very, really (intensifier filler)
```

## Page opening sequence

Every prose page starts with this scaffold. Order is fixed.

```mdx
---
title: <Title>
description: <One-sentence; appears in social cards + meta tags>
diataxis: <tutorial | howto | reference | explanation | migration | adr | changelog | readme>
covers: [<symbols this page is the canonical home for>]
last_verified: <YYYY-MM-DD>
---

import { ArticleMeta, Callout, CodeBlock, Eyebrow, Lede } from '../../components/index.js';

<Eyebrow><Section></Eyebrow>

# <Title>

<Lede>
  <One to three sentences. Aphoristic. The Lede is the page's thesis, not a teaser.>
</Lede>

<ArticleMeta />

## <First H2 — the most fundamental concept or step>
```

For reference pages: replace the post-`<Lede>` block with `<ApiSignature>` containing `name`, `status`, `signature`, `params`. Put `<ArticleMeta />` *after* the signature block.

## Page closing sequence

Almost every page closes with a single `<Callout>` linking 1–2 related pages.

```mdx
<Callout variant="info" title="Where to next">
  [<Page A>](/path/a) covers <one-line description>.
  [<Page B>](/path/b) covers <one-line description>.
</Callout>
```

Variants: `info` for orientation, `tip` for a callout-in-passing, `warning` for caveats. Never decorative.

## Code blocks

Always via the `<CodeBlock>` MDX component — never raw fenced code in source.

```mdx
<CodeBlock lang="tsx" code={`...`} />
<CodeBlock filename="App.tsx" lang="tsx" code={`...`} />
<CodeBlock
  tabs={[
    { label: 'npm', code: 'npm install usemotif', filename: 'terminal' },
    { label: 'pnpm', code: 'pnpm add usemotif', filename: 'terminal' },
    { label: 'yarn', code: 'yarn add usemotif', filename: 'terminal' },
    { label: 'bun', code: 'bun add usemotif', filename: 'terminal' },
  ]}
/>
```

`lang` is always `tsx`, `ts`, `bash`, or `css`. Multi-line code uses backticked template literals. Always include `filename=` when the snippet represents a real project file.

## Per-quadrant register

The voice card constants stay constant across quadrants. The *register* (depth, code:prose ratio, length) shifts by Diataxis quadrant.

| Quadrant | Register | Reach-for moves |
|---|---|---|
| **Tutorial** | warm, second-person sparingly, end-to-end | "Three steps:", "Open the page", "You should see…" |
| **How-to** | terse, recipe-shaped, instruction-first | "Wrap X with Y", "Add Z when…", "Strip the bg once intents own them" |
| **Reference** | dense, neutral, complete | `<ApiSignature>`, prop tables, "Returns…", "Throws…" |
| **Explanation** | essayistic, low code:prose ratio, comparative | "A token is a named value", "Two layers, one tree", "Same model, two renderers" |

## Cross-platform calls

For motif specifically, every component-page section that describes per-platform divergence uses the **"X is Y on web; X is Z on native"** pattern. Examples from existing prose:

- "On web, motif emits each leaf as a CSS custom property. On native, the same tree lives in memory."
- "Set `data-theme='dark'` on the wrapper. … Update the `active` prop. The provider re-reads from the in-memory token tree."

Never "on the web side" or "the web version" — it's always "on web" / "on native".

## What this voice card overrides

When a docwright doc-type skill's house style conflicts with this card:

- `forbidden_words` always win.
- The opening-sequence scaffold (Eyebrow / Lede / ArticleMeta) is mandatory.
- Heading style is sentence case — overrides any title-case defaults.
- British spellings — overrides US English defaults.
- Em dashes are encouraged — overrides any "minimize em dash" defaults.
