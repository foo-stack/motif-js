import type { Meta, StoryObj } from '@storybook/react';
import { Box, Text, VStack, useMotionValue, useTransform } from 'usemotif';
import { useEffect, useRef } from 'react';
import { Note, Tile } from '../../harness/demo.js';

/**
 * `useTransform` derives one motion value from another. Two forms:
 *
 *   // range form — piecewise-linear interpolation across breakpoints
 *   useTransform(source, [0, 200], [1, 0])
 *
 *   // function form — arbitrary pure mapping, runs on every source change
 *   useTransform(source, (v) => v * 0.5)
 *
 * Numeric output ranges lerp; colour strings interpolate in the configured
 * colour space; `$…` token strings resolve against the active theme at hook
 * setup; unit-matched length strings (`'8px' → '64px'`) strip-lerp-reappend.
 * A single source fans out to several derived props.
 */
const meta = {
  title: 'Motion/useTransform',
  component: Box,
  tags: ['autodocs'],
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

const RN_NOTE =
  'Heads up: motion values run on the JS thread under react-native-web here; true UI-thread performance (Reanimated / Gesture Handler) is verified on-device.';

/**
 * Range form. One `x` source (driven by the slider, 0→240) fans out into four
 * derived motion values: `opacity` (1→0), `rotate` (0→180deg), `scale`
 * (1→1.6), and a unit-matched `borderRadius` ('4px'→'64px'). All four update
 * from a single `.set()` per input event.
 */
function RangeFanOut() {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [0, 240], [1, 0.2]);
  const rotate = useTransform(x, [0, 240], [0, 180]);
  const scale = useTransform(x, [0, 240], [1, 1.6]);
  const borderRadius = useTransform(x, [0, 240], ['4px', '64px']);

  return (
    <VStack gap="$4">
      <Note>{RN_NOTE}</Note>
      <Note>One `x` source fans out to opacity, rotate, scale, and borderRadius.</Note>
      <input
        type="range"
        min={0}
        max={240}
        defaultValue={0}
        onChange={(e) => x.set(Number(e.currentTarget.value))}
        style={{ width: 320 }}
      />
      <Box bg="$colors.surface.muted" p="$6" borderRadius="$md" w={320} h={160}
        display="flex" alignItems="center" justifyContent="center">
        <Box x={x} opacity={opacity} rotate={rotate} scale={scale} borderRadius={borderRadius}>
          <Tile>fan</Tile>
        </Box>
      </Box>
    </VStack>
  );
}

export const RangeForm: Story = {
  name: 'Range form (fan-out)',
  parameters: {
    docs: {
      source: {
        code: `const x = useMotionValue(0);
const opacity = useTransform(x, [0, 240], [1, 0.2]);
const rotate  = useTransform(x, [0, 240], [0, 180]);
const scale   = useTransform(x, [0, 240], [1, 1.6]);
const radius  = useTransform(x, [0, 240], ['4px', '64px']);
<Box x={x} opacity={opacity} rotate={rotate} scale={scale} borderRadius={radius} />`,
      },
    },
  },
  render: () => <RangeFanOut />,
};

/**
 * Function form. The source is an angle in degrees; a pure transformer maps it
 * to a scale via a cosine, so the tile pulses as the angle sweeps. Function
 * transformers run on every source change and should be pure.
 */
function FunctionForm() {
  const deg = useMotionValue(0);
  // Pure mapping: 1 + a cosine ripple. Non-linear, so the range form can't
  // express it — this is exactly what the function form is for.
  const scale = useTransform(deg, (d) => 1 + 0.4 * (0.5 + 0.5 * Math.cos((d * Math.PI) / 180)));
  const rotate = useTransform(deg, (d) => d);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      deg.set(((now - start) / 12) % 360);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [deg]);

  return (
    <VStack gap="$4">
      <Note>{RN_NOTE}</Note>
      <Note>`useTransform(deg, (d) =&gt; ...)` — a pure cosine drives a non-linear pulse.</Note>
      <Box bg="$colors.surface.muted" p="$6" borderRadius="$md" w={320} h={160}
        display="flex" alignItems="center" justifyContent="center">
        <Box scale={scale} rotate={rotate}>
          <Tile tone="success">fn</Tile>
        </Box>
      </Box>
    </VStack>
  );
}

export const FunctionFormStory: Story = {
  name: 'Function form',
  parameters: {
    docs: {
      source: {
        code: `const deg = useMotionValue(0);
const scale = useTransform(deg, (d) => 1 + 0.4 * (0.5 + 0.5 * Math.cos((d * Math.PI) / 180)));
const rotate = useTransform(deg, (d) => d);
<Box scale={scale} rotate={rotate} />`,
      },
    },
  },
  render: () => <FunctionForm />,
};

/**
 * Colour output range. `useTransform` interpolates a colour-string motion value
 * from token endpoints resolved against the active theme — here action.primary
 * → action.danger in OKLab. `bg` does not accept a motion value in v1, so we
 * subscribe via `.on('change')` and write the colour to a plain element's
 * style — the canonical escape hatch for non-bindable props.
 */
function ColorInterp() {
  const t = useMotionValue(0);
  const color = useTransform(
    t,
    [0, 1],
    ['$colors.action.primary.bg', '$colors.action.danger.bg'],
    { colorSpace: 'oklab' },
  );
  const swatchRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const apply = (c: string | number) => {
      if (swatchRef.current) swatchRef.current.style.backgroundColor = String(c);
    };
    apply(color.get());
    return color.on('change', apply);
  }, [color]);

  return (
    <VStack gap="$4">
      <Note>{RN_NOTE}</Note>
      <Note>
        Token colour range, interpolated in OKLab. `bg` is not motion-value-bindable
        in v1, so the swatch subscribes via `.on('change')` and writes its own style.
      </Note>
      <input
        type="range"
        min={0}
        max={100}
        defaultValue={0}
        onChange={(e) => t.set(Number(e.currentTarget.value) / 100)}
        style={{ width: 320 }}
      />
      <div
        ref={swatchRef}
        style={{ width: 320, height: 96, borderRadius: 12 }}
      />
      <Text fontSize="$sm" color="$colors.text.muted">
        action.primary.bg → action.danger.bg
      </Text>
    </VStack>
  );
}

export const ColorRange: Story = {
  name: 'Colour interpolation',
  parameters: {
    docs: {
      source: {
        code: `const t = useMotionValue(0);
const color = useTransform(
  t,
  [0, 1],
  ['$colors.action.primary.bg', '$colors.action.danger.bg'],
  { colorSpace: 'oklab' },
);
// bg isn't motion-value-bindable in v1 — subscribe and write the style:
useEffect(() => color.on('change', (c) => { el.style.backgroundColor = String(c); }), [color]);`,
      },
    },
  },
  render: () => <ColorInterp />,
};
