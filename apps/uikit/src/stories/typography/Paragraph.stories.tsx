import type { Meta, StoryObj } from '@storybook/react';
import { Code, Heading, Kbd, Link, Paragraph, VStack } from 'usemotif';

/**
 * Paragraph renders a semantic `<p>` with sensible defaults: `$md` font
 * size, 1.6 line-height, no enforced margin. It extends every Text style
 * prop, so colour, size and spacing are all overridable. Block-level — it
 * happily hosts inline `Code`, `Kbd` and `Link` children.
 */
const meta = {
  title: 'Typography/Paragraph',
  component: Paragraph,
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
    fontSize: { control: 'text' },
    color: { control: 'text' },
  },
  args: {
    children:
      'Motif is a cross-platform styling library. The same component renders on web, React Native and desktop with no platform guards.',
  },
} satisfies Meta<typeof Paragraph>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Live-controls playground. */
export const Playground: Story = {};

/** Inline primitives compose naturally inside a Paragraph. */
export const WithInlineContent: Story = {
  name: 'With inline content',
  render: () => (
    <VStack gap="$4" style={{ maxWidth: 560 }}>
      <Heading level={3}>Keyboard-driven editing</Heading>
      <Paragraph>
        Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to open the command palette, then run{' '}
        <Code>motif build</Code> to compile. See the{' '}
        <Link href="https://usemotif.dev/docs" target="_blank">
          documentation
        </Link>{' '}
        for the full CLI reference.
      </Paragraph>
      <Paragraph color="$colors.text.muted" fontSize="$sm">
        A muted, smaller paragraph works well for secondary captions and helper text beneath the
        primary copy.
      </Paragraph>
    </VStack>
  ),
};

/** Stacked paragraphs read as body copy; gap drives the rhythm. */
export const BodyCopy: Story = {
  render: () => (
    <VStack gap="$3" style={{ maxWidth: 560 }}>
      <Paragraph>
        Tokens are the single source of truth. Every colour, space and font size flows from the
        theme, so swapping light and dark is a one-line change at the provider.
      </Paragraph>
      <Paragraph>
        Because the style props resolve against that same theme, components stay declarative — there
        is no separate stylesheet to keep in sync.
      </Paragraph>
    </VStack>
  ),
};
