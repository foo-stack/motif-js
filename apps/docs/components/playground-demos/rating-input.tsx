import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';

const controls: readonly ControlSpec[] = [
  { kind: 'range', id: 'value', label: 'value', defaultValue: 3, min: 0, max: 5 },
];

function code(state: ControlState): string {
  return `import { RatingInput } from 'usemotif/headless';

<RatingInput
  aria-label="Rating"
  value={${Number(state.value)}}
  onValueChange={setRating}
  renderItem={({ filled }) => <Star filled={filled} />}
/>`;
}

function preview(state: ControlState) {
  const value = Number(state.value);
  return (
    <div style={{ display: 'inline-flex', gap: 4 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          // eslint-disable-next-line react/no-array-index-key -- positional
          key={i}
          style={{
            fontSize: 26,
            color: i < value ? '#C2410C' : 'var(--colors-line-base)',
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export const ratingInputDemo: PlaygroundDemo = {
  label: 'RatingInput',
  code,
  preview,
  controls,
};
