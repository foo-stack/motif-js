import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';

const controls: readonly ControlSpec[] = [
  { kind: 'range', id: 'value', label: 'value', defaultValue: 60, min: 0, max: 100 },
];

function code(state: ControlState): string {
  return `import { Slider } from 'usemotif/headless';

<Slider
  aria-label="Volume"
  value={${Number(state.value)}}
  onValueChange={setVolume}
/>`;
}

function preview(state: ControlState) {
  const pct = Number(state.value);
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
            left: 0,
            height: '100%',
            width: `${pct}%`,
            borderRadius: 999,
            background: '#1D4ED8',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: `${pct}%`,
            transform: 'translate(-50%, -50%)',
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#FBF7F2',
            border: '2px solid #1D4ED8',
          }}
        />
      </div>
    </div>
  );
}

export const sliderDemo: PlaygroundDemo = { label: 'Slider', code, preview, controls };
