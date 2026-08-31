import type { PlaygroundDemo } from './index.js';
import { panel } from './_surface.js';

function code(): string {
  return `import { Combobox } from 'usemotif/headless';

<Combobox.Root options={cities} onValueChange={setCity}>
  <Combobox.Input placeholder="Search cities..." />
  <Combobox.List renderOption={(o, { highlighted }) => <Row o={o} active={highlighted} />} />
</Combobox.Root>`;
}

function row(label: string, active = false) {
  return (
    <span
      style={{
        display: 'block',
        padding: '7px 10px',
        borderRadius: 5,
        fontFamily: 'var(--font-families-sans)',
        fontSize: 13,
        background: active ? 'var(--colors-surface-muted)' : 'transparent',
      }}
    >
      {label}
    </span>
  );
}

function preview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <input
        readOnly
        value="lon"
        aria-label="City"
        style={{
          width: 180,
          padding: '7px 12px',
          borderRadius: 7,
          border: '1px solid var(--colors-line-base)',
          fontFamily: 'var(--font-families-sans)',
          fontSize: 13,
        }}
      />
      <div style={panel({ display: 'flex', flexDirection: 'column', padding: 5, width: 180 })}>
        {row('London', true)}
        {row('Long Beach')}
      </div>
    </div>
  );
}

export const comboboxDemo: PlaygroundDemo = { label: 'Combobox', code, preview };
