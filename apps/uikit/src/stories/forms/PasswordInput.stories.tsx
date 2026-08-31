import type { Meta, StoryObj } from '@storybook/react';
import { Box, Field, FieldError, FieldHelp, Label, PasswordInput } from 'usemotif';

/**
 * `PasswordInput` is `Input` pinned to `type="password"` with a built-in
 * eye-toggle (`togglable`, default `true`) that swaps between obscured and
 * plain text. It extends `InputProps` (minus `type`) - native attributes +
 * `invalid`, no Motif style props. Wrap in a `<Box w={...}>` for layout.
 */
const meta = {
  title: 'Forms/PasswordInput',
  component: PasswordInput,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    togglable: { control: 'boolean' },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    placeholder: '••••••••',
    togglable: true,
    invalid: false,
    disabled: false,
  },
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Live-controls playground, wrapped in a `<Box>` for width. */
export const Playground: Story = {
  render: (args) => (
    <Box w={320}>
      <PasswordInput {...args} />
    </Box>
  ),
};

/** Togglable (default) vs. plain - set `togglable={false}` to hide the eye. */
export const Togglable: Story = {
  render: () => (
    <Box w={320} display="flex" flexDirection="column" gap="$4">
      <Field>
        <Label>Password (togglable)</Label>
        <PasswordInput defaultValue="hunter2" />
        <FieldHelp>Click the eye to reveal.</FieldHelp>
      </Field>

      <Field>
        <Label>Password (no toggle)</Label>
        <PasswordInput defaultValue="hunter2" togglable={false} />
      </Field>
    </Box>
  ),
};

/** Invalid and disabled states inside `<Field>`. */
export const States: Story = {
  render: () => (
    <Box w={320} display="flex" flexDirection="column" gap="$4">
      <Field invalid>
        <Label>Password</Label>
        <PasswordInput defaultValue="short" />
        <FieldError>Must be at least 8 characters.</FieldError>
      </Field>

      <Field disabled>
        <Label>Disabled</Label>
        <PasswordInput defaultValue="cannot edit" />
      </Field>
    </Box>
  ),
};
