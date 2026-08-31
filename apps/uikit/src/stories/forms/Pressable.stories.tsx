import type { Meta, StoryObj } from '@storybook/react';
import { HStack, Pressable, Text, VStack } from 'usemotif';
import { Note } from '../../harness/demo.js';

/**
 * `Pressable` is an interactive `Box` (defaults to `<button>`) with the
 * pseudo-state props `_hover` / `_focus` / `_active` / `_disabled` from
 * `BoxProps`. It owns the interactive contract: `cursor`, `aria-disabled`
 * mirroring of `disabled`, click suppression while disabled, and the
 * cross-platform `onPress` alias for `onClick`.
 *
 * Hover, click, and Tab onto the buttons below. Focus styling only shows on
 * keyboard focus (`:focus-visible`).
 */
const meta = {
  title: 'Forms/Pressable',
  component: Pressable,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    children: { control: 'text' },
    onPress: { control: false },
  },
  args: {
    children: 'Press me',
    disabled: false,
  },
} satisfies Meta<typeof Pressable>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Live-controls playground - a styled pressable with all four pseudo-states. */
export const Playground: Story = {
  render: (args) => (
    <Pressable
      px="$5"
      py="$3"
      borderRadius="$md"
      bg="$colors.action.primary.bg"
      color="$colors.action.primary.fg"
      fontWeight="$semibold"
      borderStyle="solid"
      borderWidth={2}
      borderColor="transparent"
      _hover={{ opacity: 0.9 }}
      _active={{ opacity: 0.8 }}
      _focus={{ borderColor: '$colors.action.primary.fg' }}
      _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
      onPress={() => console.info('pressed')}
      {...args}
    />
  ),
};

/** The full interaction demo - hover / focus / active / disabled. */
export const Interactions: Story = {
  render: () => (
    <VStack gap="$3">
      <Note>Hover, click, and Tab onto the buttons. Focus shows on keyboard focus only.</Note>
      <HStack gap="$3" flexWrap="wrap">
        <Pressable
          px="$5"
          py="$3"
          borderRadius="$md"
          bg="$colors.action.primary.bg"
          color="$colors.action.primary.fg"
          fontWeight="$semibold"
          borderStyle="solid"
          borderWidth={2}
          borderColor="transparent"
          _hover={{ opacity: 0.9 }}
          _active={{ opacity: 0.8 }}
          _focus={{ borderColor: '$colors.action.primary.fg' }}
          _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
          onPress={() => console.info('primary pressed')}
        >
          Primary
        </Pressable>

        <Pressable
          px="$5"
          py="$3"
          borderRadius="$md"
          bg="$colors.action.danger.bg"
          color="$colors.action.danger.fg"
          fontWeight="$semibold"
          borderStyle="solid"
          borderWidth={2}
          borderColor="transparent"
          _hover={{ opacity: 0.9 }}
          _active={{ opacity: 0.8 }}
          _focus={{ borderColor: '$colors.action.danger.fg' }}
        >
          Danger
        </Pressable>

        <Pressable
          px="$5"
          py="$3"
          borderRadius="$md"
          bg="$colors.surface.muted"
          color="$colors.text.default"
          fontWeight="$semibold"
          borderStyle="solid"
          borderWidth={2}
          borderColor="transparent"
          _hover={{ bg: '$colors.surface.raised' }}
          _focus={{ borderColor: '$colors.text.default' }}
          disabled
          _disabled={{ opacity: 0.5 }}
        >
          Disabled
        </Pressable>
      </HStack>
    </VStack>
  ),
};

/** `as="a"` turns the same primitive into a link surface. */
export const AsLink: Story = {
  name: 'As link',
  render: () => (
    <Pressable
      as="a"
      {...({ href: '#pressable' } as Record<string, string>)}
      px="$4"
      py="$2"
      borderRadius="$md"
      bg="transparent"
      color="$colors.action.primary.bg"
      fontWeight="$semibold"
      display="inline-flex"
      _hover={{ textDecoration: 'underline' }}
      _focus={{ outlineStyle: 'solid', outlineWidth: 2 }}
    >
      <Text>A link-styled Pressable</Text>
    </Pressable>
  ),
};
