import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';

const controls: readonly ControlSpec[] = [
  {
    kind: 'select',
    id: 'size',
    label: 'size',
    defaultValue: 'md',
    options: ['xs', 'sm', 'md', 'lg', 'xl'],
  },
  {
    kind: 'select',
    id: 'shape',
    label: 'shape',
    defaultValue: 'circle',
    options: ['circle', 'square'],
  },
  { kind: 'toggle', id: 'image', label: 'src', defaultValue: false },
];

const SIZE: Record<string, number> = { xs: 24, sm: 32, md: 40, lg: 56, xl: 80 };

function code(state: ControlState): string {
  return `import { Avatar } from 'usemotif';

<Avatar
  name="Jane Doe"
  size="${String(state.size)}"
  shape="${String(state.shape)}"${state.image ? '\n  src="/jane.jpg"' : ''}
/>`;
}

function preview(state: ControlState) {
  const px = SIZE[String(state.size)] ?? 40;
  const radius = state.shape === 'circle' ? '50%' : 8;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: px,
        height: px,
        borderRadius: radius,
        background: state.image ? '#1D4ED8' : 'var(--colors-surface-muted)',
        color: state.image ? '#FBF7F2' : 'var(--colors-fg-default)',
        fontFamily: 'var(--font-families-sans)',
        fontWeight: 600,
        fontSize: Math.round(px * 0.4),
      }}
    >
      JD
    </span>
  );
}

export const avatarDemo: PlaygroundDemo = { label: 'Avatar', code, preview, controls };
