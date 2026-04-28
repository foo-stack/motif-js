# Calendar / DatePicker / TimeInput

Date and time inputs. `Calendar` is a pure-JS month grid (no peer
dep); `DatePicker` wraps it in a Popover; `TimeInput` is a typed
HTML `<input type="time">`.

## Import

```ts
import { Calendar, DatePicker, TimeInput } from '@motif-js/headless';
```

## Calendar

Focusable month grid with full keyboard navigation. Locale-aware
weekday + month labels via `Intl.DateTimeFormat`.

```tsx
<Calendar
  defaultValue={new Date()}
  onValueChange={setDate}
  locale="en-US"
  weekStartsOn={1}
  isDisabled={(d) => d.getDay() === 0}
/>
```

| Prop                     | Type                                                | Default     | Description                               |
| ------------------------ | --------------------------------------------------- | ----------- | ----------------------------------------- |
| `value` / `defaultValue` | `Date`                                              | —           | Selected date.                            |
| `onValueChange`          | `(d: Date) => void`                                 | —           | Selection handler.                        |
| `locale`                 | `string`                                            | (navigator) | BCP 47 locale for weekday / month labels. |
| `weekStartsOn`           | `0`–`6`                                             | `0`         | First day of week (0 = Sunday).           |
| `isDisabled`             | `(d: Date) => boolean`                              | —           | Per-day disabled gate.                    |
| `renderDay`              | `({ date, isSelected, isToday, ... }) => ReactNode` | (default)   | Override day cell render.                 |

### Keyboard

- ArrowLeft / Right — ±1 day.
- ArrowUp / Down — ±1 week.
- PageUp / PageDown — ±1 month.
- Home / End — start / end of week.
- Enter / Space — select focused day.

## DatePicker

Calendar in a Popover. Clicking the trigger opens the calendar;
selecting a date closes it.

```tsx
<DatePicker value={due} onValueChange={setDue} locale="en-US" placeholder="Pick a date" />
```

| Prop                            | Type                                   | Default         | Description                           |
| ------------------------------- | -------------------------------------- | --------------- | ------------------------------------- |
| `placeholder`                   | `string`                               | `'Pick a date'` | Trigger placeholder when no value.    |
| `renderTrigger`                 | `({ label, onClick }) => ReactElement` | (button)        | Override the trigger.                 |
| `popoverStyle` / `triggerStyle` | `CSSProperties`                        | —               | Style hooks.                          |
| `...Calendar`                   | All [Calendar](#calendar) props        | —               | Passed through to the inner Calendar. |

The default trigger formats the value via `Intl.DateTimeFormat({ dateStyle: 'medium' })`.
Override via `renderTrigger` to customize.

## TimeInput

Wrapper around `<input type="time">`. Optional `precision` controls
whether seconds are settable.

```tsx
<TimeInput value={time} onChange={(e) => setTime(e.target.value)} precision="minute" />
```

| Prop        | Type                       | Default    | Description                             |
| ----------- | -------------------------- | ---------- | --------------------------------------- |
| `precision` | `'minute' \| 'second'`     | `'minute'` | Sets `step={1}` for second precision.   |
| `step`      | `number`                   | (auto)     | Override step.                          |
| `...input`  | All HTMLInputElement props | —          | `value`, `min`, `max`, `disabled`, etc. |

## Native

- **Calendar** — pure-JS implementation, same date math, View /
  Pressable in place of div / button. Works without any peer dep.
- **DatePicker** — Calendar in an RN `<Modal transparent>`.
- **TimeInput** — `<TextInput>` with `keyboardType="numbers-and-punctuation"`
  - a `HH:MM` regex (`TIME_RE_24H` exported for caller-side validation).
    Apps that need iOS / Android native time pickers should adopt
    `@react-native-community/datetimepicker` and bypass this component.

## See also

- [Popover](./popover) — what DatePicker uses internally.
- [Forms](../primitives/forms) — for non-temporal inputs.
