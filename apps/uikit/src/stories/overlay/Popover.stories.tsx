import type { Meta, StoryObj } from '@storybook/react';
import { Popover } from '@usemotif/headless';
import { Box, Button, Text, VStack } from 'usemotif';
import { Note } from '../../harness/demo.js';

/**
 * Popover - a non-modal floating panel anchored to its trigger. Unlike
 * Dialog there's no scrim and focus stays put; the page keeps working
 * behind it. Use for filter dropdowns, info cards, quick forms.
 *
 * Parts: `Root` / `Trigger` / `Content` / `Close`. `Content` takes
 * `placement` (`'top' | 'bottom' | 'left' | 'right'`, default
 * `'bottom'`), `offset`, and dismiss opt-outs (`dismissOnClickOutside`,
 * `dismissOnEscape`). Open state is uncontrolled (`defaultOpen`) or
 * controlled (`open` + `onOpenChange`).
 */
const meta = {
  title: 'Overlay/Popover',
  component: Popover.Root,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Non-modal floating panel. Escape and click-outside dismiss by default.',
      },
    },
  },
} satisfies Meta<typeof Popover.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const PANEL = {
  background: 'var(--colors-surface-base)',
  color: 'var(--colors-text-default)',
  padding: 16,
  borderRadius: 10,
  minWidth: 220,
  border: '1px solid var(--colors-border-default)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
} as const;

type Placement = 'top' | 'bottom' | 'left' | 'right';

function PopoverPanel() {
  return (
    <VStack gap="$2" alignItems="flex-start">
      <Text fontWeight="$semibold" mt={0} mb={0}>
        Filters
      </Text>
      <Text color="$colors.text.muted" fontSize="$sm">
        Adjust which results appear.
      </Text>
      <Popover.Close>
        <Button size="sm" variant="outline" intent="neutral">
          Done
        </Button>
      </Popover.Close>
    </VStack>
  );
}

/** Click to toggle. Click outside or press Escape to dismiss. */
export const Playground: Story = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger>
        <Button>Filters</Button>
      </Popover.Trigger>
      <Popover.Content placement="bottom" style={PANEL}>
        <PopoverPanel />
      </Popover.Content>
    </Popover.Root>
  ),
};

/** All four `placement` values, spaced so each panel has room. */
export const Placements: Story = {
  render: () => (
    <Box
      display="grid"
      gap="$8"
      py="$8"
      justifyItems="center"
      style={{ gridTemplateColumns: 'repeat(2, max-content)' }}
    >
      {(['top', 'bottom', 'left', 'right'] as const).map((placement: Placement) => (
        <Popover.Root key={placement} defaultOpen>
          <Popover.Trigger>
            <Button variant="outline">{placement}</Button>
          </Popover.Trigger>
          <Popover.Content placement={placement} style={PANEL}>
            <Text mt={0} mb={0} fontSize="$sm">
              placement=&quot;{placement}&quot;
            </Text>
          </Popover.Content>
        </Popover.Root>
      ))}
    </Box>
  ),
};

/** `defaultOpen` so Docs / VR capture the panel without a click. */
export const DefaultOpen: Story = {
  render: () => (
    <Box py="$6">
      <Note>Rendered open via `defaultOpen`.</Note>
      <Popover.Root defaultOpen>
        <Popover.Trigger>
          <Button>Filters</Button>
        </Popover.Trigger>
        <Popover.Content placement="bottom" style={PANEL}>
          <PopoverPanel />
        </Popover.Content>
      </Popover.Root>
    </Box>
  ),
};
