# Image

`<Image>` with an explicit placeholder + fallback state machine. Loads
the source, shows a placeholder while loading, falls back to an
alternate render if the source errors.

## Import

```ts
import { Image } from '@motif-js/react';
```

## Example

```tsx
<Image
  src="https://example.com/avatar.png"
  alt="Profile photo"
  w={64}
  h={64}
  borderRadius="$full"
  placeholder={<Box w={64} h={64} bg="$colors.gray.200" borderRadius="$full" />}
  fallback={
    <Box
      w={64}
      h={64}
      bg="$colors.gray.300"
      borderRadius="$full"
      alignItems="center"
      justifyContent="center"
    >
      <Text fontSize="$lg" color="$colors.text.muted">
        ?
      </Text>
    </Box>
  }
/>
```

## Props

| Prop          | Type                                       | Default   | Description                                              |
| ------------- | ------------------------------------------ | --------- | -------------------------------------------------------- |
| `src`         | `string`                                   | —         | Source URL (web) / `ImageSourcePropType` (native).       |
| `alt`         | `string`                                   | —         | Required for accessibility. Empty string for decorative. |
| `placeholder` | `ReactNode`                                | —         | Rendered while the source is loading.                    |
| `fallback`    | `ReactNode`                                | —         | Rendered when the source errors.                         |
| `onLoad`      | `() => void`                               | —         | Fires when the source successfully loads.                |
| `onError`     | `() => void`                               | —         | Fires when the source fails.                             |
| `objectFit`   | `'cover' \| 'contain' \| 'fill' \| 'none'` | `'cover'` | Same as CSS `object-fit`; native equivalent.             |
| `...Box`      | All [Box](./box) props                     | —         | Sizing, border, layout.                                  |

## State machine

The component runs a small state machine:

1. **`'loading'`** — initial. Renders `placeholder` if provided, else
   the `<img>` element with `visibility: hidden`.
2. **`'loaded'`** — `onLoad` fired. Renders the source.
3. **`'error'`** — `onError` fired. Renders `fallback` if provided,
   else nothing.

A re-render that changes `src` resets the state to `'loading'`.

## Sizing

Always supply explicit dimensions or an `aspectRatio` to prevent layout
shift when the image swaps in:

```tsx
<Image src="…" alt="…" w="100%" aspectRatio={16 / 9} objectFit="cover" />
```

## Cross-platform

- **Web** — `<img>` with the standard `loading="lazy"` opt-in (set
  `loading="eager"` to override).
- **Native** — RN's `<Image>` with `source={{ uri }}`.

## See also

- [Avatar](./media#avatar) — opinionated round Image with initials
  fallback.
- [Box](./box) — for sizing / layout props.
