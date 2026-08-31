import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { HStack, VStack } from 'usemotif';
import { ColorPicker } from '@usemotif/headless';
import { Note } from '../../harness/demo.js';

// ColorPicker is a headless HSV picker. It renders, in order: a
// saturation×value plane, a hue slider, an optional alpha slider (only when
// allowAlpha && format !== 'hex'), and a format toggle (radiogroup). It owns
// internal HSV state; `value`/`onValueChange` is a CSS color string in the
// active `format`. The component supplies only minimal geometry, so the
// stories pass style props for each part to make the surfaces visible.
const PLANE: CSSProperties = {
  width: 220,
  height: 150,
  borderRadius: 8,
  // hue is layered by the component's thumb position; this is a generic
  // sat/value backdrop so the drag surface is visible.
  background:
    'linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent), #ff0000',
};
const THUMB: CSSProperties = {
  width: 12,
  height: 12,
  borderRadius: 999,
  border: '2px solid #fff',
  boxShadow: '0 0 0 1px rgba(0,0,0,0.4)',
  transform: 'translate(-6px, -6px)',
};
const SLIDER: CSSProperties = {
  width: 220,
  height: 12,
  marginTop: 10,
  borderRadius: 999,
  background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)',
};
const ALPHA_SLIDER: CSSProperties = {
  width: 220,
  height: 12,
  marginTop: 10,
  borderRadius: 999,
  background: 'linear-gradient(to right, rgba(0,0,0,0), #000)',
};
const swatch = (color: string): CSSProperties => ({
  width: 40,
  height: 40,
  borderRadius: 8,
  background: color,
  border: '1px solid var(--colors-border-default, #e5e7eb)',
});

/**
 * ColorPicker - a headless HSV picker. It renders a saturation×value plane,
 * a hue slider, an optional alpha slider (only when `allowAlpha` and
 * `format !== 'hex'`), and a format toggle (`hex`/`rgb`/`hsl`, a
 * `radiogroup`). Controlled via `value`/`onValueChange` (a CSS color string
 * in the active `format`); `format`/`onFormatChange` control the toggle.
 * Style each part via `saturationValueStyle`, `saturationValueThumbStyle`,
 * `hueSliderStyle`, and `alphaSliderStyle`. Keyboard-drivable; pointer-drag
 * on the plane/sliders.
 */
const meta = {
  title: 'Specialized/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
  argTypes: {
    value: { control: false },
    defaultValue: { control: false },
    onValueChange: { control: false },
    onFormatChange: { control: false },
    formats: { control: false },
    style: { control: false },
    saturationValueStyle: { control: false },
    saturationValueThumbStyle: { control: false },
    hueSliderStyle: { control: false },
    alphaSliderStyle: { control: false },
    format: { control: 'inline-radio', options: ['hex', 'rgb', 'hsl'] },
    allowAlpha: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Controlled picker with a live swatch + value readout. */
export const Playground: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = useState('#3b82f6');
      return (
        <HStack gap="$4" alignItems="flex-start">
          <ColorPicker
            value={value}
            onValueChange={setValue}
            saturationValueStyle={PLANE}
            saturationValueThumbStyle={THUMB}
            hueSliderStyle={SLIDER}
          />
          <VStack gap="$2" alignItems="center">
            <div style={swatch(value)} aria-hidden="true" />
            <Note>{value}</Note>
          </VStack>
        </HStack>
      );
    }
    return <Demo />;
  },
};

/** Alpha slider enabled - requires a non-hex format (rgb/hsl). */
export const WithAlpha: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = useState('rgba(59, 130, 246, 0.8)');
      return (
        <HStack gap="$4" alignItems="flex-start">
          <ColorPicker
            value={value}
            onValueChange={setValue}
            format="rgb"
            allowAlpha
            saturationValueStyle={PLANE}
            saturationValueThumbStyle={THUMB}
            hueSliderStyle={SLIDER}
            alphaSliderStyle={ALPHA_SLIDER}
          />
          <VStack gap="$2" alignItems="center">
            <div style={swatch(value)} aria-hidden="true" />
            <Note>{value}</Note>
          </VStack>
        </HStack>
      );
    }
    return <Demo />;
  },
};

/** Disabled - surfaces non-interactive (`aria-disabled`). */
export const Disabled: Story = {
  render: () => (
    <ColorPicker
      defaultValue="#16a34a"
      disabled
      saturationValueStyle={PLANE}
      saturationValueThumbStyle={THUMB}
      hueSliderStyle={SLIDER}
    />
  ),
};
