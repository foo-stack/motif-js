---
'@motif-js/react-web': minor
'@motif-js/react-native': minor
---

**`<VirtualList>` — opt-in default integrations with `@tanstack/react-virtual` (web) + `@shopify/flash-list` (native).**

Closes T3.2's runtime acceptance. Both packages already had the
`registerVirtualListImpl` seam (registry + threshold + fallback)
from prior work; this commit ships pre-built integrations as
sub-path exports so consumers can adopt either virtualizer with one
import + one register call instead of writing the wrapper
themselves.

```tsx
// Web — opt-in @tanstack/react-virtual
import { registerVirtualListImpl } from '@motif-js/react-web';
import { tanstackVirtualImpl } from '@motif-js/react-web/tanstack-virtual';
registerVirtualListImpl(tanstackVirtualImpl);

// Native — opt-in @shopify/flash-list
import { registerVirtualListImpl } from '@motif-js/react-native';
import { flashListImpl } from '@motif-js/react-native/flash-list';
registerVirtualListImpl(flashListImpl);
```

- **Both peers are optional** (`peerDependenciesMeta.optional: true`).
  Apps that want to wire their own virtualizer keep the existing
  `registerVirtualListImpl((props) => ...)` API; the new sub-paths
  don't change the seam.

- **Sub-path imports** (`@motif-js/react-web/tanstack-virtual`,
  `@motif-js/react-native/flash-list`) keep the main entry tree-
  shake-safe — apps that don't import the wrapper pay zero bundle
  cost. Both wrappers are also marked `'use client'` (web) where
  React Server Components require the directive.

- **Adapter shape on web (Tanstack)**: outer self-scrolling `<div>`
  (motif's `<ScrollView>` doesn't forward refs in v1; the wrapper
  inlines the equivalent overflow styles instead), inner spacer
  sized to `getTotalSize()`, virtualized window rendered with
  `position: absolute` + `top: virtualRow.start`. `itemHeight`
  becomes `estimateSize` (default 32px); dynamic-height rows are
  out of scope for v1 — apps needing them can register a custom
  impl with `measureElement`.

- **Adapter shape on native (FlashList)**: `data` flows through;
  `renderItem(item, index)` adapts FlashList's `({ item, index })`
  shape; `keyOf` becomes `keyExtractor`. `itemHeight` is currently
  ignored — FlashList v2 auto-measures and dropped
  `estimatedItemSize`; the prop is kept on motif's API surface for
  cross-renderer parity.

- **10k-row bench acceptance is deferred** to the v0.4.x window —
  the existing render bench is web-only; a native compile-path
  bench harness was already queued in deferred-work for T3.5, and
  T3.2's bench would land in the same harness. Runtime ships
  now; bench validation comes when the harness exists.

5 web tests cover scrolling outer container, inner-spacer sizing,
windowed rendering, keyOf usage, default item-height. 4 native
tests (with vi.mock'd FlashList) cover data passthrough, the
`{item, index}` → `(item, index)` adaptation, keyExtractor wiring,
and index fallback. Bundle: web 9.5 KB → 9.5 KB gz (the wrapper
lives at a separate sub-path); native unchanged.
