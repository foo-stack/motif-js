# Primitives — overview

motif's primitives roster. Each primitive ships on both renderers
(`@motif-js/react-web` + `@motif-js/react-native`) with the same prop
schema. Cross-renderer code imports from `@motif-js/react`.

## Core

- [Box](./box) — the atom. Theme-aware, responsive, every style prop.
- [Stack / HStack / VStack](./stack) — flex containers with `gap`.
- [Text](./text) — text content, theme-aware fonts.
- [Pressable](./pressable) — interactive surface with pseudo-state styling.
- [Image](./image) — image with placeholder + fallback states.
- [Container](./container) — host for container queries.

## Layout extras

- [Layout extras](./layout-extras) — `ZStack`, `Spacer`, `Center`, `Wrap`,
  `AspectRatio`, `Grid`, `Flex`, `SafeArea`.

## Typography

- [Typography](./typography) — `Heading`, `Paragraph`, `Code`, `Kbd`,
  `Blockquote`.

## Interaction

- [Button](./button) — full variant × intent × size matrix.
- [IconButton](./icon-button) — square Button + required a11y label.
- [Link](./link) — anchor primitive (`<a href>` web; `Linking.openURL`
  native).

## Forms

- [Forms](./forms) — `Input`, `TextArea`, `NumberInput`, `PasswordInput`,
  `Field` / `Label` / `FieldHelp` / `FieldError` / `Fieldset`.

## Media

- [Media](./media) — `Avatar`, `Icon`, `Svg`, plus the bundled icon set
  in `@motif-js/icons`.

## Scroll

- [Scroll](./scroll) — `ScrollView`, `Sticky`, `VirtualList`.

## Overlay & a11y

- [Overlay & a11y](./overlay) — `Portal`, `Overlay`, `VisuallyHidden`,
  `LiveRegion`, `FocusScope`, `Show`, `Hide`.

> Per-primitive prop tables are stubbed for v0 of the docs site. They land
> incrementally — TypeScript types are the source of truth in the meantime
> (`packages/react-web/src/<Primitive>.tsx`).
