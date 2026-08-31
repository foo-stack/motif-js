import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { HStack, Label, Text, VStack } from 'usemotif';
import { Radio, RadioGroup } from '@usemotif/headless';
import { Note } from '../../harness/demo.js';

// RadioGroup is HEADLESS - a `role="radiogroup"` container that shares a form
// `name` + the current value across its child <Radio> inputs via context.
// Uncontrolled by default (`defaultValue`); pass `value` + `onValueChange` to
// control. Each <Radio> is a bare native `<input type="radio">`, styled here
// with size + theme `accent-color`. Motif emits theme tokens as `--<scale>-<path>`
// CSS custom properties; referenced with hex fallbacks.

const RADIO_STYLE: CSSProperties = {
  width: 16,
  height: 16,
  cursor: 'pointer',
  accentColor: 'var(--colors-action-primary-bg, #3b82f6)',
};

const PLANS = [
  { value: 'free', label: 'Free' },
  { value: 'pro', label: 'Pro' },
  { value: 'team', label: 'Team' },
] as const;

/**
 * `RadioGroup` - a headless single-select group. It renders a
 * `role="radiogroup"` `<div>` and, via context, gives every nested `<Radio>` a
 * shared `name` and a synchronised `checked` state. Uncontrolled by default
 * (`defaultValue`); pass `value` + `onValueChange` for controlled use. Always
 * give the group an `aria-label` (or `aria-labelledby`) so it announces as one
 * composite control. Visuals come from `style` / `className` on each `Radio`.
 */
const meta = {
  title: 'Forms/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    value: { control: false },
    defaultValue: { control: 'inline-radio', options: PLANS.map((p) => p.value) },
    onValueChange: { control: false },
    children: { control: false },
  },
  args: {
    defaultValue: 'pro',
    'aria-label': 'Plan',
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

function Option({ value, label }: { value: string; label: string }) {
  const id = `plan-${value}`;
  return (
    <HStack gap="$2" alignItems="center">
      <Radio id={id} value={value} style={RADIO_STYLE} />
      <Label htmlFor={id}>{label}</Label>
    </HStack>
  );
}

/** Live-controls playground - pick the initial `defaultValue` in Controls. */
export const Playground: Story = {
  render: (args) => (
    <RadioGroup {...args} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {PLANS.map((p) => (
        <Option key={p.value} value={p.value} label={p.label} />
      ))}
    </RadioGroup>
  ),
};

/**
 * Controlled - `value` + `onValueChange` drive an external `useState`, echoed
 * below the group.
 */
export const Controlled: Story = {
  render: () => {
    const [plan, setPlan] = useState('pro');
    return (
      <VStack gap="$3">
        <RadioGroup
          aria-label="Plan"
          value={plan}
          onValueChange={setPlan}
          style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
        >
          {PLANS.map((p) => (
            <Option key={p.value} value={p.value} label={p.label} />
          ))}
        </RadioGroup>
        <Text color="$colors.text.muted" fontSize="$sm">
          Selected: {plan}
        </Text>
      </VStack>
    );
  },
};

/** A disabled option inside an otherwise-interactive group. */
export const WithDisabledOption: Story = {
  render: () => (
    <RadioGroup
      aria-label="Plan"
      defaultValue="free"
      style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      <HStack gap="$2" alignItems="center">
        <Radio id="d-free" value="free" style={RADIO_STYLE} />
        <Label htmlFor="d-free">Free</Label>
      </HStack>
      <HStack gap="$2" alignItems="center">
        <Radio id="d-pro" value="pro" style={RADIO_STYLE} />
        <Label htmlFor="d-pro">Pro</Label>
      </HStack>
      <HStack gap="$2" alignItems="center">
        <Radio id="d-team" value="team" disabled style={RADIO_STYLE} />
        <Label htmlFor="d-team">Team (unavailable)</Label>
      </HStack>
      <Note>The third option is disabled.</Note>
    </RadioGroup>
  ),
};
