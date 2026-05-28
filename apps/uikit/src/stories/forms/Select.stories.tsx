import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties, ReactNode } from 'react';
import { useState } from 'react';
import { Text, VStack } from 'usemotif';
import { Select, type ComboboxOption } from '@usemotif/headless';
import { Note } from '../../harness/demo.js';

// Select is a HEADLESS COMPOUND component and a thin wrapper over Combobox:
// `Select.Root` (state/context), `Select.Trigger` (a button child it augments
// with aria-haspopup/expanded + open-on-click/keys), and `Select.List` (the
// portalled listbox — the same component as Combobox.List). Unlike Combobox
// there is NO typeable input and NO filtering; the trigger displays the
// current selection. Because the trigger is your own element, YOU render the
// selected label from `value`. Motif emits theme tokens as `--<scale>-<path>`
// CSS custom properties; referenced with hex fallbacks.

const TIMEZONES: ReadonlyArray<ComboboxOption> = [
  { value: 'utc', label: 'UTC' },
  { value: 'est', label: 'Eastern (EST)' },
  { value: 'pst', label: 'Pacific (PST)' },
  { value: 'cet', label: 'Central European (CET)' },
  { value: 'jst', label: 'Japan (JST)', disabled: true },
  { value: 'aest', label: 'Australian Eastern (AEST)' },
];

function labelFor(value: string | undefined): string {
  return TIMEZONES.find((o) => o.value === value)?.label ?? 'Select a timezone…';
}

const TRIGGER: CSSProperties = {
  width: 260,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 8,
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid var(--colors-border-default, #d1d5db)',
  background: 'var(--colors-surface-default, #fff)',
  color: 'var(--colors-text-default, #111)',
  font: 'inherit',
  cursor: 'pointer',
  textAlign: 'left',
};

const LIST: CSSProperties = {
  width: 260,
  maxHeight: 240,
  overflowY: 'auto',
  padding: 4,
  borderRadius: 8,
  background: 'var(--colors-surface-raised, #fff)',
  border: '1px solid var(--colors-border-default, #d1d5db)',
  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
};

function renderOption(
  opt: ComboboxOption,
  info: { highlighted: boolean; selected: boolean; index: number },
): ReactNode {
  return (
    <span
      style={{
        display: 'block',
        padding: '8px 10px',
        borderRadius: 6,
        cursor: opt.disabled ? 'not-allowed' : 'pointer',
        opacity: opt.disabled ? 0.4 : 1,
        fontWeight: info.selected ? 600 : 400,
        background: info.highlighted ? 'var(--colors-surface-muted, #eef2ff)' : 'transparent',
      }}
    >
      {opt.label}
      {info.selected ? ' ✓' : ''}
    </span>
  );
}

const meta = {
  title: 'Forms/Select',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The canonical composition — `Root` + a `Trigger` button + a `List`. Click the
 * trigger (or focus it and press Down/Enter/Space) to open; the button text is
 * derived from the selected `value`. "Japan (JST)" is disabled.
 */
export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>('utc');
    return (
      <Select.Root
        options={TIMEZONES}
        {...(value !== undefined ? { value } : {})}
        onValueChange={setValue}
      >
        <Select.Trigger>
          <button type="button" style={TRIGGER}>
            <span>{labelFor(value)}</span>
            <span aria-hidden>▾</span>
          </button>
        </Select.Trigger>
        <Select.List style={LIST} renderOption={renderOption} />
      </Select.Root>
    );
  },
};

/** Controlled, with a live readout of the chosen value. */
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>(undefined);
    return (
      <VStack gap="$3">
        <Select.Root
          options={TIMEZONES}
          {...(value !== undefined ? { value } : {})}
          onValueChange={setValue}
        >
          <Select.Trigger>
            <button type="button" aria-label="Timezone" style={TRIGGER}>
              <span>{labelFor(value)}</span>
              <span aria-hidden>▾</span>
            </button>
          </Select.Trigger>
          <Select.List style={LIST} renderOption={renderOption} />
        </Select.Root>
        <Text color="$colors.text.muted" fontSize="$sm">
          Selected value: {value ?? '(none)'}
        </Text>
        <Note>No filtering — Select is for picking, Combobox is for typing.</Note>
      </VStack>
    );
  },
};
