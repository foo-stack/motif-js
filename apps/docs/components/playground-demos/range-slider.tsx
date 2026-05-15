import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';

const controls: readonly ControlSpec[] = [
  { kind: 'range', id: 'low', label: 'min', defaultValue: 25, min: 0, max: 100 },
  { kind: 'range', id: 'high', label: 'max', defaultValue: 75, min: 0, max: 100 },
];

function code(state: ControlState): string {
  const lo = Math.min(Number(state.low), Number(state.high));
  const hi = Math.max(Number(state.low), Number(state.high));
  return `import { RangeSlider } from 'usemotif/headless';

<RangeSlider
  aria-label="Price range"
  value={[${lo}, ${hi}]}
  onValueChange={setRange}
/>`;
}

function preview(state: ControlState) {
  const lo = Math.min(Number(state.low), Number(state.high));
  const hi = Math.max(Number(state.low), Number(state.high));
  return (
    <div style={{ width: 220 }}>
      <div
        style={{
          position: 'relative',
          height: 6,
          borderRadius: 999,
          background: 'var(--colors-line-base)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: `${lo}%`,
            width: `${hi - lo}%`,
            height: '100%',
            borderRadius: 999,
            background: '#1D4ED8',
          }}
        />
        {[lo, hi].map((p, i) => (
          <div
            // eslint-disable-next-line react/no-array-index-key -- positional
            key={i}
            style={{
              position: 'absolute',
              top: '50%',
              left: `${p}%`,
              transform: 'translate(-50%, -50%)',
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: '#FBF7F2',
              border: '2px solid #1D4ED8',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export const rangeSliderDemo: PlaygroundDemo = {
  label: 'RangeSlider',
  code,
  preview,
  controls,
};
