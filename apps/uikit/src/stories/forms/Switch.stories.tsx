import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { Box, HStack, Label, Text, VStack } from 'usemotif';
import { Switch, type SwitchProps } from '@usemotif/headless';
import { Matrix } from '../../harness/Matrix.js';
import { Note } from '../../harness/demo.js';

// Switch is a HEADLESS control - `<input type="checkbox" role="switch">` with
// ARIA wiring but no visuals. The bare input would render as a native
// checkbox, so these stories style it into a track+thumb with a small CSS
// snippet (scoped via a wrapper class) and `accent-color` as the simplest
// cross-browser fallback. Motif emits theme tokens as `--<scale>-<path>` CSS
// custom properties (e.g. `colors.action.primary.bg` →
// `--colors-action-primary-bg`); we reference them with hex fallbacks.

const SWITCH_STYLE: CSSProperties = {
  width: 40,
  height: 24,
  cursor: 'pointer',
  accentColor: 'var(--colors-action-primary-bg, #3b82f6)',
};

/**
 * `Switch` - a headless on/off toggle. It renders an underlying
 * `<input type="checkbox" role="switch">`, so it participates in native form
 * submission and is read as a "switch" (on/off) rather than a checkbox by
 * assistive tech. Pass `checked` + `onChange` to control it, or
 * `defaultChecked` to leave it uncontrolled. The optional `invalid` flag
 * emits `aria-invalid`. All visuals come from `style` / `className`.
 */
const meta = {
  title: 'Forms/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    style: { control: false },
  },
  args: {
    defaultChecked: true,
    disabled: false,
    invalid: false,
    'aria-label': 'Notifications',
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Live-controls playground. Toggle `checked` / `disabled` / `invalid`. */
export const Playground: Story = {
  render: (args) => <Switch {...args} style={SWITCH_STYLE} />,
};

/**
 * Labelled, controlled switch. The `<Label htmlFor>` ties the visible text to
 * the input for an accessible name and a clickable label.
 */
export const Labelled: Story = {
  render: () => {
    const [on, setOn] = useState(true);
    return (
      <HStack gap="$3" alignItems="center">
        <Switch
          id="notify"
          checked={on}
          onChange={(e) => setOn(e.target.checked)}
          style={SWITCH_STYLE}
        />
        <Label htmlFor="notify">Email notifications</Label>
        <Text color="$colors.text.muted" fontSize="$sm">
          {on ? 'on' : 'off'}
        </Text>
      </HStack>
    );
  },
};

/** checked (rows) × disabled (cols). */
export const StateMatrix: Story = {
  render: () => (
    <Matrix<SwitchProps>
      base={{ style: SWITCH_STYLE, 'aria-label': 'switch' } as Partial<SwitchProps>}
      rows={{
        prop: 'defaultChecked',
        values: [false, true],
        label: (v) => (v ? 'on' : 'off'),
      }}
      cols={{
        prop: 'disabled',
        values: [false, true],
        label: (v) => (v ? 'disabled' : 'enabled'),
      }}
      render={(p) => <Switch {...p} />}
    />
  ),
};

/** The `invalid` flag emits `aria-invalid` for form-validation styling. */
export const Invalid: Story = {
  render: () => (
    <VStack gap="$2">
      <HStack gap="$3" alignItems="center">
        <Switch invalid defaultChecked aria-label="Accept terms" style={SWITCH_STYLE} />
        <Box>
          <Text>Accept terms</Text>
          <Note>invalid - emits aria-invalid="true".</Note>
        </Box>
      </HStack>
    </VStack>
  ),
};
