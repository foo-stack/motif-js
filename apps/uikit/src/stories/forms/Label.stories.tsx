import type { Meta, StoryObj } from '@storybook/react';
import { Box, Field, FieldHelp, Input, Label } from 'usemotif';

/**
 * `Label` renders a `<label>` built on `TextProps` (so it accepts Motif
 * text style props). Inside a `<Field>` it auto-targets the field's input
 * via `htmlFor` and appends a red `*` when the field is `required`. Pass an
 * explicit `htmlFor` to associate it with an input outside a `Field`.
 */
const meta = {
  title: 'Forms/Label',
  component: Label,
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
    htmlFor: { control: 'text' },
  },
  args: {
    children: 'Email',
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Live-controls playground — a label wired to a sibling input via `htmlFor`. */
export const Playground: Story = {
  render: (args) => (
    <Box w={320} display="flex" flexDirection="column" gap="$1.5">
      <Label htmlFor="demo-input" {...args} />
      <Box>
        <Input id="demo-input" placeholder="you@example.com" type="email" />
      </Box>
    </Box>
  ),
};

/**
 * Inside `<Field>` the label auto-targets the input — no `htmlFor` needed —
 * and `required` adds the asterisk for you.
 */
export const InField: Story = {
  name: 'In Field',
  render: () => (
    <Box w={320} display="flex" flexDirection="column" gap="$4">
      <Field>
        <Label>Optional label</Label>
        <Input placeholder="optional" />
        <FieldHelp>Auto-linked via field context.</FieldHelp>
      </Field>

      <Field required>
        <Label>Required label</Label>
        <Input placeholder="you@example.com" type="email" />
        <FieldHelp>The red asterisk is added automatically.</FieldHelp>
      </Field>
    </Box>
  ),
};
