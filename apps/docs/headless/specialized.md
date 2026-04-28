# ColorPicker / FileUpload / TreeView

Niche primitives. Less commonly needed but ship when you need them.

## Import

```ts
import { ColorPicker, FileUpload, TreeView } from '@motif-js/headless';
import { parseColor, formatColor } from '@motif-js/headless';
```

## ColorPicker (web)

Full HSV picker — saturation×value plane, hue slider, optional alpha
slider, format toggle (hex / rgb / hsl).

```tsx
<ColorPicker
  defaultValue="#3b82f6"
  format="hex"
  allowAlpha
  onValueChange={(color) => console.log(color)} // emits in active format
/>
```

| Prop                     | Type                       | Default     | Description                                    |
| ------------------------ | -------------------------- | ----------- | ---------------------------------------------- |
| `value` / `defaultValue` | `string`                   | `'#000000'` | Colour as hex / rgb / rgba / hsl / hsla.       |
| `onValueChange`          | `(s: string) => void`      | —           | Fires on plane / slider drag in active format. |
| `format`                 | `'hex' \| 'rgb' \| 'hsl'`  | `'hex'`     | Initial output format.                         |
| `allowAlpha`             | `boolean`                  | `false`     | Show alpha slider (only for `rgb` / `hsl`).    |
| `onFormatChange`         | `(f: ColorFormat) => void` | —           | Fires when the user toggles format.            |

Internal HSV state preserves hue across zero-saturation regions that
don't survive an RGB round-trip. Keyboard shortcuts (Arrow / Shift+Arrow
/ Home / End) drive the saturation×value plane.

`parseColor(s)` / `formatColor(hsv, format)` are exported helpers
covering hex / rgb / rgba / hsl / hsla input and output. Both work on
web and native.

### Native

The ColorPicker UI is web-only — the saturation×value plane needs
SVG gradients that aren't available without `react-native-svg`. The
pure-JS helpers (`parseColor` / `formatColor`) work on both
platforms; native callers should fall back to a runtime warning or
to one of the existing community RN colour pickers.

## FileUpload

Drop-zone wrapper over `<input type="file">`.

```tsx
<FileUpload accept="image/*" multiple onFiles={(files) => upload(files)}>
  {({ isDragging, openPicker }) => (
    <Box
      p="$8"
      borderStyle="dashed"
      borderWidth={2}
      borderColor={isDragging ? '$colors.brand.500' : '$colors.gray.300'}
      onClick={openPicker}
    >
      <Text>Drop files here or click to select</Text>
    </Box>
  )}
</FileUpload>
```

| Prop       | Type                      | Default | Description                                          |
| ---------- | ------------------------- | ------- | ---------------------------------------------------- |
| `accept`   | `string`                  | —       | MIME pattern (`'image/*'`, `'.pdf,.docx'`).          |
| `multiple` | `boolean`                 | `false` | Allow multi-file selection.                          |
| `onFiles`  | `(files: File[]) => void` | —       | Fires on file selection or drop.                     |
| `children` | `(state) => ReactNode`    | —       | Render-prop. Receives `isDragging` + `openPicker()`. |

### Native

Native FileUpload is a documented stub — needs `expo-document-picker`
or `react-native-document-picker` peer dep. Apps that need it should
wire the integration through the children render-prop themselves
until motif's adapter lands.

## TreeView

ARIA tree pattern (`role="tree"`, `role="treeitem"`,
`aria-expanded` / `aria-selected`) with arrow-key navigation.

```tsx
<TreeView
  data={files}
  defaultExpanded={['src']}
  onValueChange={setSelected}
  renderNode={({ node, depth, isExpanded, isSelected, toggle, select }) => (
    <HStack
      pl={depth * 16 + 8}
      py="$1"
      bg={isSelected ? '$colors.brand.100' : 'transparent'}
      onClick={() => {
        toggle();
        select();
      }}
    >
      {node.children !== undefined ? (
        <ChevronRight transform={isExpanded ? 'rotate(90deg)' : undefined} />
      ) : null}
      <Text>{node.label}</Text>
    </HStack>
  )}
  aria-label="File tree"
/>
```

`data` is `TreeNode[]` where each node has `id`, `label`, optional
`children`, optional `disabled`, optional `data: T`.

| Prop                     | Type                     | Default | Description                  |
| ------------------------ | ------------------------ | ------- | ---------------------------- |
| `data`                   | `TreeNode<T>[]`          | —       | Tree shape.                  |
| `value` / `defaultValue` | `string`                 | —       | Selected node id.            |
| `onValueChange`          | `(id: string) => void`   | —       | Selection handler.           |
| `defaultExpanded`        | `string[]`               | `[]`    | Initially-expanded node ids. |
| `renderNode`             | `(info) => ReactElement` | —       | Required. Per-node render.   |

### Keyboard

- ArrowDown / ArrowUp — visible-node navigation.
- ArrowRight on a collapsed parent — expands.
- ArrowLeft on an expanded parent — collapses.
- Enter / Space — select focused node.

## See also

- [Forms](../primitives/forms) — for non-tree input.
- [Combobox](./combobox) — for searchable single-select.
