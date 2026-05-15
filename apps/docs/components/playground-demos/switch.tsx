import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';

const controls: readonly ControlSpec[] = [
  { kind: 'toggle', id: 'on', label: 'on', defaultValue: true },
];

function code(state: ControlState): string {
  return `import { Switch } from 'usemotif/headless';

<label>
  <Switch defaultChecked={${Boolean(state.on)}} />
  Dark mode
</label>`;
}

function preview(state: ControlState) {
  const on = Boolean(state.on);
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: 'var(--font-families-sans)',
        fontSize: 14,
      }}
    >
      <span
        style={{
          width: 36,
          height: 20,
          borderRadius: 999,
          background: on ? '#15803D' : 'var(--colors-line-base)',
          position: 'relative',
          transition: 'background 120ms',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 2,
            left: on ? 18 : 2,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#FBF7F2',
            transition: 'left 120ms',
          }}
        />
      </span>
      Dark mode
    </span>
  );
}

export const switchDemo: PlaygroundDemo = { label: 'Switch', code, preview, controls };
