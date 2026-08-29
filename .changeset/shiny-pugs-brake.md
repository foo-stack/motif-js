---
'@usemotif/headless': patch
'@usemotif/ui': patch
---

Keep `'use client'` in the published output of `@usemotif/headless` and
`@usemotif/ui`.

Both packages carry the directive on their source files, but neither tsup config
restored it after bundling, so it was absent from every `dist` artifact that
shipped. Importing either package from a React Server Component failed the build
rather than crossing a client boundary.

```
Import traces:
  Server Component:
    ./node_modules/@usemotif/headless/dist/index.js
    ./app/page.tsx
```

Only the barrel needs the directive. Both packages export a single `"."` entry,
so the per-component entries and shared chunks below it cannot be addressed by a
consumer, and the boundary the barrel declares covers everything reached through
it.

`yarn verify:publish` now reads each published entry back out of its tarball and
fails when a client entry is missing the directive, when a server or native entry
carries one it should not, or when an exports entry has not been classified at
all. Adding a subpath export is therefore a deliberate decision rather than a
silent regression.

Note one limitation this does not remove: compound components exported as an
object namespace (`Dialog`, `Popover`, `Menu`, and the rest) still cannot be
rendered directly from a Server Component, because a client reference exposes
named exports and `Dialog.Root` resolves to `undefined`. Use them from your own
`'use client'` component.
