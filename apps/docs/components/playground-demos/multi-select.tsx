import type { PlaygroundDemo } from './index.js';
import { panel } from './_surface.js';

function code(): string {
  return `import { MultiSelect } from 'usemotif/headless';

<MultiSelect.Root options={langs} value={value} onValueChange={setValue}>
  <MultiSelect.Chips renderChip={(o, { remove }) => <Chip o={o} onRemove={remove} />} />
  <MultiSelect.Input placeholder="Add a language..." />
  <MultiSelect.List />
</MultiSelect.Root>`;
}

function chip(label: string) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '3px 8px',
        borderRadius: 999,
        background: 'var(--colors-surface-muted)',
        fontFamily: 'var(--font-families-sans)',
        fontSize: 12,
      }}
    >
      {label}
      <span style={{ color: 'var(--colors-fg-faint)' }}>×</span>
    </span>
  );
}

function preview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <span
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4,
          width: 200,
          padding: 6,
          borderRadius: 7,
          border: '1px solid var(--colors-line-base)',
        }}
      >
        {chip('TypeScript')}
        {chip('Rust')}
        <span
          style={{
            fontFamily: 'var(--font-families-sans)',
            fontSize: 12,
            color: 'var(--colors-fg-faint)',
            padding: '3px 4px',
          }}
        >
          Add...
        </span>
      </span>
      <div style={panel({ display: 'flex', flexDirection: 'column', padding: 5, width: 200 })}>
        <span
          style={{ padding: '6px 10px', fontFamily: 'var(--font-families-sans)', fontSize: 13 }}
        >
          Go
        </span>
        <span
          style={{ padding: '6px 10px', fontFamily: 'var(--font-families-sans)', fontSize: 13 }}
        >
          Python
        </span>
      </div>
    </div>
  );
}

export const multiSelectDemo: PlaygroundDemo = { label: 'MultiSelect', code, preview };
