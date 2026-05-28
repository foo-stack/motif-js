import type { Meta, StoryObj } from '@storybook/react';
import { HStack, Svg } from 'usemotif';
import { Note } from '../../harness/demo.js';

/**
 * Svg — a thin, typed pass-through for inline SVG. It supplies sensible
 * defaults (`viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`,
 * rounded caps) and a `size` prop that drives both width and height (default
 * `1em`, so it scales with the parent's font-size). Standard SVG attributes
 * (`viewBox`, `fill`, `stroke`, …) pass straight through; the SVG drawing
 * lives in `children`.
 */
const meta = {
  title: 'Media/Svg',
  component: Svg,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'number' },
    stroke: { control: 'color' },
    children: { control: false },
  },
  args: {
    size: 48,
  },
} satisfies Meta<typeof Svg>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Live-controls playground — tweak `size`/`stroke` over a simple checkmark. */
export const Playground: Story = {
  render: (args) => (
    <Svg {...args}>
      <path d="M20 6 9 17l-5-5" />
    </Svg>
  ),
};

/** A `size` strip — note the SVG defaults to `currentColor` stroke. */
export const Sizes: Story = {
  render: () => (
    <HStack gap="$4" alignItems="center">
      {[16, 24, 32, 48, 64].map((s) => (
        <div
          key={s}
          style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}
        >
          <Svg size={s}>
            <path d="M20 6 9 17l-5-5" />
          </Svg>
          <Note>size={s}</Note>
        </div>
      ))}
    </HStack>
  ),
};

/** Mixing SVG primitives — circle + line — inside one `<Svg>`. */
export const Drawing: Story = {
  render: () => (
    <Svg size={96} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </Svg>
  ),
};
