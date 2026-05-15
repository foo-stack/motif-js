import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';
import { Swatch } from './_swatch.js';

const controls: readonly ControlSpec[] = [
  { kind: 'range', id: 'columns', label: 'columns', defaultValue: 3, min: 2, max: 6 },
  { kind: 'range', id: 'gap', label: 'gap', defaultValue: 8, min: 0, max: 20 },
];

function code(state: ControlState): string {
  return `import { Grid } from 'usemotif';

<Grid columns={${Number(state.columns)}} gap={${Number(state.gap)}}>
  <Box />
  <Box />
  <Box />
  <Box />
  <Box />
  <Box />
</Grid>`;
}

function preview(state: ControlState) {
  const cols = Number(state.columns);
  const tones = ['a', 'b', 'c', 'd', 'e', 'f'];
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: Number(state.gap),
        width: 220,
      }}
    >
      {tones.slice(0, cols * 2).map((t, i) => (
        <Swatch
          // eslint-disable-next-line react/no-array-index-key -- positional
          key={i}
          tone={t}
          size={32}
          style={{ width: '100%' }}
        />
      ))}
    </div>
  );
}

export const gridDemo: PlaygroundDemo = { label: 'Grid', code, preview, controls };
