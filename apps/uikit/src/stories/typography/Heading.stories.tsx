import type { Meta, StoryObj } from '@storybook/react';
import { Heading, type HeadingProps, VStack } from 'usemotif';
import { Matrix } from '../../harness/Matrix.js';
import { Note } from '../../harness/demo.js';

const LEVELS = [1, 2, 3, 4, 5, 6] as const;

/**
 * Heading renders semantic `h1`-`h6`. The `level` prop drives both the
 * rendered tag (`as="h{level}"`) and a default font-size step on the token
 * scale (`$3xl` down to `$sm`). It extends every Text style prop, and any
 * prop you pass overrides the level defaults.
 */
const meta = {
  title: 'Typography/Heading',
  component: Heading,
  tags: ['autodocs'],
  argTypes: {
    level: { control: 'inline-radio', options: LEVELS },
    children: { control: 'text' },
    color: { control: 'text' },
  },
  args: {
    children: 'The quick brown fox',
    level: 2,
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Live-controls playground. Switch `level` to retag and rescale. */
export const Playground: Story = {};

/** Every heading level, 1-6, with its default size step. */
export const Levels: Story = {
  render: () => (
    <Matrix<HeadingProps>
      base={{ children: 'Heading sample' } as Partial<HeadingProps>}
      rows={{ prop: 'level', values: LEVELS, label: (l) => `h${l}` }}
      render={(p) => <Heading {...p} />}
    />
  ),
};

/** A realistic document outline - levels carry both meaning and scale. */
export const DocumentOutline: Story = {
  render: () => (
    <VStack gap="$3" style={{ maxWidth: 520 }}>
      <Heading level={1}>Getting started with Motif</Heading>
      <Note>level 1 - page title</Note>
      <Heading level={2}>Installation</Heading>
      <Note>level 2 - section</Note>
      <Heading level={3}>Bundler setup</Heading>
      <Note>level 3 - subsection</Note>
      <Heading level={4} color="$colors.text.muted">
        Vite
      </Heading>
      <Note>level 4 - with a colour override</Note>
    </VStack>
  ),
};
