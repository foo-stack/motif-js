import type { PlaygroundDemo } from './index.js';

function code(): string {
  return `import { Overlay } from 'usemotif';

<Overlay onScrimClick={close}>
  <Box bg="$colors.surface.base" p="$6" borderRadius="$radii.lg">
    <Heading>Confirm</Heading>
    <Button onPress={confirm}>Yes, continue</Button>
  </Box>
</Overlay>`;
}

function preview() {
  return (
    <div
      style={{
        width: 220,
        height: 150,
        borderRadius: 10,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: 'var(--colors-surface-paper)',
          borderRadius: 10,
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-families-sans)',
            fontWeight: 700,
            fontSize: 15,
            color: 'var(--colors-fg-strong)',
          }}
        >
          Confirm
        </span>
        <button
          type="button"
          style={{
            padding: '6px 12px',
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
          Yes, continue
        </button>
      </div>
    </div>
  );
}

export const overlayDemo: PlaygroundDemo = { label: 'Overlay', code, preview };
