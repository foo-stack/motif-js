# Forms

Form-input primitives + the `Field` composition for labels, helper
text, and error state.

## Import

```ts
import {
  Input,
  TextArea,
  NumberInput,
  PasswordInput,
  Field,
  Label,
  FieldHelp,
  FieldError,
  Fieldset,
} from '@motif-js/react';
```

## Field composition

`<Field>` provides context for `Label` / `FieldHelp` / `FieldError` so
they wire up `htmlFor`, `aria-describedby`, and `aria-invalid`
automatically.

```tsx
<Field>
  <Label>Email</Label>
  <Input type="email" placeholder="you@example.com" required />
  <FieldHelp>We never share your email.</FieldHelp>
  <FieldError>Please enter a valid email.</FieldError>
</Field>
```

`<FieldError>` only renders if you pass children that are non-empty —
it doesn't show until you set an error message.

| Prop       | Type      | Default | Description                                               |
| ---------- | --------- | ------- | --------------------------------------------------------- |
| `id`       | `string`  | (auto)  | Field id. Falls back to `useId()`.                        |
| `invalid`  | `boolean` | `false` | Sets `aria-invalid="true"` on the input.                  |
| `disabled` | `boolean` | `false` | Disables every descendant input.                          |
| `required` | `boolean` | `false` | Adds the standard `*` indicator + `aria-required="true"`. |

## Input

Plain text input.

```tsx
<Input
  type="email"
  placeholder="you@example.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

| Prop           | Type                   | Default  | Description                                  |
| -------------- | ---------------------- | -------- | -------------------------------------------- |
| `type`         | `string`               | `'text'` | HTML input type. `email`, `tel`, `url`, etc. |
| `size`         | `'sm' \| 'md' \| 'lg'` | `'md'`   | Height / padding shorthand.                  |
| `leadingIcon`  | `ReactNode`            | —        | Icon before the value.                       |
| `trailingIcon` | `ReactNode`            | —        | Icon after the value.                        |
| `...input`     | HTML input attrs       | —        | `value`, `onChange`, `placeholder`, etc.     |

## TextArea

Multi-line text input. `rows` for initial height; pass `autoSize` to
auto-grow with content.

```tsx
<TextArea rows={4} placeholder="Tell us more…" autoSize />
```

| Prop       | Type      | Default | Description                                         |
| ---------- | --------- | ------- | --------------------------------------------------- |
| `rows`     | `number`  | `3`     | Initial visible rows.                               |
| `autoSize` | `boolean` | `false` | Grows the input height to fit content.              |
| `maxRows`  | `number`  | —       | Cap on `autoSize` growth before scrolling kicks in. |

## NumberInput

Numeric input with up / down stepper buttons + min / max / step
clamping.

```tsx
<NumberInput min={0} max={100} step={5} value={qty} onValueChange={setQty} />
```

| Prop            | Type                  | Default     | Description                                 |
| --------------- | --------------------- | ----------- | ------------------------------------------- |
| `value`         | `number`              | —           | Controlled value.                           |
| `defaultValue`  | `number`              | —           | Uncontrolled initial value.                 |
| `onValueChange` | `(n: number) => void` | —           | Change handler. Receives the clamped value. |
| `min`           | `number`              | `-Infinity` | Lower bound.                                |
| `max`           | `number`              | `Infinity`  | Upper bound.                                |
| `step`          | `number`              | `1`         | Increment per stepper click / arrow.        |

## PasswordInput

Password input with a show / hide toggle.

```tsx
<PasswordInput
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="Password"
/>
```

The trailing icon flips between Eye / EyeOff depending on visibility
state.

## Label / FieldHelp / FieldError

Drop these inside a `<Field>` and they wire up automatically:

- `<Label>` — `<label htmlFor>` pointing to the field's input.
- `<FieldHelp>` — appears below the input, gets `aria-describedby`.
- `<FieldError>` — same as FieldHelp but red + `aria-invalid` flips
  on the input.

## Fieldset

Group multiple fields under a single legend.

```tsx
<Fieldset legend="Contact">
  <Field>
    <Label>Email</Label>
    <Input type="email" />
  </Field>
  <Field>
    <Label>Phone</Label>
    <Input type="tel" />
  </Field>
</Fieldset>
```

## See also

- [Auth recipe](../recipes/auth) — full sign-in / sign-up flow.
- [Toggle (headless)](../headless/toggle) — Switch / Checkbox / Radio.
