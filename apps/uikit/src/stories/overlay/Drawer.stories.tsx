import type { Meta, StoryObj } from '@storybook/react';
import { Drawer } from '@usemotif/headless';
import { Box, Button, HStack, Text, VStack } from 'usemotif';
import { Note } from '../../harness/demo.js';

/**
 * Drawer - a side-anchored Dialog. Same compound API and a11y wiring as
 * Dialog (portal, scrim, focus trap, Escape + scrim dismiss); the only
 * addition is `side` on `Drawer.Content` - `'left' | 'right' | 'top' |
 * 'bottom'` (defaults to `'right'`) - which fixes the panel to that
 * edge. Pair with a styled `<Box>` and `exitDurationMs` to animate the
 * slide.
 *
 * Parts: `Root` / `Trigger` / `Content` / `Title` / `Description` /
 * `Close`. Open state is uncontrolled by default (`defaultOpen`) or
 * controlled (`open` + `onOpenChange`).
 */
const meta = {
  title: 'Overlay/Drawer',
  component: Drawer.Root,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Side-anchored Dialog. `side` on Drawer.Content steers which edge the panel pins to.',
      },
    },
  },
} satisfies Meta<typeof Drawer.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

type Side = 'left' | 'right' | 'top' | 'bottom';

/** Fixed-edge surface; the `side` style is supplied by Drawer.Content. */
const panelStyle = {
  background: 'var(--colors-surface-base)',
  color: 'var(--colors-text-default)',
  padding: 24,
  width: 320,
  maxWidth: '90vw',
  boxShadow: '0 0 48px rgba(0,0,0,0.3)',
} as const;

function DrawerBody({ side }: { side: Side }) {
  return (
    <Drawer.Content side={side} style={panelStyle}>
      <Drawer.Title as="h2">
        <Text fontSize="$lg" fontWeight="$bold" mt={0} mb="$2">
          Navigation
        </Text>
      </Drawer.Title>
      <Drawer.Description as="div">
        <Text color="$colors.text.muted" mb="$4">
          Anchored to the {side} edge.
        </Text>
      </Drawer.Description>
      <VStack gap="$2" alignItems="flex-start">
        <Button variant="ghost" intent="neutral" fullWidth>
          Dashboard
        </Button>
        <Button variant="ghost" intent="neutral" fullWidth>
          Settings
        </Button>
        <Button variant="ghost" intent="neutral" fullWidth>
          Profile
        </Button>
      </VStack>
      <HStack gap="$2" justifyContent="flex-end" mt="$4">
        <Drawer.Close>
          <Button variant="outline" intent="neutral">
            Close
          </Button>
        </Drawer.Close>
      </HStack>
    </Drawer.Content>
  );
}

/** Open from the right; choose any side by editing the `side` prop. */
export const Playground: Story = {
  render: () => (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button>Open drawer</Button>
      </Drawer.Trigger>
      <DrawerBody side="right" />
    </Drawer.Root>
  ),
};

/** Each `side` value, each opened via its own trigger. */
export const Sides: Story = {
  render: () => (
    <HStack gap="$3" flexWrap="wrap">
      {(['left', 'right', 'top', 'bottom'] as const).map((side) => (
        <Drawer.Root key={side}>
          <Drawer.Trigger>
            <Button variant="outline">{side}</Button>
          </Drawer.Trigger>
          <DrawerBody side={side} />
        </Drawer.Root>
      ))}
    </HStack>
  ),
};

/** Open on mount via `defaultOpen` so Docs / VR capture the panel. */
export const DefaultOpen: Story = {
  render: () => (
    <Box>
      <Note>Rendered open via `defaultOpen`, anchored right.</Note>
      <Drawer.Root defaultOpen>
        <Drawer.Trigger>
          <Button>Open drawer</Button>
        </Drawer.Trigger>
        <DrawerBody side="right" />
      </Drawer.Root>
    </Box>
  ),
};
