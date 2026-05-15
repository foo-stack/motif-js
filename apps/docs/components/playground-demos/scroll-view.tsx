import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';
import { Swatch } from './_swatch.js';

const controls: readonly ControlSpec[] = [
  {
    kind: 'select',
    id: 'direction',
    label: 'direction',
    defaultValue: 'vertical',
    options: ['vertical', 'horizontal'],
  },
];

function code(state: ControlState): string {
  return `import { ScrollView } from 'usemotif';

<ScrollView direction="${String(state.direction)}" h={160}>
  {rows}
</ScrollView>`;
}

const TONES = ['a', 'b', 'c', 'd', 'e', 'f', 'a', 'b'];

function preview(state: ControlState) {
  const horizontal = state.direction === 'horizontal';
  return (
    <div
      style={{
        width: horizontal ? 220 : 140,
        height: horizontal ? 80 : 150,
        overflow: 'auto',
        border: '1px solid var(--colors-line-base)',
        borderRadius: 8,
        padding: 8,
        display: 'flex',
        flexDirection: horizontal ? 'row' : 'column',
        gap: 8,
      }}
    >
      {TONES.map((t, i) => (
        <Swatch
          // eslint-disable-next-line react/no-array-index-key -- positional
          key={i}
          tone={t}
          size={horizontal ? 56 : 44}
          style={{ flex: '0 0 auto', width: horizontal ? 56 : '100%' }}
        />
      ))}
    </div>
  );
}

export const scrollViewDemo: PlaygroundDemo = {
  label: 'ScrollView',
  code,
  preview,
  controls,
};
