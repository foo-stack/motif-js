import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { VStack } from 'usemotif';
import { Progress, type ProgressProps } from '@usemotif/headless';
import { Matrix } from '../../harness/Matrix.js';
import { Note } from '../../harness/demo.js';

// Progress is a HEADLESS primitive - it ships ARIA wiring (role="progressbar",
// aria-valuenow/min/max) and a filled track, but no visuals. Styling rides on
// `style` (the track) and `fillStyle` (the fill), so these stories supply a
// small inline theme to make the bar visible.
// Motif emits theme tokens as `--<scale>-<path>` CSS custom properties
// (e.g. `colors.surface.muted` → `--colors-surface-muted`). Reference them
// directly here, with a hex fallback so the bar is visible even outside a
// ThemeProvider.
const TRACK: CSSProperties = {
  width: 220,
  height: 8,
  borderRadius: 999,
  background: 'var(--colors-surface-muted, #e5e7eb)',
};
const FILL: CSSProperties = {
  height: '100%',
  borderRadius: 999,
  background: 'var(--colors-action-primary-bg, #3b82f6)',
  transition: 'width 200ms ease',
};

const VALUES = [0, 25, 50, 75, 100] as const;

/**
 * Progress - a headless, value-driven progress indicator. `value` is `0..100`
 * by default; pass `max` to rescale, or `null` for an indeterminate bar (no
 * `aria-valuenow`). It renders an ARIA `progressbar` with a filled inner
 * track; all visuals come from the `style` / `fillStyle` props (shown here
 * with a small inline theme).
 */
const meta = {
  title: 'Media/Progress',
  component: Progress,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 5 } },
    max: { control: 'number' },
    style: { control: false },
    fillStyle: { control: false },
  },
  args: {
    value: 60,
    max: 100,
    'aria-label': 'Upload progress',
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Live-controls playground - drag `value` to drive the bar. */
export const Playground: Story = {
  render: (args) => <Progress {...args} style={TRACK} fillStyle={FILL} />,
};

/** A sweep across the canonical fill values. */
export const Values: Story = {
  render: () => (
    <Matrix<ProgressProps>
      base={{ style: TRACK, fillStyle: FILL, 'aria-label': 'progress' } as Partial<ProgressProps>}
      rows={{ prop: 'value', values: VALUES, label: (v) => `${v}%` }}
      render={(p) => <Progress {...(p as ProgressProps)} />}
    />
  ),
};

/**
 * Indeterminate state. With `value={null}` no `aria-valuenow` is emitted and
 * the fill renders at a fixed 30% sliver (a real app would animate it).
 */
export const Indeterminate: Story = {
  render: () => (
    <VStack gap="$2">
      <Progress value={null} aria-label="Loading" style={TRACK} fillStyle={FILL} />
      <Note>value={'{null}'} - indeterminate, no aria-valuenow.</Note>
    </VStack>
  ),
};
