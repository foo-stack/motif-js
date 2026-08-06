---
'@usemotif/react': minor
'@usemotif/react-native': minor
'usemotif': patch
---

Export `styled()` and `createStyledContext()` from the platform packages

`styled()` and `createStyledContext()` were implemented in the `usemotif`
umbrella package and exported only from there. They are now implemented in
`@usemotif/react` (web) and `@usemotif/react-native` (native), alongside the
`Box` they render, and the umbrella re-exports them like every other symbol.

This closes a gap for anyone following the READMEs' advice to install a
platform package directly for a web-only or tree-shake-sensitive build: that
path previously had no styled factory at all, since it was the one part of the
API the umbrella did not pass through.

`usemotif`'s public surface is unchanged — `import { styled } from 'usemotif'`
continues to work and continues to resolve to the correct platform
implementation via the `react-native` export condition. No migration is needed.

Consumers importing directly from a platform package gain two new exports:

```ts
import { createStyledContext, styled } from '@usemotif/react';
// or
import { createStyledContext, styled } from '@usemotif/react-native';
```
