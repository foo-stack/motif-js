import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties, ReactNode } from 'react';
import { useState } from 'react';
import { Text, VStack } from 'usemotif';
import { Search, type ComboboxOption } from '@usemotif/headless';
import { Note } from '../../harness/demo.js';

// Search is a HEADLESS COMPOUND component — Combobox tuned for free-text input.
// Same prop surface (`Search.Root` / `Search.Input` / `Search.List`, the latter
// two being Combobox.Input / Combobox.List), with one difference: `Search.Root`
// renders a `role="search"` wrapper around everything. Use it for query-style
// inputs (command bars, doc search) rather than single-value form pickers.
// Motif emits theme tokens as `--<scale>-<path>` CSS custom properties;
// referenced with hex fallbacks.

const PAGES: ReadonlyArray<ComboboxOption> = [
  { value: 'getting-started', label: 'Getting started' },
  { value: 'theming', label: 'Theming & tokens' },
  { value: 'styled', label: 'styled() factory' },
  { value: 'variants', label: 'Variants' },
  { value: 'responsive', label: 'Responsive styles' },
  { value: 'headless', label: 'Headless components' },
  { value: 'compilers', label: 'Compilers' },
];

const INPUT: CSSProperties = {
  width: 280,
  padding: '8px 10px 8px 32px',
  borderRadius: 8,
  border: '1px solid var(--colors-border-default, #d1d5db)',
  background: 'var(--colors-surface-default, #fff) no-repeat 10px center',
  color: 'var(--colors-text-default, #111)',
  font: 'inherit',
};

const LIST: CSSProperties = {
  width: 280,
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
        cursor: 'pointer',
        fontWeight: info.selected ? 600 : 400,
        background: info.highlighted ? 'var(--colors-surface-muted, #eef2ff)' : 'transparent',
      }}
    >
      {opt.label}
    </span>
  );
}

const meta = {
  title: 'Forms/Search',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The canonical composition. `Search.Root` adds a `role="search"` landmark;
 * `Search.Input` is the typeable field; `Search.List` is the portalled results
 * popup. Type to filter the docs pages.
 */
export const Default: Story = {
  render: () => (
    <Search.Root options={PAGES}>
      <Search.Input>
        <input
          aria-label="Search docs"
          type="search"
          placeholder="Search the docs…"
          style={INPUT}
        />
      </Search.Input>
      <Search.List style={LIST} renderOption={renderOption} emptyMessage="No pages found." />
    </Search.Root>
  ),
};

/**
 * Controlled query — `inputValue` + `onInputValueChange` drive an external
 * `useState`, echoed live so you can see the typed query independent of any
 * selection.
 */
export const ControlledQuery: Story = {
  render: () => {
    const [query, setQuery] = useState('');
    return (
      <VStack gap="$3">
        <Search.Root options={PAGES} inputValue={query} onInputValueChange={setQuery}>
          <Search.Input>
            <input aria-label="Search docs" type="search" placeholder="Search…" style={INPUT} />
          </Search.Input>
          <Search.List style={LIST} renderOption={renderOption} emptyMessage="No matches." />
        </Search.Root>
        <Text color="$colors.text.muted" fontSize="$sm">
          Query: {query.length > 0 ? `"${query}"` : '(empty)'}
        </Text>
        <Note>role="search" landmark wraps the input + results.</Note>
      </VStack>
    );
  },
};
