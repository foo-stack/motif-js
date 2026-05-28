import type { Meta, StoryObj } from '@storybook/react';
import { Grid, VStack } from 'usemotif';
import { Note, Tile } from '../../harness/demo.js';

/**
 * Grid is a CSS-grid container. `columns={n}` is shorthand for
 * `repeat(n, 1fr)`; `templateColumns` takes a raw track list and wins over
 * `columns`. Spacing via the `gap` style prop.
 */
const meta = {
  title: 'Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
  argTypes: {
    columns: { control: { type: 'number', min: 1, max: 8 } },
    gap: { control: 'text' },
    templateColumns: { control: 'text' },
  },
  args: { columns: 4, gap: '$3' },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Grid {...args}>
      {Array.from({ length: 8 }).map((_, i) => (
        <Tile key={i} tone="muted">
          {i + 1}
        </Tile>
      ))}
    </Grid>
  ),
};

export const ColumnCounts: Story = {
  render: () => (
    <VStack gap="$5">
      {[2, 3, 4, 6].map((c) => (
        <VStack key={c} gap="$1">
          <Note>columns={c}</Note>
          <Grid columns={c} gap="$2">
            {Array.from({ length: c * 2 }).map((_, i) => (
              <Tile key={i} tone="muted">
                {i + 1}
              </Tile>
            ))}
          </Grid>
        </VStack>
      ))}
    </VStack>
  ),
};

export const TemplateColumns: Story = {
  name: 'templateColumns (raw track list)',
  render: () => (
    <VStack gap="$1">
      <Note>templateColumns="2fr 1fr 1fr"</Note>
      <Grid templateColumns="2fr 1fr 1fr" gap="$2">
        <Tile>2fr</Tile>
        <Tile tone="success">1fr</Tile>
        <Tile tone="danger">1fr</Tile>
      </Grid>
    </VStack>
  ),
};

export const Responsive: Story = {
  render: () => (
    <VStack gap="$1">
      <Note>gridTemplateColumns responds to viewport — resize the canvas</Note>
      <Grid gap="$3" gridTemplateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Tile key={i} tone="muted">
            {i + 1}
          </Tile>
        ))}
      </Grid>
    </VStack>
  ),
};
