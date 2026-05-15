import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';

const controls: readonly ControlSpec[] = [
  {
    kind: 'select',
    id: 'tab',
    label: 'active',
    defaultValue: 'account',
    options: ['account', 'security', 'billing'],
  },
];

const PANELS: Record<string, string> = {
  account: 'Name, email, and avatar.',
  security: 'Password and two-factor.',
  billing: 'Plan and payment method.',
};

function code(state: ControlState): string {
  return `import { Tabs } from 'usemotif/headless';

<Tabs.Root defaultValue="${String(state.tab)}">
  <Tabs.List>
    <Tabs.Tab value="account">Account</Tabs.Tab>
    <Tabs.Tab value="security">Security</Tabs.Tab>
    <Tabs.Tab value="billing">Billing</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="${String(state.tab)}">…</Tabs.Panel>
</Tabs.Root>`;
}

function tab(label: string, value: string, active: string) {
  const selected = value === active;
  return (
    <span
      style={{
        padding: '7px 12px',
        fontFamily: 'var(--font-families-sans)',
        fontSize: 13,
        fontWeight: selected ? 600 : 400,
        color: selected ? 'var(--colors-accent-base)' : 'var(--colors-fg-muted)',
        borderBottom: `2px solid ${selected ? 'var(--colors-accent-base)' : 'transparent'}`,
      }}
    >
      {label}
    </span>
  );
}

function preview(state: ControlState) {
  const active = String(state.tab);
  return (
    <div style={{ width: 240 }}>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--colors-line-base)' }}>
        {tab('Account', 'account', active)}
        {tab('Security', 'security', active)}
        {tab('Billing', 'billing', active)}
      </div>
      <div
        style={{
          padding: '14px 12px',
          fontFamily: 'var(--font-families-sans)',
          fontSize: 13,
          color: 'var(--colors-fg-default)',
        }}
      >
        {PANELS[active]}
      </div>
    </div>
  );
}

export const tabsDemo: PlaygroundDemo = { label: 'Tabs', code, preview, controls };
