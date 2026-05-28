import type { Meta, StoryObj } from '@storybook/react';
import { Menu } from '@usemotif/headless';
import { Box, Button, Text } from 'usemotif';
import { Note } from '../../harness/demo.js';

/**
 * Menu — an accessible dropdown with full keyboard support. Trigger
 * gets `aria-haspopup="menu"` + `aria-expanded`; the panel is
 * `role="menu"`, each item `role="menuitem"`. Arrow keys move focus,
 * Home/End jump, Enter/Space activate, Escape closes and restores focus
 * to the trigger.
 *
 * Parts: `Root` / `Trigger` / `Content` / `Item` / `Separator`. `Item`
 * takes `onSelect` and `disabled`; `Content` takes `placement` and
 * `offset`. Open state is uncontrolled (`defaultOpen`) or controlled
 * (`open` + `onOpenChange`).
 */
const meta = {
  title: 'Overlay/Menu',
  component: Menu.Root,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Keyboard-navigable dropdown menu. Arrow keys, Home/End, Enter/Space, Escape.',
      },
    },
  },
} satisfies Meta<typeof Menu.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const PANEL = {
  background: 'var(--colors-surface-base)',
  color: 'var(--colors-text-default)',
  padding: 6,
  borderRadius: 10,
  minWidth: 180,
  border: '1px solid var(--colors-border-default)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
} as const;

const ITEM = { padding: '8px 12px', borderRadius: 6, fontSize: 14 } as const;
const DANGER_ITEM = { ...ITEM, color: 'var(--colors-action-danger-bg)' } as const;

function MenuBody() {
  return (
    <Menu.Content style={PANEL}>
      <Menu.Item style={ITEM} onSelect={() => undefined}>
        Save
      </Menu.Item>
      <Menu.Item style={ITEM} onSelect={() => undefined}>
        Duplicate
      </Menu.Item>
      <Menu.Item style={ITEM} disabled onSelect={() => undefined}>
        Rename (disabled)
      </Menu.Item>
      <Menu.Separator style={{ margin: '4px 0' }} />
      <Menu.Item style={DANGER_ITEM} onSelect={() => undefined}>
        Delete
      </Menu.Item>
    </Menu.Content>
  );
}

/** Click the trigger, then drive it with the keyboard. */
export const Playground: Story = {
  render: () => (
    <Menu.Root>
      <Menu.Trigger>
        <Button>Actions</Button>
      </Menu.Trigger>
      <MenuBody />
    </Menu.Root>
  ),
};

/** `defaultOpen` so Docs / VR capture the open panel and its items. */
export const DefaultOpen: Story = {
  render: () => (
    <Box pb={220}>
      <Note>Rendered open via `defaultOpen` — first enabled item auto-focuses.</Note>
      <Menu.Root defaultOpen>
        <Menu.Trigger>
          <Button>Actions</Button>
        </Menu.Trigger>
        <MenuBody />
      </Menu.Root>
    </Box>
  ),
};

/** A disabled item is skipped by arrow-key navigation and not selectable. */
export const WithDisabledItem: Story = {
  render: () => (
    <Box pb={220}>
      <Text color="$colors.text.muted" fontSize="$sm" mb="$2">
        ArrowDown from the trigger skips the disabled row.
      </Text>
      <Menu.Root defaultOpen>
        <Menu.Trigger>
          <Button variant="outline">Edit</Button>
        </Menu.Trigger>
        <Menu.Content style={PANEL}>
          <Menu.Item style={ITEM} onSelect={() => undefined}>
            Cut
          </Menu.Item>
          <Menu.Item style={ITEM} disabled onSelect={() => undefined}>
            Copy (disabled)
          </Menu.Item>
          <Menu.Item style={ITEM} onSelect={() => undefined}>
            Paste
          </Menu.Item>
        </Menu.Content>
      </Menu.Root>
    </Box>
  ),
};
