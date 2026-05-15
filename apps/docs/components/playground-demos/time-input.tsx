import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';

const controls: readonly ControlSpec[] = [
  {
    kind: 'select',
    id: 'precision',
    label: 'precision',
    defaultValue: 'minute',
    options: ['minute', 'second'],
  },
];

function code(state: ControlState): string {
  return `import { TimeInput } from 'usemotif/headless';

<TimeInput precision="${String(state.precision)}" defaultValue="09:30" />`;
}

function preview(state: ControlState) {
  return (
    <input
      type="time"
      step={state.precision === 'second' ? 1 : undefined}
      defaultValue={state.precision === 'second' ? '09:30:00' : '09:30'}
      aria-label="Time"
      style={{
        padding: '8px 12px',
        borderRadius: 7,
        border: '1px solid var(--colors-line-base)',
        fontFamily: 'var(--font-families-sans)',
        fontSize: 14,
        color: 'var(--colors-fg-default)',
      }}
    />
  );
}

export const timeInputDemo: PlaygroundDemo = {
  label: 'TimeInput',
  code,
  preview,
  controls,
};
