import type { Meta, StoryObj } from '@storybook/react';
import { HStack, Stack, Text, VStack } from 'usemotif';
import { Note, Tile } from '../../harness/demo.js';

/**
 * Stack is the flex-with-gap workhorse — column by default, `direction="row"`
 * (or the `HStack` shorthand) for horizontal. `gap` drives spacing via CSS
 * `gap`; no margin hacks. Structural primitive, so these are compositional
 * demos rather than a variant matrix.
 */
const meta = {
  title: 'Layout/Stack',
  component: Stack,
  tags: ['autodocs'],
  argTypes: {
    gap: { control: 'text' },
    direction: { control: 'inline-radio', options: ['row', 'column'] },
    alignItems: { control: 'text' },
    justifyContent: { control: 'text' },
  },
  args: { gap: '$3', direction: 'column' },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Stack {...args}>
      <Tile>One</Tile>
      <Tile tone="success">Two</Tile>
      <Tile tone="danger">Three</Tile>
    </Stack>
  ),
};

export const Gaps: Story = {
  render: () => (
    <VStack gap="$5">
      {(['$1', '$2', '$4', '$6', '$8'] as const).map((g) => (
        <VStack key={g} gap="$1">
          <Note>gap={g}</Note>
          <HStack gap={g}>
            <Tile>A</Tile>
            <Tile>B</Tile>
            <Tile>C</Tile>
          </HStack>
        </VStack>
      ))}
    </VStack>
  ),
};

export const Alignment: Story = {
  render: () => (
    <VStack gap="$5">
      {(['flex-start', 'center', 'flex-end', 'stretch'] as const).map((a) => (
        <VStack key={a} gap="$1">
          <Note>alignItems={a}</Note>
          <HStack gap="$3" alignItems={a} bg="$colors.surface.muted" p="$2" borderRadius="$md" h={96}>
            <Tile>sm</Tile>
            <Tile tone="success" py="$5">
              tall
            </Tile>
            <Tile tone="danger" py="$3">
              mid
            </Tile>
          </HStack>
        </VStack>
      ))}
    </VStack>
  ),
};

export const HStackVsVStack: Story = {
  name: 'HStack vs VStack',
  render: () => (
    <HStack gap="$8" alignItems="flex-start">
      <VStack gap="$2">
        <Text fontWeight="$semibold">VStack</Text>
        <VStack gap="$2">
          <Tile>1</Tile>
          <Tile>2</Tile>
          <Tile>3</Tile>
        </VStack>
      </VStack>
      <VStack gap="$2">
        <Text fontWeight="$semibold">HStack</Text>
        <HStack gap="$2">
          <Tile>1</Tile>
          <Tile>2</Tile>
          <Tile>3</Tile>
        </HStack>
      </VStack>
    </HStack>
  ),
};
