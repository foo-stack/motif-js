---
'@motif-js/core': minor
'@motif-js/react': minor
'@motif-js/react-web': minor
'@motif-js/react-native': minor
'@motif-js/primitives': minor
'@motif-js/forms': minor
'@motif-js/headless': minor
'@motif-js/icons': minor
'@motif-js/compiler-core': minor
'@motif-js/compiler-babel': minor
'@motif-js/compiler-swc': minor
'@motif-js/compiler-metro': minor
'@motif-js/tokens': minor
'@motif-js/color': minor
'@motif-js/reset': minor
'@motif-js/test-utils': minor
---

**Phase E — Primitives buildout.**

35 new primitives ship on both renderers. Same prop schema, same
behaviour where the platform supports it, deliberate divergence
(with comments) where it doesn't. Every primitive composes the
existing Box / Pressable / Text foundation, so theme + responsive
+ pseudo-state plumbing all flow through automatically.

Layout: `ZStack`, `Spacer`, `Center`, `Wrap`, `AspectRatio`,
`Grid`, `Flex`, `SafeArea`.

Typography: `Heading` (level 1–6), `Paragraph`, `Code`, `Kbd`,
`Blockquote` (with optional `cite`).

Interaction: `Button` (full variant × intent × size matrix +
loading / icon slots / fullWidth), `IconButton` (square Button +
required a11y label), `Link` (`<a href>` web; `Linking.openURL`
native; auto-injects `rel='noopener noreferrer'` on
`target='_blank'`).

Media: `Avatar` (image-with-initials fallback), `Icon` (token-
sized SVG wrapper), `Svg` (typed primitive with Phosphor-friendly
defaults). Plus a 12-icon starter set in `@motif-js/icons`: Plus,
X, Check, ChevronUp / Down / Left / Right, Search, Trash, Heart,
Star, ArrowRight. The full ~200-icon Phosphor-inspired set lands
as a v0.4.x patch.

Scroll & lists: `ScrollView` (direction / hideScrollbar),
`Sticky` (web only — RN's `stickyHeaderIndices` integration is a
follow-up), `VirtualList` (prop shape shipped; v0 renders non-
virtualised so the eventual Virtuoso / FlashList integration is
a drop-in).

Forms: `Input`, `TextArea`, `NumberInput`, `PasswordInput` (all
forwardRef'd; PasswordInput ships with a togglable eye), and the
Field family — `Field` / `Label` / `FieldHelp` / `FieldError` /
`Fieldset` — that auto-wires `aria-describedby` / `aria-invalid`
/ `aria-required` so callers get a11y right by default.

Overlay & a11y: `Portal` (web `createPortal`, native `<Modal
transparent>`), `Overlay` (full-viewport scrim + tap-outside
hook), `VisuallyHidden` (sr-only span web; zero-size accessible
Box native), `LiveRegion` (`aria-live` / `accessibilityLiveRegion`),
`FocusScope` (autoFocus + restoreFocus on mount/unmount; full
Tab-cycling trap is a Phase F item with Dialog), and `Show` /
`Hide` for declarative responsive visibility.

Style-prop schema gains 17 new entries: `outline*` (5: outline,
outlineStyle / Width / Color / Offset) for focus rings, and
`border{Top,Right,Bottom,Left}{Width,Style,Color}` (12) for
per-side border control needed by Blockquote and other
typography accents.

`@motif-js/react` re-exports the full primitive surface so
cross-renderer apps import from a single package; package-field
routing picks the right implementation per platform.

What's not in this release:

- **Real virtualisation** (Virtuoso / FlashList) for
  `VirtualList`. v0 renders every item; the prop shape is final
  so callers don't migrate when the integration ships.
- **Native sticky headers via `stickyHeaderIndices`**. Native
  `Sticky` is a documented passthrough today.
- **Real `react-native-svg` integration** for native `Svg` /
  `Icon`. v0 accepts a `SvgComponent` prop where callers can
  pass `Svg` from `react-native-svg`; the default is a sized
  Box that's useful for testing / emoji fallback.
- **Tab-cycling focus trap** in `FocusScope`. v0 only
  autoFocuses + restoreFocuses; full Tab cycling lands with
  Phase F's `Dialog` / `AlertDialog`.
- **Full ~200-icon Phosphor-inspired set**. 12-icon starter
  ships now; the rest lands as a v0.4.x patch.

Workspace test count: 469 → 491 passing + 3 skipped. New tests
focus on Button (web 17 / native 8), layout extras (web 9 /
native 8), typography (web 8 / native 7), IconButton + Link
(web 10 / native 4), media (web 10), forms (web 10).
