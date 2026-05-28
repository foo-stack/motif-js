import type { Meta, StoryObj } from '@storybook/react';
import {
  Box,
  Field,
  FieldError,
  FieldHelp,
  Fieldset,
  Input,
  Label,
  NumberInput,
  PasswordInput,
} from 'usemotif';

/**
 * `Fieldset` is a bordered `<fieldset>` surface with an optional `legend`,
 * built on `BoxProps` (so it takes Motif style props for padding, width,
 * radius, …). It groups related `Field`s into a labelled section.
 */
const meta = {
  title: 'Forms/Fieldset',
  component: Fieldset,
  tags: ['autodocs'],
  argTypes: {
    legend: { control: 'text' },
  },
  args: {
    legend: 'Account',
  },
} satisfies Meta<typeof Fieldset>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Live-controls playground — edit the `legend` text. */
export const Playground: Story = {
  render: (args) => (
    <Box w={360}>
      <Fieldset {...args}>
        <Box display="flex" flexDirection="column" gap="$4">
          <Field required>
            <Label>Email</Label>
            <Input type="email" placeholder="you@example.com" />
          </Field>
          <Field>
            <Label>Password</Label>
            <PasswordInput />
          </Field>
        </Box>
      </Fieldset>
    </Box>
  ),
};

/** A realistic grouped form: a legend over several composed fields. */
export const GroupedForm: Story = {
  name: 'Grouped form',
  render: () => (
    <Box w={360}>
      <Fieldset legend="Account">
        <Box display="flex" flexDirection="column" gap="$4">
          <Field required>
            <Label>Email</Label>
            <Input type="email" placeholder="you@example.com" />
            <FieldHelp>We'll never share it.</FieldHelp>
          </Field>

          <Field invalid>
            <Label>Username</Label>
            <Input defaultValue="bad value" />
            <FieldError>Username is already taken.</FieldError>
          </Field>

          <Field>
            <Label>Age</Label>
            <NumberInput min={0} max={120} />
          </Field>
        </Box>
      </Fieldset>
    </Box>
  ),
};

/** Without a legend — still renders the bordered grouping surface. */
export const NoLegend: Story = {
  name: 'No legend',
  render: () => (
    <Box w={360}>
      <Fieldset>
        <Field>
          <Label>Note</Label>
          <Input placeholder="Anything…" />
        </Field>
      </Fieldset>
    </Box>
  ),
};
