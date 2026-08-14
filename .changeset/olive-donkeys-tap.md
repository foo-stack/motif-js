---
'@usemotif/react': patch
'@usemotif/recipes': patch
'@usemotif/ui': patch
---

Declare internal peer dependencies as `workspace:^` rather than `workspace:*`.

Changesets resolves `workspace:*` to the dependency's _exact_ current
version, so any minor bump left the declared peer range and escalated every
peer dependent to a major — which the fixed version group then carried to all
17 packages. A single minor changeset produced a major release for the whole
suite, and `onlyUpdatePeerDependentsWhenOutOfRange` could not prevent it.

`workspace:^` resolves to `^<version>`, which a minor still satisfies, so
minors stay minors. Genuine major bumps still propagate. Publish output is
unchanged: both ranges are rewritten to concrete versions at publish time.

Fixes #321
