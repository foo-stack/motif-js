# Switch / Checkbox / Radio

Form-integrated input components. Each renders a real `<input>`
element so they integrate with native form submission, browser
auto-fill, and reset handling.

## Import

```ts
import { Switch, Checkbox, Radio, RadioGroup } from '@motif-js/headless';
```

## Switch

`<input type="checkbox" role="switch">`. Same form semantics as a
checkbox but assistive tech reads "switch on/off" instead of
"checkbox checked/unchecked" — matches the mental model for binary
on/off settings.

```tsx
<Switch checked={isOn} onChange={(e) => setIsOn(e.target.checked)} />
```

| Prop       | Type                       | Default | Description                                   |
| ---------- | -------------------------- | ------- | --------------------------------------------- |
| `invalid`  | `boolean`                  | `false` | Sets `aria-invalid="true"`.                   |
| `...input` | All HTMLInputElement props | —       | `checked`, `defaultChecked`, `onChange`, etc. |

## Checkbox

Standard checkbox with `indeterminate` support.

```tsx
<Checkbox
  checked={selectedCount === total}
  indeterminate={selectedCount > 0 && selectedCount < total}
  onChange={(e) => toggleAll(e.target.checked)}
/>
```

| Prop            | Type      | Default | Description                                                 |
| --------------- | --------- | ------- | ----------------------------------------------------------- |
| `indeterminate` | `boolean` | `false` | Sets the DOM `indeterminate` flag + `aria-checked="mixed"`. |
| `invalid`       | `boolean` | `false` | Sets `aria-invalid`.                                        |

`indeterminate` is set on the underlying `<input>` via ref — browsers
don't expose it as an attribute, so motif manages it imperatively.
When indeterminate, `aria-checked="mixed"` ships so screen readers
announce the mixed state.

## Radio + RadioGroup

`<RadioGroup>` synchronises a name + a current value across all child
`<Radio>` inputs. Shares `name` so the inputs are mutually exclusive
in form submission.

```tsx
<RadioGroup defaultValue="medium" aria-label="Pizza size">
  <Field>
    <Label>
      <Radio value="small" /> Small
    </Label>
  </Field>
  <Field>
    <Label>
      <Radio value="medium" /> Medium
    </Label>
  </Field>
  <Field>
    <Label>
      <Radio value="large" /> Large
    </Label>
  </Field>
</RadioGroup>
```

### RadioGroup props

| Prop                         | Type                  | Default | Description                                                  |
| ---------------------------- | --------------------- | ------- | ------------------------------------------------------------ |
| `name`                       | `string`              | (auto)  | Form-name shared by every Radio inside.                      |
| `value`                      | `string`              | —       | Controlled selected value.                                   |
| `defaultValue`               | `string`              | —       | Uncontrolled initial value.                                  |
| `onValueChange`              | `(v: string) => void` | —       | Fires when selection changes.                                |
| `aria-label` / `-labelledby` | `string`              | —       | Required for the group to announce as one composite control. |

### Radio props

| Prop       | Type                                          | Description                  |
| ---------- | --------------------------------------------- | ---------------------------- |
| `value`    | `string`                                      | The radio's value. Required. |
| `...input` | HTMLInputElement props (minus `type`/`value`) | Standard HTML input props.   |

`Radio` outside a `RadioGroup` throws — the group's context is required
for shared name + value sync.

## See also

- [Forms](../primitives/forms) — `Field` / `Label` / `FieldHelp` /
  `FieldError` for full form composition.
- [Combobox](./combobox) — when the choice set is large.
