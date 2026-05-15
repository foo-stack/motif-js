import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';

const controls: readonly ControlSpec[] = [
  {
    kind: 'select',
    id: 'current',
    label: 'current',
    defaultValue: 'payment',
    options: ['cart', 'payment', 'review'],
  },
];

const STEPS = [
  { id: 'cart', label: 'Cart' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
];

function code(state: ControlState): string {
  return `import { Stepper } from 'usemotif/headless';

<Stepper
  steps={steps}
  current="${String(state.current)}"
  renderStep={(info) => <Step {...info} />}
/>`;
}

function preview(state: ControlState) {
  const current = String(state.current);
  const currentIdx = STEPS.findIndex((s) => s.id === current);
  return (
    <ol style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, gap: 8 }}>
      {STEPS.map((s, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <li key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-families-sans)',
                fontSize: 11,
                fontWeight: 600,
                background: done || active ? '#1D4ED8' : 'var(--colors-line-base)',
                color: done || active ? '#FBF7F2' : 'var(--colors-fg-muted)',
              }}
            >
              {done ? '✓' : i + 1}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-families-sans)',
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                color: active ? 'var(--colors-fg-strong)' : 'var(--colors-fg-muted)',
              }}
            >
              {s.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export const stepperDemo: PlaygroundDemo = { label: 'Stepper', code, preview, controls };
