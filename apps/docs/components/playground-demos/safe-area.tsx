import type { PlaygroundDemo } from './index.js';

function code(): string {
  return `import { SafeArea } from 'usemotif';

<SafeArea flex={1}>
  <ScreenContent />
</SafeArea>`;
}

function preview() {
  return (
    <div
      style={{
        width: 160,
        height: 240,
        border: '6px solid #1C1917',
        borderRadius: 28,
        background: '#FBF7F2',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 6,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 56,
          height: 12,
          borderRadius: 8,
          background: '#1C1917',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 28,
          left: 12,
          right: 12,
          bottom: 18,
          background: '#1D4ED8',
          borderRadius: 6,
        }}
      />
    </div>
  );
}

export const safeAreaDemo: PlaygroundDemo = { label: 'SafeArea (native)', code, preview };
