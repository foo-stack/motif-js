import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';

const controls: readonly ControlSpec[] = [
  { kind: 'range', id: 'lh', label: 'lineHeight', defaultValue: 16, min: 12, max: 22 },
];

const TEXT =
  'Motif resolves every style prop through the active theme. Tokens describe the values; theming is how they switch.';

function code(state: ControlState): string {
  return `import { Paragraph } from 'usemotif';

<Paragraph lineHeight={${(Number(state.lh) / 10).toFixed(1)}}>
  ${TEXT}
</Paragraph>`;
}

function preview(state: ControlState) {
  return (
    <p
      style={{
        fontFamily: 'var(--font-families-sans)',
        fontSize: 15,
        lineHeight: Number(state.lh) / 10,
        color: 'var(--colors-fg-muted)',
        maxWidth: 280,
        margin: 0,
      }}
    >
      {TEXT}
    </p>
  );
}

export const paragraphDemo: PlaygroundDemo = {
  label: 'Paragraph',
  code,
  preview,
  controls,
};
