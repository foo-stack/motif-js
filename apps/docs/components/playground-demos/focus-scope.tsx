import type { PlaygroundDemo } from './index.js';

function code(): string {
  return `import { FocusScope } from 'usemotif';

<FocusScope trapFocus restoreFocus onEscape={close}>
  <Dialog>
    <Input aria-label="Name" />
    <Button onPress={close}>Done</Button>
  </Dialog>
</FocusScope>`;
}

function preview() {
  return (
    <div
      style={{
        width: 220,
        border: '2px dashed var(--colors-accent-base)',
        borderRadius: 10,
        padding: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-families-mono)',
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--colors-accent-base)',
        }}
      >
        Focus trapped here
      </span>
      <input
        aria-label="Name"
        style={{
          padding: '6px 10px',
          borderRadius: 6,
          border: '1px solid var(--colors-line-base)',
          fontFamily: 'var(--font-families-sans)',
          fontSize: 13,
        }}
      />
      <button
        type="button"
        style={{
          alignSelf: 'flex-start',
          padding: '6px 14px',
          borderRadius: 6,
          border: '1px solid transparent',
          background: '#1D4ED8',
          color: '#FBF7F2',
          fontFamily: 'var(--font-families-sans)',
          fontWeight: 600,
          fontSize: 13,
          cursor: 'pointer',
        }}
      >
        Done
      </button>
    </div>
  );
}

export const focusScopeDemo: PlaygroundDemo = { label: 'FocusScope', code, preview };
