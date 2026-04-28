# Pressable

An interactive Box with pseudo-state styling. Renders as `<button>` on
web (and RN's `<Pressable>` on native) by default; override with `as`.

## Import

```ts
import { Pressable } from '@motif-js/react';
```

## Example

```tsx
<Pressable
  px="$4"
  py="$2"
  borderRadius="$md"
  bg="$colors.brand.500"
  color="$colors.brand.contrast"
  _hover={{ bg: '$colors.brand.600' }}
  _focus={{ outline: '2px solid', outlineColor: '$colors.brand.300' }}
  _active={{ transform: 'scale(0.98)' }}
  _disabled={{ opacity: 0.5 }}
  onPress={() => alert('clicked')}
>
  Click me
</Pressable>
```

## Props

| Prop        | Type                   | Default | Description                                             |
| ----------- | ---------------------- | ------- | ------------------------------------------------------- |
| `onPress`   | `(e) => void`          | —       | Cross-platform alias for click. Suppressed if disabled. |
| `disabled`  | `boolean`              | `false` | Disables interaction; sets `aria-disabled`.             |
| `_hover`    | Style bag              | —       | Style overrides for `:hover`.                           |
| `_focus`    | Style bag              | —       | Style overrides for `:focus-visible`.                   |
| `_active`   | Style bag              | —       | Style overrides for `:active`.                          |
| `_disabled` | Style bag              | —       | Style overrides for `:disabled` / `[aria-disabled]`.    |
| `...Box`    | All [Box](./box) props | —       | Layout / colour / etc.                                  |

## Pseudo-state styling

The four `_state` props each accept a partial style object that's
applied via the matching CSS pseudo-class. The compiler extracts the
pseudo classes at build time when the value is a literal object — see
[Compiler guide](../guides/compiler).

`_focus` uses `:focus-visible` so mouse-click focus doesn't show the
focus ring. Keyboard / programmatic focus does. This matches modern
WCAG guidance and the platform default for `<button>`.

## Tag override

```tsx
{
  /* Anchor — for in-app links */
}
<Pressable as="a" href="/dashboard" _hover={{ textDecoration: 'underline' }}>
  Go to dashboard
</Pressable>;
```

## Disabled handling

`disabled={true}`:

- Sets the native `disabled` attribute on `<button>` (browser blocks
  click + tab-focus).
- Sets `aria-disabled="true"` on non-button surfaces.
- Suppresses `onPress` calls regardless of source element.
- Applies `_disabled` style overrides.

## Cross-platform

Web: `<button>` with the standard click / focus / hover machinery.
Native: RN's `<Pressable>` — `onPress` maps directly, hover fires only
on platforms that support it (desktop, web, mouse-connected mobile).

## See also

- [Button](./button) — opinionated Pressable with variant × intent ×
  size matrix.
- [IconButton](./icon-button) — square Button, requires a11y label.
- [Link](./link) — anchor primitive.
