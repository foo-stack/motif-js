import type { Meta, StoryObj } from '@storybook/react';
import { Box, Field, FieldError, FieldHelp, Input, Label } from 'usemotif';

/**
 * `Input` is a thin wrapper over the native `<input>` - it extends
 * `InputHTMLAttributes`, NOT `BoxProps`, so it does **not** accept Motif
 * style props (`p`, `w`, `flex`, ...). It takes native input attributes, a
 * `style` escape hatch, and an `invalid` flag. For layout, wrap it in a
 * `<Box w={...}>` / `<Box flex={1}>` parent.
 *
 * Dropped inside a `<Field>`, it inherits `invalid` / `disabled` from the
 * field context and wires up `aria-describedby` automatically.
 */
const meta = {
  title: 'Forms/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    type: { control: 'text' },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    defaultValue: { control: 'text' },
  },
  args: {
    placeholder: 'you@example.com',
    type: 'email',
    invalid: false,
    disabled: false,
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Live-controls playground. Note the `<Box w={320}>` wrapper - `Input`
 * itself has no style props, so width is controlled by its parent.
 */
export const Playground: Story = {
  render: (args) => (
    <Box w={320}>
      <Input {...args} />
    </Box>
  ),
};

/** Default, invalid, disabled, and placeholder states inside `<Field>`. */
export const States: Story = {
  render: () => (
    <Box w={320} display="flex" flexDirection="column" gap="$4">
      <Field>
        <Label>Email</Label>
        <Input type="email" placeholder="you@example.com" />
        <FieldHelp>We'll never share it.</FieldHelp>
      </Field>

      <Field invalid>
        <Label>Username</Label>
        <Input defaultValue="bad value" />
        <FieldError>Username is already taken.</FieldError>
      </Field>

      <Field disabled>
        <Label>Disabled</Label>
        <Input defaultValue="cannot edit" />
      </Field>
    </Box>
  ),
};

/**
 * The wrapper pattern for layout: `Input` has no `flex`/`w` props, so use
 * a `<Box>` parent. Here two inputs sit side by side via `flex={1}`.
 */
export const LayoutWrapper: Story = {
  name: 'Layout (Box wrapper)',
  render: () => (
    <Box display="flex" gap="$3" w={420}>
      <Box flex={1}>
        <Input placeholder="First name" type="text" />
      </Box>
      <Box flex={1}>
        <Input placeholder="Last name" type="text" />
      </Box>
    </Box>
  ),
};
