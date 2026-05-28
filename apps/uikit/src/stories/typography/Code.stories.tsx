import type { Meta, StoryObj } from '@storybook/react';
import { Code, Paragraph, Text, VStack } from 'usemotif';
import { Note } from '../../harness/demo.js';

/**
 * Code renders an inline `<code>` with monospace font and a subtle
 * background tint. It extends every Text style prop. For block code wrap
 * it in a `<pre>` (or pass `as="pre"`); tweak `bg` / `color` for accent
 * variants.
 */
const meta = {
  title: 'Typography/Code',
  component: Code,
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
    bg: { control: 'text' },
    color: { control: 'text' },
  },
  args: {
    children: 'const theme = createTheme(tokens)',
  },
} satisfies Meta<typeof Code>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Live-controls playground. */
export const Playground: Story = {};

/** Inline code reads naturally mid-sentence. */
export const Inline: Story = {
  render: () => (
    <Paragraph style={{ maxWidth: 560 }}>
      Install with <Code>npm i usemotif</Code>, then import the primitives:{' '}
      <Code>import {'{ Box, Text }'} from 'usemotif'</Code>. The compiler
      reads your <Code>motif.config.ts</Code> at build time.
    </Paragraph>
  ),
};

/** Accent variants — recolour via the inherited style props. */
export const Variants: Story = {
  render: () => (
    <VStack gap="$3">
      <VStack gap="$1">
        <Note>default (neutral tint)</Note>
        <Text>
          <Code>{`GET /api/users`}</Code>
        </Text>
      </VStack>
      <VStack gap="$1">
        <Note>success accent</Note>
        <Text>
          <Code bg="$colors.action.success.bg" color="$colors.action.success.fg">
            200 OK
          </Code>
        </Text>
      </VStack>
      <VStack gap="$1">
        <Note>danger accent</Note>
        <Text>
          <Code bg="$colors.action.danger.bg" color="$colors.action.danger.fg">
            404 Not Found
          </Code>
        </Text>
      </VStack>
    </VStack>
  ),
};

/**
 * Block code — `Code` is inline-only (it omits `as`), so wrap the snippet in
 * a `Text as="pre"` with the same mono treatment for multi-line blocks.
 */
export const Block: Story = {
  render: () => (
    <Text
      as="pre"
      fontFamily="$mono"
      fontSize="$sm"
      bg="$colors.surface.muted"
      display="block"
      p="$3"
      borderRadius="$md"
      style={{ maxWidth: 560 }}
    >
      {`function App() {
  return <Box p="$4">Hello, Motif</Box>;
}`}
    </Text>
  ),
};
