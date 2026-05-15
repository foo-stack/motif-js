import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';

const controls: readonly ControlSpec[] = [
  { kind: 'toggle', id: 'open', label: 'open', defaultValue: true },
];

function code(state: ControlState): string {
  return `import { Collapsible } from 'usemotif/headless';

<Collapsible.Root defaultOpen={${Boolean(state.open)}}>
  <Collapsible.Trigger>
    <button>Details</button>
  </Collapsible.Trigger>
  <Collapsible.Content>
    The expandable region.
  </Collapsible.Content>
</Collapsible.Root>`;
}

function preview(state: ControlState) {
  const open = Boolean(state.open);
  return (
    <div style={{ width: 220, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '8px 12px',
          borderRadius: 6,
          border: '1px solid var(--colors-line-base)',
          fontFamily: 'var(--font-families-sans)',
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        Details
        <span style={{ fontSize: 10 }}>{open ? '▴' : '▾'}</span>
      </span>
      {open ? (
        <span
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            background: 'var(--colors-surface-muted)',
            fontFamily: 'var(--font-families-sans)',
            fontSize: 12,
            color: 'var(--colors-fg-muted)',
          }}
        >
          The expandable region.
        </span>
      ) : null}
    </div>
  );
}

export const collapsibleDemo: PlaygroundDemo = {
  label: 'Collapsible',
  code,
  preview,
  controls,
};
