import type { Meta, StoryObj } from '@storybook/react';
import { Wrap } from 'usemotif';
import { Tile } from '../../harness/demo.js';

/** Wrap - a flex container with `flex-wrap: wrap` and a consistent gap. */
const meta = {
  title: 'Layout/Wrap',
  component: Wrap,
  tags: ['autodocs'],
  argTypes: { gap: { control: 'text' } },
  args: { gap: '$2' },
} satisfies Meta<typeof Wrap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tags: Story = {
  render: (args) => (
    <Wrap {...args} maxW={420}>
      {Array.from({ length: 14 }).map((_, i) => (
        <Tile key={i} tone="muted" borderRadius="$full">
          tag {i + 1}
        </Tile>
      ))}
    </Wrap>
  ),
};
