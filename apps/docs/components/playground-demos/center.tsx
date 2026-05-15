import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';
import { Swatch } from './_swatch.js';

const controls: readonly ControlSpec[] = [
  { kind: 'range', id: 'height', label: 'h', defaultValue: 80, min: 60, max: 140 },
];

function code(state: ControlState): string {
  return `import { Center } from 'usemotif';

<Center h={${Number(state.height)}}>
  <Box />
</Center>`;
}

function preview(state: ControlState) {
  return (
    <div
      style={{
        height: Number(state.height),
        width: 160,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px dashed var(--colors-line-base)',
        borderRadius: 6,
      }}
    >
      <Swatch tone="a" size={28} />
    </div>
  );
}

export const centerDemo: PlaygroundDemo = { label: 'Center', code, preview, controls };
