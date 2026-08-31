---
'@usemotif/core': patch
'@usemotif/react': patch
'@usemotif/react-native': patch
'@usemotif/headless': patch
'@usemotif/ui': patch
'usemotif': patch
---

Apply the writing rule to comments, JSDoc, and package prose.

No behaviour changes and no API changes. The published bytes do move, because
JSDoc is emitted into `.d.ts` and the package descriptions and READMEs render on
npm, so this is a patch rather than nothing.

Em dashes become hyphens, the ellipsis character becomes three dots, and en
dashes in ranges become hyphens. Only comment lines were touched in package
source; string literals, JSX text, and test names are untouched and are a
separate pass.
