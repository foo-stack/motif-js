import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';

const controls: readonly ControlSpec[] = [
  { kind: 'range', id: 'radius', label: 'radius', defaultValue: 8, min: 0, max: 40 },
  {
    kind: 'select',
    id: 'fit',
    label: 'objectFit',
    defaultValue: 'cover',
    options: ['cover', 'contain'],
  },
];

function code(state: ControlState): string {
  return `import { Image } from 'usemotif';

<Image
  src="/cover.jpg"
  alt="Mountain ridge at dawn"
  w={200}
  h={130}
  borderRadius={${Number(state.radius)}}
  objectFit="${String(state.fit)}"
/>`;
}

function preview(state: ControlState) {
  return (
    <div
      style={{
        width: 200,
        height: 130,
        borderRadius: Number(state.radius),
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1D4ED8 0%, #7E22CE 50%, #C2410C 100%)',
        display: 'flex',
        alignItems: 'flex-end',
        padding: 10,
        boxSizing: 'border-box',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-families-mono)',
          fontSize: 11,
          color: '#FBF7F2',
          background: 'rgba(0,0,0,0.35)',
          borderRadius: 4,
          padding: '2px 6px',
        }}
      >
        objectFit: {String(state.fit)}
      </span>
    </div>
  );
}

export const imageDemo: PlaygroundDemo = { label: 'Image', code, preview, controls };
