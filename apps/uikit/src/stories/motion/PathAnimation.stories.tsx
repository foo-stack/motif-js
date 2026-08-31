import type { Meta, StoryObj } from '@storybook/react';
import { Path, Svg, Text, VStack, useMotionValue } from 'usemotif';
import { useEffect, useRef, useState } from 'react';
import { Note } from '../../harness/demo.js';

/**
 * The animated side of `<Path pathLength={p}>`. `pathLength` is a `0..1`
 * stroke-drawing progress: `0` hides the stroke, `1` draws it fully. Pass a
 * `MotionValue<number>` (or a literal number) - motif emits `pathLength="1"`,
 * `stroke-dasharray="1 1"`, and a `stroke-dashoffset` of `1 - progress`,
 * walking the dash from hidden to drawn.
 *
 *   const progress = useMotionValue(0);
 *   useEffect(() => { progress.set(1); }, []);
 *   <Svg viewBox="0 0 24 24"><Path d="…" pathLength={progress} /></Svg>
 *
 * The STATIC playground (holding `pathLength` at a fixed fraction) lives at
 * `Media/Path` - `apps/uikit/src/stories/media/Path.stories.tsx`. This story
 * exercises the animated draw-on.
 */
const meta = {
  title: 'Motion/Path',
  component: Path,
  tags: ['autodocs'],
} satisfies Meta<typeof Path>;

export default meta;
type Story = StoryObj<typeof meta>;

const RnWebNote = (
  <Note>
    On the web (react-native-web) target the stroke-draw runs on the JS thread (the leaf re-renders
    on each motion-value change); true UI-thread path draw (Reanimated) is verified on-device.
  </Note>
);

const CHECK = 'M4 12.5l5 5L20 6';
const ARROW = 'M5 12h14M13 6l6 6-6 6';

/**
 * A motion value ramps 0→1 over time, drawing the stroke on. "Replay"
 * resets the value to 0 and re-runs the ramp.
 */
function DrawOnDemo() {
  const progress = useMotionValue(0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    progress.set(0);
    let raf = 0;
    const start = performance.now();
    const durationMs = 900;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      progress.set(t);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, progress]);

  return (
    <VStack gap="$4">
      {RnWebNote}
      <Note>pathLength driven by a MotionValue ramping 0→1 - the stroke draws on.</Note>
      <button onClick={() => setRun((r) => r + 1)}>Replay</button>
      <Svg size={140} viewBox="0 0 24 24">
        <Path
          d={CHECK}
          pathLength={progress}
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </VStack>
  );
}

export const DrawOn: Story = {
  name: 'Draw-on (animated)',
  parameters: {
    docs: {
      source: {
        code: `const progress = useMotionValue(0);
useEffect(() => {
  let raf = 0;
  const start = performance.now();
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / 900);
    progress.set(t);
    if (t < 1) raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}, [progress]);
<Svg viewBox="0 0 24 24">
  <Path d="M4 12.5l5 5L20 6" pathLength={progress} fill="none" stroke="currentColor" strokeWidth={2} />
</Svg>`,
      },
    },
  },
  render: () => <DrawOnDemo />,
};

/**
 * Live control. A slider writes straight into the `pathLength` motion value -
 * scrub it to draw the stroke to any fraction by hand.
 */
function ScrubDemo() {
  const progress = useMotionValue(0.5);
  // Mirror the slider's value for the readout without re-rendering the Path
  // path math - the Path subscribes to the motion value directly.
  const labelRef = useRef<HTMLSpanElement | null>(null);

  return (
    <VStack gap="$4">
      {RnWebNote}
      <Note>Scrub the slider - it writes into the pathLength motion value directly.</Note>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        defaultValue={0.5}
        onChange={(e) => {
          const v = Number(e.currentTarget.value);
          progress.set(v);
          if (labelRef.current) labelRef.current.textContent = v.toFixed(2);
        }}
        style={{ width: 240 }}
      />
      <Svg size={140} viewBox="0 0 24 24">
        <Path
          d={ARROW}
          pathLength={progress}
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
      <Text fontSize="$sm" color="$colors.text.muted">
        pathLength: <span ref={labelRef}>0.50</span>
      </Text>
    </VStack>
  );
}

export const Scrub: Story = {
  name: 'Scrub (slider-driven)',
  parameters: {
    docs: {
      source: {
        code: `const progress = useMotionValue(0.5);
<input type="range" min={0} max={1} step={0.01}
  onChange={(e) => progress.set(Number(e.currentTarget.value))} />
<Svg viewBox="0 0 24 24">
  <Path d="M5 12h14M13 6l6 6-6 6" pathLength={progress} fill="none" stroke="currentColor" strokeWidth={2} />
</Svg>`,
      },
    },
  },
  render: () => <ScrubDemo />,
};
