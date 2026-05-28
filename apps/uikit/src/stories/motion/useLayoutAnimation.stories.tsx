import type { Meta, StoryObj } from '@storybook/react';
import { Box, HStack, Text, VStack, useLayoutAnimation } from 'usemotif';
import { useState } from 'react';
import { Note, Tile } from '../../harness/demo.js';

/**
 * `useLayoutAnimation(options?)` animates an element between its previous and
 * next layout box (FLIP). It returns `{ ref }` (web) — attach the ref and the
 * hook reads `getBoundingClientRect()` each commit, applies an inverse
 * transform, then tweens it back to identity under a CSS transition. Options:
 * `kind` (`'all'` | `'position'` | `'size'`), `duration` (s), `easing`.
 *
 *   const { ref } = useLayoutAnimation();
 *   return <div ref={ref} style={{ height: open ? 200 : 80 }} />;
 *
 * The declarative `<Box layout>` prop wraps the same hook — `layout` (true /
 * `'position'` / `'size'`) animates position/size changes between commits
 * instead of snapping.
 */
const meta = {
  title: 'Motion/useLayoutAnimation',
  component: Box,
  tags: ['autodocs'],
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

const RnWebNote = (
  <Note>
    On the web (react-native-web) target FLIP runs on the JS thread via inline transform + CSS
    transition; true UI-thread FLIP (Reanimated layout animations) is verified on-device.
  </Note>
);

const COLORS = ['primary', 'success', 'danger', 'muted'] as const;

/**
 * Declarative FLIP reorder. Each item is a `<Box layout>`. Shuffling the list
 * order on a click animates every item from its old slot to its new one.
 */
function ReorderDemo() {
  const [order, setOrder] = useState([0, 1, 2, 3, 4, 5]);
  const shuffle = () =>
    setOrder((prev) => {
      const next = [...prev];
      for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j]!, next[i]!];
      }
      return next;
    });

  return (
    <VStack gap="$4">
      {RnWebNote}
      <Note>{'<Box layout>'} — items FLIP from old slot to new on shuffle.</Note>
      <button onClick={shuffle}>Shuffle</button>
      <HStack gap="$3" flexWrap="wrap" bg="$colors.surface.muted" p="$4" borderRadius="$md" w={360}>
        {order.map((id) => (
          <Box key={id} layout>
            <Tile tone={COLORS[id % COLORS.length]!} w={64} h={64}>
              {id}
            </Tile>
          </Box>
        ))}
      </HStack>
    </VStack>
  );
}

export const Reorder: Story = {
  name: 'FLIP reorder',
  parameters: {
    docs: {
      source: {
        code: `const [order, setOrder] = useState([0, 1, 2, 3, 4, 5]);
// shuffle order on click…
<HStack flexWrap="wrap">
  {order.map((id) => (
    <Box key={id} layout>
      <Tile>{id}</Tile>
    </Box>
  ))}
</HStack>`,
      },
    },
  },
  render: () => <ReorderDemo />,
};

/**
 * The hook form with `kind: 'size'` — toggling a panel's height animates the
 * size change (and the siblings below it reflow) instead of snapping.
 */
function ResizeDemo() {
  const { ref } = useLayoutAnimation<HTMLDivElement>({ kind: 'all', duration: 0.35 });
  const [expanded, setExpanded] = useState(false);

  return (
    <VStack gap="$4">
      {RnWebNote}
      <Note>useLayoutAnimation({'{ kind: "all" }'}) on a panel that grows/shrinks.</Note>
      <button onClick={() => setExpanded((e) => !e)}>{expanded ? 'Collapse' : 'Expand'}</button>
      <div ref={ref} style={{ width: expanded ? 320 : 160, overflow: 'hidden' }}>
        <Box
          bg="$colors.action.primary.bg"
          color="$colors.action.primary.fg"
          p="$5"
          borderRadius="$md"
        >
          <Text fontWeight="$semibold">{expanded ? 'expanded panel' : 'panel'}</Text>
        </Box>
      </div>
    </VStack>
  );
}

export const Resize: Story = {
  name: 'Hook form (resizing panel)',
  parameters: {
    docs: {
      source: {
        code: `const { ref } = useLayoutAnimation<HTMLDivElement>({ kind: 'all', duration: 0.35 });
const [expanded, setExpanded] = useState(false);
return (
  <div ref={ref} style={{ width: expanded ? 320 : 160 }}>
    <Box p="$5">panel</Box>
  </div>
);`,
      },
    },
  },
  render: () => <ResizeDemo />,
};
