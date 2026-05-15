import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';

const controls: readonly ControlSpec[] = [
  {
    kind: 'select',
    id: 'state',
    label: 'state',
    defaultValue: 'checked',
    options: ['unchecked', 'checked', 'indeterminate'],
  },
];

function code(state: ControlState): string {
  const s = String(state.state);
  const extra = s === 'indeterminate' ? ' indeterminate' : '';
  return `import { Checkbox } from 'usemotif/headless';

<label>
  <Checkbox${extra} defaultChecked={${s === 'checked'}} />
  Subscribe to updates
</label>`;
}

function preview(state: ControlState) {
  const s = String(state.state);
  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: 'var(--font-families-sans)',
        fontSize: 14,
        color: 'var(--colors-fg-default)',
      }}
    >
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: 4,
          border: `1px solid ${s === 'unchecked' ? 'var(--colors-line-base)' : '#1D4ED8'}`,
          background: s === 'unchecked' ? 'transparent' : '#1D4ED8',
          color: '#FBF7F2',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
        }}
      >
        {s === 'checked' ? '✓' : s === 'indeterminate' ? '–' : ''}
      </span>
      Subscribe to updates
    </label>
  );
}

export const checkboxDemo: PlaygroundDemo = { label: 'Checkbox', code, preview, controls };
