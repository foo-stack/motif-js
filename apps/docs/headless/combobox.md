# Combobox / Select / MultiSelect / Search

Listbox-pattern inputs sharing the standard combobox / listbox /
option ARIA model and the same keyboard navigation.

## Import

```ts
import { Combobox, Select, MultiSelect, Search } from '@motif-js/headless';
```

## Combobox

Type-to-filter input with a dropdown listbox.

```tsx
<Combobox.Root options={languages} onValueChange={setLang}>
  <Combobox.Input placeholder="Language" />
  <Combobox.List />
</Combobox.Root>
```

`options` is `{ value: T, label: string, disabled? }[]`. Default
filter is case-insensitive substring match on `label`; pass a custom
`filter` to override.

### Root props

| Prop                     | Type                          | Default   | Description                                 |
| ------------------------ | ----------------------------- | --------- | ------------------------------------------- |
| `options`                | `ComboboxOption<T>[]`         | —         | Item list.                                  |
| `value` / `defaultValue` | `T`                           | —         | Selected value (controlled / uncontrolled). |
| `onValueChange`          | `(v: T \| undefined) => void` | —         | Selection handler.                          |
| `inputValue`             | `string`                      | —         | Controlled filter text.                     |
| `onInputValueChange`     | `(s: string) => void`         | —         | Input change handler.                       |
| `filter`                 | `(opt, input) => boolean`     | substring | Custom filter.                              |
| `open` / `defaultOpen`   | `boolean`                     | `false`   | Controlled / uncontrolled list open state.  |

### Subcomponents

- **`Combobox.Input`** — clones a child input or renders a default
  one. Wires `role="combobox"`, `aria-expanded`, `aria-activedescendant`.
- **`Combobox.List`** — Portal-rendered listbox + options. Position
  via `useFloatingPosition`. Click-outside closes.

### List props

| Prop           | Type                       | Default        | Description                        |
| -------------- | -------------------------- | -------------- | ---------------------------------- |
| `placement`    | Popover placement          | `'bottom'`     | Floating placement.                |
| `offset`       | `number`                   | `4`            | Pixel gap from input.              |
| `renderOption` | `(opt, info) => ReactNode` | `opt.label`    | Per-option custom render.          |
| `emptyMessage` | `ReactNode`                | `'No options'` | Shown when filtered list is empty. |

### Keyboard

- ArrowDown — open + move highlight.
- ArrowUp — move highlight up.
- Home / End — jump.
- Enter — select highlighted.
- Escape — close.

## Select

Button-triggered listbox. No type-to-filter — just an opinionated
Combobox where the `Input` is replaced by a `Trigger` button.

```tsx
<Select.Root options={categories} onValueChange={setCategory}>
  <Select.Trigger>
    <Button>{categoryLabel ?? 'Pick…'}</Button>
  </Select.Trigger>
  <Select.List />
</Select.Root>
```

The trigger gets `aria-haspopup="listbox"` + `aria-expanded`. Press
Enter / Space / ArrowDown to open.

## MultiSelect

Combobox that holds an array of selected values. Renders a chip layer
for the current selection + an inline input for filtering.

```tsx
<MultiSelect.Root options={tags} maxSelections={5}>
  <MultiSelect.Chips />
  <MultiSelect.Input placeholder="Add tag" />
  <MultiSelect.SelectAll />
  <MultiSelect.List />
</MultiSelect.Root>
```

| Prop (Root)     | Type               | Default | Description                           |
| --------------- | ------------------ | ------- | ------------------------------------- |
| `value`         | `T[]`              | —       | Controlled.                           |
| `defaultValue`  | `T[]`              | `[]`    | Uncontrolled.                         |
| `onValueChange` | `(v: T[]) => void` | —       | Fires on add / remove.                |
| `maxSelections` | `number`           | —       | Cap. Selecting at the cap is a no-op. |

`MultiSelect.Chips` renders one chip per selected value; tapping a
chip removes it. Backspace at empty input pops the last chip.
`MultiSelect.SelectAll` toggles between "all filtered selected" and
"none of the filtered selected", respecting `maxSelections`.

## Search

Combobox tuned for free-text input. Same surface; the wrapper renders
`role="search"` + `aria-autocomplete="list"`.

```tsx
<Search.Root options={results} filter={fuzzy}>
  <Combobox.Input placeholder="Search…" />
  <Combobox.List />
</Search.Root>
```

## Native

All of the above render the listbox in a bottom-sheet `<Modal>`
instead of a positioned dropdown. The keyboard / accessibility model
is identical; the visual surface is the platform-correct
mobile-friendly substitute.

## See also

- [CommandPalette](./command-palette) — Combobox-in-Dialog with
  sections and shortcuts.
- [Forms](../primitives/forms) — `Input`, `Field`, etc. for non-listbox inputs.
