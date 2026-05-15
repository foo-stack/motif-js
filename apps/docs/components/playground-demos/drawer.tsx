import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';
import { caption } from './_surface.js';

const controls: readonly ControlSpec[] = [
  {
    kind: 'select',
    id: 'side',
    label: 'side',
    defaultValue: 'right',
    options: ['left', 'right', 'top', 'bottom'],
  },
];

function code(state: ControlState): string {
  return `import { Drawer } from 'usemotif/headless';

<Drawer.Root>
  <Drawer.Trigger><Button>Menu</Button></Drawer.Trigger>
  <Drawer.Content side="${String(state.side)}">
    <Drawer.Title>Navigation</Drawer.Title>
    <NavLinks />
  </Drawer.Content>
</Drawer.Root>`;
}

function preview(state: ControlState) {
  const side = String(state.side);
  const vertical = side === 'top' || side === 'bottom';
  return (
    <div
      style={{
        width: 240,
        height: 150,
        borderRadius: 10,
        background: 'rgba(0,0,0,0.5)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: vertical ? 'column' : 'row',
        justifyContent: side === 'left' || side === 'top' ? 'flex-start' : 'flex-end',
      }}
    >
      <div
        style={{
          background: 'var(--colors-surface-paper)',
          width: vertical ? '100%' : 96,
          height: vertical ? 56 : '100%',
          padding: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        {caption(side)}
        <span style={{ fontFamily: 'var(--font-families-sans)', fontSize: 12 }}>Navigation</span>
      </div>
    </div>
  );
}

export const drawerDemo: PlaygroundDemo = { label: 'Drawer', code, preview, controls };
