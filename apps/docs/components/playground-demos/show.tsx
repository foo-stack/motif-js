import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';

const controls: readonly ControlSpec[] = [
  {
    kind: 'range',
    id: 'width',
    label: 'viewport',
    defaultValue: 900,
    min: 400,
    max: 1400,
    step: 100,
  },
];

function code(state: ControlState): string {
  return `import { Show } from 'usemotif';

<Show above="md">
  <Sidebar />
</Show>
<!-- viewport: ${Number(state.width)}px -->`;
}

function preview(state: ControlState) {
  const visible = Number(state.width) >= 768;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
      {visible ? (
        <div
          style={{
            width: 160,
            padding: '14px 12px',
            borderRadius: 8,
            background: '#1D4ED8',
            color: '#FBF7F2',
            fontFamily: 'var(--font-families-sans)',
            fontSize: 13,
            textAlign: 'center',
          }}
        >
          Sidebar
        </div>
      ) : (
        <div
          style={{
            width: 160,
            padding: '14px 12px',
            borderRadius: 8,
            border: '1px dashed var(--colors-line-base)',
            color: 'var(--colors-fg-faint)',
            fontFamily: 'var(--font-families-mono)',
            fontSize: 11,
            textAlign: 'center',
          }}
        >
          not rendered
        </div>
      )}
      <span
        style={{
          fontFamily: 'var(--font-families-mono)',
          fontSize: 10,
          color: 'var(--colors-fg-faint)',
        }}
      >
        above="md" — {visible ? 'shown' : 'hidden'} at {Number(state.width)}px
      </span>
    </div>
  );
}

export const showDemo: PlaygroundDemo = { label: 'Show', code, preview, controls };
