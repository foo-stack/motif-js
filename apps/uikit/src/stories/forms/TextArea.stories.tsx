import type { Meta, StoryObj } from '@storybook/react';
import { Box, Field, FieldError, FieldHelp, Label, TextArea } from 'usemotif';

/**
 * `TextArea` wraps the native `<textarea>` - it extends
 * `TextareaHTMLAttributes`, NOT `BoxProps`, so no Motif style props. It
 * adds `rows` (default `3`) and an `invalid` flag, and is vertically
 * resizable. Wrap in a `<Box w={...}>` to control width.
 */
const meta = {
  title: 'Forms/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    rows: { control: { type: 'number', min: 1, max: 12 } },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    defaultValue: { control: 'text' },
  },
  args: {
    placeholder: 'Say something about yourself...',
    rows: 3,
    invalid: false,
    disabled: false,
  },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Live-controls playground, wrapped in a `<Box>` for width. */
export const Playground: Story = {
  render: (args) => (
    <Box w={360}>
      <TextArea {...args} />
    </Box>
  ),
};

/** Default, invalid, disabled, and a taller `rows` variant inside `<Field>`. */
export const States: Story = {
  render: () => (
    <Box w={360} display="flex" flexDirection="column" gap="$4">
      <Field>
        <Label>Bio</Label>
        <TextArea rows={4} placeholder="Say something about yourself..." />
        <FieldHelp>Markdown is supported.</FieldHelp>
      </Field>

      <Field invalid>
        <Label>Comment</Label>
        <TextArea defaultValue="too short" />
        <FieldError>Comment must be at least 20 characters.</FieldError>
      </Field>

      <Field disabled>
        <Label>Disabled</Label>
        <TextArea defaultValue="cannot edit" />
      </Field>
    </Box>
  ),
};
