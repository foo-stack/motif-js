import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';
import { panel } from './_surface.js';

const controls: readonly ControlSpec[] = [
  {
    kind: 'select',
    id: 'type',
    label: 'type',
    defaultValue: 'background',
    options: ['background', 'foreground'],
  },
];

function code(state: ControlState): string {
  return `import { Toaster, useToast } from 'usemotif/headless';

const { toast } = useToast();

toast({
  title: 'Changes saved',
  description: 'Your draft is up to date.',
  type: '${String(state.type)}',
});`;
}

function preview(state: ControlState) {
  const foreground = state.type === 'foreground';
  return (
    <div
      style={panel({
        width: 230,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderLeft: `3px solid ${foreground ? '#B91C1C' : '#15803D'}`,
      })}
    >
      <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--colors-fg-strong)' }}>
        {foreground ? 'Upload failed' : 'Changes saved'}
      </span>
      <span style={{ fontSize: 12, color: 'var(--colors-fg-muted)' }}>
        {foreground ? 'Check your connection.' : 'Your draft is up to date.'}
      </span>
    </div>
  );
}

export const toastDemo: PlaygroundDemo = { label: 'Toast', code, preview, controls };
