import type { Meta, StoryObj } from '@storybook/react';
import { Blockquote, Link, VStack } from 'usemotif';

/**
 * Blockquote renders a `<blockquote>` with a left accent border and italic
 * children. Unlike the other typography primitives it is a focused wrapper:
 * it accepts only `children` and an optional `cite` node, rendered after the
 * quote as muted `<cite>` text. It does not forward Text style props.
 */
const meta = {
  title: 'Typography/Blockquote',
  component: Blockquote,
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
    cite: { control: 'text' },
  },
  args: {
    children:
      'Tokens are the single source of truth — change them once and the whole UI follows.',
    cite: 'Motif design principles',
  },
} satisfies Meta<typeof Blockquote>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Live-controls playground. */
export const Playground: Story = {};

/** With and without a citation. */
export const Citation: Story = {
  render: () => (
    <VStack gap="$5" style={{ maxWidth: 560 }}>
      <Blockquote cite="Antoine de Saint-Exupéry">
        Perfection is achieved not when there is nothing more to add, but when
        there is nothing left to take away.
      </Blockquote>
      <Blockquote>
        A bare quote with no citation still carries the left accent border and
        italic styling.
      </Blockquote>
    </VStack>
  ),
};

/** `cite` is a ReactNode, so it can hold rich content like a Link. */
export const RichCitation: Story = {
  name: 'Rich citation',
  render: () => (
    <Blockquote
      cite={
        <>
          From the{' '}
          <Link href="https://usemotif.dev/docs" target="_blank">
            Motif docs
          </Link>
        </>
      }
    >
      The same component renders on web, React Native and desktop with no
      platform guards.
    </Blockquote>
  ),
};
