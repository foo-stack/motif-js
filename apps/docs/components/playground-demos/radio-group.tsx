import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';

const controls: readonly ControlSpec[] = [
  {
    kind: 'select',
    id: 'value',
    label: 'value',
    defaultValue: 'standard',
    options: ['standard', 'express', 'overnight'],
  },
];

const OPTIONS = [
  { value: 'standard', label: 'Standard - 5 days' },
  { value: 'express', label: 'Express - 2 days' },
  { value: 'overnight', label: 'Overnight' },
];

function code(state: ControlState): string {
  return `import { RadioGroup, Radio } from 'usemotif/headless';

<RadioGroup aria-label="Shipping" value="${String(state.value)}">
  <label><Radio value="standard" /> Standard - 5 days</label>
  <label><Radio value="express" /> Express - 2 days</label>
  <label><Radio value="overnight" /> Overnight</label>
</RadioGroup>`;
}

function preview(state: ControlState) {
  const selected = String(state.value);
  return (
    <div
      role="radiogroup"
      aria-label="Shipping"
      style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      {OPTIONS.map((o) => (
        <span
          key={o.value}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: 'var(--font-families-sans)',
            fontSize: 14,
          }}
        >
          <span
            style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              border: `1px solid ${o.value === selected ? '#1D4ED8' : 'var(--colors-line-base)'}`,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {o.value === selected ? (
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1D4ED8' }} />
            ) : null}
          </span>
          {o.label}
        </span>
      ))}
    </div>
  );
}

export const radioGroupDemo: PlaygroundDemo = {
  label: 'RadioGroup',
  code,
  preview,
  controls,
};
