import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { HStack, Text, VStack } from 'usemotif';
import { RangeSlider } from '@usemotif/headless';
import { Note } from '../../harness/demo.js';

// RangeSlider is HEADLESS - it holds a two-handle `[number, number]` value and
// ships ARIA wiring (two role="slider" thumbs with the correct
// aria-valuemin/now/max relationship) plus keyboard nav per thumb (arrows +
// Home/End). It is INTENTIONALLY MINIMAL: it renders only the wrapper plus two
// bare <div> thumbs and exposes a single `style` hook (the wrapper). It does
// NOT position the thumbs, render a track/fill, or accept thumb/fill style
// props - that layout is the app's job. These stories style the wrapper as a
// visible track and surface the value via the controlled API. Motif emits
// theme tokens as `--<scale>-<path>` CSS custom properties; referenced with
// hex fallbacks.

const TRACK: CSSProperties = {
  width: 260,
  height: 28,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '0 6px',
  borderRadius: 999,
  background: 'var(--colors-surface-muted, #e5e7eb)',
};

// The two thumbs are the RangeSlider wrapper's direct children. RangeSlider
// only exposes a `style` prop (no `className`), so we scope a CSS rule to a
// parent wrapper div and target the `role="slider"` thumbs beneath it.
const THUMB_CSS = `
  .motif-range-track [role='slider'] {
    width: 16px;
    height: 16px;
    border-radius: 999px;
    cursor: pointer;
    background: var(--colors-surface-default, #ffffff);
    border: 2px solid var(--colors-action-primary-bg, #3b82f6);
    box-shadow: 0 1px 2px rgba(0,0,0,0.2);
  }
  .motif-range-track [role='slider']:focus-visible {
    outline: 2px solid var(--colors-action-primary-bg, #3b82f6);
    outline-offset: 2px;
  }
`;

/**
 * `RangeSlider` - a headless two-handle range. Its value is a
 * `[number, number]` tuple, controlled via `value` + `onValueChange` or
 * uncontrolled via `defaultValue`. Bounded by `min` / `max` / `step`; the
 * lower thumb's `aria-valuemax` is the upper thumb's value and vice-versa, so
 * the handles can't cross. Keyboard nav (arrows, Home/End) is per-thumb. It is
 * deliberately minimal: a single `style` hook on the wrapper and two bare
 * `role="slider"` thumb divs - there is no built-in track, fill, or thumb
 * positioning, so an app supplies that layout. Always give it an `aria-label`.
 */
const meta = {
  title: 'Forms/RangeSlider',
  component: RangeSlider,
  tags: ['autodocs'],
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
    value: { control: false },
    style: { control: false },
  },
  args: {
    min: 0,
    max: 100,
    step: 1,
    defaultValue: [25, 75],
    disabled: false,
    'aria-label': 'Price range',
  },
} satisfies Meta<typeof RangeSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Live-controls playground. */
export const Playground: Story = {
  render: (args) => (
    <div className="motif-range-track">
      <style>{THUMB_CSS}</style>
      <RangeSlider {...args} style={TRACK} />
    </div>
  ),
};

/**
 * Controlled - the `[lo, hi]` tuple drives a `useState`, echoed live. Focus a
 * thumb and use the arrow keys; the thumbs cannot cross.
 */
export const Controlled: Story = {
  render: () => {
    const [range, setRange] = useState<[number, number]>([200, 800]);
    return (
      <VStack gap="$3" className="motif-range-track">
        <style>{THUMB_CSS}</style>
        <HStack gap="$3" alignItems="center">
          <RangeSlider
            aria-label="Price"
            min={0}
            max={1000}
            step={50}
            value={range}
            onValueChange={setRange}
            style={TRACK}
          />
          <Text fontFamily="$mono">
            ${range[0]} - ${range[1]}
          </Text>
        </HStack>
        <Note>Two role="slider" thumbs; lower/upper bounds clamp each other.</Note>
      </VStack>
    );
  },
};

/** Disabled - both thumbs drop out of the tab order and ignore input. */
export const Disabled: Story = {
  render: () => (
    <div className="motif-range-track">
      <style>{THUMB_CSS}</style>
      <RangeSlider
        aria-label="Disabled range"
        defaultValue={[30, 70]}
        disabled
        style={{ ...TRACK, opacity: 0.5 }}
      />
    </div>
  ),
};
