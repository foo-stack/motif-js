import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';

const controls: readonly ControlSpec[] = [
  { kind: 'range', id: 'size', label: 'size', defaultValue: 48, min: 24, max: 96 },
  { kind: 'range', id: 'stroke', label: 'strokeWidth', defaultValue: 2, min: 1, max: 4 },
  { kind: 'color', id: 'color', label: 'stroke', defaultValue: '#15803D' },
];

function code(state: ControlState): string {
  return `import { Svg } from 'usemotif';

<Svg size={${Number(state.size)}} strokeWidth={${Number(state.stroke)}}>
  <circle cx="12" cy="12" r="9" />
  <path d="M8 12l3 3 5-6" />
</Svg>`;
}

function preview(state: ControlState) {
  const px = Number(state.size);
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      stroke={String(state.color)}
      strokeWidth={Number(state.stroke)}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l3 3 5-6" />
    </svg>
  );
}

export const svgDemo: PlaygroundDemo = { label: 'Svg', code, preview, controls };
