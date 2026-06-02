---
'@usemotif/compiler-swc': patch
---

Deduplicate aggregated virtual CSS across modules. `generateBundle` concatenated every module's extracted CSS with no cross-module dedupe, so a rule extracted in two modules (the common case for a shared design system) shipped twice. The `m-<hash>` scheme makes identical rule content produce an identical single-line rule, so the aggregate now collapses duplicate rule lines through a Set (first-occurrence order preserved). CSS was already idempotent, so this is a size win, not a behavior change.
