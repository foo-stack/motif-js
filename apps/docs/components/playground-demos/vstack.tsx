import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';
import { Swatch } from './_swatch.js';

const controls: readonly ControlSpec[] = [
  { kind: 'range', id: 'gap', label: 'gap', defaultValue: 8, min: 0, max: 24 },
];

function code(state: ControlState): string {
  return `import { VStack } from 'usemotif';

<VStack gap={${Number(state.gap)}}>
  <Box />
  <Box />
  <Box />
</VStack>`;
}

function preview(state: ControlState) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: Number(state.gap),
      }}
    >
      <Swatch tone="a" size={28} />
      <Swatch tone="b" size={28} />
      <Swatch tone="c" size={28} />
    </div>
  );
}

export const vstackDemo: PlaygroundDemo = { label: 'VStack', code, preview, controls };
