import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { Box, Button, Text, VStack } from 'usemotif';
import { Accordion } from '@usemotif/headless';
import { Note } from '../../harness/demo.js';

// Accordion is a set of linked Collapsibles. Root holds the shared
// `value` array (open item ids); each Accordion.Item carries a stable
// `value`; Trigger/Content are re-exported from Collapsible. `type`
// switches between single-open (default) and multiple-open.
const ITEM: CSSProperties = {
  borderBottom: '1px solid var(--colors-border-default, #e5e7eb)',
};
const PANEL: CSSProperties = {
  padding: '0 12px 16px',
  color: 'var(--colors-text-muted, #6b7280)',
};
const SECTIONS = [
  { id: 'shipping', title: 'Shipping', body: 'Ships in 2-3 business days via standard post.' },
  { id: 'returns', title: 'Returns', body: 'Free 30-day returns on unworn items.' },
  { id: 'warranty', title: 'Warranty', body: 'Two-year limited manufacturer warranty.' },
] as const;

function Trigger({ children }: { children: string }) {
  return (
    <Accordion.Trigger>
      <Button variant="ghost" fullWidth justifyContent="space-between">
        {children}
      </Button>
    </Accordion.Trigger>
  );
}

/**
 * Accordion - many `Collapsible`s linked through `Accordion.Root`. Each
 * `Accordion.Item` takes a stable `value`; `Accordion.Trigger` and
 * `Accordion.Content` are the Collapsible parts re-exported. `Root` is
 * controlled with `value: string[]` / `onValueChange`, or uncontrolled
 * with `defaultValue`. `type="single"` (default) keeps one open;
 * `type="multiple"` allows several.
 */
const meta = {
  title: 'Disclosure/Accordion',
  component: Accordion.Root,
  tags: ['autodocs'],
} satisfies Meta<typeof Accordion.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Single-open (default), with the first section expanded for autodocs. */
export const Playground: Story = {
  render: () => (
    <Box style={{ maxWidth: 420 }}>
      <Accordion.Root type="single" defaultValue={['shipping']}>
        {SECTIONS.map((s) => (
          <Box key={s.id} style={ITEM}>
            <Accordion.Item value={s.id}>
              <Trigger>{s.title}</Trigger>
              <Accordion.Content style={PANEL}>
                <Text m={0}>{s.body}</Text>
              </Accordion.Content>
            </Accordion.Item>
          </Box>
        ))}
      </Accordion.Root>
    </Box>
  ),
};

/** `type="multiple"` - several panels open at once. */
export const Multiple: Story = {
  render: () => (
    <Box style={{ maxWidth: 420 }}>
      <Accordion.Root type="multiple" defaultValue={['shipping', 'warranty']}>
        {SECTIONS.map((s) => (
          <Box key={s.id} style={ITEM}>
            <Accordion.Item value={s.id}>
              <Trigger>{s.title}</Trigger>
              <Accordion.Content style={PANEL}>
                <Text m={0}>{s.body}</Text>
              </Accordion.Content>
            </Accordion.Item>
          </Box>
        ))}
      </Accordion.Root>
    </Box>
  ),
};

/** Controlled - parent state owns the open-id array. */
export const Controlled: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = useState<string[]>(['returns']);
      return (
        <VStack gap="$2" style={{ maxWidth: 420 }}>
          <Note>open = [{value.join(', ')}]</Note>
          <Accordion.Root type="single" value={value} onValueChange={setValue}>
            {SECTIONS.map((s) => (
              <Box key={s.id} style={ITEM}>
                <Accordion.Item value={s.id}>
                  <Trigger>{s.title}</Trigger>
                  <Accordion.Content style={PANEL}>
                    <Text m={0}>{s.body}</Text>
                  </Accordion.Content>
                </Accordion.Item>
              </Box>
            ))}
          </Accordion.Root>
        </VStack>
      );
    }
    return <Demo />;
  },
};
