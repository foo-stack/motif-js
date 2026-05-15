import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';

const controls: readonly ControlSpec[] = [
  { kind: 'range', id: 'value', label: 'value', defaultValue: 65, min: 0, max: 100 },
  { kind: 'toggle', id: 'indeterminate', label: 'indeterminate', defaultValue: false },
];

function code(state: ControlState): string {
  const v = state.indeterminate ? 'null' : String(Number(state.value));
  return `import { Progress } from 'usemotif/headless';

<Progress aria-label="Upload" value={${v}} />`;
}

function preview(state: ControlState) {
  const indeterminate = Boolean(state.indeterminate);
  const pct = Number(state.value);
  return (
    <div style={{ width: 220 }}>
      <div
        style={{
          height: 8,
          borderRadius: 999,
          background: 'var(--colors-line-base)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: indeterminate ? '40%' : `${pct}%`,
            borderRadius: 999,
            background: '#15803D',
            marginLeft: indeterminate ? '30%' : 0,
          }}
        />
      </div>
    </div>
  );
}

export const progressDemo: PlaygroundDemo = {
  label: 'Progress',
  code,
  preview,
  controls,
};
