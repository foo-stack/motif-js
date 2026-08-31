import type { Meta, StoryObj } from '@storybook/react';
import { Box, Stack, Text, VStack } from 'usemotif';
import { useState } from 'react';
import { Note, Tile } from '../../harness/demo.js';

/**
 * `<Stack stagger={seconds}>` adds `index * stagger` to each direct child's
 * `transition-delay`, so children with an `enterStyle` mount in a wave rather
 * than all at once. It composes with each child's own `transition` delay.
 *
 *   <Stack stagger={0.08}>
 *     {items.map((it) => (
 *       <Box key={it.id} enterStyle={{ opacity: 0, y: 12 }} transition="200ms">
 *         {it.label}
 *       </Box>
 *     ))}
 *   </Stack>
 *
 * `prefers-reduced-motion: reduce` (and explicit `stagger={0}`) collapse the
 * wave to zero. Remount the Stack (change its `key`) to replay the entry.
 */
const meta = {
  title: 'Motion/Stagger',
  component: Stack,
  tags: ['autodocs'],
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

const RnWebNote = (
  <Note>
    On the web (react-native-web) target the staggered entry runs on the JS thread via CSS
    transition-delay; true UI-thread orchestration (Reanimated) is verified on-device.
  </Note>
);

const LABELS = ['Inbox', 'Drafts', 'Sent', 'Archive', 'Spam', 'Trash'];

/**
 * A vertical list reveals in a wave. The "Replay" button bumps a `key` on the
 * Stack, remounting it so the `enterStyle` entry animation fires again.
 */
function StaggerDemo({ stagger }: { stagger: number }) {
  const [run, setRun] = useState(0);

  return (
    <VStack gap="$4">
      {RnWebNote}
      <Note>{`<Stack stagger={${stagger}}>`} - children fade + lift in sequence.</Note>
      <button onClick={() => setRun((r) => r + 1)}>Replay</button>
      <Stack key={run} stagger={stagger} gap="$2" w={240}>
        {LABELS.map((label) => (
          <Box key={label} enterStyle={{ opacity: 0, y: 12 }} transition="220ms ease-out">
            <Tile py="$3">{label}</Tile>
          </Box>
        ))}
      </Stack>
    </VStack>
  );
}

export const Wave: Story = {
  parameters: {
    docs: {
      source: {
        code: `const [run, setRun] = useState(0);
<button onClick={() => setRun((r) => r + 1)}>Replay</button>
<Stack key={run} stagger={0.08} gap="$2">
  {labels.map((label) => (
    <Box key={label} enterStyle={{ opacity: 0, y: 12 }} transition="220ms ease-out">
      {label}
    </Box>
  ))}
</Stack>`,
      },
    },
  },
  render: () => <StaggerDemo stagger={0.08} />,
};

/**
 * Side-by-side stagger amounts. Bigger values spread the wave further apart.
 */
function CompareDemo() {
  const [run, setRun] = useState(0);
  const amounts = [0, 0.06, 0.15] as const;

  return (
    <VStack gap="$4">
      {RnWebNote}
      <Note>stagger=0 (instant) vs 0.06 vs 0.15 - same children, different spread.</Note>
      <button onClick={() => setRun((r) => r + 1)}>Replay</button>
      <div style={{ display: 'flex', gap: 24 }} key={run}>
        {amounts.map((amount) => (
          <VStack key={amount} gap="$2">
            <Text fontSize="$sm" color="$colors.text.muted">
              stagger={amount}
            </Text>
            <Stack stagger={amount} gap="$2" w={120}>
              {LABELS.slice(0, 5).map((label) => (
                <Box key={label} enterStyle={{ opacity: 0, x: -16 }} transition="220ms ease-out">
                  <Tile py="$2">{label}</Tile>
                </Box>
              ))}
            </Stack>
          </VStack>
        ))}
      </div>
    </VStack>
  );
}

export const Compare: Story = {
  name: 'Stagger amounts',
  render: () => <CompareDemo />,
};
