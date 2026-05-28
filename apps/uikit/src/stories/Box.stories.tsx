import type { Meta, StoryObj } from '@storybook/react';
import { Box, Text } from 'usemotif';

/**
 * Phase 0 smoke story — proves the toolchain renders a Motif primitive under
 * the ThemeProvider decorator on the react-native-web-vite builder. The full
 * exhaustive Box matrix lands in Phase 2 once the Phase 1 `<Matrix>` harness
 * exists.
 */
const meta = {
  title: 'Layout/Box',
  component: Box,
  parameters: { layout: 'centered' },
  argTypes: {
    bg: { control: 'text', description: 'Background token or value' },
    p: { control: 'text', description: 'Padding token or value' },
    borderRadius: { control: 'text' },
  },
  args: {
    bg: '$colors.action.primary.bg',
    p: '$6',
    borderRadius: '$md',
  },
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Box {...args}>
      <Text color="$colors.action.primary.fg" fontWeight="$semibold">
        Box
      </Text>
    </Box>
  ),
};

export const Surfaces: Story = {
  render: () => (
    <Box display="flex" gap="$3">
      {(['base', 'muted', 'raised', 'sunken'] as const).map((s) => (
        <Box
          key={s}
          bg={`$colors.surface.${s}`}
          p="$5"
          borderRadius="$md"
          borderWidth={1}
          borderStyle="solid"
          borderColor="$colors.border.default"
        >
          <Text fontSize="$xs" color="$colors.text.muted" fontFamily="$mono">
            surface.{s}
          </Text>
        </Box>
      ))}
    </Box>
  ),
};
