import type { Meta, StoryObj } from '@storybook/react';
import { Box, Text, VStack, useScroll, useTransform } from 'usemotif';
import { useRef } from 'react';
import { Note, Tile } from '../../harness/demo.js';

/**
 * `useScroll(options?)` tracks scroll position as motion values that bypass
 * React renders. It returns `{ scrollX, scrollY, scrollXProgress,
 * scrollYProgress }` — the `*Progress` pair is a `0..1` ratio you feed to
 * `useTransform` to drive a progress bar, parallax, fade, etc.
 *
 * Three shapes:
 *   useScroll()                      — window scroll
 *   useScroll({ container })         — a specific scroll container's progress
 *   useScroll({ target, offset })    — when a target element crosses the
 *                                      viewport, between two `offset` anchors
 *
 * Default offset is `['start end', 'end start']`. Listeners coalesce via rAF.
 */
const meta = {
  title: 'Motion/useScroll',
  component: Box,
  tags: ['autodocs'],
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

const RnWebNote = (
  <Note>
    On the web (react-native-web) target scroll tracking runs on the JS thread;
    true UI-thread scroll-linked motion (Reanimated) is verified on-device.
  </Note>
);

/**
 * Container form. A scrollable Box's `scrollYProgress` (0..1 over the
 * container's max scroll) drives a top progress bar's width and a hue.
 */
function ContainerDemo() {
  const container = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ container });
  // `width` is a MotionValue-widened prop; the unit-matched output range
  // (`'0%'`..`'100%'`) interpolates straight into the `width` slot.
  const width = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <VStack gap="$4">
      {RnWebNote}
      <Note>useScroll({'{ container }'}) → scrollYProgress drives a progress bar.</Note>
      <Box w={360} borderRadius="$md" overflow="hidden" bg="$colors.surface.muted">
        <Box h={6} width={width} bg="$colors.action.primary.bg" />
        <Box
          ref={container}
          h={220}
          p="$4"
          style={{ overflowY: 'auto' }}
        >
          <VStack gap="$3">
            {Array.from({ length: 14 }, (_, i) => (
              <Tile key={i} tone={i % 2 ? 'muted' : 'primary'} py="$3">
                row {i + 1}
              </Tile>
            ))}
          </VStack>
        </Box>
      </Box>
    </VStack>
  );
}

export const Container: Story = {
  name: 'Container progress',
  parameters: {
    docs: {
      source: {
        code: `const container = useRef<HTMLElement | null>(null);
const { scrollYProgress } = useScroll({ container });
const width = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
return (
  <Box overflow="hidden">
    <Box h={6} width={width} bg="$colors.action.primary.bg" />
    <Box ref={container} style={{ overflowY: 'auto' }}>{rows}</Box>
  </Box>
);`,
      },
    },
  },
  render: () => <ContainerDemo />,
};

/**
 * Target + offset form. As the target card crosses the scroll container,
 * `scrollYProgress` advances 0→1 between the two `offset` anchors
 * (`['start end', 'end start']`) — here driving the card's opacity and lift.
 */
function TargetDemo() {
  const container = useRef<HTMLElement | null>(null);
  const target = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    container,
    target,
    offset: ['start end', 'end start'],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.15, 1, 0.15]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, -40]);

  return (
    <VStack gap="$4">
      {RnWebNote}
      <Note>useScroll({'{ target, offset }'}) → progress as the target crosses the viewport.</Note>
      <Box
        ref={container}
        w={360}
        h={240}
        p="$4"
        borderRadius="$md"
        bg="$colors.surface.muted"
        style={{ overflowY: 'auto' }}
      >
        <Box h={180} />
        <Box ref={target} opacity={opacity} y={y}>
          <Tile tone="success" py="$5">
            scroll-revealed target
          </Tile>
        </Box>
        <Box h={180} />
      </Box>
      <Text fontSize="$sm" color="$colors.text.muted">
        Scroll the box — the target fades + lifts as it crosses center.
      </Text>
    </VStack>
  );
}

export const Target: Story = {
  name: 'Target + offset',
  parameters: {
    docs: {
      source: {
        code: `const target = useRef<HTMLElement | null>(null);
const { scrollYProgress } = useScroll({
  target,
  offset: ['start end', 'end start'],
});
const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.15, 1, 0.15]);
const y = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, -40]);
return <Box ref={target} opacity={opacity} y={y}>fades in on entry</Box>;`,
      },
    },
  },
  render: () => <TargetDemo />,
};
