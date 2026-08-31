import type { Meta, StoryObj } from '@storybook/react';
import { HStack, Path, Svg } from 'usemotif';
import { Note } from '../../harness/demo.js';

/**
 * Path - an SVG `<path>` with an optional `pathLength` stroke-drawing prop
 * (`0` hides the stroke, `1` draws it fully). It's a drop-in replacement for
 * the lowercase `path` tag inside `<Svg>`. When `pathLength` is omitted it
 * renders a plain `<path>` with no dash mechanics - that's what these stories
 * exercise.
 *
 * The motion side - animating `pathLength` from a `MotionValue` to draw the
 * stroke on - is covered by the Motion stories, not here.
 */
const meta = {
  title: 'Media/Path',
  component: Path,
  tags: ['autodocs'],
  argTypes: {
    d: { control: 'text' },
    pathLength: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    stroke: { control: 'color' },
  },
  args: {
    d: 'M5 12h14M13 6l6 6-6 6',
    stroke: 'currentColor',
  },
} satisfies Meta<typeof Path>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Live-controls playground. Drag `pathLength` to partially draw the stroke -
 * the static counterpart to the animated Motion story.
 */
export const Playground: Story = {
  render: (args) => (
    <Svg size={120} viewBox="0 0 24 24">
      <Path {...args} />
    </Svg>
  ),
};

/** A fully-rendered static path (no `pathLength`) - the default case. */
export const Static: Story = {
  render: () => (
    <Svg size={120} viewBox="0 0 24 24">
      <Path d="M5 12h14M13 6l6 6-6 6" />
    </Svg>
  ),
};

/**
 * Holding `pathLength` at fixed fractions shows the stroke-drawing surface
 * statically. Animating between these is the Motion story's job.
 */
export const PartialDraw: Story = {
  name: 'Partial draw (static pathLength)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <HStack gap="$5" alignItems="center">
        {[0.25, 0.5, 0.75, 1].map((p) => (
          <div
            key={p}
            style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}
          >
            <Svg size={80} viewBox="0 0 24 24">
              <Path d="M5 12h14M13 6l6 6-6 6" pathLength={p} />
            </Svg>
            <Note>pathLength={p}</Note>
          </div>
        ))}
      </HStack>
      <Note>Static fractions only. Motion (animated draw-on) is a separate story.</Note>
    </div>
  ),
};
