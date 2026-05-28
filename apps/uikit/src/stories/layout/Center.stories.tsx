import type { Meta, StoryObj } from '@storybook/react';
import { Center, Text } from 'usemotif';

/** Center — centers its children on both axes. */
const meta = {
  title: 'Layout/Center',
  component: Center,
  tags: ['autodocs'],
  args: { h: 160, bg: '$colors.surface.muted', borderRadius: '$md' },
} satisfies Meta<typeof Center>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Center {...args}>
      <Text fontWeight="$semibold">Centered both axes</Text>
    </Center>
  ),
};
