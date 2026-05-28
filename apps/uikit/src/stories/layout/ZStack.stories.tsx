import type { Meta, StoryObj } from '@storybook/react';
import { Box, Center, Text, ZStack } from 'usemotif';

/** ZStack — overlaps children on the z-axis (each child fills the stack). */
const meta = {
  title: 'Layout/ZStack',
  component: ZStack,
  tags: ['autodocs'],
  args: { maxW: 320, h: 140 },
} satisfies Meta<typeof ZStack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overlay: Story = {
  render: (args) => (
    <ZStack {...args}>
      <Box bg="$colors.action.primary.bg" w="$full" h="$full" borderRadius="$md" />
      <Center>
        <Text color="$colors.action.primary.fg" fontWeight="$bold">
          Overlay content
        </Text>
      </Center>
    </ZStack>
  ),
};
