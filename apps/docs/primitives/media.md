# Media

Avatar, Icon, and Svg primitives plus the bundled icon set in
`@motif-js/icons`.

## Import

```ts
import { Avatar, Icon, Svg } from '@motif-js/react';
import { Heart, Settings } from '@motif-js/icons';
```

## Avatar

Round image with initials fallback. Composes `<Image>` with sensible
sizing + a `name` prop that derives initials when the image is missing
or fails.

```tsx
<Avatar src="…" name="Jane Doe" size="md" />;
{
  /* falls back to <Box bg=…>JD</Box> if src 404s */
}
```

| Prop       | Type                                   | Default | Description                                       |
| ---------- | -------------------------------------- | ------- | ------------------------------------------------- |
| `src`      | `string`                               | —       | Image URL. Optional — `name` initials work alone. |
| `name`     | `string`                               | —       | Used to derive initials and `alt` text.           |
| `size`     | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'`  | Diameter — 24 / 32 / 40 / 48 / 64 px.             |
| `fallback` | `ReactNode`                            | (auto)  | Override the initials fallback render.            |
| `...Image` | All [Image](./image) props             | —       | Inherited.                                        |

## Icon

A 24×24 SVG container. The bundled `@motif-js/icons` glyphs render as
`<Icon>` with a `render` callback that consumes the SVG primitives:

```tsx
<Heart color="$colors.danger.500" />
```

For custom glyphs:

```tsx
<Icon size={24} color="currentColor" render={({ Path }) => <Path d="M12 2L2 22h20L12 2z" />} />
```

| Prop         | Type                                | Default          | Description                                      |
| ------------ | ----------------------------------- | ---------------- | ------------------------------------------------ |
| `size`       | `number \| string` (responsive)     | `'1em'`          | Width + height. `'1em'` = inherits font-size.    |
| `color`      | Token / colour                      | `'currentColor'` | Stroke / fill colour.                            |
| `render`     | `(svg: SvgPrimitives) => ReactNode` | —                | Required. Receives `Path`, `Line`, `Circle`, ... |
| `aria-label` | `string`                            | —                | Pass for non-decorative icons.                   |

## Svg

Cross-platform SVG primitive. Web renders native `<svg>`; native
renders `<Svg>` from `react-native-svg` when installed (else a sized
Box placeholder).

```tsx
<Svg viewBox="0 0 24 24" w={24} h={24}>
  <Path d="M12 2L2 22h20L12 2z" fill="currentColor" />
</Svg>
```

For component portability, prefer `<Icon render={...} />` so the same
JSX works on both renderers without conditional imports.

## Bundled icons (`@motif-js/icons`)

81 glyphs across navigation, actions, communication, media, users,
status, files, editing, visibility, time, and misc — see
[icons source](https://github.com/foo-stack/motif-js/tree/main/packages/icons/src/glyphs)
for the full list.

```tsx
import { Plus, Search, Heart, Settings, ArrowRight } from '@motif-js/icons';

<Plus />
<Heart color="$colors.danger.500" />
```

Each is tree-shakable — only the glyphs you import end up in the
bundle.

## See also

- [Image](./image) — for full image rendering with placeholder /
  fallback.
- [IconButton](./icon-button) — opinionated icon-only button.
