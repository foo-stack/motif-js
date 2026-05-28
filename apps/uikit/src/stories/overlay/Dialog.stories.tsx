import type { Meta, StoryObj } from '@storybook/react';
import { Dialog } from '@usemotif/headless';
import { Box, Button, HStack, Text } from 'usemotif';
import { Note } from '../../harness/demo.js';

/**
 * Dialog — accessible modal built from motif primitives. Headless and
 * unstyled: the compound parts (`Root` / `Trigger` / `Content` / `Title`
 * / `Description` / `Close`) ship the a11y wiring (portal, scrim, focus
 * trap, Escape + scrim dismiss, `aria-modal` / `aria-labelledby` /
 * `aria-describedby`) and leave every pixel of the surface to you.
 *
 * Open state is uncontrolled by default; pass `open` + `onOpenChange`
 * (or `defaultOpen` for an initially-open uncontrolled dialog).
 */
const meta = {
  title: 'Overlay/Dialog',
  component: Dialog.Root,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Headless modal dialog. Style `Dialog.Content` yourself — the wiring (focus trap, scrim, Escape) is built in.',
      },
    },
  },
} satisfies Meta<typeof Dialog.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Inline-style surface mirroring the playground idiom. */
const SURFACE = {
  background: 'var(--colors-surface-base)',
  color: 'var(--colors-text-default)',
  padding: 24,
  borderRadius: 12,
  maxWidth: 420,
  boxShadow: '0 12px 48px rgba(0,0,0,0.25)',
} as const;

function DialogBody() {
  return (
    <Dialog.Content style={SURFACE}>
      <Dialog.Title as="h2">
        <Text fontSize="$lg" fontWeight="$bold" mt={0} mb="$2">
          Confirm save?
        </Text>
      </Dialog.Title>
      <Dialog.Description as="div">
        <Text color="$colors.text.muted" mb="$4">
          This will overwrite the existing draft.
        </Text>
      </Dialog.Description>
      <HStack gap="$2" justifyContent="flex-end">
        <Dialog.Close>
          <Button variant="outline" intent="neutral">
            Cancel
          </Button>
        </Dialog.Close>
        <Dialog.Close>
          <Button>Save</Button>
        </Dialog.Close>
      </HStack>
    </Dialog.Content>
  );
}

/** Click the trigger to open. Escape or a scrim click dismisses. */
export const Playground: Story = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>Open dialog</Button>
      </Dialog.Trigger>
      <DialogBody />
    </Dialog.Root>
  ),
};

/**
 * `defaultOpen` renders the dialog open on mount — the Docs page and
 * visual-regression capture the styled surface without an interaction.
 */
export const DefaultOpen: Story = {
  render: () => (
    <Box>
      <Note>Rendered open via the uncontrolled `defaultOpen` prop.</Note>
      <Dialog.Root defaultOpen>
        <Dialog.Trigger>
          <Button>Open dialog</Button>
        </Dialog.Trigger>
        <DialogBody />
      </Dialog.Root>
    </Box>
  ),
};
