---
'@usemotif/migrate': minor
---

`rename-v3` now redirects `@motif-js/compiler-swc` to `@usemotif/compiler-web`.

Every other specifier is a 1:1 scope swap, so the bundler plugin used to come
out of the codemod as `@usemotif/compiler-swc` — a package that no longer
receives releases now that the alias is gone. A v2 consumer running the
codemod landed on a dead name through no fault of their own.

```diff
- import motifExtract from '@motif-js/compiler-swc';
+ import motifExtract from '@usemotif/compiler-web';
```

Handled as a whole-specifier remap, which is safe because neither package ever
exposed a subpath export.

Also fixes the hand-rolled `perl` fallback in the v2 → v3 migration guide. Its
`@motif-js` and `@usemotif` sigils were unescaped, so perl read them as array
interpolations and expanded them to nothing — the one-liner rewrote every
import to `@motif/<name>` instead of `@usemotif/<name>`.
