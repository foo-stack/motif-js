import type { Meta, StoryObj } from '@storybook/react';
import { CommandPalette, useCommandPaletteShortcut, type Command } from '@usemotif/headless';
import { File, Search, Settings, Trash } from '@usemotif/icons';
import { Box, Button, HStack, Kbd, Text, VStack } from 'usemotif';
import { useState, type ReactNode } from 'react';
import { Note } from '../../harness/demo.js';

const COMMANDS: Command[] = [
  { id: 'open', label: 'Open file', section: 'File', shortcut: ['⌘', 'O'], icon: <File />, onSelect: () => undefined },
  { id: 'save', label: 'Save', section: 'File', shortcut: ['⌘', 'S'], icon: <File />, onSelect: () => undefined },
  { id: 'search', label: 'Search project', section: 'Edit', shortcut: ['⌘', 'F'], icon: <Search />, onSelect: () => undefined },
  { id: 'settings', label: 'Open settings', section: 'App', icon: <Settings />, onSelect: () => undefined },
  { id: 'trash', label: 'Delete file', section: 'File', icon: <Trash />, disabled: true, onSelect: () => undefined },
];

const DIALOG = {
  background: 'var(--colors-surface-base)',
  color: 'var(--colors-text-default)',
  borderRadius: 12,
  width: 460,
  maxWidth: '90vw',
  overflow: 'hidden',
  border: '1px solid var(--colors-border-default)',
  boxShadow: '0 16px 56px rgba(0,0,0,0.3)',
} as const;

const INPUT = {
  width: '100%',
  boxSizing: 'border-box' as const,
  padding: '14px 16px',
  border: 'none',
  borderBottom: '1px solid var(--colors-border-default)',
  background: 'transparent',
  color: 'var(--colors-text-default)',
  fontSize: 15,
  outline: 'none',
};

function PaletteList() {
  return (
    <Box p="$1" maxH={320} overflow="auto">
      <CommandPalette.List
        renderSection={(section) => (
          <Text
            fontSize="$xs"
            fontWeight="$semibold"
            color="$colors.text.muted"
            px="$2"
            pt="$2"
            pb="$1"
          >
            {section}
          </Text>
        )}
        renderItem={(cmd, { highlighted }) => (
          <HStack
            gap="$2"
            alignItems="center"
            px="$2"
            py="$2"
            borderRadius="$sm"
            bg={highlighted ? '$colors.surface.muted' : 'transparent'}
            opacity={cmd.disabled ? 0.45 : 1}
          >
            <Box display="flex" alignItems="center" color="$colors.text.muted">
              {cmd.icon}
            </Box>
            <Text flex="1">{cmd.label}</Text>
            {cmd.shortcut ? (
              <HStack gap="$1">
                {cmd.shortcut.map((k) => (
                  <Kbd key={k}>{k}</Kbd>
                ))}
              </HStack>
            ) : null}
          </HStack>
        )}
      />
    </Box>
  );
}

function PaletteShell({ children }: { children?: ReactNode }) {
  return (
    <Box style={DIALOG}>
      <CommandPalette.Input placeholder="Type a command…">
        <input style={INPUT} />
      </CommandPalette.Input>
      <PaletteList />
      {children}
    </Box>
  );
}

/**
 * CommandPalette — a fuzzy-searchable command launcher (⌘K). Composes
 * Dialog (focus trap + scrim + portal) over a filtered, section-grouped
 * list with recent-item tracking.
 *
 * Parts: `Root` (takes a `commands: Command[]` array, controlled `open`
 * + `onOpenChange` or uncontrolled `defaultOpen`, plus `recents` /
 * `matcher` overrides) / `Input` (renders a default `<input>` or clones
 * a child) / `List` (drives `renderItem` + optional `renderSection`).
 * Pair with the `useCommandPaletteShortcut('mod+k', open)` hook for
 * global activation.
 */
const meta = {
  title: 'Overlay/CommandPalette',
  component: CommandPalette.Root,
  tags: ['autodocs'],
  args: { commands: COMMANDS },
  parameters: {
    docs: {
      description: {
        component:
          'Fuzzy ⌘K command launcher built on Dialog. Type to filter; ArrowUp/Down + Enter to run.',
      },
    },
  },
} satisfies Meta<typeof CommandPalette.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Press ⌘K (or Ctrl+K), or click the button. Type to fuzzy-filter. */
export const Playground: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    useCommandPaletteShortcut('mod+k', () => setOpen(true));
    return (
      <VStack gap="$2" alignItems="flex-start">
        <Note>
          Press <Kbd>⌘</Kbd>
          <Kbd>K</Kbd> or click below. Esc closes.
        </Note>
        <Button onClick={() => setOpen(true)}>Open command palette</Button>
        <CommandPalette.Root commands={COMMANDS} open={open} onOpenChange={setOpen}>
          <PaletteShell />
        </CommandPalette.Root>
      </VStack>
    );
  },
};

/** `defaultOpen` so Docs / VR capture the sectioned, filterable list. */
export const DefaultOpen: Story = {
  render: () => (
    <Box>
      <Note>Rendered open via `defaultOpen` — type to filter.</Note>
      <CommandPalette.Root commands={COMMANDS} defaultOpen>
        <PaletteShell />
      </CommandPalette.Root>
    </Box>
  ),
};
