import type { Meta, StoryObj } from '@storybook/react';
import { Box, Text, VStack } from 'usemotif';
import { colorGroups, type ColorLeaf } from './_tokens.js';
import { Note } from '../../harness/demo.js';

/**
 * Color tokens, auto-rendered from the shipped theme tree. Swatches use the
 * token strings (`$colors....`) so they resolve through the active theme's CSS
 * variables - flip the Theme toolbar to see semantic tokens re-map while the
 * raw palette ramps stay put.
 */
const meta = {
  title: 'Theming/Colors',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const SEMANTIC = ['surface', 'text', 'border', 'action'];

function Swatch({ leaf }: { leaf: ColorLeaf }) {
  return (
    <VStack gap="$1">
      <Box
        bg={leaf.token}
        h={56}
        borderRadius="$md"
        borderWidth={1}
        borderStyle="solid"
        borderColor="$colors.border.default"
      />
      <Text fontSize="$xs" fontFamily="$mono" color="$colors.text.muted" mt={0} mb={0}>
        {leaf.path}
      </Text>
    </VStack>
  );
}

function Group({ name, leaves }: { name: string; leaves: ColorLeaf[] }) {
  return (
    <VStack gap="$2">
      <Text fontWeight="$semibold" fontSize="$sm" mt={0} mb={0}>
        {name}
      </Text>
      <Box
        display="grid"
        gap="$3"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}
      >
        {leaves.map((leaf) => (
          <Swatch key={leaf.path} leaf={leaf} />
        ))}
      </Box>
    </VStack>
  );
}

export const Semantic: Story = {
  render: () => {
    const groups = colorGroups();
    return (
      <VStack gap="$6" p="$6">
        <Note>Semantic tokens - these re-map across light / dark. Toggle the Theme toolbar.</Note>
        {SEMANTIC.filter((g) => groups[g]).map((g) => (
          <Group key={g} name={g} leaves={groups[g]!} />
        ))}
      </VStack>
    );
  },
};

export const Palette: Story = {
  render: () => {
    const groups = colorGroups();
    const palette = Object.keys(groups).filter((g) => !SEMANTIC.includes(g));
    return (
      <VStack gap="$6" p="$6">
        <Note>Raw palette ramps - the primitive layer semantic tokens reference.</Note>
        {palette.map((g) => (
          <Group key={g} name={g} leaves={groups[g]!} />
        ))}
      </VStack>
    );
  },
};
