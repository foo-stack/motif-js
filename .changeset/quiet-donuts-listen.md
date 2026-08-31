---
'@usemotif/compiler-babel': patch
'@usemotif/compiler-core': patch
'@usemotif/compiler-web': patch
'@usemotif/core': patch
'@usemotif/headless': patch
'@usemotif/icons': patch
'@usemotif/migrate': patch
'@usemotif/react': patch
'@usemotif/react-native': patch
'@usemotif/reset': patch
'@usemotif/test-utils': patch
'@usemotif/tokens': patch
'@usemotif/ui': patch
'usemotif': patch
---

Apply the writing rule across the repository.

No behaviour changes and no API changes. Published bytes move, because JSDoc is
emitted into `.d.ts` and the package descriptions and READMEs render on npm.

Em dashes become hyphens, the ellipsis character becomes three dots, and en
dashes in ranges become hyphens. A character standing alone inside quotes is
left as it is: that is a symbol rather than punctuation, such as the
indeterminate mark on a checkbox or the elision in a code sample.

`yarn writing:check` now fails when one reaches tracked source, so this is a
rule rather than a one-time sweep.
