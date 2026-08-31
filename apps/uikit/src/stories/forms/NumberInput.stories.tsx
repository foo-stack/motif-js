import type { Meta, StoryObj } from '@storybook/react';
import { Box, Field, FieldError, FieldHelp, Label, NumberInput } from 'usemotif';

/**
 * `NumberInput` is `Input` pinned to `type="number"` with
 * `inputMode="numeric"`. It extends `InputProps` (minus `type`) and so,
 * like `Input`, takes native attributes (`min`, `max`, `step`) plus
 * `invalid` - NOT Motif style props. Wrap in a `<Box w={...}>` for layout.
 */
const meta = {
  title: 'Forms/NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    placeholder: '0',
    min: 0,
    max: 120,
    invalid: false,
    disabled: false,
  },
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Live-controls playground, wrapped in a `<Box>` for width. */
export const Playground: Story = {
  render: (args) => (
    <Box w={200}>
      <NumberInput {...args} />
    </Box>
  ),
};

/** Default, invalid, and disabled states inside `<Field>`. */
export const States: Story = {
  render: () => (
    <Box w={200} display="flex" flexDirection="column" gap="$4">
      <Field>
        <Label>Age</Label>
        <NumberInput min={0} max={120} />
        <FieldHelp>Between 0 and 120.</FieldHelp>
      </Field>

      <Field invalid>
        <Label>Quantity</Label>
        <NumberInput defaultValue={-1} min={1} />
        <FieldError>Quantity must be at least 1.</FieldError>
      </Field>

      <Field disabled>
        <Label>Locked</Label>
        <NumberInput defaultValue={42} />
      </Field>
    </Box>
  ),
};
