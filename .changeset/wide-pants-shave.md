---
'usemotif': patch
---

Stop publishing `workspace:*` dependency ranges to npm.

`changeset publish` shells out to `npm publish`, which ships Yarn's
workspace protocol into the registry verbatim, so every install of an
affected package failed with `Workspace not found`. The hand publish path
already rewrote those ranges to concrete versions; the CI path did not, and
1.2.2 and 1.2.3 went out through it. Both paths now share one conversion
(`scripts/workspace-protocol.mjs`), and `yarn verify:publish` packs every
package and asserts no `workspace:` range survives into the tarball.

`peerDependencies` were affected as well as `dependencies` — `@usemotif/ui`
shipped `usemotif: workspace:*` as a peer.

Fixes #327
