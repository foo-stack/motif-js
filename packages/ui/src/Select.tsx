'use client';

import { Select as HeadlessSelect, type ComboboxOption } from '@usemotif/headless';
import { useCallback, useState, type CSSProperties, type ReactNode } from 'react';
import { Box } from 'usemotif';

export type SelectOption = ComboboxOption;

export interface SelectProps {
  readonly options: ReadonlyArray<SelectOption>;
  /** Controlled selected value. */
  readonly value?: string;
  /** Initially-selected value (uncontrolled). */
  readonly defaultValue?: string;
  readonly onValueChange?: (value: string | undefined) => void;
  /** Shown on the trigger when nothing is selected. */
  readonly placeholder?: string;
  /** Width of the trigger and listbox (number → px). */
  readonly width?: number | string;
}

// The headless listbox is a portalled `<div role="listbox">` the kit can only
// style inline — so its surface is referenced through motif's token CSS vars
// (`--colors-*`, `--radii-*`), with hex fallbacks for the pre-hydration paint.
const LIST_STYLE: CSSProperties = {
  maxHeight: 260,
  overflowY: 'auto',
  padding: 4,
  borderRadius: 'var(--radii-lg, 12px)',
  background: 'var(--colors-surface-raised, #fff)',
  border: '1px solid var(--colors-border-default, #d1d5db)',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.18)',
};

// Chevron as a right-aligned background image, flipped on open via the
// `_expanded` pseudo (the same approach as the kit Accordion trigger).
const CHEVRON_DOWN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 6l4 4 4-4'/%3E%3C/svg%3E\")";
const CHEVRON_UP =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 10l4-4 4 4'/%3E%3C/svg%3E\")";
const TRIGGER_EXPANDED = {
  borderColor: '$colors.action.primary.bg',
  backgroundImage: CHEVRON_UP,
} as const;

// Module-scoped so it's a stable `renderOption` reference (lint: no-new-fn-as-prop).
// `highlighted` reflects both keyboard navigation and mouse hover (the headless
// list sets it on mouse-enter), so the row needs no `_hover` of its own.
function renderThemedOption(
  opt: SelectOption,
  info: { highlighted: boolean; selected: boolean; index: number },
): ReactNode {
  return (
    <Box
      px="$space.3"
      py="$space.2"
      borderRadius="$radii.md"
      fontSize="$fontSizes.sm"
      bg={info.highlighted ? '$colors.surface.default' : 'transparent'}
      color={opt.disabled === true ? '$colors.text.muted' : '$colors.text.default'}
      fontWeight={info.selected ? 600 : 400}
      cursor={opt.disabled === true ? 'not-allowed' : 'pointer'}
    >
      {opt.label}
    </Box>
  );
}

/**
 * Themed single-select dropdown over the accessible headless `Select` (a
 * Combobox without typeahead): trigger `aria-haspopup`/`aria-expanded`, full
 * listbox keyboard navigation, click-outside dismissal. Controlled or
 * uncontrolled — the trigger shows the selected option's label and flips its
 * chevron on open via the `_expanded` pseudo.
 *
 * ```tsx
 * <Select
 *   options={[{ value: 'utc', label: 'UTC' }, { value: 'pst', label: 'Pacific' }]}
 *   defaultValue="utc"
 *   onValueChange={(v) => setZone(v)}
 * />
 * ```
 */
export function Select({
  options,
  value: controlledValue,
  defaultValue,
  onValueChange,
  placeholder = 'Select…',
  width = 240,
}: SelectProps) {
  const [internal, setInternal] = useState<string | undefined>(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internal;
  const handleChange = useCallback(
    (next: string | undefined) => {
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );
  const selected = options.find((o) => o.value === value);

  return (
    <HeadlessSelect.Root
      options={options}
      onValueChange={handleChange}
      {...(isControlled ? { value: controlledValue } : {})}
      {...(defaultValue !== undefined ? { defaultValue } : {})}
    >
      <HeadlessSelect.Trigger>
        <Box
          as="button"
          width={width}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          textAlign="left"
          px="$space.3"
          py="$space.2"
          pr="$space.10"
          bg="$colors.surface.default"
          color={selected !== undefined ? '$colors.text.default' : '$colors.text.muted'}
          fontSize="$fontSizes.md"
          borderWidth="$borderWidths.thin"
          borderColor="$colors.border.default"
          borderRadius="$radii.lg"
          cursor="pointer"
          backgroundImage={CHEVRON_DOWN}
          backgroundRepeat="no-repeat"
          backgroundPosition="right 12px center"
          transition="border-color 120ms ease"
          _expanded={TRIGGER_EXPANDED}
        >
          {selected !== undefined ? selected.label : placeholder}
        </Box>
      </HeadlessSelect.Trigger>
      <HeadlessSelect.List style={LIST_STYLE} renderOption={renderThemedOption} />
    </HeadlessSelect.Root>
  );
}
