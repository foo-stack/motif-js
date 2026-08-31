import type { Meta, StoryObj } from '@storybook/react';
import { HStack, Spacer } from 'usemotif';
import { Tile } from '../../harness/demo.js';

/** Spacer - a flex-grow filler that pushes siblings apart inside a Stack/Flex. */
const meta = {
  title: 'Layout/Spacer',
  component: Spacer,
  tags: ['autodocs'],
} satisfies Meta<typeof Spacer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PushApart: Story = {
  name: 'Pushes siblings apart',
  render: () => (
    <HStack gap="$2" bg="$colors.surface.muted" p="$2" borderRadius="$md">
      <Tile>Left</Tile>
      <Spacer />
      <Tile tone="success">Right</Tile>
    </HStack>
  ),
};
