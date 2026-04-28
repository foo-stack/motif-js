# Migration

Per-version migration notes for motif-js. See [SEMVER.md](./SEMVER.md) for
the stability policy.

## Unreleased

No breaking changes pending. Active development happens on `main`.

## v1.0.0 (Phase E close, 2026-04-28)

The v1.0.0 graduation was unintended — changesets bumped 0.3.0 → 1.0.0
instead of the planned 0.4.0. See the README banner + Phase E ROADMAP
entry for context.

**No API breaks** — v1.0.0 is the v0.3.0 surface plus the 35 new
primitives shipped in Phase E. Apps using v0.3.0 can upgrade by
running `yarn upgrade @motif-js/react @motif-js/tokens @motif-js/headless`
(or whichever motif packages they consume) without code changes.

### New since v0.3.0

- 35 new primitives: layout extras (ZStack, Spacer, Center, Wrap,
  AspectRatio, Grid, Flex, SafeArea), typography (Heading, Paragraph,
  Code, Kbd, Blockquote), interaction (Button, IconButton, Link), media
  (Avatar, Icon, Svg), scroll (ScrollView, Sticky, VirtualList), forms
  (Input, TextArea, NumberInput, PasswordInput, Field family), overlay
  (Portal, Overlay, VisuallyHidden, LiveRegion, FocusScope, Show, Hide).
- 12-icon starter set in `@motif-js/icons`.
- 17 new style-prop schema entries: outline\* (5) + per-side border (12).

## v0.3.0 (Phase D, 2026-04-28)

Static compiler shipped. **No runtime API breaks** — the runtime path
is unchanged; the compiler is opt-in.

### New

- `@motif-js/compiler-core` — AST classifier + extraction.
- `@motif-js/compiler-babel` — Babel plugin.
- `@motif-js/compiler-swc` — Vite / webpack / etc. plugin.
- `@motif-js/compiler-metro` — Metro / Expo wrapper.
- Box runtime fast-path when no style props remain (cascades to Stack /
  Text / Pressable).

### Required actions

None for runtime users. To enable the compiler:

```ts
// vite.config.ts
import motif from '@motif-js/compiler-swc';
export default { plugins: [motif.vite() /* ...rest */] };
```

## v0.2.0 (Phase C, 2026-04-28)

Native renderer shipped. **No web API breaks**.

### New

- `@motif-js/react-native` — Box / Stack / Text / Pressable / Image /
  Container / Theme on native.
- Viewport-driven responsive resolution + container-query polyfill.

### Required actions

None for web users. RN apps:

```sh
yarn add @motif-js/react-native @motif-js/tokens
```

## v0.1.0 (Phase B, first public preview)

The first public preview. No prior version on npm.

### Surface

- `@motif-js/core`, `@motif-js/react`, `@motif-js/react-web`
- `@motif-js/tokens` (light + dark themes)
- Box / Stack / HStack / VStack / Text / Pressable / Image / Container
- Theme / ThemeProvider / nested `<Theme name="...">`
- All three responsive shapes (object / array / DSL)
- Container queries
- SSR (sync collector, AsyncLocalStorage variant, Next App Router pattern)
- styled() factory with variants + compoundVariants
