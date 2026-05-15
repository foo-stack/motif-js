import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';
import { caption, panel, triggerButton } from './_surface.js';

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
  return `import { Popover } from 'usemotif/headless';

<Popover.Root>
  <Popover.Trigger>
    <Button>Filter</Button>
  </Popover.Trigger>
  <Popover.Content placement="${String(state.placement)}">
    <FilterControls />
  </Popover.Content>
</Popover.Root>`;
}

function preview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      {triggerButton('Filter')}
      <div style={panel({ display: 'flex', flexDirection: 'column', gap: 6, width: 170 })}>
        {caption('Popover content')}
        <span style={{ fontSize: 13, color: 'var(--colors-fg-default)' }}>
          Non-modal — focus stays put.
        </span>
      </div>
    </div>
  );
}

export const popoverDemo: PlaygroundDemo = { label: 'Popover', code, preview, controls };
