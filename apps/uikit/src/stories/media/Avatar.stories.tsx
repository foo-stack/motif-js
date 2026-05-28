import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, type AvatarProps, HStack } from 'usemotif';
import { Matrix } from '../../harness/Matrix.js';
import { Note } from '../../harness/demo.js';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
const SHAPES = ['circle', 'square'] as const;

// A stable image that loads, and one guaranteed to 404 so the initials
// fallback renders.
const OK_SRC = 'https://placehold.co/160x160/3b82f6/white?text=JD';
const BROKEN_SRC = 'https://example.invalid/missing.jpg';

/**
 * Avatar — a circular (or rounded-square) profile image with an automatic
 * initials fallback. `name` is required: it's the image's `alt` text and the
 * source of the initials shown when `src` is absent or fails to load. `size`
 * takes the `xs`–`xl` enum or a raw pixel number.
 */
const meta = {
  title: 'Media/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    src: { control: 'text' },
    size: { control: 'inline-radio', options: SIZES },
    shape: { control: 'inline-radio', options: SHAPES },
    fallback: { control: false },
  },
  args: {
    name: 'Jane Doe',
    src: OK_SRC,
    size: 'md',
    shape: 'circle',
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Live-controls playground. Clear `src` to see the initials fallback. */
export const Playground: Story = {};

/** Every size, circle shape, with an image. */
export const Sizes: Story = {
  render: () => (
    <Matrix<AvatarProps>
      base={{ name: 'Jane Doe', src: OK_SRC } as Partial<AvatarProps>}
      cols={{ prop: 'size', values: SIZES }}
      render={(p) => <Avatar {...(p as AvatarProps)} />}
    />
  ),
};

/** shape (rows) × size (cols). */
export const Shapes: Story = {
  render: () => (
    <Matrix<AvatarProps>
      base={{ name: 'Jane Doe', src: OK_SRC } as Partial<AvatarProps>}
      rows={{ prop: 'shape', values: SHAPES }}
      cols={{ prop: 'size', values: SIZES }}
      render={(p) => <Avatar {...(p as AvatarProps)} />}
    />
  ),
};

/**
 * Image vs. initials fallback. When `src` is missing — or fails to load — the
 * avatar derives up-to-2-letter initials from `name`. A `BROKEN_SRC` triggers
 * the same path via the image's `onError`.
 */
export const Fallback: Story = {
  render: () => (
    <HStack gap="$6" alignItems="flex-end">
      <FallbackCase label="image loads" name="Jane Doe" src={OK_SRC} />
      <FallbackCase label="no src → initials" name="Jane Doe" />
      <FallbackCase label="broken src → initials" name="Anil Kumar" src={BROKEN_SRC} />
      <FallbackCase label="single name → 2 letters" name="madonna" />
    </HStack>
  ),
};

function FallbackCase({ label, name, src }: { label: string; name: string; src?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
      <Avatar size="lg" name={name} {...(src !== undefined ? { src } : {})} />
      <Note>{label}</Note>
    </div>
  );
}
