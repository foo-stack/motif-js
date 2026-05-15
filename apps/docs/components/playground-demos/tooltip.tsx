import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';
import { triggerButton } from './_surface.js';

const controls: readonly ControlSpec[] = [
  {
    kind: 'select',
    id: 'placement',
    label: 'placement',
    defaultValue: 'bottom',
    options: ['top', 'bottom', 'left', 'right'],
  },
];

function code(state: ControlState): string {
  return `import { Tooltip } from 'usemotif/headless';

<Tooltip.Root placement="${String(state.placement)}">
  <Tooltip.Trigger>
    <IconButton aria-label="Save"><SaveIcon /></IconButton>
  </Tooltip.Trigger>
  <Tooltip.Content>Save (⌘S)</Tooltip.Content>
</Tooltip.Root>`;
}

function preview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div
        style={{
          padding: '5px 9px',
          borderRadius: 5,
          background: '#1C1917',
          color: '#FBF7F2',
          fontFamily: 'var(--font-families-sans)',
          fontSize: 12,
        }}
      >
        Save (⌘S)
      </div>
      {triggerButton('Save')}
    </div>
  );
}

export const tooltipDemo: PlaygroundDemo = { label: 'Tooltip', code, preview, controls };
