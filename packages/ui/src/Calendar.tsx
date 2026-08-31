'use client';

import {
  Calendar as HeadlessCalendar,
  type CalendarProps as HeadlessCalendarProps,
} from '@usemotif/headless';
import { useMemo, type CSSProperties, type ReactNode } from 'react';
import { Box } from 'usemotif';

export type CalendarProps = HeadlessCalendarProps;

// The headless Calendar applies this `style` to its role="grid" container. Themed
// via token CSS vars (hex fallbacks), like TimeInput - `style` here is raw
// CSSProperties, not Box style-props.
const CALENDAR_GRID_STYLE: CSSProperties = {
  width: 280,
  padding: '12px',
  borderRadius: 'var(--radii-lg, 12px)',
  border: '1px solid var(--colors-border-default, #d1d5db)',
  background: 'var(--colors-surface-raised, #fff)',
  color: 'var(--colors-text-default, #111)',
  font: 'inherit',
};

const DAY_HOVER = { bg: '$colors.surface.interactive' } as const;

/**
 * Module-scoped so it's a stable `renderDay` reference (lint: no-new-fn-as-prop).
 * The headless Calendar owns each cell's `gridcell` role, `aria-selected`, and
 * click/focus wiring + computes its state; the kit just paints the day. Selected
 * uses `action.primary` (the cell is the headless `<div>`, not this Box, so the
 * selected paint is JS-driven from `info`, not the `_selected` pseudo).
 */
export function renderThemedDay(info: {
  date: Date;
  isSelected: boolean;
  isToday: boolean;
  isOutsideMonth: boolean;
  isDisabled: boolean;
}): ReactNode {
  const { date, isSelected, isToday, isOutsideMonth, isDisabled } = info;
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height={36}
      m={2}
      borderRadius="$radii.md"
      fontSize="$fontSizes.sm"
      borderWidth="$borderWidths.thin"
      borderColor={isToday && !isSelected ? '$colors.action.primary.bg' : 'transparent'}
      bg={isSelected ? '$colors.action.primary.bg' : 'transparent'}
      color={
        isSelected
          ? '$colors.text.inverse'
          : isDisabled || isOutsideMonth
            ? '$colors.text.muted'
            : '$colors.text.default'
      }
      opacity={isDisabled ? 0.5 : 1}
      cursor={isDisabled ? 'not-allowed' : 'pointer'}
      {...(isSelected || isDisabled ? {} : { _hover: DAY_HOVER })}
    >
      {date.getDate()}
    </Box>
  );
}

/**
 * Themed month calendar over the accessible headless `Calendar` - a focusable
 * `role="grid"` with full keyboard nav (arrows day-by-day, PageUp/Down month,
 * Home/End week, Enter/Space select), locale-aware labels, controlled or
 * uncontrolled. The kit themes the grid surface and paints each day (selected,
 * today ring, outside-month + disabled muted) through `renderDay`; pass your own
 * `renderDay` to fully override the cell.
 *
 * ```tsx
 * <Calendar defaultValue={new Date()} onValueChange={setDate} />
 * ```
 */
export function Calendar({ style, renderDay, ...rest }: CalendarProps) {
  const mergedStyle = useMemo<CSSProperties>(
    () => (style !== undefined ? { ...CALENDAR_GRID_STYLE, ...style } : CALENDAR_GRID_STYLE),
    [style],
  );
  return (
    <HeadlessCalendar {...rest} style={mergedStyle} renderDay={renderDay ?? renderThemedDay} />
  );
}
