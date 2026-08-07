---
'@usemotif/react': patch
'@usemotif/react-native': patch
---

Stop pulling the wrong renderer into single-platform installs

`@usemotif/react` declared `react-dom` and `@usemotif/react-native` declared
`react-native` as required peers. Since `usemotif` depends on both platform
packages, npm's automatic peer installation dragged in whichever renderer the
project did not need:

- a web-only project also installed `react-native` and its full dependency tree
- a native-only project also installed `react-dom`

Both renderer peers are now marked optional, matching the stance `usemotif`
already took in its own `peerDependenciesMeta`. Measured on the published 1.2.1
packages, a consumer that needs only the native binding goes from 172 MB to
3.1 MB of `node_modules`; the web binding goes from 10 MB to 2.9 MB.

This was never a bundle-size problem — the wrong renderer was installed but
never bundled — only an install-size one.

If you install a platform package directly, keep declaring the renderer you
actually use (`react-dom` for web, `react-native` for native) as a dependency of
your own app. Nothing changes for `usemotif` consumers.
