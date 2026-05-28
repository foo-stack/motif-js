import type { Meta, StoryObj } from '@storybook/react';
import { Link, type LinkProps, Paragraph, VStack } from 'usemotif';
import { Matrix } from '../../harness/Matrix.js';
import { Note } from '../../harness/demo.js';

const UNDERLINE = ['hover', 'always', 'never'] as const;

/**
 * Link is the inline anchor primitive — renders `<a>` and inherits
 * Pressable's pseudo-state plumbing (`_hover`, `_focus`). The colour comes
 * from the theme's primary accent. `target='_blank'` auto-injects
 * `rel='noopener noreferrer'` unless you override `rel`. The `underline`
 * mode controls when the underline shows.
 */
const meta = {
  title: 'Typography/Link',
  component: Link,
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
    href: { control: 'text' },
    underline: { control: 'inline-radio', options: UNDERLINE },
    target: { control: 'inline-radio', options: ['_self', '_blank', '_parent', '_top'] },
    rel: { control: 'text' },
  },
  args: {
    children: 'Read the docs',
    href: 'https://usemotif.dev',
    underline: 'hover',
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Live-controls playground. Hover the link to see the `hover` mode. */
export const Playground: Story = {};

/** The three underline modes. `hover` only underlines on hover/focus. */
export const Underline: Story = {
  render: () => (
    <Matrix<LinkProps>
      base={{ children: 'usemotif.dev', href: 'https://usemotif.dev' } as Partial<LinkProps>}
      rows={{ prop: 'underline', values: UNDERLINE }}
      render={(p) => <Link {...(p as LinkProps)} />}
    />
  ),
};

/** Inline in body copy — the common case. */
export const Inline: Story = {
  render: () => (
    <Paragraph style={{ maxWidth: 560 }}>
      Motif ships a <Link href="https://usemotif.dev/docs">getting-started guide</Link> and a full{' '}
      <Link href="https://usemotif.dev/api" underline="always">
        API reference
      </Link>
      . Source lives on{' '}
      <Link href="https://github.com/foo-stack/usemotif" target="_blank">
        GitHub
      </Link>
      .
    </Paragraph>
  ),
};

/** External links open in a new tab and get a safe `rel` automatically. */
export const External: Story = {
  render: () => (
    <VStack gap="$2">
      <Note>target="_blank" auto-adds rel="noopener noreferrer"</Note>
      <Link href="https://usemotif.dev" target="_blank" underline="always">
        Open usemotif.dev in a new tab ↗
      </Link>
    </VStack>
  ),
};
