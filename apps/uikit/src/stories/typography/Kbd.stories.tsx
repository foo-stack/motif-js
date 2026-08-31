import type { Meta, StoryObj } from '@storybook/react';
import { HStack, Kbd, Paragraph, Text, VStack } from 'usemotif';
import { Note } from '../../harness/demo.js';

/**
 * Kbd renders a `<kbd>` for keyboard-shortcut labels - monospace,
 * bordered, with a slight elevation tint. It extends every Text style
 * prop and is designed for inline use inside paragraphs.
 */
const meta = {
  title: 'Typography/Kbd',
  component: Kbd,
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
  },
  args: {
    children: '⌘K',
  },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Live-controls playground. */
export const Playground: Story = {};

/** Common single-key labels. */
export const Keys: Story = {
  render: () => (
    <HStack gap="$2" alignItems="center">
      {['⌘', '⌥', '⌃', '⇧', 'Esc', 'Tab', 'Enter', '↑', '↓'].map((k) => (
        <Kbd key={k}>{k}</Kbd>
      ))}
    </HStack>
  ),
};

/** Chords - join keys with a separator for multi-key shortcuts. */
export const Shortcuts: Story = {
  render: () => (
    <VStack gap="$3">
      {(
        [
          { combo: ['⌘', 'K'], label: 'Command palette' },
          { combo: ['⌘', '⇧', 'P'], label: 'Run task' },
          { combo: ['⌃', 'C'], label: 'Cancel' },
        ] as const
      ).map(({ combo, label }) => (
        <HStack key={label} gap="$3" alignItems="center">
          <HStack gap="$1" alignItems="center">
            {combo.map((k, i) => (
              <HStack key={k} gap="$1" alignItems="center">
                {i > 0 ? <Text color="$colors.text.muted">+</Text> : null}
                <Kbd>{k}</Kbd>
              </HStack>
            ))}
          </HStack>
          <Note>{label}</Note>
        </HStack>
      ))}
    </VStack>
  ),
};

/** Inline inside running text. */
export const InParagraph: Story = {
  name: 'In a paragraph',
  render: () => (
    <Paragraph style={{ maxWidth: 520 }}>
      Save your work with <Kbd>⌘</Kbd> <Kbd>S</Kbd>, or undo the last change with <Kbd>⌘</Kbd>{' '}
      <Kbd>Z</Kbd>.
    </Paragraph>
  ),
};
