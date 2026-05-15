import type { PlaygroundDemo } from './index.js';
import { panel } from './_surface.js';

function code(): string {
  return `import { Search } from 'usemotif/headless';

<Search.Root options={results} onValueChange={open}>
  <Search.Input placeholder="Search the docs…" />
  <Search.List renderOption={(o, { highlighted }) => <Hit o={o} active={highlighted} />} />
</Search.Root>`;
}

function hit(label: string, active = false) {
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
    <div
      role="search"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
    >
      <input
        readOnly
        value="token"
        aria-label="Search"
        style={{
          width: 200,
          padding: '7px 12px',
          borderRadius: 7,
          border: '1px solid var(--colors-line-base)',
          fontFamily: 'var(--font-families-sans)',
          fontSize: 13,
        }}
      />
      <div style={panel({ display: 'flex', flexDirection: 'column', padding: 5, width: 200 })}>
        {hit('Tokens — concept', true)}
        {hit('Tokens — reference')}
      </div>
    </div>
  );
}

export const searchDemo: PlaygroundDemo = { label: 'Search', code, preview };
