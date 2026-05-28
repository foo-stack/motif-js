import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties, ReactNode } from 'react';
import { useState } from 'react';
import { Text, VStack } from 'usemotif';
import { MultiSelect, type ComboboxOption } from '@usemotif/headless';
import { Note } from '../../harness/demo.js';

// MultiSelect is a HEADLESS COMPOUND component holding a `value: T[]`:
// `MultiSelect.Root` (state/context), `.Chips` (renderChip per selected item),
// `.Input` (typeable filter; Backspace at empty input pops the last chip),
// `.List` (portalled, role="listbox" aria-multiselectable; click toggles), and
// `.SelectAll` (only when `enableSelectAll` is set — augments a child element
// with role="checkbox" + tri-state aria-checked). `maxSelections` caps the
// array. Motif emits theme tokens as `--<scale>-<path>` CSS custom properties;
// referenced with hex fallbacks.

const LANGS: ReadonlyArray<ComboboxOption> = [
  { value: 'ts', label: 'TypeScript' },
  { value: 'js', label: 'JavaScript' },
  { value: 'rs', label: 'Rust' },
  { value: 'go', label: 'Go' },
  { value: 'py', label: 'Python' },
  { value: 'rb', label: 'Ruby', disabled: true },
  { value: 'swift', label: 'Swift' },
];

const FIELD: CSSProperties = {
  width: 320,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 6,
  padding: 6,
  borderRadius: 8,
  border: '1px solid var(--colors-border-default, #d1d5db)',
  background: 'var(--colors-surface-default, #fff)',
};

const INPUT: CSSProperties = {
  flex: 1,
  minWidth: 80,
  border: 'none',
  outline: 'none',
  background: 'transparent',
  color: 'var(--colors-text-default, #111)',
  font: 'inherit',
};

const CHIP: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '2px 6px',
  borderRadius: 6,
  fontSize: 13,
  background: 'var(--colors-action-primary-bg, #3b82f6)',
  color: 'var(--colors-action-primary-fg, #fff)',
};

const LIST: CSSProperties = {
  width: 320,
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
        display: 'flex',
        justifyContent: 'space-between',
        padding: '8px 10px',
        borderRadius: 6,
        cursor: opt.disabled ? 'not-allowed' : 'pointer',
        opacity: opt.disabled ? 0.4 : 1,
        background: info.highlighted ? 'var(--colors-surface-muted, #eef2ff)' : 'transparent',
      }}
    >
      {opt.label}
      <span aria-hidden>{info.selected ? '☑' : '☐'}</span>
    </span>
  );
}

const meta = {
  title: 'Forms/MultiSelect',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The canonical composition — `Chips` (selected, with × removers) + `Input`
 * (type to filter) + `List` (click to toggle). Backspace at an empty input
 * removes the last chip. "Ruby" is disabled.
 */
export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<ReadonlyArray<string>>(['ts', 'rs']);
    return (
      <VStack gap="$3">
        <MultiSelect.Root options={LANGS} value={value} onValueChange={setValue}>
          <div style={FIELD}>
            <MultiSelect.Chips
              renderChip={(opt, { remove }) => (
                <span style={CHIP}>
                  {opt.label}
                  <button
                    type="button"
                    aria-label={`Remove ${opt.label}`}
                    onClick={remove}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: 'inherit',
                      cursor: 'pointer',
                      padding: 0,
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </span>
              )}
            />
            <MultiSelect.Input>
              <input aria-label="Languages" placeholder="Filter…" style={INPUT} />
            </MultiSelect.Input>
          </div>
          <MultiSelect.List style={LIST} renderOption={renderOption} />
        </MultiSelect.Root>
        <Text color="$colors.text.muted" fontSize="$sm">
          Selected: {value.length > 0 ? value.join(', ') : '(none)'}
        </Text>
      </VStack>
    );
  },
};

/**
 * `maxSelections={3}` caps the array — adding past the cap is a no-op. Remove
 * a chip to free a slot.
 */
export const Capped: Story = {
  render: () => {
    const [value, setValue] = useState<ReadonlyArray<string>>(['ts', 'js']);
    return (
      <VStack gap="$3">
        <MultiSelect.Root options={LANGS} value={value} onValueChange={setValue} maxSelections={3}>
          <div style={FIELD}>
            <MultiSelect.Chips
              renderChip={(opt, { remove }) => (
                <span style={CHIP}>
                  {opt.label}
                  <button
                    type="button"
                    aria-label={`Remove ${opt.label}`}
                    onClick={remove}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: 'inherit',
                      cursor: 'pointer',
                      padding: 0,
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </span>
              )}
            />
            <MultiSelect.Input>
              <input aria-label="Languages (max 3)" placeholder="Filter…" style={INPUT} />
            </MultiSelect.Input>
          </div>
          <MultiSelect.List style={LIST} renderOption={renderOption} />
        </MultiSelect.Root>
        <Note>
          maxSelections={'{3}'} — {value.length}/3 chosen.
        </Note>
      </VStack>
    );
  },
};

/**
 * `enableSelectAll` surfaces a `<MultiSelect.SelectAll>` control. It augments
 * its child element with `role="checkbox"` and a tri-state `aria-checked`
 * (true / "mixed" / false) reflecting the filtered subset.
 */
export const SelectAll: Story = {
  render: () => {
    const [value, setValue] = useState<ReadonlyArray<string>>([]);
    return (
      <VStack gap="$3">
        <MultiSelect.Root
          options={LANGS}
          value={value}
          onValueChange={setValue}
          enableSelectAll
          defaultOpen
        >
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <MultiSelect.SelectAll>
              <button
                type="button"
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: '1px solid var(--colors-border-default, #d1d5db)',
                  background: 'var(--colors-surface-default, #fff)',
                  cursor: 'pointer',
                  font: 'inherit',
                }}
              >
                Select all
              </button>
            </MultiSelect.SelectAll>
            <MultiSelect.Input>
              <input aria-label="Languages" placeholder="Filter…" style={INPUT} />
            </MultiSelect.Input>
          </div>
          <MultiSelect.List style={LIST} renderOption={renderOption} />
        </MultiSelect.Root>
        <Text color="$colors.text.muted" fontSize="$sm">
          {value.length} selected
        </Text>
      </VStack>
    );
  },
};
