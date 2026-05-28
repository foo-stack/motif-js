import type { Meta, StoryObj } from '@storybook/react';
import { Box, HStack, Text, VStack } from 'usemotif';
import { scaleEntries } from './_tokens.js';
import { Note } from '../../harness/demo.js';

/**
 * The dimensional scales — space, radii, font sizes, font weights — rendered
 * straight from the shipped theme so the reference stays in sync with the
 * source of truth.
 */
const meta = {
  title: 'Theming/Scales',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Row({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <HStack gap="$4" alignItems="center">
      <Text
        fontFamily="$mono"
        fontSize="$xs"
        color="$colors.text.muted"
        style={{ width: 64 }}
        mt={0}
        mb={0}
      >
        {label}
      </Text>
      <Box style={{ width: 56 }}>
        <Text fontFamily="$mono" fontSize="$xs" color="$colors.text.muted" mt={0} mb={0}>
          {value}
        </Text>
      </Box>
      {children}
    </HStack>
  );
}

export const Space: Story = {
  render: () => (
    <VStack gap="$2" p="$6">
      <Note>space scale — drives padding, margin, gap, and the `x`/`y` transform axes.</Note>
      {scaleEntries('space').map(([k, v]) => (
        <Row key={k} label={`$space.${k}`} value={`${v}`}>
          <Box
            bg="$colors.action.primary.bg"
            h={16}
            borderRadius="$sm"
            style={{ width: Number(v) }}
          />
        </Row>
      ))}
    </VStack>
  ),
};

export const Radii: Story = {
  render: () => (
    <HStack gap="$5" p="$6" flexWrap="wrap">
      {scaleEntries('radii').map(([k, v]) => (
        <VStack key={k} gap="$1">
          <Box
            w={88}
            h={64}
            bg="$colors.surface.raised"
            borderWidth={1}
            borderStyle="solid"
            borderColor="$colors.border.default"
            style={{ borderRadius: Number(v) }}
          />
          <Text fontFamily="$mono" fontSize="$xs" color="$colors.text.muted" mt={0} mb={0}>
            {k} · {`${v}`}
          </Text>
        </VStack>
      ))}
    </HStack>
  ),
};

export const FontSizes: Story = {
  render: () => (
    <VStack gap="$3" p="$6">
      {scaleEntries('fontSizes').map(([k, v]) => (
        <HStack key={k} gap="$4" alignItems="baseline">
          <Text
            fontFamily="$mono"
            fontSize="$xs"
            color="$colors.text.muted"
            style={{ width: 80 }}
            mt={0}
            mb={0}
          >
            {k} · {`${v}`}
          </Text>
          <Text fontSize={`$${k}`} mt={0} mb={0}>
            The quick brown fox
          </Text>
        </HStack>
      ))}
    </VStack>
  ),
};

export const FontWeights: Story = {
  render: () => (
    <VStack gap="$3" p="$6">
      {scaleEntries('fontWeights').map(([k, v]) => (
        <HStack key={k} gap="$4" alignItems="baseline">
          <Text
            fontFamily="$mono"
            fontSize="$xs"
            color="$colors.text.muted"
            style={{ width: 120 }}
            mt={0}
            mb={0}
          >
            {k} · {`${v}`}
          </Text>
          <Text fontSize="$xl" fontWeight={`$${k}`} mt={0} mb={0}>
            The quick brown fox
          </Text>
        </HStack>
      ))}
    </VStack>
  ),
};
