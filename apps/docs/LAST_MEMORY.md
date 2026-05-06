# motif-js docs site — LAST_MEMORY

> Single-paragraph summary of the most recent session, plus a precise pickup-point for the next one. Replace this file's body wholesale at the end of every session — it is not a log; the log lives in [PROGRESS.md](./PROGRESS.md). Always pair with [PLAN.md](./PLAN.md).

---

## Session: 2026-05-06 — second self-host experiment (6 variants, all reverted)

### What was done

Re-confirmed the async-Google-Fonts baseline at `/` mobile **89**, then ran six self-hosted variants against the same vorge preview + Lighthouse mobile preset. **Results** (all `/` mobile perf, baseline 89): A1 inline @font-face + 2 preloads + `font-display: optional` → 76 (-13); A2 async-loaded local `/fonts.css` via print/onload → 74 (-15); A3 Fraunces self-hosted only, Inter + JetBrains dropped for system stacks → 82 (-7); **A4** Fraunces-only axis-pinned subset (SOFT=50, wght 400-700, opsz 36-144; 121 KB → 59 KB latin via `fontTools.varLib.instancer`) → **86 (-3, best of the 6)**; A5 base64 the subset Fraunces inline as `data:` URI → 84 (-5; HTML body grows 80 KB, slows initial parse); A6 A4 + Inter axis-subset back unpreloaded → 82 (-7; Inter still competes). User direction: **revert all six.** Working tree restored to commit `b3feb4f` — `apps/docs/public/fonts/` removed, `plugins/fonts.ts` is the Phase-8-close async-Google-Fonts shape, no `theme/fonts.css`, no scratch tooling left under `/tmp`. Across the two self-host experiments (this one + the earlier "approach 1+2"), eight distinct delivery shapes have been ruled out for vorge's localhost HTTP/1.1 preview under Lighthouse mobile preset. The structural reason every variant lost: same-origin font fetches queue behind the critical CSS bundle on a single connection at 1.6 Mbps; cross-origin Google Fonts gets a separate parallel connection. Production CDN with HTTP/2 should change the balance, but that's a different measurement than localhost preview.

### Files touched this session

No code changes landed (working tree is clean back to `b3feb4f`). Only:

- `apps/docs/PROGRESS.md` — appended one new decisions log row covering the six-variant experiment.
- `apps/docs/LAST_MEMORY.md` — replaced (this file).

### Open questions / known gaps carried forward

1. **Self-hosting fonts is still structurally cleaner** (no third-party DNS, no GDPR third-party-cookie wrinkle, simpler offline dev), but only competitive with the Google Fonts baseline if the production deploy meets these conditions:
   - HTTP/2 (or HTTP/3) so font fetches multiplex with CSS rather than queueing.
   - `cache-control: public, max-age=31536000, immutable` on `/fonts/*` so warm-load is essentially free.
   - Lighthouse measured against the deployed URL, not localhost preview.

   Until those exist, the data says async-Google-Fonts wins. **A6 is the right answer to revisit when those conditions land** — Fraunces-only + axis-pinned subset (~59 KB latin) cost -3 perf locally; on a real CDN it should net positive.

2. **vorge#5 doc-layout hydration warning** is upstream. Watch the issue.
3. **Side-by-side visual screenshot diff** vs the reference's CSR React app remains the only outstanding sign-off item from Phase 8.
4. **Custom Shiki themes** still blocked on a vorge config-schema widening.

### What to do next session

PLAN's eight phases done. Next-session priorities, in rough leverage order:

1. **Wire a deploy target** — Cloudflare Pages, Netlify, or Vercel for `motif-js.dev`. Will produce a real (non-localhost) URL to point Lighthouse at; production scores will be the actual story.
2. **Once deployed, retry self-hosting against the deployed URL.** Per the conditions in #1 above. The A4 / A6 shapes are already worked out — `fontTools.varLib.instancer` + axis pin (SOFT=50, wght 400-700, opsz 36-144) is the trick.
3. **Watch [vorge#5](https://github.com/foo-stack/vorge/issues/5)**; bump vorge cohort when a fix ships and re-measure doc-page best-practices.
4. **Visual fidelity sign-off pass** — side-by-side vs the reference's CSR React app; v1.x point release.
5. **`/changelog` evolution** — sync against motif-js source as new versions ship via `docwright-mode-sync`.

### Watch-outs going forward

- **Don't run a third self-host experiment without changing the conditions first.** The decision log now has eight ruled-out shapes (two from the first experiment + six from this one). Each cost build-measure-revert cycles. The unblock is moving the measurement target off localhost preview to a real CDN, not trying a ninth shape.
- **A4's tooling is in `pip3 install --user --break-system-packages fonttools brotli` + `pyftsubset` + `fontTools.varLib.instancer`.** When/if we revisit, the recipe is documented.
- **The async-Google-Fonts plugin shape is committed at `b3feb4f`.** Any changes to `plugins/fonts.ts` should preserve the `<link rel="preload" as="style">` + `<link rel="stylesheet" media="print" onload="this.media='all'">` + `<noscript>` triplet — it's what produces the non-blocking critical-path behavior.
- **GDPR exposure of Google Fonts is real but practically marginal** for a v1 docs site. If a customer / legal review surfaces it, the A4 shape is ready to deploy.
