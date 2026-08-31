import type { Meta, StoryObj } from '@storybook/react';
import { Box, HStack, Icon, type IconProps } from 'usemotif';
import { Check, ChevronRight, Heart, Plus, Search, Star, Trash } from '@usemotif/icons';
import { Matrix } from '../../harness/Matrix.js';
import { Note } from '../../harness/demo.js';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

/**
 * Icon - the semantic SVG primitive. It's `aria-hidden` by default (icons are
 * decorative unless given an `aria-label`), picks a size from the `xs`-`xl`
 * enum (or a raw pixel number), and inherits `color` via `currentColor`. The
 * pre-built glyphs in `@usemotif/icons` are thin wrappers over this same
 * component, so they accept the identical props.
 */
const meta = {
  title: 'Media/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: SIZES },
    color: { control: 'color' },
    render: { control: false },
    children: { control: false },
  },
  args: {
    size: 'md',
    color: 'currentColor',
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Live-controls playground over a single glyph. */
export const Playground: Story = {
  render: (args) => <Icon {...args} render={({ Path }) => <Path d="M5 12h14M12 5v14" />} />,
};

/** Every size token, rendered with the `Star` glyph from `@usemotif/icons`. */
export const Sizes: Story = {
  render: () => (
    <Matrix<IconProps>
      cols={{ prop: 'size', values: SIZES }}
      render={(p) => <Star {...(p as IconProps)} />}
    />
  ),
};

/**
 * Colour threads through via `currentColor`. Icon/Svg are plain SVG
 * pass-throughs and don't resolve motif tokens themselves, so set the token
 * `color` on a surrounding motif element (a `Box` here) and the stroke
 * inherits it. (Passing a raw CSS colour to the icon's own `color` prop also
 * works - that lands directly on the `<svg>`.)
 */
export const Colors: Story = {
  render: () => (
    <HStack gap="$4" alignItems="center">
      <Box color="$colors.action.danger.bg">
        <Heart size="lg" />
      </Box>
      <Box color="$colors.action.success.bg">
        <Check size="lg" />
      </Box>
      <Box color="$colors.action.primary.bg">
        <Star size="lg" />
      </Box>
      <Box color="$colors.text.muted">
        <Trash size="lg" />
      </Box>
    </HStack>
  ),
};

/** A spread of glyphs from `@usemotif/icons` at a common size. */
export const Glyphs: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <HStack gap="$4" alignItems="center">
        <Plus size="lg" />
        <Check size="lg" />
        <Heart size="lg" />
        <Star size="lg" />
        <Trash size="lg" />
        <Search size="lg" />
        <ChevronRight size="lg" />
      </HStack>
      <Note>Glyphs from @usemotif/icons - each is an &lt;Icon&gt; wrapper.</Note>
    </div>
  ),
};
