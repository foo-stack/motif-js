import type { Meta, StoryObj } from '@storybook/react';
import { Box, Container, Text } from 'usemotif';
import { Note } from '../../harness/demo.js';

/**
 * Container — opens a CSS containment context (`container-type`/`container-name`)
 * so descendants can respond to the container's width via `@<name>.<bp>` prop
 * keys, independent of the viewport.
 */
const meta = {
  title: 'Layout/Container',
  component: Container,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    type: { control: 'inline-radio', options: ['inline-size', 'size', 'normal'] },
  },
  args: { name: 'card', type: 'inline-size' },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ContainerQuery: Story = {
  name: 'Container query (resize the card)',
  render: (args) => (
    <Box
      style={{ resize: 'horizontal' }}
      overflow="auto"
      minW={240}
      maxW="100%"
      p="$3"
      borderWidth={1}
      borderStyle="solid"
      borderColor="$colors.border.default"
      borderRadius="$md"
    >
      <Note>
        Drag the bottom-right corner — the inner box reflows on the card width, not the viewport.
      </Note>
      <Container {...args}>
        <Box
          display="flex"
          flexDirection={{ base: 'column', '@card.md': 'row' }}
          gap="$3"
          p={{ base: '$3', '@card.md': '$5' }}
          bg={{ base: '$colors.action.primary.bg', '@card.md': '$colors.action.success.bg' }}
          color="$colors.action.primary.fg"
          borderRadius="$md"
        >
          <Box flex="1" p="$2">
            <Text fontWeight="$semibold">Item A</Text>
          </Box>
          <Box flex="1" p="$2">
            <Text fontWeight="$semibold">Item B</Text>
          </Box>
        </Box>
      </Container>
    </Box>
  ),
};
