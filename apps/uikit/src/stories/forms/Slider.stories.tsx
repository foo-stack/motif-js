import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { HStack, Text, VStack } from 'usemotif';
import { Slider } from '@usemotif/headless';
import { Note } from '../../harness/demo.js';

// Slider is HEADLESS - it ships ARIA wiring (role="slider", aria-valuenow/min/max),
// pointer dragging, and full keyboard nav (arrows, Home/End, PageUp/Down), but
// no visuals. It exposes three style hooks: `style` (the track wrapper),
// `fillStyle` (the filled portion), and `thumbStyle` (the handle). The fill
// and thumb are absolutely positioned, so the track needs an explicit height.
// Motif emits theme tokens as `--<scale>-<path>` CSS custom properties;
// referenced here with hex fallbacks.

const TRACK: CSSProperties = {
  width: 260,
  height: 6,
  borderRadius: 999,
  background: 'var(--colors-surface-muted, #e5e7eb)',
};
const FILL: CSSProperties = {
  top: 0,
  height: 6,
  borderRadius: 999,
  background: 'var(--colors-action-primary-bg, #3b82f6)',
};
const THUMB: CSSProperties = {
  top: -5,
  width: 16,
  height: 16,
  marginLeft: -8,
  borderRadius: 999,
  background: 'var(--colors-surface-default, #ffffff)',
  border: '2px solid var(--colors-action-primary-bg, #3b82f6)',
  boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
};

/**
 * `Slider` - a headless single-value range input. Controlled via `value` +
 * `onValueChange`, or uncontrolled via `defaultValue`. Bound by `min` / `max`
 * / `step`; values are snapped to the step and clamped. Supports
 * `orientation="vertical"` and a `disabled` flag. Give it an `aria-label`. The
 * three style hooks - `style`, `fillStyle`, `thumbStyle` - supply all visuals;
 * because the fill and thumb are absolutely positioned, the track `style` must
 * set an explicit height.
 */
const meta = {
  title: 'Forms/Slider',
  component: Slider,
  tags: ['autodocs'],
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    value: { control: false },
    style: { control: false },
    fillStyle: { control: false },
    thumbStyle: { control: false },
  },
  args: {
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 40,
    disabled: false,
    orientation: 'horizontal',
    'aria-label': 'Volume',
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Live-controls playground - adjust min/max/step/disabled. */
export const Playground: Story = {
  render: (args) => <Slider {...args} style={TRACK} fillStyle={FILL} thumbStyle={THUMB} />,
};

/**
 * Controlled - `value` + `onValueChange` drive an external `useState`, shown
 * as a live readout. Drag the thumb or focus it and use the arrow keys.
 */
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState(60);
    return (
      <VStack gap="$3">
        <HStack gap="$3" alignItems="center">
          <Slider
            aria-label="Brightness"
            value={value}
            onValueChange={setValue}
            style={TRACK}
            fillStyle={FILL}
            thumbStyle={THUMB}
          />
          <Text fontFamily="$mono" w={36}>
            {value}
          </Text>
        </HStack>
        <Note>Arrow keys ±step · Home/End jump to min/max · PageUp/Down ±10 steps.</Note>
      </VStack>
    );
  },
};

/** Custom bounds + step: a 0-10 rating at half-step granularity. */
export const SteppedRange: Story = {
  render: () => {
    const [value, setValue] = useState(5);
    return (
      <HStack gap="$3" alignItems="center">
        <Slider
          aria-label="Rating"
          min={0}
          max={10}
          step={0.5}
          value={value}
          onValueChange={setValue}
          style={TRACK}
          fillStyle={FILL}
          thumbStyle={THUMB}
        />
        <Text fontFamily="$mono" w={36}>
          {value}
        </Text>
      </HStack>
    );
  },
};

/** Disabled - non-interactive, `aria-disabled` set and `tabIndex={-1}`. */
export const Disabled: Story = {
  render: () => (
    <Slider
      aria-label="Disabled"
      defaultValue={30}
      disabled
      style={{ ...TRACK, opacity: 0.5 }}
      fillStyle={FILL}
      thumbStyle={THUMB}
    />
  ),
};
