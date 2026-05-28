import type { Meta, StoryObj } from '@storybook/react';
import { Text, type TextProps, VStack } from 'usemotif';
import { Matrix } from '../../harness/Matrix.js';
import { Note } from '../../harness/demo.js';

const SIZES = ['$xs', '$sm', '$md', '$lg', '$xl', '$2xl', '$3xl'] as const;
const WEIGHTS = ['$normal', '$medium', '$semibold', '$bold'] as const;
const COLORS = [
  '$colors.text.default',
  '$colors.text.muted',
  '$colors.action.primary.bg',
  '$colors.action.danger.bg',
  '$colors.action.success.bg',
] as const;

/**
 * Text is the inline typography primitive — a `<span>` by default carrying
 * the full Box style-prop surface (`fontSize`, `fontWeight`, `color`,
 * `lineHeight`, …). The v1.1 `lines` prop clamps to N lines with an
 * ellipsis. Override `as` for semantic block-level text, or reach for the
 * `Heading` / `Paragraph` primitives.
 */
const meta = {
  title: 'Typography/Text',
  component: Text,
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
    fontSize: { control: 'select', options: SIZES },
    fontWeight: { control: 'inline-radio', options: WEIGHTS },
    color: { control: 'select', options: COLORS },
    lines: { control: { type: 'number', min: 0, max: 5 } },
  },
  args: {
    children: 'The quick brown fox jumps over the lazy dog.',
    fontSize: '$md',
    fontWeight: '$normal',
    color: '$colors.text.default',
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Live-controls playground. Drive size, weight, colour and line-clamp. */
export const Playground: Story = {};

/** The whole font-size token scale, at normal weight. */
export const Sizes: Story = {
  render: () => (
    <Matrix<TextProps>
      base={{ children: 'Motif text' } as Partial<TextProps>}
      rows={{ prop: 'fontSize', values: SIZES }}
      render={(p) => <Text {...p} />}
    />
  ),
};

/** Each font-weight token, md size. */
export const Weights: Story = {
  render: () => (
    <Matrix<TextProps>
      base={{ children: 'Motif text', fontSize: '$lg' } as Partial<TextProps>}
      rows={{ prop: 'fontWeight', values: WEIGHTS }}
      render={(p) => <Text {...p} />}
    />
  ),
};

/** Semantic colour tokens applied to inline text. */
export const Colors: Story = {
  render: () => (
    <Matrix<TextProps>
      base={{ children: 'Motif text', fontWeight: '$medium' } as Partial<TextProps>}
      rows={{ prop: 'color', values: COLORS }}
      render={(p) => <Text {...p} />}
    />
  ),
};

const LONG =
  'Motif resolves the line-clamp styles inline so any per-instance style override wins. This sentence is deliberately long enough to overflow a single line and demonstrate truncation across multiple line counts.';

/** `lines={n}` truncates to N lines with an ellipsis. */
export const Truncation: Story = {
  render: () => (
    <VStack gap="$5" style={{ maxWidth: 320 }}>
      {([1, 2, 3] as const).map((n) => (
        <VStack key={n} gap="$1">
          <Note>lines={n}</Note>
          <Text lines={n}>{LONG}</Text>
        </VStack>
      ))}
      <VStack gap="$1">
        <Note>no clamp (wraps freely)</Note>
        <Text>{LONG}</Text>
      </VStack>
    </VStack>
  ),
};
