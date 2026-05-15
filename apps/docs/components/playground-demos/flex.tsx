import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';
import { Swatch } from './_swatch.js';

const controls: readonly ControlSpec[] = [
  {
    kind: 'select',
    id: 'direction',
    label: 'direction',
    defaultValue: 'row',
    options: ['row', 'column', 'row-reverse', 'column-reverse'],
  },
];

function code(state: ControlState): string {
  return `import { Flex } from 'usemotif';

<Flex direction="${String(state.direction)}">
  <Box />
  <Box />
  <Box />
</Flex>`;
}

function preview(state: ControlState) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: state.direction as 'row' | 'column' | 'row-reverse' | 'column-reverse',
        gap: 4,
      }}
    >
      <Swatch tone="a" size={28} />
      <Swatch tone="b" size={28} />
      <Swatch tone="c" size={28} />
    </div>
  );
}

export const flexDemo: PlaygroundDemo = { label: 'Flex', code, preview, controls };
