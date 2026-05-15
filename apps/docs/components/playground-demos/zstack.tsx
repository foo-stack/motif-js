import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';

const controls: readonly ControlSpec[] = [
  { kind: 'range', id: 'offset', label: 'overlap', defaultValue: 14, min: 0, max: 24 },
];

function code(state: ControlState): string {
  return `import { ZStack, Box } from 'usemotif';

<ZStack>
  <Box w={56} h={56} bg="$colors.blue.700" />
  <Box w={56} h={56} bg="$colors.orange.600" ml={${Number(state.offset)}} mt={${Number(state.offset)}} />
  <Box w={56} h={56} bg="$colors.green.700" ml={${Number(state.offset) * 2}} mt={${Number(state.offset) * 2}} />
</ZStack>`;
}

function preview(state: ControlState) {
  const o = Number(state.offset);
  return (
    <div style={{ position: 'relative', width: 88, height: 88 }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            top: i * o,
            left: i * o,
            width: 44,
            height: 44,
            borderRadius: 6,
            background: ['#1D4ED8', '#C2410C', '#15803D'][i],
            border: '1px solid var(--colors-surface-paper)',
          }}
        />
      ))}
    </div>
  );
}

export const zstackDemo: PlaygroundDemo = { label: 'ZStack', code, preview, controls };
