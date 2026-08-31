import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from '@usemotif/headless';
import { Heart } from '@usemotif/icons';
import { Box, Button, HStack, IconButton, Text } from 'usemotif';
import { Note } from '../../harness/demo.js';

/**
 * Tooltip - a text affordance shown on hover or keyboard focus. Wires
 * `aria-describedby` onto the trigger and dismisses on Escape. Strictly
 * for descriptive text - for interactive content use HoverCard or
 * Popover (those are reachable by keyboard and touch).
 *
 * Parts: `Root` / `Trigger` / `Content`. `Root` takes `placement`
 * (`'top' | 'bottom' | 'left' | 'right'`, default `'bottom'`),
 * `openDelay` (default 500ms), and `closeDelay` (default 200ms).
 *
 * **No controlled-open prop.** Visibility is internal and hover/focus
 * driven, so there's no static "DefaultOpen" story - hover or Tab to
 * the trigger.
 */
const meta = {
  title: 'Overlay/Tooltip',
  component: Tooltip.Root,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Hover/focus text tooltip. Descriptive only; no controlled-open prop - interaction only.',
      },
    },
  },
} satisfies Meta<typeof Tooltip.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

function Bubble({ children }: { children: React.ReactNode }) {
  return (
    <Box
      bg="$colors.text.default"
      color="$colors.surface.base"
      px="$2"
      py="$1"
      borderRadius="$sm"
      fontSize="$sm"
    >
      {children}
    </Box>
  );
}

/** Hover or focus either control. The icon button carries an aria-label. */
export const Playground: Story = {
  render: () => (
    <Box py="$6">
      <Note>Hover or Tab onto a control (open delay shortened for the demo).</Note>
      <HStack gap="$4" alignItems="center">
        <Tooltip.Root openDelay={150}>
          <Tooltip.Trigger>
            <IconButton aria-label="Save">
              <Heart />
            </IconButton>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <Bubble>Save (⌘S)</Bubble>
          </Tooltip.Content>
        </Tooltip.Root>

        <Tooltip.Root openDelay={150} placement="top">
          <Tooltip.Trigger>
            <Button variant="outline">Hover me</Button>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <Bubble>Placed above the trigger</Bubble>
          </Tooltip.Content>
        </Tooltip.Root>
      </HStack>
    </Box>
  ),
};

/** All four `placement` values. Hover each button. */
export const Placements: Story = {
  render: () => (
    <HStack gap="$4" flexWrap="wrap" py="$8">
      {(['top', 'bottom', 'left', 'right'] as const).map((placement) => (
        <Tooltip.Root key={placement} placement={placement} openDelay={150}>
          <Tooltip.Trigger>
            <Button variant="outline">{placement}</Button>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <Bubble>
              <Text fontSize="$sm">placement=&quot;{placement}&quot;</Text>
            </Bubble>
          </Tooltip.Content>
        </Tooltip.Root>
      ))}
    </HStack>
  ),
};
