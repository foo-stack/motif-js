import type { Meta, StoryObj } from '@storybook/react';
import { AspectRatio, Center, HStack, Text, VStack } from 'usemotif';
import { Note } from '../../harness/demo.js';

/** AspectRatio — preserves a fixed width:height ratio for its child. */
const meta = {
  title: 'Layout/AspectRatio',
  component: AspectRatio,
  tags: ['autodocs'],
  argTypes: { ratio: { control: { type: 'number', step: 0.1 } } },
  args: { ratio: 16 / 9, bg: '$colors.surface.muted', borderRadius: '$md', maxW: 360 },
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <AspectRatio {...args}>
      <Center w="$full" h="$full">
        <Text fontSize="$lg">{(args.ratio ?? 1).toFixed(2)}</Text>
      </Center>
    </AspectRatio>
  ),
};

export const CommonRatios: Story = {
  render: () => (
    <HStack gap="$4" alignItems="flex-start" flexWrap="wrap">
      {(
        [
          ['1:1', 1],
          ['4:3', 4 / 3],
          ['16:9', 16 / 9],
          ['21:9', 21 / 9],
        ] as const
      ).map(([label, r]) => (
        <VStack key={label} gap="$1" w={200}>
          <Note>{label}</Note>
          <AspectRatio ratio={r} bg="$colors.surface.muted" borderRadius="$md">
            <Center w="$full" h="$full">
              <Text fontFamily="$mono" fontSize="$sm">
                {label}
              </Text>
            </Center>
          </AspectRatio>
        </VStack>
      ))}
    </HStack>
  ),
};
