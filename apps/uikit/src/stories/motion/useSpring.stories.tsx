import type { Meta, StoryObj } from '@storybook/react';
import { Box, HStack, Text, VStack, useSpring } from 'usemotif';
import { useEffect, useRef } from 'react';
import { Note, Tile } from '../../harness/demo.js';

/**
 * `useSpring(initial, config?)` returns a MotionValue whose `.set(target)`
 * springs from the current value toward `target` over the spring's natural
 * duration instead of snapping. Config is a literal `SpringConfig`
 * (`stiffness` / `damping` / `mass` / `restSpeed` / `restDistance` /
 * `velocity`) or a theme animation-token name (`'bouncy'` /
 * `'$animations.bouncy'`). Defaults: stiffness 100, damping 10, mass 1.
 * Re-targeting mid-flight redirects smoothly without resetting velocity.
 *
 *   const x = useSpring(0, { stiffness: 200, damping: 18 });
 *   x.set(100); // springs toward 100
 *   <Box x={x} />
 */

const RN_NOTE =
  'Heads up: the spring runs a JS-thread requestAnimationFrame loop under react-native-web here; true UI-thread performance (Reanimated / Gesture Handler) is verified on-device.';

interface SpringArgs {
  stiffness: number;
  damping: number;
  mass: number;
}

/**
 * Click anywhere in the track to set a new target — the tile springs there.
 * The stiffness / damping / mass controls feed the same config the integrator
 * reads each frame, so tweaking them mid-flight changes the feel live.
 */
function ClickToMove({ stiffness, damping, mass }: SpringArgs) {
  const TRACK = 320;
  const SIZE = 56;
  const x = useSpring(0, { stiffness, damping, mass });
  const trackRef = useRef<HTMLDivElement | null>(null);

  const moveTo = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const target = Math.max(0, Math.min(TRACK - SIZE, clientX - rect.left - SIZE / 2));
    x.set(target);
  };

  return (
    <VStack gap="$4">
      <Note>{RN_NOTE}</Note>
      <Note>Click anywhere in the track — the tile springs to that point.</Note>
      <div
        ref={trackRef}
        onClick={(e) => moveTo(e.clientX)}
        style={{
          width: TRACK,
          height: 80,
          borderRadius: 12,
          background: 'var(--colors-surface-muted, #f3f4f6)',
          position: 'relative',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 12,
        }}
      >
        <Box x={x}>
          <Tile tone="success">spring</Tile>
        </Box>
      </div>
      <Text fontSize="$sm" color="$colors.text.muted">
        stiffness={stiffness} · damping={damping} · mass={mass}
      </Text>
    </VStack>
  );
}

// Meta is typed against `ClickToMove` (not `Box`) so the spring-config
// argTypes — stiffness / damping / mass — are real component props rather
// than rejected style props.
const meta = {
  title: 'Motion/useSpring',
  component: ClickToMove,
  tags: ['autodocs'],
  argTypes: {
    // Live controls feeding the same `SpringConfig` the rAF integrator reads.
    stiffness: { control: { type: 'range', min: 10, max: 500, step: 10 } },
    damping: { control: { type: 'range', min: 1, max: 60, step: 1 } },
    mass: { control: { type: 'range', min: 0.2, max: 5, step: 0.1 } },
  },
  args: { stiffness: 200, damping: 18, mass: 1 },
} satisfies Meta<typeof ClickToMove>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ClickToMoveStory: Story = {
  name: 'Click to move',
  parameters: {
    docs: {
      source: {
        code: `const x = useSpring(0, { stiffness: 200, damping: 18, mass: 1 });
<div onClick={(e) => x.set(targetFromClick(e))}>
  <Box x={x}><Tile>spring</Tile></Box>
</div>`,
      },
    },
  },
};

/**
 * Same target, four damping settings side by side — from bouncy (low damping,
 * lots of overshoot) to critically damped (no overshoot). Click "Toggle" to
 * fling every tile between its two ends so the feels compare directly.
 */
function DampingComparison() {
  const TRACK = 200;
  const SIZE = 44;
  const FAR = TRACK - SIZE;
  const dampings = [4, 8, 14, 26] as const;
  const springs = [
    useSpring(0, { stiffness: 200, damping: dampings[0] }),
    useSpring(0, { stiffness: 200, damping: dampings[1] }),
    useSpring(0, { stiffness: 200, damping: dampings[2] }),
    useSpring(0, { stiffness: 200, damping: dampings[3] }),
  ];
  const atFar = useRef(false);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      if (now - last > 1100) {
        last = now;
        atFar.current = !atFar.current;
        const target = atFar.current ? FAR : 0;
        for (const s of springs) s.set(target);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // springs are stable refs from useSpring; the loop reads them by closure.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [FAR]);

  return (
    <VStack gap="$4">
      <Note>{RN_NOTE}</Note>
      <Note>Same stiffness (200), four damping values — they auto-fling every ~1.1s.</Note>
      <HStack gap="$4" alignItems="flex-start">
        {springs.map((s, i) => (
          <VStack key={dampings[i]} gap="$2">
            <Text fontSize="$sm" color="$colors.text.muted">
              damping {dampings[i]}
            </Text>
            <div
              style={{
                width: TRACK,
                height: 64,
                borderRadius: 12,
                background: 'var(--colors-surface-muted, #f3f4f6)',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 10,
              }}
            >
              <Box x={s}>
                <Tile>{dampings[i]}</Tile>
              </Box>
            </div>
          </VStack>
        ))}
      </HStack>
    </VStack>
  );
}

export const Damping: Story = {
  name: 'Damping comparison',
  parameters: {
    docs: {
      source: {
        code: `const bouncy = useSpring(0, { stiffness: 200, damping: 4 });
const crisp  = useSpring(0, { stiffness: 200, damping: 26 });
// .set(target) on each springs them with different overshoot.`,
      },
    },
  },
  render: () => <DampingComparison />,
};
