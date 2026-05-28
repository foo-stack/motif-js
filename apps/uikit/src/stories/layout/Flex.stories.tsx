import type { Meta, StoryObj } from '@storybook/react';
import { Flex, VStack } from 'usemotif';
import { Note, Tile } from '../../harness/demo.js';

/**
 * Flex is a bare `<Box display="flex">` with an optional `direction` prop —
 * no gap defaults (that's Stack's job). Reach for it when you want a flex
 * container and will set alignment/justification yourself.
 */
const meta = {
  title: 'Layout/Flex',
  component: Flex,
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'inline-radio',
      options: ['row', 'column', 'row-reverse', 'column-reverse'],
    },
    alignItems: { control: 'text' },
    justifyContent: { control: 'text' },
    gap: { control: 'text' },
  },
  args: { direction: 'row', gap: '$3', alignItems: 'center' },
} satisfies Meta<typeof Flex>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Flex {...args}>
      <Tile>A</Tile>
      <Tile tone="success">B</Tile>
      <Tile tone="danger">C</Tile>
    </Flex>
  ),
};

export const Justify: Story = {
  render: () => (
    <VStack gap="$5">
      {(['flex-start', 'center', 'flex-end', 'space-between', 'space-around'] as const).map((j) => (
        <VStack key={j} gap="$1">
          <Note>justifyContent={j}</Note>
          <Flex justifyContent={j} gap="$2" bg="$colors.surface.muted" p="$2" borderRadius="$md">
            <Tile>1</Tile>
            <Tile>2</Tile>
            <Tile>3</Tile>
          </Flex>
        </VStack>
      ))}
    </VStack>
  ),
};
