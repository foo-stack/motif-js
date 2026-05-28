import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { VStack } from 'usemotif';
import { TimeInput } from '@usemotif/headless';
import { Note } from '../../harness/demo.js';

// TimeInput is a thin forwardRef wrapper over <input type="time">. It adds a
// generated id and maps `precision` ('minute' | 'second') to the input's
// `step`. All other native input attributes (value, onChange, min, max,
// disabled, required, aria-*) pass straight through.
const INPUT: CSSProperties = {
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid var(--colors-border-default, #e5e7eb)',
  background: 'var(--colors-surface-base, #ffffff)',
  color: 'var(--colors-text-default, #111827)',
  fontSize: 14,
};

/**
 * TimeInput — a `forwardRef` wrapper over a native `<input type="time">`.
 * It generates an `id` and maps `precision` (`'minute'` default | `'second'`)
 * to the input `step` (1s for seconds). Every other native input attribute
 * (`value`, `onChange`, `min`, `max`, `disabled`, `required`, `aria-*`)
 * passes through. Controlled like any native input.
 */
const meta = {
  title: 'Date & Time/TimeInput',
  component: TimeInput,
  tags: ['autodocs'],
  argTypes: {
    precision: { control: 'inline-radio', options: ['minute', 'second'] },
    disabled: { control: 'boolean' },
  },
  args: {
    precision: 'minute',
    disabled: false,
    'aria-label': 'Meeting time',
  },
} satisfies Meta<typeof TimeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Controlled native time input. */
export const Playground: Story = {
  render: (args) => {
    function Demo() {
      const [time, setTime] = useState('09:30');
      return (
        <VStack gap="$2">
          <TimeInput
            {...args}
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={INPUT}
          />
          <Note>value = {time || '(empty)'}</Note>
        </VStack>
      );
    }
    return <Demo />;
  },
};

/** Second precision — the picker exposes seconds (step=1). */
export const SecondPrecision: Story = {
  render: () => {
    function Demo() {
      const [time, setTime] = useState('09:30:15');
      return (
        <TimeInput
          precision="second"
          aria-label="Start time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={INPUT}
        />
      );
    }
    return <Demo />;
  },
};

/** Disabled. */
export const Disabled: Story = {
  render: () => <TimeInput aria-label="Locked time" value="12:00" disabled readOnly style={INPUT} />,
};
