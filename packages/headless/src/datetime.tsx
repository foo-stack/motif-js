'use client';

import {
  forwardRef,
  useCallback,
  useId,
  useState,
  type CSSProperties,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { Popover } from './Popover.js';

/**
 * Date / time family — Calendar, DatePicker, TimeInput.
 *
 * v0 ships:
 * - Calendar: a focusable month grid with full keyboard nav
 *   (Arrow keys move day-by-day, PageUp/Down jump month, Home/End
 *   jump start/end of week, Enter selects).
 * - DatePicker: thin Popover-around-Calendar composition.
 * - TimeInput: native `<input type="time">` wrapper.
 *
 * Date math uses the platform `Date` directly. A v1.x patch will
 * likely move to `Temporal` (Stage 4 since 2024) or
 * `@js-temporal/polyfill` for cleaner timezone semantics. Today's
 * implementation is locale-aware via `Intl.DateTimeFormat` for
 * weekday / month labels.
 */

// ─────────── Calendar helpers ─────────────────────────────────────

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
function addMonths(date: Date, n: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + n);
  return d;
}
function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// ─────────── Calendar ─────────────────────────────────────────────

export interface CalendarProps {
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (next: Date) => void;
  /** Locale used for weekday + month labels. Defaults to navigator
   * locale. */
  locale?: string;
  /** Marks days disabled. */
  isDisabled?: (date: Date) => boolean;
  /** First day of week, 0=Sunday..6=Saturday. Defaults to 0. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Inline style for the grid. */
  style?: CSSProperties;
  /** Override how each day cell renders. */
  renderDay?: (info: {
    date: Date;
    isSelected: boolean;
    isToday: boolean;
    isOutsideMonth: boolean;
    isDisabled: boolean;
  }) => ReactNode;
}

export function Calendar({
  value: controlled,
  defaultValue,
  onValueChange,
  locale,
  isDisabled,
  weekStartsOn = 0,
  style,
  renderDay,
}: CalendarProps): ReactElement {
  const [uncontrolled, setUncontrolled] = useState<Date | undefined>(defaultValue);
  const isControlled = controlled !== undefined;
  const selected = isControlled ? controlled : uncontrolled;
  const setSelected = useCallback(
    (next: Date) => {
      if (!isControlled) setUncontrolled(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );
  const [focusedDay, setFocusedDay] = useState<Date>(selected ?? new Date());
  const monthStart = startOfMonth(focusedDay);
  const today = new Date();

  const dayLabel = useCallback(
    (d: Date) => new Intl.DateTimeFormat(locale, { dateStyle: 'full' }).format(d),
    [locale],
  );
  const weekdayFmt = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const weekdayHeaders = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(2024, 0, ((weekStartsOn + i) % 7) + 7); // arbitrary week with known weekday alignment
    return weekdayFmt.format(d);
  });

  // Build the grid: pad start with previous-month days, fill 6 weeks (42 cells).
  const firstDayWeekday = monthStart.getDay();
  const offset = (firstDayWeekday - weekStartsOn + 7) % 7;
  const gridStart = addDays(monthStart, -offset);
  const cells: Date[] = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>): void {
    let next: Date | null = null;
    switch (e.key) {
      case 'ArrowLeft':
        next = addDays(focusedDay, -1);
        break;
      case 'ArrowRight':
        next = addDays(focusedDay, 1);
        break;
      case 'ArrowUp':
        next = addDays(focusedDay, -7);
        break;
      case 'ArrowDown':
        next = addDays(focusedDay, 7);
        break;
      case 'PageUp':
        next = addMonths(focusedDay, -1);
        break;
      case 'PageDown':
        next = addMonths(focusedDay, 1);
        break;
      case 'Home':
        next = addDays(focusedDay, -focusedDay.getDay() + weekStartsOn);
        break;
      case 'End':
        next = addDays(focusedDay, 6 - focusedDay.getDay() + weekStartsOn);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isDisabled?.(focusedDay) !== true) setSelected(focusedDay);
        return;
      default:
        return;
    }
    e.preventDefault();
    setFocusedDay(next);
  }

  return (
    <div
      role="grid"
      onKeyDown={onKeyDown}
      tabIndex={0}
      aria-label={new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
        monthStart,
      )}
      style={style}
    >
      <div role="row">
        {weekdayHeaders.map((w, i) => (
          <div key={i} role="columnheader" aria-label={w}>
            {w}
          </div>
        ))}
      </div>
      {Array.from({ length: 6 }, (_, weekIdx) => (
        <div role="row" key={weekIdx}>
          {cells.slice(weekIdx * 7, weekIdx * 7 + 7).map((d, i) => {
            const isSelected = selected !== undefined && isSameDay(d, selected);
            const isOutsideMonth = d.getMonth() !== monthStart.getMonth();
            const isToday = isSameDay(d, today);
            const disabled = isDisabled?.(d) === true;
            const isFocused = isSameDay(d, focusedDay);
            return (
              // Keyboard activation lives on the parent grid (Enter / Space
              // on the focused cell triggers the same setSelected). The
              // jsx-a11y rule can't see the parent listener, so disable it
              // here; the cell is fully keyboard-accessible via the grid.
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events
              <div
                key={i}
                role="gridcell"
                aria-selected={isSelected}
                aria-disabled={disabled || undefined}
                tabIndex={isFocused ? 0 : -1}
                aria-label={dayLabel(d)}
                onClick={() => {
                  if (disabled) return;
                  setFocusedDay(d);
                  setSelected(d);
                }}
              >
                {renderDay !== undefined
                  ? renderDay({
                      date: d,
                      isSelected,
                      isToday,
                      isOutsideMonth,
                      isDisabled: disabled,
                    })
                  : d.getDate()}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─────────── DatePicker ───────────────────────────────────────────

export interface DatePickerProps extends Omit<CalendarProps, 'style'> {
  /** What renders as the trigger. Receives the formatted current
   * value + an `onClick` to open the calendar. */
  renderTrigger?: (info: { label: string; onClick: () => void }) => ReactNode;
  placeholder?: string;
  popoverStyle?: CSSProperties;
  triggerStyle?: CSSProperties;
}

export function DatePicker({
  value,
  defaultValue,
  onValueChange,
  renderTrigger,
  locale,
  popoverStyle,
  triggerStyle,
  placeholder = 'Pick a date',
  ...calendarRest
}: DatePickerProps): ReactElement {
  const [open, setOpen] = useState(false);
  const current = value ?? defaultValue;
  const label =
    current === undefined
      ? placeholder
      : new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(current);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger>
        {renderTrigger !== undefined ? (
          (renderTrigger({ label, onClick: () => setOpen((v) => !v) }) as ReactElement)
        ) : (
          <button type="button" style={triggerStyle}>
            {label}
          </button>
        )}
      </Popover.Trigger>
      <Popover.Content {...(popoverStyle !== undefined ? { style: popoverStyle } : {})}>
        <Calendar
          {...calendarRest}
          {...(value !== undefined ? { value } : {})}
          {...(defaultValue !== undefined ? { defaultValue } : {})}
          onValueChange={(d) => {
            onValueChange?.(d);
            setOpen(false);
          }}
          {...(locale !== undefined ? { locale } : {})}
        />
      </Popover.Content>
    </Popover.Root>
  );
}

// ─────────── TimeInput ────────────────────────────────────────────

export interface TimeInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** `'HH:mm'` or `'HH:mm:ss'`. Defaults to `'HH:mm'`. */
  precision?: 'minute' | 'second';
}

export const TimeInput = forwardRef(function TimeInput(
  { precision = 'minute', step, ...rest }: TimeInputProps,
  ref: Ref<HTMLInputElement>,
): ReactElement {
  const id = useId();
  return (
    <input
      ref={ref}
      type="time"
      id={id}
      step={step ?? (precision === 'second' ? 1 : undefined)}
      {...rest}
    />
  );
});
