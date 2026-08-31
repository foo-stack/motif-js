import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties, ReactNode } from 'react';
import { useState } from 'react';
import { Text, VStack } from 'usemotif';
import { Combobox, type ComboboxOption } from '@usemotif/headless';
import { Note } from '../../harness/demo.js';

// Combobox is a HEADLESS COMPOUND component: `Combobox.Root` (state + context),
// `Combobox.Input` (the typeable text field, role="combobox"), and
// `Combobox.List` (the popup listbox, rendered in a Portal). Root owns the
// `options` array, the filtered list (case-insensitive substring on `label` by
// default, overridable via `filter`), the selected `value`, the `inputValue`,
// and `open` state - each independently controllable. `Combobox.List` takes
// `style`, `renderOption`, `placement`, `offset`, and `emptyMessage`. Because
// the list is portalled, its visuals come from the `style`/`renderOption`
// props here. Motif emits theme tokens as `--<scale>-<path>` CSS custom
// properties; referenced with hex fallbacks.

const FRUITS: ReadonlyArray<ComboboxOption> = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'durian', label: 'Durian', disabled: true },
  { value: 'elderberry', label: 'Elderberry' },
  { value: 'fig', label: 'Fig' },
  { value: 'grape', label: 'Grape' },
];

const INPUT: CSSProperties = {
  width: 240,
  padding: '8px 10px',
  borderRadius: 8,
  border: '1px solid var(--colors-border-default, #d1d5db)',
  background: 'var(--colors-surface-default, #fff)',
  color: 'var(--colors-text-default, #111)',
  font: 'inherit',
};

const LIST: CSSProperties = {
  width: 240,
  maxHeight: 220,
  overflowY: 'auto',
  padding: 4,
  borderRadius: 8,
  background: 'var(--colors-surface-raised, #fff)',
  border: '1px solid var(--colors-border-default, #d1d5db)',
  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
};

function optionStyle(highlighted: boolean, selected: boolean, disabled?: boolean): CSSProperties {
  return {
    padding: '8px 10px',
    borderRadius: 6,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    fontWeight: selected ? 600 : 400,
    background: highlighted ? 'var(--colors-surface-muted, #eef2ff)' : 'transparent',
  };
}

function renderOption(
  opt: ComboboxOption,
  info: { highlighted: boolean; selected: boolean; index: number },
): ReactNode {
  return (
    <span style={optionStyle(info.highlighted, info.selected, opt.disabled)}>
      {opt.label}
      {info.selected ? ' ✓' : ''}
    </span>
  );
}

const meta = {
  title: 'Forms/Combobox',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The canonical composition - `Root` wraps an `Input` (type to filter) and a
 * `List` (the popup). Uncontrolled here via `defaultValue`. Type "a" to filter
 * the list; arrow keys move the highlight, Enter selects, Escape closes.
 * "Durian" is disabled and can't be picked.
 */
export const Default: Story = {
  render: () => (
    <Combobox.Root options={FRUITS} defaultValue="banana">
      <label htmlFor="cb-default" style={{ display: 'block', marginBottom: 6 }}>
        <Text fontWeight="$semibold">Favourite fruit</Text>
      </label>
      <Combobox.Input>
        <input id="cb-default" placeholder="Search fruit..." style={INPUT} />
      </Combobox.Input>
      <Combobox.List style={LIST} renderOption={renderOption} />
    </Combobox.Root>
  ),
};

/**
 * Controlled selection - `value` + `onValueChange` on `Root` drive an external
 * `useState`, echoed below. The selected option's label is shown as the input
 * value once chosen.
 */
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>('cherry');
    return (
      <VStack gap="$3">
        <Combobox.Root
          options={FRUITS}
          // `value` is conditionally spread: under exactOptionalPropertyTypes a
          // declared-but-undefined `value` isn't assignable to `value?: T`.
          {...(value !== undefined ? { value } : {})}
          onValueChange={setValue}
        >
          <Combobox.Input>
            <input aria-label="Fruit" placeholder="Pick a fruit..." style={INPUT} />
          </Combobox.Input>
          <Combobox.List style={LIST} renderOption={renderOption} />
        </Combobox.Root>
        <Text color="$colors.text.muted" fontSize="$sm">
          Selected value: {value ?? '(none)'}
        </Text>
      </VStack>
    );
  },
};

/**
 * `defaultOpen` plus the bare default option rendering and a custom
 * `emptyMessage`. Clear the input and type "zz" to see the empty state.
 */
export const OpenByDefault: Story = {
  render: () => (
    <Combobox.Root options={FRUITS} defaultOpen>
      <Combobox.Input>
        <input aria-label="Fruit" placeholder="Type to filter..." style={INPUT} />
      </Combobox.Input>
      <Combobox.List style={LIST} renderOption={renderOption} emptyMessage="No fruit matches." />
      <Note>Opens on mount; filtering is case-insensitive substring on the label.</Note>
    </Combobox.Root>
  ),
};
