'use client';

import {
  Combobox as HeadlessCombobox,
  Search as HeadlessSearch,
  type ComboboxOption,
} from '@usemotif/headless';
import type { CSSProperties, ReactNode } from 'react';
import { Box, type BoxProps } from 'usemotif';

export type ComboboxItem = ComboboxOption;

export interface ComboboxProps {
  readonly options: ReadonlyArray<ComboboxOption>;
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onValueChange?: (value: string | undefined) => void;
  readonly placeholder?: string;
  /** Width of the input and listbox (number → px). */
  readonly width?: number | string;
}

// The headless renders its own portalled `<div role="listbox">`, themeable only
// inline — so the surface uses motif's token CSS vars (hex fallbacks).
const LIST_STYLE: CSSProperties = {
  maxHeight: 260,
  overflowY: 'auto',
  padding: 4,
  borderRadius: 'var(--radii-lg, 12px)',
  background: 'var(--colors-surface-raised, #fff)',
  border: '1px solid var(--colors-border-default, #d1d5db)',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.18)',
};

// Module-scoped so it's a stable `renderOption` reference (lint: no-new-fn-as-prop).
function renderThemedOption(
  opt: ComboboxOption,
  info: { highlighted: boolean; selected: boolean; index: number },
): ReactNode {
  return (
    <Box
      px="$space.3"
      py="$space.2"
      borderRadius="$radii.md"
      fontSize="$fontSizes.sm"
      bg={info.highlighted ? '$colors.surface.interactive' : 'transparent'}
      color={opt.disabled === true ? '$colors.text.muted' : '$colors.text.default'}
      fontWeight={info.selected ? 600 : 400}
      cursor={opt.disabled === true ? 'not-allowed' : 'pointer'}
    >
      {opt.label}
    </Box>
  );
}

// The themed text input projected into the headless Input (which clones the
// combobox role / value / onChange / keyboard handlers onto it).
function themedInput(width: number | string, placeholder: string) {
  return (
    <Box
      as="input"
      width={width}
      px="$space.3"
      py="$space.2"
      borderWidth="$borderWidths.thin"
      borderColor="$colors.border.default"
      borderRadius="$radii.lg"
      bg="$colors.surface.raised"
      color="$colors.text.default"
      fontSize="$fontSizes.md"
      {...({ type: 'text', placeholder } as unknown as BoxProps)}
    />
  );
}

function rootProps(props: ComboboxProps) {
  const { options, value, defaultValue, onValueChange } = props;
  return {
    options,
    ...(value !== undefined ? { value } : {}),
    ...(defaultValue !== undefined ? { defaultValue } : {}),
    ...(onValueChange !== undefined ? { onValueChange } : {}),
  };
}

/**
 * Themed autocomplete over the accessible headless `Combobox` (typeahead
 * filtering, `role="combobox"`, listbox keyboard navigation). The input filters
 * the options as you type; picking one fills the input.
 *
 * ```tsx
 * <Combobox options={frameworks} defaultValue="react" onValueChange={setFw} />
 * ```
 */
export function Combobox({ placeholder = 'Search…', width = 240, ...rest }: ComboboxProps) {
  return (
    <HeadlessCombobox.Root {...rootProps({ ...rest, placeholder, width })}>
      <HeadlessCombobox.Input>
        {
          themedInput(width, placeholder) as NonNullable<
            Parameters<typeof HeadlessCombobox.Input>[0]['children']
          >
        }
      </HeadlessCombobox.Input>
      <HeadlessCombobox.List style={LIST_STYLE} renderOption={renderThemedOption} />
    </HeadlessCombobox.Root>
  );
}

/**
 * Themed search box — a {@link Combobox} tuned for free-text input, wrapped in a
 * `role="search"` landmark.
 *
 * ```tsx
 * <Search options={results} onValueChange={openResult} placeholder="Search docs…" />
 * ```
 */
export function Search({ placeholder = 'Search…', width = 280, ...rest }: ComboboxProps) {
  return (
    <HeadlessSearch.Root {...rootProps({ ...rest, placeholder, width })}>
      <HeadlessSearch.Input>
        {
          themedInput(width, placeholder) as NonNullable<
            Parameters<typeof HeadlessSearch.Input>[0]['children']
          >
        }
      </HeadlessSearch.Input>
      <HeadlessSearch.List style={LIST_STYLE} renderOption={renderThemedOption} />
    </HeadlessSearch.Root>
  );
}
