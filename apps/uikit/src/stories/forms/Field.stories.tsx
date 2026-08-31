import type { Meta, StoryObj } from '@storybook/react';
import {
  Box,
  Field,
  FieldError,
  FieldHelp,
  Input,
  Label,
  NumberInput,
  PasswordInput,
  TextArea,
} from 'usemotif';

/**
 * `Field` is the accessibility glue for a form row - a `BoxProps`-based
 * column that generates a stable `id`, links `Label` / `FieldHelp` /
 * `FieldError` via `aria-describedby`, and broadcasts `invalid` /
 * `disabled` / `required` to any nested input through context.
 *
 * The canonical idiom is `<Field><Label/><Input/><FieldHelp/></Field>`;
 * swap in `<FieldError/>` when `invalid`, and the `required` flag adds a
 * `*` to the label automatically.
 */
const meta = {
  title: 'Forms/Field',
  component: Field,
  tags: ['autodocs'],
  argTypes: {
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    invalid: false,
    disabled: false,
    required: false,
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Live-controls playground. Toggle `invalid` / `disabled` / `required`
 * and watch the child `Input` + `Label` react via field context.
 */
export const Playground: Story = {
  render: (args) => (
    <Box w={320}>
      <Field {...args}>
        <Label>Email</Label>
        <Input type="email" placeholder="you@example.com" />
        <FieldHelp>We'll never share it.</FieldHelp>
        {args.invalid ? <FieldError>That email is already in use.</FieldError> : null}
      </Field>
    </Box>
  ),
};

/** The four field states side by side: default, required, invalid, disabled. */
export const States: Story = {
  render: () => (
    <Box w={320} display="flex" flexDirection="column" gap="$5">
      <Field>
        <Label>Default</Label>
        <Input placeholder="optional" />
        <FieldHelp>A plain field with help text.</FieldHelp>
      </Field>

      <Field required>
        <Label>Required</Label>
        <Input placeholder="you@example.com" type="email" />
        <FieldHelp>The label gains a red asterisk.</FieldHelp>
      </Field>

      <Field invalid>
        <Label>Invalid</Label>
        <Input defaultValue="bad value" />
        <FieldError>This value is not allowed.</FieldError>
      </Field>

      <Field disabled>
        <Label>Disabled</Label>
        <Input defaultValue="cannot edit" />
      </Field>
    </Box>
  ),
};

/** Field context flows to every input flavour, not just `Input`. */
export const AcrossControls: Story = {
  name: 'Across controls',
  render: () => (
    <Box w={320} display="flex" flexDirection="column" gap="$5">
      <Field invalid>
        <Label>Bio</Label>
        <TextArea defaultValue="too short" rows={3} />
        <FieldError>Tell us a bit more.</FieldError>
      </Field>

      <Field required>
        <Label>Age</Label>
        <NumberInput min={0} max={120} />
      </Field>

      <Field disabled>
        <Label>Password</Label>
        <PasswordInput defaultValue="hunter2" />
      </Field>
    </Box>
  ),
};
