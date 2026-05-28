import type { Meta, StoryObj } from '@storybook/react';
import { ContextMenu } from '@usemotif/headless';
import { Box, Text } from 'usemotif';
import { Note } from '../../harness/demo.js';

/**
 * ContextMenu — a Menu opened by right-click, positioned at the pointer.
 * Same a11y model as Menu (`role="menu"` + `role="menuitem"`, arrow-key
 * navigation, Home/End, Enter/Space, Escape) but the trigger is an
 * arbitrary region rather than a button.
 *
 * Parts: `Root` / `Trigger` / `Content` / `Item` / `Separator`. `Item`
 * takes `onSelect` and `disabled`.
 *
 * **No controlled-open prop.** `ContextMenu.Root` accepts only
 * `children`; the menu opens from the trigger's `onContextMenu` at the
 * captured pointer coordinates, so it can't be forced open via props —
 * right-click the region to open it.
 */
const meta = {
  title: 'Overlay/ContextMenu',
  component: ContextMenu.Root,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Right-click menu positioned at the pointer. No controlled-open prop — interaction only.',
      },
    },
  },
} satisfies Meta<typeof ContextMenu.Root>;

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

/** Right-click (or two-finger tap) the dashed region to open the menu. */
export const Playground: Story = {
  render: () => (
    <Box>
      <Note>Right-click the region below — the menu opens at the pointer.</Note>
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          <Box
            h={160}
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="$colors.surface.muted"
            borderRadius="$md"
            borderWidth={1}
            borderStyle="dashed"
            borderColor="$colors.border.default"
            color="$colors.text.muted"
          >
            <Text>Right-click anywhere here</Text>
          </Box>
        </ContextMenu.Trigger>
        <ContextMenu.Content style={PANEL}>
          <ContextMenu.Item style={ITEM} onSelect={() => undefined}>
            Cut
          </ContextMenu.Item>
          <ContextMenu.Item style={ITEM} onSelect={() => undefined}>
            Copy
          </ContextMenu.Item>
          <ContextMenu.Item style={ITEM} onSelect={() => undefined}>
            Paste
          </ContextMenu.Item>
          <ContextMenu.Separator style={{ margin: '4px 0' }} />
          <ContextMenu.Item
            style={{ ...ITEM, color: 'var(--colors-action-danger-bg)' }}
            onSelect={() => undefined}
          >
            Delete
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>
    </Box>
  ),
};
