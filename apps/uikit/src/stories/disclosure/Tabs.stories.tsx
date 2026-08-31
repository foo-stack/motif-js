import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { Box, HStack, Text, VStack } from 'usemotif';
import { Tabs } from '@usemotif/headless';
import { Note } from '../../harness/demo.js';

// Tabs: Root holds the active `value`; List is the `role="tablist"`;
// each Tab is a `role="tab"` button (arrow-key roving focus, Home/End);
// each Panel is a `role="tabpanel"` that unmounts when inactive unless
// `forceMount`. Tab/Panel are paired by matching `value`. Root is
// controlled (`value`/`onValueChange`) or uncontrolled (`defaultValue`).
//
// Tabs.Tab takes a static `style` but doesn't pass selection state to its
// children, so to style the active tab these stories drive `value` from a
// parent `useState` and compute the style per tab from that.
function tabStyle(selected: boolean): CSSProperties {
  return {
    appearance: 'none',
    border: 'none',
    background: 'transparent',
    padding: '8px 14px',
    cursor: 'pointer',
    fontWeight: 600,
    color: selected
      ? 'var(--colors-action-primary-bg, #3b82f6)'
      : 'var(--colors-text-muted, #6b7280)',
    borderBottom: selected
      ? '2px solid var(--colors-action-primary-bg, #3b82f6)'
      : '2px solid transparent',
  };
}
const PANEL: CSSProperties = {
  padding: 16,
  color: 'var(--colors-text-default, #111827)',
};
const TABS = [
  { value: 'account', label: 'Account', body: 'Update your profile and email.' },
  { value: 'billing', label: 'Billing', body: 'Manage cards and invoices.' },
  { value: 'team', label: 'Team', body: 'Invite and manage members.' },
] as const;

/**
 * Tabs - `Tabs.Root` owns the active value; `Tabs.List` is the
 * `role="tablist"`; `Tabs.Tab` (matched to a `Tabs.Panel` by `value`) is
 * a roving-focus tab button with ArrowLeft/Right + Home/End nav; inactive
 * panels unmount unless `forceMount`. Controlled via `value`/`onValueChange`
 * or uncontrolled via `defaultValue`. `orientation` switches arrow keys to
 * Up/Down.
 */
const meta = {
  title: 'Disclosure/Tabs',
  component: Tabs.Root,
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Controlled horizontal tabs (the canonical pattern); active tab styled. */
export const Playground: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = useState('account');
      return (
        <Box style={{ maxWidth: 460 }}>
          <Tabs.Root value={value} onValueChange={setValue}>
            <Tabs.List
              style={{
                display: 'flex',
                gap: 4,
                borderBottom: '1px solid var(--colors-border-default, #e5e7eb)',
              }}
            >
              {TABS.map((t) => (
                <Tabs.Tab key={t.value} value={t.value} style={tabStyle(value === t.value)}>
                  {t.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>
            {TABS.map((t) => (
              <Tabs.Panel key={t.value} value={t.value} style={PANEL}>
                <Text m={0}>{t.body}</Text>
              </Tabs.Panel>
            ))}
          </Tabs.Root>
        </Box>
      );
    }
    return <Demo />;
  },
};

/** Controlled with a status line showing the active value. */
export const Controlled: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = useState('billing');
      return (
        <VStack gap="$2" style={{ maxWidth: 460 }}>
          <Note>active = {value}</Note>
          <Tabs.Root value={value} onValueChange={setValue}>
            <Tabs.List
              style={{
                display: 'flex',
                gap: 4,
                borderBottom: '1px solid var(--colors-border-default, #e5e7eb)',
              }}
            >
              {TABS.map((t) => (
                <Tabs.Tab key={t.value} value={t.value} style={tabStyle(value === t.value)}>
                  {t.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>
            {TABS.map((t) => (
              <Tabs.Panel key={t.value} value={t.value} style={PANEL}>
                <Text m={0}>{t.body}</Text>
              </Tabs.Panel>
            ))}
          </Tabs.Root>
        </VStack>
      );
    }
    return <Demo />;
  },
};

/** A disabled tab - skipped by arrow-key roving focus. */
export const DisabledTab: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = useState('account');
      return (
        <Box style={{ maxWidth: 460 }}>
          <Tabs.Root value={value} onValueChange={setValue}>
            <Tabs.List
              style={{
                display: 'flex',
                gap: 4,
                borderBottom: '1px solid var(--colors-border-default, #e5e7eb)',
              }}
            >
              <Tabs.Tab value="account" style={tabStyle(value === 'account')}>
                Account
              </Tabs.Tab>
              <Tabs.Tab
                value="billing"
                disabled
                style={{ ...tabStyle(false), opacity: 0.4, cursor: 'not-allowed' }}
              >
                Billing (disabled)
              </Tabs.Tab>
              <Tabs.Tab value="team" style={tabStyle(value === 'team')}>
                Team
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="account" style={PANEL}>
              <Text m={0}>Account panel. Arrow keys skip the disabled tab.</Text>
            </Tabs.Panel>
            <Tabs.Panel value="team" style={PANEL}>
              <Text m={0}>Team panel.</Text>
            </Tabs.Panel>
          </Tabs.Root>
        </Box>
      );
    }
    return <Demo />;
  },
};

/** Vertical orientation - list and panels side by side; Up/Down nav. */
export const Vertical: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = useState('account');
      return (
        <Tabs.Root value={value} onValueChange={setValue} orientation="vertical">
          <HStack gap="$3" alignItems="flex-start">
            <Tabs.List
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                borderRight: '1px solid var(--colors-border-default, #e5e7eb)',
                paddingRight: 8,
              }}
            >
              {TABS.map((t) => (
                <Tabs.Tab key={t.value} value={t.value} style={tabStyle(value === t.value)}>
                  {t.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>
            {TABS.map((t) => (
              <Tabs.Panel key={t.value} value={t.value} style={{ padding: 8 }}>
                <Text m={0}>{t.body}</Text>
              </Tabs.Panel>
            ))}
          </HStack>
        </Tabs.Root>
      );
    }
    return <Demo />;
  },
};
