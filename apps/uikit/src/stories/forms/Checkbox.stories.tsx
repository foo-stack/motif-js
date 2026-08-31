import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { Box, HStack, Label, Text, VStack } from 'usemotif';
import { Checkbox, type CheckboxProps } from '@usemotif/headless';
import { Matrix } from '../../harness/Matrix.js';
import { Note } from '../../harness/demo.js';

// Checkbox is a HEADLESS control - a bare `<input type="checkbox">` with ARIA
// wiring (including `aria-checked="mixed"` for the indeterminate state) but no
// visuals. We give it size + an `accent-color` from the theme tokens so it's
// visible. Motif emits theme tokens as `--<scale>-<path>` CSS custom
// properties; referenced here with hex fallbacks.

const BOX_STYLE: CSSProperties = {
  width: 18,
  height: 18,
  cursor: 'pointer',
  accentColor: 'var(--colors-action-primary-bg, #3b82f6)',
};

/**
 * `Checkbox` - a headless boolean input. It renders a native
 * `<input type="checkbox">`, so it works with form submission and reset. Pass
 * `checked` + `onChange` to control it or `defaultChecked` to leave it
 * uncontrolled. Two extras: `invalid` emits `aria-invalid`, and
 * `indeterminate` sets the DOM `.indeterminate` flag plus
 * `aria-checked="mixed"` (the caller owns that flag - browsers don't expose it
 * as an attribute). All visuals come from `style` / `className`.
 */
const meta = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    style: { control: false },
  },
  args: {
    defaultChecked: true,
    indeterminate: false,
    disabled: false,
    invalid: false,
    'aria-label': 'Subscribe',
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Live-controls playground. */
export const Playground: Story = {
  render: (args) => <Checkbox {...args} style={BOX_STYLE} />,
};

/** Labelled, controlled checkbox wired to a `<Label htmlFor>`. */
export const Labelled: Story = {
  render: () => {
    const [checked, setChecked] = useState(true);
    return (
      <HStack gap="$3" alignItems="center">
        <Checkbox
          id="subscribe"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          style={BOX_STYLE}
        />
        <Label htmlFor="subscribe">Subscribe to the newsletter</Label>
      </HStack>
    );
  },
};

/** checked (rows) × disabled (cols) - the discrete state cross-product. */
export const StateMatrix: Story = {
  render: () => (
    <Matrix<CheckboxProps>
      base={{ style: BOX_STYLE, 'aria-label': 'checkbox' } as Partial<CheckboxProps>}
      rows={{
        prop: 'defaultChecked',
        values: [false, true],
        label: (v) => (v ? 'checked' : 'unchecked'),
      }}
      cols={{
        prop: 'disabled',
        values: [false, true],
        label: (v) => (v ? 'disabled' : 'enabled'),
      }}
      render={(p) => <Checkbox {...p} />}
    />
  ),
};

/**
 * Indeterminate ("mixed") state - used for a parent checkbox whose children
 * are partially selected. Emits `aria-checked="mixed"`.
 */
export const Indeterminate: Story = {
  render: () => (
    <HStack gap="$3" alignItems="center">
      <Checkbox indeterminate aria-label="Select all" style={BOX_STYLE} />
      <Box>
        <Text>Select all</Text>
        <Note>indeterminate - aria-checked="mixed".</Note>
      </Box>
    </HStack>
  ),
};

/** The `invalid` flag, e.g. an unchecked "accept terms" box on submit. */
export const Invalid: Story = {
  render: () => (
    <VStack gap="$2">
      <HStack gap="$3" alignItems="center">
        <Checkbox invalid aria-label="Accept terms" style={BOX_STYLE} />
        <Box>
          <Text>I accept the terms</Text>
          <Note>invalid - emits aria-invalid="true".</Note>
        </Box>
      </HStack>
    </VStack>
  ),
};
