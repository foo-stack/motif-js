# Button

Opinionated Pressable with a `variant × intent × size` matrix +
loading state + leading / trailing icons.

## Import

```ts
import { Button } from '@motif-js/react';
```

## Example

```tsx
<Button intent="primary" onPress={() => save()}>
  Save changes
</Button>

<Button variant="outline" intent="danger" leadingIcon={<Trash />}>
  Delete
</Button>

<Button intent="primary" loading loadingLabel="Saving…">
  Save
</Button>
```

## Props

| Prop           | Type                                              | Default     | Description                                             |
| -------------- | ------------------------------------------------- | ----------- | ------------------------------------------------------- |
| `variant`      | `'solid' \| 'outline' \| 'ghost' \| 'link'`       | `'solid'`   | Visual treatment.                                       |
| `intent`       | `'primary' \| 'neutral' \| 'danger' \| 'success'` | `'primary'` | Semantic colour.                                        |
| `size`         | `'sm' \| 'md' \| 'lg'`                            | `'md'`      | Height / padding / font-size shorthand.                 |
| `loading`      | `boolean`                                         | `false`     | Spinner state — disables clicks, sets `aria-busy`.      |
| `loadingLabel` | `ReactNode`                                       | —           | Alt label rendered while loading. Defaults to children. |
| `loadingIcon`  | `ReactNode`                                       | (built-in)  | Override the loading indicator.                         |
| `leadingIcon`  | `ReactNode`                                       | —           | Content rendered before the label.                      |
| `trailingIcon` | `ReactNode`                                       | —           | Content rendered after the label.                       |
| `...Pressable` | All [Pressable](./pressable) props                | —           | `onPress`, `disabled`, etc.                             |

## Variants

| Variant   | Visual                                                         |
| --------- | -------------------------------------------------------------- |
| `solid`   | Filled background, white text. Default for CTAs.               |
| `outline` | Transparent background, coloured border + text. Secondary CTA. |
| `ghost`   | Transparent — colour only on hover. Tertiary actions.          |
| `link`    | Text-only, underlined. Inline with copy.                       |

## Intents

`primary` (brand), `neutral` (gray), `danger` (red), `success` (green).
Token references: `$colors.action.<intent>.<bg|fg|hover>`.

## Loading state

When `loading={true}`:

- Click events suppressed.
- `aria-busy="true"` set on the button.
- The leading-icon slot is replaced with `loadingIcon` (or default
  spinner).
- Children stay laid out — labels remain readable behind the spinner.
- If `loadingLabel` is supplied, it replaces the visible children.

## Sizing

Heights map to:

- `sm` — 32px / `$2 $3` padding / `$sm` font.
- `md` — 40px / `$3 $4` padding / `$md` font.
- `lg` — 48px / `$4 $6` padding / `$lg` font.

Override per-instance via padding props if the matrix doesn't fit:

```tsx
<Button size="md" px="$8" py="$3">
  Wide button
</Button>
```

## See also

- [Pressable](./pressable) — for full custom control.
- [IconButton](./icon-button) — square button + required label.
