import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties, ReactElement } from 'react';
import { useState } from 'react';
import { HStack, Text, VStack } from 'usemotif';
import { RatingInput } from '@usemotif/headless';
import { Note } from '../../harness/demo.js';

// RatingInput is HEADLESS — it ships ARIA wiring (role="slider" with
// aria-valuenow 0..count), keyboard nav (arrows + Home/End), and click-to-set,
// but no visuals. The one required prop is `renderItem`, a render fn called per
// item with `{ index, filled, half }`; the caller draws each star/heart.
// `count` sets the number of items (default 5), `allowHalf` enables half-steps,
// `disabled` freezes it. Motif emits theme tokens as `--<scale>-<path>` CSS
// custom properties; referenced here with hex fallbacks.

const STAR: CSSProperties = {
  fontSize: 24,
  lineHeight: 1,
  userSelect: 'none',
};

// A simple star glyph. `half` is supported by RatingInput's render contract;
// we approximate it with a left-clipped overlay.
function Star({ filled, half }: { filled: boolean; half: boolean }): ReactElement {
  const ON = 'var(--colors-action-primary-bg, #f59e0b)';
  const OFF = 'var(--colors-surface-muted, #d1d5db)';
  if (half) {
    return (
      <span style={{ ...STAR, position: 'relative', color: OFF }}>
        ★
        <span
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '50%',
            overflow: 'hidden',
            color: ON,
          }}
        >
          ★
        </span>
      </span>
    );
  }
  return <span style={{ ...STAR, color: filled ? ON : OFF }}>★</span>;
}

/**
 * `RatingInput` — a headless star-rating control. It renders a
 * `role="slider"` (0..`count`) and calls the required `renderItem` fn for each
 * item with `{ index, filled, half }` so you supply the glyphs. Controlled via
 * `value` + `onValueChange`, or uncontrolled via `defaultValue`. `count`
 * (default 5) sizes the scale; `allowHalf` permits 0.5 steps (Shift+Arrow and
 * left-half clicks); `disabled` freezes it. Give it an `aria-label`.
 */
const meta = {
  title: 'Forms/RatingInput',
  component: RatingInput,
  tags: ['autodocs'],
  argTypes: {
    count: { control: { type: 'number', min: 1, max: 10 } },
    allowHalf: { control: 'boolean' },
    disabled: { control: 'boolean' },
    value: { control: false },
    renderItem: { control: false },
  },
  args: {
    count: 5,
    allowHalf: false,
    disabled: false,
    defaultValue: 3,
    'aria-label': 'Rating',
    renderItem: ({ filled, half }) => <Star filled={filled} half={half} />,
  },
} satisfies Meta<typeof RatingInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Live-controls playground — tweak count / allowHalf / disabled. */
export const Playground: Story = {};

/**
 * Controlled — `value` + `onValueChange` drive a `useState`, echoed live. Click
 * a star or focus the control and use the arrow keys.
 */
export const Controlled: Story = {
  render: () => {
    const [rating, setRating] = useState(4);
    return (
      <VStack gap="$3">
        <HStack gap="$3" alignItems="center">
          <RatingInput
            aria-label="Product rating"
            value={rating}
            onValueChange={setRating}
            renderItem={({ filled, half }) => <Star filled={filled} half={half} />}
          />
          <Text fontFamily="$mono">{rating} / 5</Text>
        </HStack>
        <Note>Click to set · arrow keys to adjust · Home/End for min/max.</Note>
      </VStack>
    );
  },
};

/** `allowHalf` — half-star precision via left-half clicks or Shift+Arrow. */
export const HalfSteps: Story = {
  render: () => {
    const [rating, setRating] = useState(2.5);
    return (
      <HStack gap="$3" alignItems="center">
        <RatingInput
          aria-label="Half-step rating"
          allowHalf
          value={rating}
          onValueChange={setRating}
          renderItem={({ filled, half }) => <Star filled={filled} half={half} />}
        />
        <Text fontFamily="$mono">{rating}</Text>
      </HStack>
    );
  },
};

/** A larger 10-item scale, and a disabled (read-only) rating. */
export const Variants: Story = {
  render: () => (
    <VStack gap="$4">
      <VStack gap="$1">
        <Note>count={'{10}'}</Note>
        <RatingInput
          aria-label="Ten-star rating"
          count={10}
          defaultValue={7}
          renderItem={({ filled, half }) => <Star filled={filled} half={half} />}
        />
      </VStack>
      <VStack gap="$1">
        <Note>disabled (read-only)</Note>
        <RatingInput
          aria-label="Read-only rating"
          disabled
          defaultValue={4}
          renderItem={({ filled, half }) => <Star filled={filled} half={half} />}
          style={{ opacity: 0.6 }}
        />
      </VStack>
    </VStack>
  ),
};
