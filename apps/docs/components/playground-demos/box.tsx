import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';

const controls: readonly ControlSpec[] = [
  { kind: 'range', id: 'p', label: 'p', defaultValue: 16, min: 4, max: 32 },
  { kind: 'range', id: 'radius', label: 'radius', defaultValue: 8, min: 0, max: 24 },
  { kind: 'color', id: 'bg', label: 'bg', defaultValue: '#1D4ED8' },
];

function code(state: ControlState): string {
  return `import { Box } from 'usemotif';

<Box
  p={${Number(state.p)}}
  borderRadius={${Number(state.radius)}}
  bg="${String(state.bg)}"
  color="$colors.fg.onAccent"
>
  Box
</Box>`;
}

function preview(state: ControlState) {
  return (
    <div
      style={{
        padding: Number(state.p),
        borderRadius: Number(state.radius),
        background: String(state.bg),
        color: '#FBF7F2',
        fontFamily: 'var(--font-families-mono)',
        fontWeight: 500,
        fontSize: 13,
      }}
    >
      Box
    </div>
  );
}

export const boxDemo: PlaygroundDemo = { label: 'Box', code, preview, controls };
