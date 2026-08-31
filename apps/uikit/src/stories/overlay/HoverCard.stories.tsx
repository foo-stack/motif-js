import type { Meta, StoryObj } from '@storybook/react';
import { HoverCard } from '@usemotif/headless';
import { Avatar, Box, Button, HStack, Link, Text, VStack } from 'usemotif';
import { Note } from '../../harness/demo.js';

/**
 * HoverCard - Tooltip-shaped, but for interactive content. Opens on
 * hover or focus and stays open while the pointer bridges from trigger
 * to card, so the body can hold links and buttons. Use for profile and
 * link previews - never for critical actions (keyboard/touch users
 * can't hover).
 *
 * Parts: `Root` / `Trigger` / `Content`. Timing and position live on
 * `Root`: `openDelay` (default 700ms), `closeDelay` (default 300ms),
 * and `placement` (`'top' | 'bottom' | 'left' | 'right'`, default
 * `'bottom'`).
 *
 * **No controlled-open prop.** Open state is internal and hover/focus
 * driven, so there's no static "DefaultOpen" story - hover or Tab to
 * the trigger to see the card.
 */
const meta = {
  title: 'Overlay/HoverCard',
  component: HoverCard.Root,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Hover/focus-triggered card for interactive previews. No controlled-open prop - interaction only.',
      },
    },
  },
} satisfies Meta<typeof HoverCard.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const CARD = {
  background: 'var(--colors-surface-base)',
  color: 'var(--colors-text-default)',
  padding: 16,
  borderRadius: 10,
  width: 260,
  border: '1px solid var(--colors-border-default)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
} as const;

function ProfileCard() {
  return (
    <VStack gap="$2" alignItems="flex-start">
      <HStack gap="$2" alignItems="center">
        <Avatar name="Jane Doe" size="sm" />
        <VStack gap={0}>
          <Text fontWeight="$semibold" mt={0} mb={0}>
            Jane Doe
          </Text>
          <Text color="$colors.text.muted" fontSize="$sm">
            @jane
          </Text>
        </VStack>
      </HStack>
      <Text fontSize="$sm" color="$colors.text.muted">
        Design systems engineer. Building accessible primitives.
      </Text>
      <Button size="sm">Follow</Button>
    </VStack>
  );
}

/** Hover or focus the link. The card holds an interactive Follow button. */
export const Playground: Story = {
  render: () => (
    <Box py="$8">
      <Note>Hover or Tab to the trigger (faster open delay for the demo).</Note>
      <Text>
        Mentioned by{' '}
        <HoverCard.Root openDelay={150} closeDelay={200}>
          <HoverCard.Trigger>
            <Link href="#" onClick={(e) => e.preventDefault()}>
              @jane
            </Link>
          </HoverCard.Trigger>
          <HoverCard.Content style={CARD}>
            <ProfileCard />
          </HoverCard.Content>
        </HoverCard.Root>{' '}
        in this thread.
      </Text>
    </Box>
  ),
};

/** `placement` lives on Root. Hover each trigger to see the side. */
export const Placements: Story = {
  render: () => (
    <HStack gap="$6" flexWrap="wrap" py="$8">
      {(['top', 'bottom', 'left', 'right'] as const).map((placement) => (
        <HoverCard.Root key={placement} placement={placement} openDelay={150} closeDelay={200}>
          <HoverCard.Trigger>
            <Button variant="outline">{placement}</Button>
          </HoverCard.Trigger>
          <HoverCard.Content style={CARD}>
            <ProfileCard />
          </HoverCard.Content>
        </HoverCard.Root>
      ))}
    </HStack>
  ),
};
