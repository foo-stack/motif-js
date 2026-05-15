import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';

const controls: readonly ControlSpec[] = [
  { kind: 'range', id: 'level', label: 'level', defaultValue: 2, min: 1, max: 6 },
];

const SIZE: Record<number, number> = { 1: 36, 2: 30, 3: 24, 4: 20, 5: 17, 6: 15 };

function code(state: ControlState): string {
  return `import { Heading } from 'usemotif';

<Heading level={${Number(state.level)}}>
  Section heading
</Heading>`;
}

function preview(state: ControlState) {
  const level = Number(state.level);
  return (
    <span
      style={{
        fontFamily: 'var(--font-families-sans)',
        fontSize: SIZE[level] ?? 30,
        fontWeight: 700,
        lineHeight: 1.2,
        color: 'var(--colors-fg-strong)',
      }}
    >
      Section heading
    </span>
  );
}

export const headingDemo: PlaygroundDemo = { label: 'Heading', code, preview, controls };
