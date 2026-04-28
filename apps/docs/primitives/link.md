# Link

Anchor primitive. Renders `<a href>` on web; uses `Linking.openURL` on
native.

## Import

```ts
import { Link } from '@motif-js/react';
```

## Example

```tsx
<Link href="/about" color="$colors.brand.500">
  About
</Link>

<Link href="https://example.com" external>
  Example.com (opens in new tab)
</Link>
```

## Props

| Prop       | Type                   | Default | Description                                                                           |
| ---------- | ---------------------- | ------- | ------------------------------------------------------------------------------------- |
| `href`     | `string`               | —       | Target URL.                                                                           |
| `external` | `boolean`              | `false` | Web: adds `target="_blank"` + `rel="noopener noreferrer"`.                            |
| `onPress`  | `(e) => void`          | —       | Cross-platform alias for the click. `e.preventDefault()` to block default navigation. |
| `as`       | `ElementType`          | —       | Override the rendered element on web (e.g. for router-aware links).                   |
| `...Box`   | All [Box](./box) props | —       | Inherited.                                                                            |

## Router integration

For client-side routing, use `as` to render through a router-aware
component:

```tsx
import { Link as RouterLink } from 'react-router';

<Link as={RouterLink} to="/about" color="$colors.brand.500">
  About
</Link>;
```

The Link primitive doesn't know about routing — it just renders an
anchor and forwards events. Wire it up to your router via `as`.

## External links

`external={true}` triggers two web-only behaviours:

- `target="_blank"` so the link opens in a new tab.
- `rel="noopener noreferrer"` so the new tab can't access the
  opener (security + perf).

On native, `external` is a no-op — `Linking.openURL` always opens in
the system handler.

## Native behaviour

On native, `<Link>` wraps a Pressable. `onPress` fires
`Linking.openURL(href)` by default. Override via the `onPress` prop —
returning anything (or just calling another navigation API) cancels
the default open.

## See also

- [Pressable](./pressable) — interactive surface without href.
- [Button](./button) — opinionated pressable with intent / variant.
