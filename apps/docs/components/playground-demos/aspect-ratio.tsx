import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';

const controls: readonly ControlSpec[] = [
  {
    kind: 'select',
    id: 'ratio',
    label: 'ratio',
    defaultValue: '16/9',
    options: ['1', '4/3', '16/9', '21/9'],
  },
];

function parse(r: string): number {
  if (r.includes('/')) {
    const [a, b] = r.split('/').map(Number);
    return (a ?? 1) / (b ?? 1);
  }
  return Number(r) || 1;
}

function code(state: ControlState): string {
  const v = String(state.ratio);
  const expr = v.includes('/') ? v : v;
  return `import { AspectRatio } from 'usemotif';

<AspectRatio ratio={${expr}}>
  <Image src="..." />
</AspectRatio>`;
}

function preview(state: ControlState) {
  return (
    <div
      style={{
        width: 180,
        aspectRatio: parse(String(state.ratio)),
        background: '#1D4ED8',
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FBF7F2',
        fontFamily: 'var(--font-families-mono)',
        fontSize: 12,
      }}
    >
      {String(state.ratio)}
    </div>
  );
}

export const aspectRatioDemo: PlaygroundDemo = {
  label: 'AspectRatio',
  code,
  preview,
  controls,
};
