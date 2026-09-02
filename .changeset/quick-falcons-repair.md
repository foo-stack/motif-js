---
'@usemotif/compiler-web': patch
'@usemotif/headless': patch
---

Stop `@usemotif/compiler-web` advertising a CommonJS entry it cannot provide.

The package declared a `require` condition and a `main` field, but `unplugin`
publishes a single ESM export and no CommonJS build, so
`require('@usemotif/compiler-web')` threw ERR_REQUIRE_ESM from inside that
dependency on any Node without `require(esm)`. The webpack guide documented that
exact call, so the documented setup could not have worked there.

The package is now ESM only and the guide shows an ESM config. Bundling the
dependency instead was tried and rejected: it takes the output from 4.7 KB to
139 KB and still fails at load, because unplugin reads `import.meta`, which has
no meaning in a CommonJS bundle.

Nothing goes from working to broken. A CommonJS consumer already crashed; it now
gets a resolution error naming the package instead of a runtime error naming a
file inside `node_modules`.

`@usemotif/headless` has no behaviour change. Its compound components are now
declared once, in the entry that assembles them, rather than also as an object
in each component module. The objects had no consumers left beyond the package's
own tests, which now exercise the entry, so they were testing a shape no
consumer receives.
