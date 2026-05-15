import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';
import { Swatch } from './_swatch.js';

const controls: readonly ControlSpec[] = [
  { kind: 'range', id: 'gap', label: 'gap', defaultValue: 12, min: 0, max: 32 },
  {
    kind: 'select',
    id: 'align',
    label: 'alignItems',
    defaultValue: 'center',
    options: ['flex-start', 'center', 'flex-end'],
  },
];

function code(state: ControlState): string {
  return `import { HStack } from 'usemotif';

<HStack gap={${Number(state.gap)}} alignItems="${String(state.align)}">
  <Box />
  <Box />
  <Box />
</HStack>`;
}

function preview(state: ControlState) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: String(state.align),
        gap: Number(state.gap),
        height: 56,
      }}
    >
      <Swatch tone="a" size={32} />
      <Swatch tone="b" size={48} />
      <Swatch tone="c" size={28} />
    </div>
  );
}

export const hstackDemo: PlaygroundDemo = { label: 'HStack', code, preview, controls };
