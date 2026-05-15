import type { PlaygroundDemo } from './index.js';
import { panel } from './_surface.js';

function code(): string {
  return `import { Select } from 'usemotif/headless';

<Select.Root options={frameworks} placeholder="Pick a framework">
  <Select.Trigger><button>React</button></Select.Trigger>
  <Select.List renderOption={(o) => <Row option={o} />} />
</Select.Root>`;
}

function row(label: string, selected = false) {
  return (
    <span
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '7px 10px',
        borderRadius: 5,
        fontFamily: 'var(--font-families-sans)',
        fontSize: 13,
        background: selected ? 'var(--colors-surface-muted)' : 'transparent',
      }}
    >
      {label}
      {selected ? <span style={{ color: '#1D4ED8' }}>✓</span> : null}
    </span>
  );
}

function preview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <span
        style={{
          display: 'inline-flex',
          justifyContent: 'space-between',
          width: 170,
          padding: '7px 12px',
          borderRadius: 7,
          border: '1px solid var(--colors-line-base)',
          fontFamily: 'var(--font-families-sans)',
          fontSize: 13,
        }}
      >
        React <span style={{ fontSize: 9 }}>▾</span>
      </span>
      <div style={panel({ display: 'flex', flexDirection: 'column', padding: 5, width: 170 })}>
        {row('React', true)}
        {row('Vue')}
        {row('Svelte')}
      </div>
    </div>
  );
}

export const selectDemo: PlaygroundDemo = { label: 'Select', code, preview };
