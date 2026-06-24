'use client';

import {
  useCallback,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { Box, type BoxProps } from 'usemotif';

export interface SegmentedControlOption {
  readonly value: string;
  readonly label: ReactNode;
  readonly disabled?: boolean;
}

export interface SegmentedControlProps {
  readonly options: ReadonlyArray<SegmentedControlOption>;
  /** Controlled selection. Pass with `onValueChange`. */
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onValueChange?: (value: string) => void;
  readonly 'aria-label'?: string;
}

/**
 * A themed segmented control — a single-select row of segments (iOS-style), with
 * the `radiogroup` / `radio` ARIA pattern, roving tab stop, and arrow-key
 * navigation. Self-contained: controlled (`value` + `onValueChange`) or
 * uncontrolled (`defaultValue`), no headless behind it, so it hugs the display
 * floor. Click + keyboard are handled by delegation on the container, so the
 * segments carry no per-item handlers.
 *
 * ```tsx
 * <SegmentedControl
 *   aria-label="View"
 *   defaultValue="list"
 *   options={[{ value: 'list', label: 'List' }, { value: 'grid', label: 'Grid' }]}
 *   onValueChange={setView}
 * />
 * ```
 */
export function SegmentedControl({
  options,
  value: controlled,
  defaultValue,
  onValueChange,
  'aria-label': ariaLabel,
}: SegmentedControlProps) {
  const [uncontrolled, setUncontrolled] = useState<string | undefined>(
    defaultValue ?? options[0]?.value,
  );
  const isControlled = controlled !== undefined;
  const selected = isControlled ? controlled : uncontrolled;
  const containerRef = useRef<HTMLElement>(null);

  const select = useCallback(
    (next: string) => {
      if (!isControlled) setUncontrolled(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const handleClick = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      const btn = (e.target as HTMLElement).closest('[data-seg-value]');
      if (btn === null || btn.hasAttribute('disabled')) return;
      const v = btn.getAttribute('data-seg-value');
      if (v !== null) select(v);
    },
    [select],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const enabled = options.filter((o) => o.disabled !== true);
      if (enabled.length === 0) return;
      const idx = enabled.findIndex((o) => o.value === selected);
      const base = idx === -1 ? 0 : idx;
      const nextIdx =
        e.key === 'ArrowRight'
          ? (base + 1) % enabled.length
          : (base - 1 + enabled.length) % enabled.length;
      const next = enabled[nextIdx]!;
      select(next.value);
      containerRef.current
        ?.querySelector<HTMLElement>(`[data-seg-value="${next.value}"]`)
        ?.focus();
    },
    [options, selected, select],
  );

  return (
    <Box
      ref={containerRef}
      role="radiogroup"
      display="inline-flex"
      gap={2}
      p={2}
      borderRadius="$radii.lg"
      bg="$colors.surface.muted"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...(ariaLabel !== undefined ? { 'aria-label': ariaLabel } : {})}
    >
      {options.map((opt) => {
        const isSelected = opt.value === selected;
        const disabled = opt.disabled === true;
        return (
          <Box
            as="button"
            key={opt.value}
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected ? 0 : -1}
            px="$space.3"
            py="$space.1"
            borderWidth={0}
            borderRadius="$radii.md"
            fontSize="$fontSizes.sm"
            fontWeight={isSelected ? '$fontWeights.semibold' : '$fontWeights.medium'}
            cursor={disabled ? 'not-allowed' : 'pointer'}
            bg={isSelected ? '$colors.surface.raised' : 'transparent'}
            color={disabled ? '$colors.text.muted' : '$colors.text.default'}
            boxShadow={isSelected ? '0 1px 2px rgba(0, 0, 0, 0.12)' : 'none'}
            {...({ type: 'button', disabled, 'data-seg-value': opt.value } as unknown as BoxProps)}
          >
            {opt.label}
          </Box>
        );
      })}
    </Box>
  );
}
