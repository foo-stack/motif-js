import type { PlaygroundDemo } from './index.js';

function code(): string {
  return `import { Portal } from 'usemotif';

<Box overflow="hidden">
  <Portal>
    <Toast>Saved</Toast>
  </Portal>
</Box>`;
}

function preview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
      <div
        style={{
          width: 200,
          height: 70,
          border: '1px solid var(--colors-line-base)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-families-mono)',
          fontSize: 11,
          color: 'var(--colors-fg-faint)',
        }}
      >
        component tree
      </div>
      <span style={{ fontSize: 14, color: 'var(--colors-fg-faint)' }}>↓ renders at</span>
      <div
        style={{
          width: 200,
          padding: '10px 14px',
          borderRadius: 8,
          background: '#15803D',
          color: '#FBF7F2',
          fontFamily: 'var(--font-families-sans)',
          fontSize: 13,
          textAlign: 'center',
        }}
      >
        Toast - at document.body
      </div>
    </div>
  );
}

export const portalDemo: PlaygroundDemo = { label: 'Portal', code, preview };
