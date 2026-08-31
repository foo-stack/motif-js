import type { Meta, StoryObj } from '@storybook/react';
import { AlertDialog } from '@usemotif/headless';
import { Box, Button, HStack, Text } from 'usemotif';
import { Note } from '../../harness/demo.js';

/**
 * AlertDialog - the Dialog compound API with two confirmation-friendly
 * defaults baked in: `role="alertdialog"` and scrim-click dismissal
 * **off** (so a destructive flow needs an explicit confirm or cancel).
 * Re-enable accidental dismissal with `dismissOnScrimClick` on
 * `AlertDialog.Content`.
 *
 * Same parts as Dialog - `Root` / `Trigger` / `Content` / `Title` /
 * `Description` / `Close` - and the same controlled/uncontrolled open
 * model (`open` + `onOpenChange`, or `defaultOpen`).
 */
const meta = {
  title: 'Overlay/AlertDialog',
  component: AlertDialog.Root,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Destructive-confirmation dialog. `role="alertdialog"` and scrim-click dismissal is off by default.',
      },
    },
  },
} satisfies Meta<typeof AlertDialog.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const SURFACE = {
  background: 'var(--colors-surface-base)',
  color: 'var(--colors-text-default)',
  padding: 24,
  borderRadius: 12,
  maxWidth: 420,
  boxShadow: '0 12px 48px rgba(0,0,0,0.25)',
} as const;

function AlertBody() {
  return (
    <AlertDialog.Content style={SURFACE}>
      <AlertDialog.Title as="h2">
        <Text fontSize="$lg" fontWeight="$bold" mt={0} mb="$2">
          Delete account?
        </Text>
      </AlertDialog.Title>
      <AlertDialog.Description as="div">
        <Text color="$colors.text.muted" mb="$4">
          This is permanent. All your data will be removed and cannot be recovered.
        </Text>
      </AlertDialog.Description>
      <HStack gap="$2" justifyContent="flex-end">
        <AlertDialog.Close>
          <Button variant="outline" intent="neutral">
            Cancel
          </Button>
        </AlertDialog.Close>
        <AlertDialog.Close>
          <Button intent="danger">Delete</Button>
        </AlertDialog.Close>
      </HStack>
    </AlertDialog.Content>
  );
}

/** Click to open. Scrim clicks are ignored - confirm or cancel explicitly. */
export const Playground: Story = {
  render: () => (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button intent="danger">Delete account</Button>
      </AlertDialog.Trigger>
      <AlertBody />
    </AlertDialog.Root>
  ),
};

/** Open on mount via `defaultOpen` so Docs / VR capture the surface. */
export const DefaultOpen: Story = {
  render: () => (
    <Box>
      <Note>Rendered open via `defaultOpen`. Scrim-click dismissal is off.</Note>
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Trigger>
          <Button intent="danger">Delete account</Button>
        </AlertDialog.Trigger>
        <AlertBody />
      </AlertDialog.Root>
    </Box>
  ),
};
