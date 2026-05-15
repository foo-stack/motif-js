import type { PlaygroundDemo } from './index.js';
import { panel, triggerButton } from './_surface.js';

function code(): string {
  return `import { Menu } from 'usemotif/headless';

<Menu.Root>
  <Menu.Trigger><Button>Actions</Button></Menu.Trigger>
  <Menu.Content>
    <Menu.Item onSelect={save}>Save</Menu.Item>
    <Menu.Item onSelect={duplicate}>Duplicate</Menu.Item>
    <Menu.Separator />
    <Menu.Item disabled onSelect={remove}>Delete</Menu.Item>
  </Menu.Content>
</Menu.Root>`;
}

function row(label: string, disabled = false) {
  return (
    <span
      style={{
        padding: '6px 10px',
        borderRadius: 5,
        fontFamily: 'var(--font-families-sans)',
        fontSize: 13,
        color: disabled ? 'var(--colors-fg-faint)' : 'var(--colors-fg-default)',
      }}
    >
      {label}
    </span>
  );
}

function preview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      {triggerButton('Actions')}
      <div style={panel({ display: 'flex', flexDirection: 'column', padding: 6, width: 150 })}>
        {row('Save')}
        {row('Duplicate')}
        <span style={{ height: 1, background: 'var(--colors-line-faint)', margin: '4px 0' }} />
        {row('Delete', true)}
      </div>
    </div>
  );
}

export const menuDemo: PlaygroundDemo = { label: 'Menu', code, preview };
