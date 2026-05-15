import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';

const controls: readonly ControlSpec[] = [
  { kind: 'range', id: 'size', label: 'fontSize', defaultValue: 16, min: 12, max: 28 },
  {
    kind: 'range',
    id: 'weight',
    label: 'fontWeight',
    defaultValue: 400,
    min: 300,
    max: 700,
    step: 100,
  },
  { kind: 'color', id: 'color', label: 'color', defaultValue: '#1C1917' },
];

function code(state: ControlState): string {
  return `import { Text } from 'usemotif';

<Text
  fontSize={${Number(state.size)}}
  fontWeight={${Number(state.weight)}}
  color="${String(state.color)}"
>
  The quick brown fox.
</Text>`;
}

function preview(state: ControlState) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-families-sans)',
        fontSize: Number(state.size),
        fontWeight: Number(state.weight),
        color: String(state.color),
      }}
    >
      The quick brown fox.
    </span>
  );
}

export const textDemo: PlaygroundDemo = { label: 'Text', code, preview, controls };
