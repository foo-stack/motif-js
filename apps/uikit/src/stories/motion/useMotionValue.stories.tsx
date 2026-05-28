import type { Meta, StoryObj } from '@storybook/react';
import { Box, HStack, Text, VStack, useMotionValue } from 'usemotif';
import { useEffect, useRef, useState } from 'react';
import { Note, Tile } from '../../harness/demo.js';

/**
 * `useMotionValue(initial)` allocates a stable imperative value channel scoped
 * to the component's lifetime. Writing via `.set()` notifies subscribers
 * synchronously and does NOT trigger a React re-render — `Box` subscribes to
 * the value and commits it straight to the element. Bind one to a
 * transform-shorthand (`x`, `rotate`, `scale`) or to `opacity`.
 *
 *   const x = useMotionValue(0);
 *   return <Box x={x} />; // drive with x.set(...)
 */
const meta = {
  title: 'Motion/useMotionValue',
  component: Box,
  tags: ['autodocs'],
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A range slider drives `x.set(value)` on every input event. The handle moves
 * with zero React renders — the component below renders once. Open React
 * DevTools' "highlight updates" and drag the slider: nothing flashes.
 */
function SliderDemo() {
  const x = useMotionValue(0);
  // Pure display of how many times THIS component rendered — proves the
  // motion-value write path bypasses React. It stays at 1 while you drag.
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <VStack gap="$4">
      <Note>
        Heads up: motion values run on the JS thread under react-native-web here;
        true UI-thread performance (Reanimated / Gesture Handler) is verified
        on-device.
      </Note>
      <Note>Drag the slider — `x.set()` moves the tile with no React re-render.</Note>
      <input
        type="range"
        min={0}
        max={240}
        defaultValue={0}
        onChange={(e) => x.set(Number(e.currentTarget.value))}
        style={{ width: 320 }}
      />
      <Box bg="$colors.surface.muted" p="$3" borderRadius="$md" w={320} overflow="hidden">
        <Box x={x}>
          <Tile>x</Tile>
        </Box>
      </Box>
      <Text fontSize="$sm" color="$colors.text.muted">
        SliderDemo render count: {renderCount.current} (stays at 1 while dragging)
      </Text>
    </VStack>
  );
}

export const Slider: Story = {
  parameters: {
    docs: {
      source: {
        code: `const x = useMotionValue(0);
<input type="range" onChange={(e) => x.set(Number(e.currentTarget.value))} />
<Box x={x}><Tile>x</Tile></Box>`,
      },
    },
  },
  render: () => <SliderDemo />,
};

/**
 * A `requestAnimationFrame` loop writes a sine wave into two motion values —
 * one bound to `y`, one to `rotate`. The loop runs outside React entirely;
 * `.set()` per frame commits directly to the element.
 */
function RafDemo() {
  const y = useMotionValue(0);
  const rotate = useMotionValue(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = (now - start) / 1000;
      y.set(Math.sin(t * 2) * 40);
      rotate.set(Math.sin(t * 2) * 30);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, y, rotate]);

  return (
    <VStack gap="$4">
      <Note>
        Heads up: motion values run on the JS thread under react-native-web here;
        true UI-thread performance (Reanimated / Gesture Handler) is verified
        on-device.
      </Note>
      <Note>A rAF loop writes a sine wave into `y` and `rotate` every frame.</Note>
      <HStack gap="$4" alignItems="center">
        <Box bg="$colors.surface.muted" p="$5" borderRadius="$md" h={140} w={140}
          display="flex" alignItems="center" justifyContent="center">
          <Box y={y} rotate={rotate}>
            <Tile tone="success">rAF</Tile>
          </Box>
        </Box>
        <button onClick={() => setRunning((r) => !r)}>{running ? 'Pause' : 'Play'}</button>
      </HStack>
    </VStack>
  );
}

export const RafLoop: Story = {
  name: 'rAF loop',
  parameters: {
    docs: {
      source: {
        code: `const y = useMotionValue(0);
useEffect(() => {
  let raf = 0;
  const tick = (now: number) => {
    y.set(Math.sin(now / 500) * 40);
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}, [y]);
<Box y={y} />`,
      },
    },
  },
  render: () => <RafDemo />,
};
