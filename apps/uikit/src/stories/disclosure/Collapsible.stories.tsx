import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { Box, Button, Text, VStack } from 'usemotif';
import { Collapsible } from '@usemotif/headless';
import { Note } from '../../harness/demo.js';

// Collapsible is the single-disclosure case: Root + Trigger + Content.
// Trigger clones a single child element, wiring `aria-expanded` /
// `aria-controls` onto it, so the child must be a real element (here a
// motif `Button`). Content renders an ARIA `region` and unmounts when
// closed unless `forceMount` is set.
const PANEL: CSSProperties = {
  marginTop: 8,
  padding: 16,
  borderRadius: 8,
  background: 'var(--colors-surface-muted, #f3f4f6)',
  border: '1px solid var(--colors-border-default, #e5e7eb)',
  color: 'var(--colors-text-default, #111827)',
};

/**
 * Collapsible — the single open/closed disclosure. Compose
 * `Collapsible.Root` → `Collapsible.Trigger` (clones one child and adds
 * `aria-expanded`/`aria-controls`) → `Collapsible.Content` (an ARIA
 * `region`, unmounted while closed). Controlled via `open`/`onOpenChange`
 * or uncontrolled via `defaultOpen`.
 */
const meta = {
  title: 'Disclosure/Collapsible',
  component: Collapsible.Root,
  tags: ['autodocs'],
} satisfies Meta<typeof Collapsible.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Uncontrolled, open by default so autodocs capture the content. */
export const Playground: Story = {
  render: () => (
    <VStack gap="$2" style={{ maxWidth: 360 }}>
      <Collapsible.Root defaultOpen>
        <Collapsible.Trigger>
          <Button variant="outline">Toggle details</Button>
        </Collapsible.Trigger>
        <Collapsible.Content style={PANEL}>
          <Text m={0}>
            The content region mounts only while open. Click the trigger to collapse it.
          </Text>
        </Collapsible.Content>
      </Collapsible.Root>
    </VStack>
  ),
};

/** Controlled: a parent `useState` drives `open`, with a live status line. */
export const Controlled: Story = {
  render: () => {
    function Demo() {
      const [open, setOpen] = useState(true);
      return (
        <VStack gap="$2" style={{ maxWidth: 360 }}>
          <Note>open = {String(open)}</Note>
          <Collapsible.Root open={open} onOpenChange={setOpen}>
            <Collapsible.Trigger>
              <Button>{open ? 'Hide' : 'Show'} notes</Button>
            </Collapsible.Trigger>
            <Collapsible.Content style={PANEL}>
              <Text m={0}>Controlled content driven by parent state.</Text>
            </Collapsible.Content>
          </Collapsible.Root>
        </VStack>
      );
    }
    return <Demo />;
  },
};

/**
 * `forceMount` keeps the content in the DOM while closed (it sets `hidden`),
 * which is what you want for enter/exit animations.
 */
export const ForceMount: Story = {
  render: () => (
    <Box style={{ maxWidth: 360 }}>
      <Collapsible.Root defaultOpen={false}>
        <Collapsible.Trigger>
          <Button variant="ghost">Reveal (force-mounted)</Button>
        </Collapsible.Trigger>
        <Collapsible.Content forceMount style={PANEL}>
          <Text m={0}>Always in the DOM; toggling flips the `hidden` flag.</Text>
        </Collapsible.Content>
      </Collapsible.Root>
    </Box>
  ),
};
