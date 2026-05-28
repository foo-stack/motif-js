import type { Meta, StoryObj } from '@storybook/react';
import { Box, HStack, Image } from 'usemotif';
import { Note } from '../../harness/demo.js';

// A stable image that loads, and one guaranteed to 404 so the fallback shows.
const OK_SRC = 'https://placehold.co/160x100/3b82f6/white?text=img';
const BROKEN_SRC = 'https://example.invalid/missing.jpg';

/**
 * Image — the cross-platform image primitive. Wraps `<img>` and accepts every
 * Box style prop (`w`, `h`, `borderRadius`, `objectFit`, …). With no
 * `placeholder`/`fallback` it emits a plain styled image; set either and it
 * switches to a wrapped mode that overlays the placeholder while loading and
 * the fallback (or placeholder) on error, fading the image in once loaded.
 */
const meta = {
  title: 'Media/Image',
  component: Image,
  tags: ['autodocs'],
  argTypes: {
    src: { control: 'text' },
    alt: { control: 'text' },
    objectFit: {
      control: 'inline-radio',
      options: ['cover', 'contain', 'fill', 'none', 'scale-down'],
    },
    placeholder: { control: false },
    fallback: { control: false },
  },
  args: {
    src: OK_SRC,
    alt: 'A placeholder image',
    w: 160,
    h: 100,
    borderRadius: '$md',
    objectFit: 'cover',
  },
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Live-controls playground. */
export const Playground: Story = {};

const Skeleton = <Box bg="$colors.surface.muted" w="100%" h="100%" />;

/**
 * The three load states side by side: a plain image (no overlay), one with a
 * placeholder skeleton shown while loading, and a broken URL that falls back
 * to the skeleton on error.
 */
export const States: Story = {
  render: () => (
    <HStack gap="$6" alignItems="flex-start">
      <Case label="simple (no overlay)">
        <Image src={OK_SRC} alt="loads" w={160} h={100} borderRadius="$md" />
      </Case>
      <Case label="with placeholder">
        <Image
          src={OK_SRC}
          alt="loads with skeleton"
          w={160}
          h={100}
          borderRadius="$md"
          placeholder={Skeleton}
        />
      </Case>
      <Case label="broken url → fallback">
        <Image
          src={BROKEN_SRC}
          alt="fails to load"
          w={160}
          h={100}
          borderRadius="$md"
          fallback={Skeleton}
        />
      </Case>
    </HStack>
  ),
};

function Case({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {children}
      <Note>{label}</Note>
    </div>
  );
}
