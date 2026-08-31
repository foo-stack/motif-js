import type { Meta, StoryObj } from '@storybook/react';
import { Box, HStack, Text, VStack, useDrag, useTransform } from 'usemotif';
import { useState } from 'react';
import { Note, Tile } from '../../harness/demo.js';

/**
 * `useDrag(options)` is the pointer-driven drag gesture. It returns
 * `{ dragProps, x, y, isDragging }` - spread `dragProps` onto a draggable
 * element and bind the `x` / `y` motion values to the transform shorthand:
 *
 *   const { dragProps, x, y } = useDrag({ constraints: { left: -120, right: 120 } });
 *   return <Box {...dragProps} x={x} y={y}>drag me</Box>;
 *
 * The declarative `<Box drag>` prop wraps the same hook - `drag` /
 * `dragConstraints` / `dragElastic` / `dragMomentum` / `dragTransition` plus
 * the `onDragStart` / `onDrag` / `onDragEnd` lifecycle callbacks. `drag="x"`
 * or `drag="y"` locks to one axis. The hook's `x` / `y` compose with
 * `useTransform` to derive rotation, opacity, etc. from drag position.
 */
const meta = {
  title: 'Motion/useDrag',
  component: Box,
  tags: ['autodocs'],
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

const RnWebNote = (
  <Note>
    On the web (react-native-web) target gestures run on the JS thread; true UI-thread drag (Gesture
    Handler + Reanimated) is verified on-device.
  </Note>
);

function Pen({ children }: { children: React.ReactNode }) {
  return (
    <Box
      bg="$colors.surface.muted"
      borderRadius="$md"
      p="$5"
      h={200}
      display="flex"
      alignItems="center"
      justifyContent="center"
      style={{ touchAction: 'none', userSelect: 'none' }}
    >
      {children}
    </Box>
  );
}

/**
 * The declarative `<Box drag>` prop - free 2D drag, clamped to a box via
 * `dragConstraints`, with a little rubber-band `dragElastic` overshoot that
 * springs back on release.
 */
function DeclarativeDemo() {
  return (
    <VStack gap="$4">
      {RnWebNote}
      <Note>
        {'<Box drag dragConstraints={{...}} dragElastic={0.2}>'} - free 2D, clamped, elastic.
      </Note>
      <Pen>
        <Box
          drag
          dragConstraints={{ left: -120, right: 120, top: -60, bottom: 60 }}
          dragElastic={0.2}
          dragMomentum
        >
          <Tile>drag me</Tile>
        </Box>
      </Pen>
    </VStack>
  );
}

export const Declarative: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Box
  drag
  dragConstraints={{ left: -120, right: 120, top: -60, bottom: 60 }}
  dragElastic={0.2}
  dragMomentum
>
  <Tile>drag me</Tile>
</Box>`,
      },
    },
  },
  render: () => <DeclarativeDemo />,
};

/** Axis-locked drag. `drag="x"` pins the Y offset to its start; `drag="y"` the X. */
function AxisLockDemo() {
  return (
    <VStack gap="$4">
      {RnWebNote}
      <Note>
        {'drag="x"'} and {'drag="y"'} lock movement to a single axis.
      </Note>
      <HStack gap="$5">
        <VStack gap="$2">
          <Text fontSize="$sm" color="$colors.text.muted">
            drag="x"
          </Text>
          <Pen>
            <Box drag="x" dragConstraints={{ left: -120, right: 120 }}>
              <Tile tone="success">x only</Tile>
            </Box>
          </Pen>
        </VStack>
        <VStack gap="$2">
          <Text fontSize="$sm" color="$colors.text.muted">
            drag="y"
          </Text>
          <Pen>
            <Box drag="y" dragConstraints={{ top: -60, bottom: 60 }}>
              <Tile tone="danger">y only</Tile>
            </Box>
          </Pen>
        </VStack>
      </HStack>
    </VStack>
  );
}

export const AxisLock: Story = {
  name: 'Axis-locked',
  parameters: {
    docs: {
      source: {
        code: `<Box drag="x" dragConstraints={{ left: -120, right: 120 }}>x only</Box>
<Box drag="y" dragConstraints={{ top: -60, bottom: 60 }}>y only</Box>`,
      },
    },
  },
  render: () => <AxisLockDemo />,
};

/**
 * The hook form. `useDrag` returns `x` / `y` motion values; `useTransform`
 * derives a tilt from horizontal offset, and `onDragEnd` reports the
 * settled offset. Spread `dragProps` onto the draggable Box.
 */
function HookDemo() {
  const [last, setLast] = useState<{ x: number; y: number } | null>(null);
  const { dragProps, x, y, isDragging } = useDrag({
    constraints: { left: -140, right: 140, top: -60, bottom: 60 },
    dragElastic: 0.4,
    dragMomentum: true,
    onDragEnd: ({ offset }) => setLast({ x: Math.round(offset.x), y: Math.round(offset.y) }),
  });
  // Derive a card tilt + fade from the drag offset - zero React renders.
  const rotate = useTransform(x, [-140, 0, 140], [-18, 0, 18]);
  const opacity = useTransform(x, [-200, -120, 0, 120, 200], [0.4, 1, 1, 1, 0.4]);

  return (
    <VStack gap="$4">
      {RnWebNote}
      <Note>useDrag → x/y motion values; useTransform derives rotate + opacity.</Note>
      <Pen>
        <Box {...dragProps} x={x} y={y} rotate={rotate} opacity={opacity}>
          <Tile>{isDragging ? 'dragging' : 'grab me'}</Tile>
        </Box>
      </Pen>
      <Text fontSize="$sm" color="$colors.text.muted">
        last onDragEnd offset: {last ? `x=${last.x} y=${last.y}` : '—'}
      </Text>
    </VStack>
  );
}

export const HookForm: Story = {
  name: 'Hook form (useDrag + useTransform)',
  parameters: {
    docs: {
      source: {
        code: `const { dragProps, x, y } = useDrag({
  constraints: { left: -140, right: 140, top: -60, bottom: 60 },
  dragElastic: 0.4,
  dragMomentum: true,
  onDragEnd: ({ offset }) => console.log('settled at', offset),
});
const rotate = useTransform(x, [-140, 0, 140], [-18, 0, 18]);
const opacity = useTransform(x, [-200, -120, 0, 120, 200], [0.4, 1, 1, 1, 0.4]);
return <Box {...dragProps} x={x} y={y} rotate={rotate} opacity={opacity} />;`,
      },
    },
  },
  render: () => <HookDemo />,
};
