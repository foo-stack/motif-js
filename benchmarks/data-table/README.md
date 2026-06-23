# `@usemotif-bench/data-table`

The adversarial cross-platform workloads — the three shapes where atomic-CSS
styling engines demonstrably crack. Each bench renders an identical tree across
motif, Tamagui, Stitches, and engine-free baselines, server-side, in jsdom.

Run them:

```sh
yarn workspace @usemotif-bench/data-table bench
```

## The workloads

| Bench          | Shape                                                     | Why it's adversarial                                                                                                                                                                                                                                                                               |
| -------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data-table`   | 100 rows × 12 columns = 1,200 styled cells, zebra-striped | Wide-and-shallow with one repeated declaration set per cell. A per-prop atomic engine re-derives and dedupes class atoms for every cell; this is the workload Tamagui's own issue [#3448](https://github.com/tamagui/tamagui/issues/3448) reports as 2.7–8.6× slower than RN / RNW.                |
| `deep-tree`    | A single 150-level nested chain of styled containers      | Narrow-and-deep. Isolates per-node mount cost where context reads, theme lookups, and style merges compound with nesting depth.                                                                                                                                                                    |
| `theme-switch` | 300 token-driven nodes rendered light → dark              | Motif references colours as `var(--colors-…)`, so both themes emit the same hashed rules and a switch swaps the root variable scope, not the per-node styles — the marginal cost is flat in the node count. An engine that bakes theme values into per-node atoms re-derives every node on switch. |

## Apples-to-apples constraints

- Identical render-tree shape per bench across every library.
- Visually equivalent output (same padding, borders, colours, zebra striping).
- Fresh per-request style context each iteration — motif resets its
  `SSRStyleCollector`, Stitches flushes via `getCssText()`, Tamagui's atoms
  dedupe globally and we measure the post-warmup steady state (what a real SSR
  app sees from the second request onward).

## Comparison rows

Each bench tells two stories at once:

- **Motif's own ladder** — `runtime` → `compiled-stripped` (the shape the
  progressive compiler emits once it replaces `<Box>` with the host element) →
  the engine-free `vanilla inline` / `vanilla CSS` floor.
- **Cross-library** — `Tamagui` and (where applicable) `Stitches`, so the docs
  performance guide can quote a "why motif over X on this workload" number.

## Scope

These are jsdom server-side-render benches — they measure style-resolution and
markup-generation cost, the portion of the work that is identical on web and
native. They are runnable in ordinary CI with no device. The published
real-device frame-timing numbers (iOS simulator + Android emulator) come from
the separate device-CI lane; this harness is the cross-library cost comparison
that lane cannot run (Tamagui/Stitches/RNW side by side).
