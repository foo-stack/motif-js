# Slider / RangeSlider / Progress / RatingInput

Value-along-an-axis controls. Headless wiring (ARIA + keyboard); no
built-in styling beyond the geometry needed for the drag surfaces.

## Import

```ts
import { Slider, RangeSlider, Progress, RatingInput } from '@motif-js/headless';
```

## Slider

Single-thumb slider.

```tsx
<Slider value={volume} onValueChange={setVolume} min={0} max={100} step={5} />
```

| Prop                                 | Type                         | Default        | Description              |
| ------------------------------------ | ---------------------------- | -------------- | ------------------------ |
| `value`                              | `number`                     | —              | Controlled.              |
| `defaultValue`                       | `number`                     | `0`            | Uncontrolled.            |
| `onValueChange`                      | `(n: number) => void`        | —              | Change handler.          |
| `min` / `max`                        | `number`                     | `0` / `100`    | Bounds.                  |
| `step`                               | `number`                     | `1`            | Snap interval.           |
| `disabled`                           | `boolean`                    | `false`        | Disables interaction.    |
| `orientation`                        | `'horizontal' \| 'vertical'` | `'horizontal'` | Axis.                    |
| `style` / `thumbStyle` / `fillStyle` | `CSSProperties`              | —              | Per-element style hooks. |

### Keyboard

- ArrowRight / ArrowUp — increment by `step`.
- ArrowLeft / ArrowDown — decrement.
- Home / End — `min` / `max`.
- PageUp / PageDown — ±10 steps.

## RangeSlider

Two-thumb slider — selects a value range.

```tsx
<RangeSlider value={[20, 80]} onValueChange={setRange} min={0} max={100} />
```

The two thumbs constrain each other: the lower thumb's max is the
upper thumb's value, and vice versa, so they can't cross.

| Prop                   | Type                            | Default           | Description       |
| ---------------------- | ------------------------------- | ----------------- | ----------------- |
| `value`                | `[number, number]`              | —                 | Controlled tuple. |
| `defaultValue`         | `[number, number]`              | `[0, 100]`        | Uncontrolled.     |
| `onValueChange`        | `(v: [number, number]) => void` | —                 | Change handler.   |
| `min` / `max` / `step` | `number`                        | `0` / `100` / `1` | As Slider.        |

## Progress

Read-only progress bar. Pass `value: number | null` — `null` is the
indeterminate state (no `aria-valuenow`).

```tsx
<Progress value={42} max={100} aria-label="Uploading" />
<Progress value={null} aria-label="Loading" /> {/* indeterminate */}
```

| Prop                  | Type             | Default | Description                                 |
| --------------------- | ---------------- | ------- | ------------------------------------------- |
| `value`               | `number \| null` | —       | Current value, or `null` for indeterminate. |
| `max`                 | `number`         | `100`   | Upper bound of the scale.                   |
| `style` / `fillStyle` | `CSSProperties`  | —       | Track / fill style hooks.                   |

## RatingInput

Star-rating-style input. Caller supplies the `renderItem` for each
position.

```tsx
<RatingInput
  count={5}
  value={rating}
  onValueChange={setRating}
  allowHalf
  renderItem={({ filled, half }) => (
    <Star
      color={filled ? '$colors.warning.500' : half ? '$colors.warning.300' : '$colors.gray.300'}
    />
  )}
/>
```

| Prop                     | Type                                        | Default | Description                                        |
| ------------------------ | ------------------------------------------- | ------- | -------------------------------------------------- |
| `count`                  | `number`                                    | `5`     | Number of items.                                   |
| `value` / `defaultValue` | `number`                                    | `0`     | Current rating (0..count).                         |
| `onValueChange`          | `(n: number) => void`                       | —       | Change handler.                                    |
| `allowHalf`              | `boolean`                                   | `false` | Half-step support via Shift+Arrow / partial click. |
| `renderItem`             | `({ index, filled, half }) => ReactElement` | —       | Required. Per-item visual.                         |

### Keyboard

- ArrowRight / ArrowUp — increment by step (1 or 0.5 with `allowHalf`).
- ArrowLeft / ArrowDown — decrement.
- Home / End — 0 / `count`.

## See also

- [Forms](../primitives/forms) — `NumberInput` for typed numeric values.
