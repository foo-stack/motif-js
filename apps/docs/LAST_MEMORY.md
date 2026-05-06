# motif-js docs site — LAST_MEMORY

> Single-paragraph summary of the most recent session, plus a precise pickup-point for the next one. Replace this file's body wholesale at the end of every session — it is not a log; the log lives in [PROGRESS.md](./PROGRESS.md). Always pair with [PLAN.md](./PLAN.md).

---

## Session: 2026-05-06 — post-Phase-8 polish (font self-host attempt + vorge issue)

### What was done

**Self-hosting Fraunces / Inter / JetBrains Mono attempted, then reverted on user direction after measurement showed it slowed mobile Lighthouse vs. the async-Google-Fonts baseline.** Downloaded 10 latin/latin-ext woff2 files (488 KB total, 169 KB critical-path) into `apps/docs/public/fonts/`, ported the @font-face block, tried two delivery shapes (Vite-bundled `theme/fonts.css` and inlined `<style>` via `head-extras`-style HTML transform), with and without `<link rel="preload" as="font">`. Best self-hosted run: `/` perf 75, `/concepts/tokens` perf 74. Phase-8-close baseline (async-Google-Fonts): `/` 90, `/concepts/tokens` 87. Same-origin self-hosting queues fonts behind the critical CSS bundle on vorge preview's HTTP/1.1 connection under Slow 4G; the cross-origin Google Fonts URL gets a separate connection and parallelizes. Self-hosting will almost certainly win in production behind an HTTP/2 CDN with proper cache headers, but on the local preview measurement it lost by ~15 perf points. **Reverted everything**: `apps/docs/public/fonts/` removed, `plugins/fonts.ts` restored to the Phase 8 close (preload + async-CSS for Google Fonts URL), no `theme/fonts.css`. Working tree is clean back to commit `ff29fee`. Then **filed [vorge#5](https://github.com/foo-stack/vorge/issues/5)** for the React-19 hydration warning on doc-layout pages — reproduction shape + ruled-out causes + three investigation hypotheses for the maintainer.

### Files touched this session

No code changes landed. Only:

- `apps/docs/PROGRESS.md` — appended two post-Phase-8 decisions log entries (the self-host experiment + the vorge#5 filing).
- `apps/docs/LAST_MEMORY.md` — replaced (this file).

### Open questions / known gaps carried forward

1. **Self-hosting fonts is the right answer in production**, just not on vorge's localhost HTTP/1.1 preview server. If/when we want to revisit:
   - Ship behind a CDN with HTTP/2 and `cache-control: max-age=31536000` for `/fonts/*`.
   - Re-measure Lighthouse against the deployed URL, not localhost preview. Production scores will be different.
   - The download/manifest script lives in this session's bash history if needed; the @font-face block + plugin shape was reasonable.
2. **vorge#5 doc-layout hydration warning** is now upstream. Watch the issue; once a fix lands in a vorge `1.1.x` cohort, bump and re-measure doc-page best-practices (should go 96 → 100).
3. **Real-network Lighthouse scores will be substantially better than the localhost-preview numbers logged in PROGRESS.** Don't quote 90/87 in marketing copy — those are mobile Slow-4G with cold-cache. Real users on cable / 4G LTE see scores in the high 90s.
4. **Side-by-side visual screenshot diff** vs the reference's CSR React app remains the only outstanding sign-off item from Phase 8. Inherently human-eye work; treat as a v1.x point-release follow-up.
5. **Custom Shiki themes** still blocked on a vorge config-schema widening (separate from vorge#5).

### What to do next session

The PLAN's eight phases are done; the docs site is shippable. The natural next steps, in rough leverage order:

1. **Wire a deploy target** — Cloudflare Pages, Netlify, or Vercel for `motif-js.dev`. Will validate the production Lighthouse story (real-world scores should be in the 90s) and unblock the rest of the v1 ecosystem.
2. **Watch [vorge#5](https://github.com/foo-stack/vorge/issues/5)**; bump vorge cohort when a fix ships and re-measure.
3. **Visual fidelity sign-off pass** against the reference's CSR React app. Side-by-side at desktop + mobile viewports; file fix-tasks for any drift > 4px / > 2 hex-units.
4. **`/changelog` evolution** — sync against motif-js source as new versions ship via `docwright-mode-sync`.

### Watch-outs going forward

- **Vorge preview is HTTP/1.1.** Any future perf experiment that depends on connection-multiplexing (HTTP/2 push, prioritized fetches, parallel same-origin requests) won't reflect production reality on localhost preview. Run Lighthouse against the deployed staging URL once one exists.
- **`apps/docs/.lighthouse/` is gitignored** — old reports from the failed self-host experiment are still on disk locally. Safe to delete.
- **Don't conflate localhost-preview scores with production-CDN scores.** The cache-insight in Phase 8's reports flagged ~600 KiB of "savings from caching" — that's because vorge preview returns no `cache-control`. Production CDN will set those headers and Lighthouse re-runs will jump.
- **The Google Fonts approach has a real GDPR / third-party-cookie wrinkle** in some jurisdictions (the EU has fined sites for using Google Fonts without a Data Processing Agreement). If that becomes a deploy-blocker, self-hosting wins on legal grounds even if it loses on Lighthouse-localhost. Re-run the experiment on the production CDN before committing either way.
- **vorge#5 may be a vorge `1.1.x` patch** rather than a major. When upgrading, run the Lighthouse pass on doc pages to confirm the warning is gone before bumping the docs site's pinned vorge versions.
