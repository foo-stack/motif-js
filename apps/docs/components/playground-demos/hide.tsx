import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';

const controls: readonly ControlSpec[] = [
  {
    kind: 'range',
    id: 'width',
    label: 'viewport',
    defaultValue: 600,
    min: 400,
    max: 1400,
    step: 100,
  },
];

function code(state: ControlState): string {
  return `import { Hide } from 'usemotif';

<Hide above="md">
  <MobileMenuButton />
</Hide>
<!-- viewport: ${Number(state.width)}px -->`;
}

function preview(state: ControlState) {
  const visible = Number(state.width) < 768;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
      {visible ? (
        <button
          type="button"
          style={{
            width: 160,
            padding: '12px',
            borderRadius: 8,
            border: '1px solid var(--colors-line-base)',
            background: 'var(--colors-surface-paper)',
            fontFamily: 'var(--font-families-sans)',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Menu
        </button>
      ) : (
        <div
          style={{
            width: 160,
            padding: '12px',
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
        above="md" - {visible ? 'shown' : 'hidden'} at {Number(state.width)}px
      </span>
    </div>
  );
}

export const hideDemo: PlaygroundDemo = { label: 'Hide', code, preview, controls };
