---
'@usemotif/compiler-web': minor
---

Remove the deprecated `@usemotif/compiler-swc` alias package.

`@usemotif/compiler-swc` was renamed to `@usemotif/compiler-web` in v1.2.0 —
the plugin is a Babel-based `unplugin`, never an SWC plugin, so the old name
described the wrong toolchain. The old package stayed on as a thin alias that
re-exported this one unchanged. It is now removed; `@usemotif/compiler-swc`
stops receiving releases at 1.3.0.

```diff
- import motifExtract from '@usemotif/compiler-swc';
+ import motifExtract from '@usemotif/compiler-web';
```

The API is identical — the import specifier is the only change.
