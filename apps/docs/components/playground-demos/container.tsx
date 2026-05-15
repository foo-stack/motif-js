import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';

const controls: readonly ControlSpec[] = [
  { kind: 'range', id: 'width', label: 'width', defaultValue: 220, min: 120, max: 320 },
];

function code(state: ControlState): string {
  return `import { Container, Box } from 'usemotif';

<Container name="card" w={${Number(state.width)}}>
  <Box
    p={{ base: '$2', '@card.md': '$4', '@card.lg': '$8' }}
  >
    Reflows on container width.
  </Box>
</Container>`;
}

function preview(state: ControlState) {
  const w = Number(state.width);
  const pad = w >= 300 ? 24 : w >= 200 ? 16 : 8;
  return (
    <div
      style={{
        width: w,
        border: '1px dashed var(--colors-line-base)',
        borderRadius: 6,
        padding: 6,
        background: 'var(--colors-surface-paper2)',
      }}
    >
      <div
        style={{
          padding: pad,
          background: '#1D4ED8',
          color: '#FBF7F2',
          borderRadius: 4,
          fontFamily: 'var(--font-families-mono)',
          fontSize: 12,
        }}
      >
        padding {pad}px
      </div>
    </div>
  );
}

export const containerDemo: PlaygroundDemo = {
  label: 'Container',
  code,
  preview,
  controls,
};
