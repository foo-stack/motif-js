import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';
import { Swatch } from './_swatch.js';

const controls: readonly ControlSpec[] = [
  {
    kind: 'select',
    id: 'direction',
    label: 'direction',
    defaultValue: 'column',
    options: ['column', 'row'],
  },
  { kind: 'range', id: 'gap', label: 'gap', defaultValue: 12, min: 0, max: 32 },
];

function code(state: ControlState): string {
  return `import { Stack } from 'usemotif';

<Stack direction="${String(state.direction)}" gap={${Number(state.gap)}}>
  <Box />
  <Box />
  <Box />
</Stack>`;
}

function preview(state: ControlState) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: state.direction === 'row' ? 'row' : 'column',
        gap: Number(state.gap),
      }}
    >
      <Swatch tone="a" />
      <Swatch tone="b" />
      <Swatch tone="c" />
    </div>
  );
}

export const stackDemo: PlaygroundDemo = { label: 'Stack', code, preview, controls };
