---
'@usemotif/headless': minor
---

Make `Dialog` renderable from a React Server Component.

A client reference is a proxy that exposes named exports and nothing else, so
reaching through one never worked: `Dialog.Root`, where `Dialog` was an object
the client module exported, resolved to `undefined` and the render failed with
an invalid element type. The workaround was to wrap every use in a Client
Component.

The package now ships two graphs. `dist/index.js` is the entry and carries no
`'use client'` directive, so a Server Component can import it. Every component
lives in an internal chunk that does carry the directive, and the entry
re-exports from it, which means each name arrives already a client reference.
`Dialog` is then assembled in the entry out of six of those, so every property
of it is a valid element type on either side of the boundary.

Nothing is added to or removed from the public surface, and `Dialog.Root` stays
the only documented way to reach a part. The flattened parts the entry builds
from are internal and are not exported.

The remaining compound components still have the old shape and still have to be
used from a Client Component. They are converted next.

Consumers importing the package from a Client Component are unaffected.
